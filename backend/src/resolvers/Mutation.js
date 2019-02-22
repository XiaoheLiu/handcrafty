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
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    const item = await ctx.db.query.item({ where }, `{id title}`);
    // TODO: check if they own the item

    return ctx.db.mutation.deleteItem({ where }, info);
  }
};

module.exports = Mutations;
