"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
require("core-js/modules/es.function.name.js");
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));
var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));
var a = 1;
var fn1 = function fn1() {
  console.log("箭头函数");
};
var promise = new _promise["default"](function (resolve, reject) {
  resolve("测试promise");
}).then(res = console.log(res));
//新增的部分
var Person = /*#__PURE__*/function () {
  function Person(name) {
    (0, _classCallCheck2["default"])(this, Person);
    this.name = name;
  }
  return (0, _createClass2["default"])(Person, [{
    key: "say",
    value: function say() {
      console.log(this.name);
    }
  }]);
}();
