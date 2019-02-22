const { forwardTo } = require("prisma-binding");

const Query = {
  // items(parent, args, ctx, info) {
  //   return ctx.db.query.items();
  // }
  items: forwardTo("db"),
  item: forwardTo("db")
};

module.exports = Query;
