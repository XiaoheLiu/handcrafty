const Mutations = {
  createCat(parent, args, ctx, info) {
    global.cats = global.cats || [];
    const newCat = { name: args.name };
    global.cats.push(newCat);
    return newCat;
  }
};

module.exports = Mutations;
