const { forwardTo } = require('prisma-binding');
const { hasPermission } = require('../utils');

const Query = {
  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),

  me(parent, args, ctx, info) {
    if (!ctx.request.userId) return null;
    return ctx.db.query.user({ where: { id: ctx.request.userId } }, info);
  },

  async users(parent, args, ctx, info) {
    // Check if user has permission to query all users
    if (!ctx.request.userId) {
      throw new Error('You have to be logged in to do that');
    }
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);
    // if they do, query all users
    return ctx.db.query.users({}, info);
  },

  async order(parent, args, ctx, info) {
    // Check if logged in
    if (!ctx.request.userId) {
      throw new Error('You are not loggned in!');
    }
    // Query current order
    const order = await ctx.db.query.order(
      {
        where: { id: args.id },
      },
      info
    );
    // Check if they have permission to see order
    const ownsOrder = order.user.id === ctx.request.userId;
    const hasPermission = ctx.request.user.permissions.includes('ADMIN');
    if (!ownsOrder || !hasPermission) {
      throw new Error('You do not have permission to view this order!');
    }
    // Return order
    return order;
  },

  async orders(parent, args, ctx, info) {
    const { userId } = ctx.request;
    if (!userId) throw new Error('Please login to see your order!');
    const orders = await ctx.db.query.orders(
      {
        where: { user: { id: userId } },
      },
      info
    );
    return orders;
  },
};

module.exports = Query;
