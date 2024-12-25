# 学习 babel-plugin

## 概念

1、babel 是一个 JavaScript 编译器，它可以将 ES6+ 的代码编译成 ES5 的代码，以便在旧的浏览器中运行。babel-plugin 是 babel 的一个插件，它可以在编译过程中对代码进行一些处理，比如添加 polyfill、转换语法等。
2、抽象语法树 （Abstract Syntax Tree，AST） 是源代码的树形表示，它描述了源代码的结构和语义。babel-plugin 可以通过操作 AST 来对代码进行转换。简单来说 AST 就是一个深度嵌套对象，这个对象能够描述我们书写代码的所有信息。
https://astexplorer.net/ （可查看 ast 树）

## 工作流程

1、解析：将源代码解析成 AST。由 babel 中的@babel/parser 模块提供能力
2、转换：遍历 AST，对节点进行转换。各种 plugin 在此阶段执行，由 babel 中的@babel/traverse 模块提供能力
3、生成：将转换后的 AST 生成新的代码。由 babel 中的@babel/generator 模块提供能力

## 功能体验

我们简单搭建一个项目用于测试 babel
babel 本身不提供任何功能，所有的功能均由 plugin 和 preset 来提供，在 babel 配置中可以通过配置 preset 与 plugin 来添加各种功能，而 preset 实际上就是众多 plugin 的集合
https://www.babeljs.cn/docs/presets

### 如何使用 babel 做语法转换

官方提供了一个预设@babel/preset-env 用于做语法转换

```js
// .babelrc
module.exports = {
  presets: ["@babel/preset-env"],
  plugins: [],
};
```

输入

```js
const a = 1;

const fn1 = () => {
  console.log("箭头函数");
};

const promise = new Promise((resolve, reject) => {
  resolve("测试promise");
}).then((res = console.log(res)));
```

输出

```js
"use strict";

var a = 1;
var fn1 = function fn1() {
  console.log("箭头函数");
};
var promise = new Promise(function (resolve, reject) {
  resolve("测试promise");
}).then((res = console.log(res)));
```

可以发现代码中所有新语法都被转化为了低版本浏览器可用的语法，而 Promise 这种新 api 则没有做任何处理。

### 如何使用 babel 处理 api 兼容

实际上@babel/preset-env 也提供了 api 兼容处理，只是默认未被开启
修改配置为：

```js
// .babelrc
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage", //默认为false，即不做api兼容
        corejs: 3,
      },
    ],
  ],
  plugins: [],
};
```

再次输入上述代码后得到输出

```js
"use strict";

require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.promise.js");
var a = 1;
var fn1 = function fn1() {
  console.log("箭头函数");
};
var promise = new Promise(function (resolve, reject) {
  resolve("测试promise");
}).then((res = console.log(res)));
```

可以看到额外引入了若干文件，做了 api 的兼容处理，但此时依然存在几个问题
比如当我输入以下代码时：

```js
const a = 1;

const fn1 = () => {
  console.log("箭头函数");
};

const promise = new Promise((resolve, reject) => {
  resolve("测试promise");
}).then((res = console.log(res)));
//新增的部分
class Person {
  constructor(name) {
    this.name = name;
  }
  say() {
    console.log(this.name);
  }
}
```

得到输出

```js
"use strict";

require("core-js/modules/es.symbol.js");
require("core-js/modules/es.symbol.description.js");
require("core-js/modules/es.symbol.iterator.js");
require("core-js/modules/es.symbol.to-primitive.js");
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.date.to-primitive.js");
require("core-js/modules/es.number.constructor.js");
require("core-js/modules/es.object.define-property.js");
require("core-js/modules/es.string.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
function _typeof(o) {
  "@babel/helpers - typeof";
  return (
    (_typeof =
      "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
        ? function (o) {
            return typeof o;
          }
        : function (o) {
            return o &&
              "function" == typeof Symbol &&
              o.constructor === Symbol &&
              o !== Symbol.prototype
              ? "symbol"
              : typeof o;
          }),
    _typeof(o)
  );
}
require("core-js/modules/es.function.name.js");
require("core-js/modules/es.object.to-string.js");
require("core-js/modules/es.promise.js");
function _classCallCheck(a, n) {
  if (!(a instanceof n))
    throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    (o.enumerable = o.enumerable || !1),
      (o.configurable = !0),
      "value" in o && (o.writable = !0),
      Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return (
    r && _defineProperties(e.prototype, r),
    t && _defineProperties(e, t),
    Object.defineProperty(e, "prototype", { writable: !1 }),
    e
  );
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == _typeof(i) ? i : i + "";
}
function _toPrimitive(t, r) {
  if ("object" != _typeof(t) || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != _typeof(i)) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
var a = 1;
var fn1 = function fn1() {
  console.log("箭头函数");
};
var promise = new Promise(function (resolve, reject) {
  resolve("测试promise");
}).then((res = console.log(res)));
//新增的部分
var Person = /*#__PURE__*/ (function () {
  function Person(name) {
    _classCallCheck(this, Person);
    this.name = name;
  }
  return _createClass(Person, [
    {
      key: "say",
      value: function say() {
        console.log(this.name);
      },
    },
  ]);
})();
```

1. 有辅助函数的定义，当我们有很多文件要被转换时，这些辅助函数就会被定义多次导致文件体积变大
2. 直接 require 了一些文件，这些文件中直接对原型链做了改写，存在全局污染的问题

## 解决以上两个问题

以上两个问题其实都可以通过使用@babel/plugin-transform-runtime 配合@babel/runtime 来解决

1. 所有的辅助函数均已被隔离在@babel/runtime/helps 中
2. runtime 本身也提供 polyfill 能力，且没有通过在全局引入文件这种形式处理，我们可以通过增加 corejs 的配置开启 runtime 的 polyfill 能力

```js
// .babelrc
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage", //默认为false，即不做api兼容
        "corejs": {
          "version": 3
        }
      }
    ]
  ],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": 3
      }
    ]
  ]
}

```

得到输出

```js
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
require("core-js/modules/es.function.name.js");
var _classCallCheck2 = _interopRequireDefault(
  require("@babel/runtime-corejs3/helpers/classCallCheck")
);
var _createClass2 = _interopRequireDefault(
  require("@babel/runtime-corejs3/helpers/createClass")
);
var _promise = _interopRequireDefault(
  require("@babel/runtime-corejs3/core-js-stable/promise")
);
var a = 1;
var fn1 = function fn1() {
  console.log("箭头函数");
};
var promise = new _promise["default"](function (resolve, reject) {
  resolve("测试promise");
}).then((res = console.log(res)));
//新增的部分
var Person = /*#__PURE__*/ (function () {
  function Person(name) {
    (0, _classCallCheck2["default"])(this, Person);
    this.name = name;
  }
  return (0, _createClass2["default"])(Person, [
    {
      key: "say",
      value: function say() {
        console.log(this.name);
      },
    },
  ]);
})();
```

可以看出，所有的辅助函数均从@babel/runtime-corejs3 中导出，且不再全局 require 文件，而是通过@babel/runtime-corejs3 来导入需要的新 api
到此一套完整的 babel 配置就完成了。

## 安装

```js
// npm install  @babel/cli @babel/preset-env --save-dev
```

## 使用

```js
npx babel input.js --out-file output.js
```

## babel 文档

https://www.babeljs.cn/docs
