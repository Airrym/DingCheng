Page({
  data: {
    result: "0"   // 显示内容
  },

  // 输入按钮
  input(e) {
    let val = e.target.dataset.val;
    let res = this.data.result;
    if (res === "0" && !isNaN(val)) {
      res = val;  // 第一次输入数字时替换0
    } else {
      res += val; // 追加字符
    }
    this.setData({ result: res });
  },
  // 计算结果
  calculate() {
    let expr = this.data.result;
  
    // 1. 替换符号
    expr = expr.replace(/＋/g, '+')
               .replace(/－/g, '-')
               .replace(/×/g, '*')
               .replace(/÷/g, '/');
  
    // 2. 检查是否只有数字和运算符
    if (!/^[0-9+\-*/.]+$/.test(expr)) {
      this.setData({ result: "错误" });
      return;
    }
  
    // 3. 防止结尾是运算符
    if (/[+\-*/.]$/.test(expr)) {
      this.setData({ result: "错误" });
      return;
    }
  
    try {
      // 按运算符分割
      let nums = expr.split(/[\+\-\*\/]/).map(Number);
      let ops = expr.match(/[\+\-\*\/]/g) || [];
  
      // 处理 * 和 /
      for (let i = 0; i < ops.length; ) {
        if (ops[i] === "*" || ops[i] === "/") {
          let res = ops[i] === "*" ? nums[i] * nums[i + 1] : nums[i] / nums[i + 1];
          nums.splice(i, 2, res);
          ops.splice(i, 1);
        } else {
          i++;
        }
      }
  
      // 处理 + 和 -
      let result = nums[0];
      for (let i = 0; i < ops.length; i++) {
        result = ops[i] === "+" ? result + nums[i + 1] : result - nums[i + 1];
      }
  
      this.setData({ result: result.toString() });
    } catch (err) {
      console.log("计算错误：", err);
      this.setData({ result: "错误" });
    }
  },
  

  // 清空
  clear() {
    this.setData({ result: "0" });
  }
});
