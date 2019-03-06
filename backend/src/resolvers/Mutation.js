const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { transport, makeEmail } = require('../mail');
const { hasPermission } = require('../utils');

const Mutations = {
  async createItem(parent, args, ctx, info) {
    // check if they are logged in
    if (!ctx.request.userId) {
      throw new Error('You must log in to do that!');
    }
    // create the item and save the user who created it
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          // Create an relationship between item and user
          user: {
            connect: {
              id: ctx.request.userId,
            },
          },
          ...args,
        },
      },
      info
    );
    return item;
  },

  async updateItem(parent, args, ctx, info) {
    const where = { id: args.id };
    // Check if they own the item or has permissions
    const item = await ctx.db.query.item({ where }, `{id title user { id }}`);
    // Check if they own the item or has permissions
    const ownsItem = item.user.id === ctx.request.userId;
    const hasPermissions =
      ctx.request.user &&
      ctx.request.user.permissions.some(permission =>
        ['ADMIN', 'ITEMUPDATE'].includes(permission)
      );
    if (!ownsItem && !hasPermissions) {
      throw new Error('You are not allowed to edit this item!');
    }
    // Update the item
    const updatedItem = { ...args };
    delete updatedItem.id;
    return ctx.db.mutation.updateItem(
      {
        data: updatedItem,
        where,
      },
      info
    );
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    const item = await ctx.db.query.item({ where }, `{id title user { id }}`);
    // Check if they own the item or has permissions
    const ownsItem = item.user.id === ctx.request.userId;
    const hasPermissions =
      ctx.request.user &&
      ctx.request.user.permissions.some(permission =>
        ['ADMIN', 'ITEMDELETE'].includes(permission)
      );
    if (!ownsItem && !hasPermissions) {
      throw new Error('You are not allowed to delete this item!');
    }
    // Delete the item
    return ctx.db.mutation.deleteItem({ where }, info);
  },

  async signup(parents, args, ctx, info) {
    args.email = args.email.toLowerCase();
    const password = await bcrypt.hash(args.password, 10);
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ['USER'] },
        },
      },
      info
    );
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // one year cookie
    });
    return user;
  },

  async signin(parent, { email, password }, ctx, info) {
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Invalid password');
    }
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // one year cookie
    });
    return user;
  },
  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');
    return { message: 'Signed out!' };
  },

  async requestReset(parent, { email }, ctx, info) {
    // 1. Check if user exists
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }
    // 2. Generate reset token that expires in an hour
    const randomBytesPromise = promisify(randomBytes);
    const resetToken = (await randomBytesPromise(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000;
    // 3. Insert resetToken info to the db
    const res = await ctx.db.mutation.updateUser({
      where: { email },
      data: { resetToken, resetTokenExpiry },
    });
    // 4. Send out the reset email
    const resetLink = `${
      process.env.FRONTEND_URL
    }/reset?resetToken=${resetToken}`;
    const mailRes = await transport.sendMail({
      from: 'sdathenaliu@gmail.com',
      to: user.email,
      subject: 'Reset Your Password for Handcrafty',
      html: makeEmail(
        user.name,
        `Here is the link to reset your password! \n\n
      <a href='${resetLink}'> Click here to reset! </a>`
      ),
    });
    // 5. Return success message
    return { message: 'Please check your email' };
  },

  async resetPassword(parent, args, ctx, info) {
    // 1. Check if password match
    if (args.password !== args.confirmPassword) {
      throw new Error('The password and confirm password do not match!');
    }
    // 2. Check if its a legit reset token and not expired
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000,
      },
    });
    if (!user) {
      throw new Error(`This token is either invalid or expired!`);
    }
    // 3. Hash new password
    const password = await bcrypt.hash(args.password, 10);
    // 4. Save new password and invalidate the token
    const updatedUser = await ctx.db.mutation.updateUser({
      where: {
        email: user.email,
      },
      data: {
        password,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
    // 5. Generate JWT, set cookie
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // one year cookie
    });
    // 6. Return new user
    return updatedUser;
  },

  async updatePermissions(parent, args, ctx, info) {
    // Check if logged in
    if (!ctx.request.userId) {
      throw new Error('You must be logged in!');
    }
    // Query the current user
    const currentUser = await ctx.db.query.user(
      { where: { id: ctx.request.userId } },
      info
    );
    // Check if they have permission to do this
    hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE']);
    return ctx.db.mutation.updateUser(
      {
        data: {
          permissions: {
            set: args.permissions,
          },
        },
        where: {
          id: args.userId,
        },
      },
      info
    );
  },

  async addToCart(parent, args, ctx, info) {
    // Check if they have signed in
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error('Please sign in to view your cart.');
    }
    // Query the user's current cart
    const [existingCartItem] = await ctx.db.query.cartItems({
      where: {
        user: { id: userId },
        item: { id: args.id },
      },
    });
    // Check if that item is already in the cart and increment by 1 if it is,
    if (existingCartItem) {
      return ctx.db.mutation.updateCartItem(
        {
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + 1 },
        },
        info
      );
    }
    // if not, create a new CartItem for the user
    return ctx.db.mutation.createCartItem(
      {
        data: {
          user: {
            connect: { id: userId },
          },
          item: {
            connect: { id: args.id },
          },
        },
      },
      info
    );
  },
};

module.exports = Mutations;
