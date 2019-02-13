const Query = {
  cats(parent, args, ctx, info) {
    global.cats = global.cats || [];
    return global.cats;
  }
};

module.exports = Query;
