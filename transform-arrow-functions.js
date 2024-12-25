const t = require("@babel/types");

module.exports = (api, options, dirname) => {
  // const { types: t } = api;
  return {
    pre: () => {
      console.log("pre");
    },
    post: () => {
      console.log("post");
    },
    visitor: {
      ArrowFunctionExpression: (path, state) => {
        if (!t.isBlockStatement(path.node.body)) {
          // 如果箭头函数体不是一个块语句（即省略了大括号）
          const newBody = t.blockStatement([t.returnStatement(path.node.body)]);
          path.get("body").replaceWith(newBody);
        }
        path.node.type = "FunctionExpression";
        path.node.expression = false;
      },
    },
  };
};
