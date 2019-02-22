const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO check if they are logged in
    const item = await ctx.db.mutation.createItem(
      {
        data: {
          ...args
        }
      },
      info
    );
    return item;
  },

  updateItem(parent, args, ctx, info) {
    const updatedItem = { ...args };
    delete updatedItem.id;
    return ctx.db.mutation.updateItem(
      {
        data: updatedItem,
        where: {
          id: args.id
        }
      },
      info
    );
  }
};

module.exports = Mutations;
