"use strict";

var a = 1;
var fn1 = function fn1() {
  console.log("箭头函数");
};
var promise = new Promise(function (resolve, reject) {
  resolve("测试promise");
}).then(res = console.log(res));
