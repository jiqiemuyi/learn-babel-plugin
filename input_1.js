const a = 1;

const fn1 = () => {
  console.log("箭头函数");
};

const promise = new Promise((resolve, reject) => {
  resolve("测试promise");
}).then((res = console.log(res)));
