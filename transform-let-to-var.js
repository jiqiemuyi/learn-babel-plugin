module.exports = function (babel) {
  return {
    visitor: {
      VariableDeclaration(path, state) {
        path.node.kind = "var";
      },
    },
  };
};
