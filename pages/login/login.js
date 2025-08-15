// pages/login/login.js
const TOKEN_KEY = 'auth_token';
const USER_KEY  = 'auth_user';

Page({
  data: {
    form: { username: '', password: '' },
    remember: true,
    loading: false,
    redirect: '' // 可接收 ?redirect=/pages/order/order 之类
  },

  onLoad(options) {
    if (options && options.redirect) {
      this.setData({ redirect: decodeURIComponent(options.redirect) });
    }
    // 读“记住我”的用户信息
    const user = wx.getStorageSync(USER_KEY);
    if (user && user.username) {
      this.setData({ form: { ...this.data.form, username: user.username } });
    }
  },

  onShow() {
    // 已登录则自动跳转
    const token = wx.getStorageSync(TOKEN_KEY);
    if (token) this.goBackOrHome();
  },

  onInput(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ form: { ...this.data.form, [key]: e.detail.value } });
  },

  toggleRemember() {
    this.setData({ remember: !this.data.remember });
  },

  async onLogin() {
    const { username, password } = this.data.form;
    if (!username) return wx.showToast({ title:'请输入账号', icon:'none' });
    if (!password) return wx.showToast({ title:'请输入密码', icon:'none' });

    this.setData({ loading: true });
    try {
      // ====== 示例登录流程（替换为你的后端接口）======
      // const res = await wx.request({ url:'https://api.xxx.com/login', method:'POST', data:{ username, password } })
      // 假数据模拟
      await new Promise(r=>setTimeout(r, 500));
      // 简单校验：任意账号+长度>=4的密码通过
      if (String(password).length < 4) {
        throw new Error('账号或密码错误');
      }
      const token = 'mock.' + Date.now();
      const user  = { username, nick: username, role: 'user' };

      wx.setStorageSync(TOKEN_KEY, token);
      if (this.data.remember) wx.setStorageSync(USER_KEY, user);
      else wx.removeStorageSync(USER_KEY);

      wx.showToast({ title:'登录成功', icon:'success' });
      this.goBackOrHome();
    } catch (e) {
      wx.showToast({ title: e.message || '登录失败', icon:'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  onWxLogin() {
    // 微信登录：获取临时 code，发给你后端换 token
    wx.login({
      success: async (res) => {
        if (!res.code) {
          wx.showToast({ title:'获取登录凭证失败', icon:'none' });
          return;
        }
        // === 这里调用后端接口，用 res.code 换 token/user ===
        // const { token, user } = await request('/auth/wechat', { code: res.code })
        // 模拟：
        const token = 'wx.' + Date.now();
        const user  = { username: 'wx_user', nick: '微信用户', role: 'user' };

        wx.setStorageSync(TOKEN_KEY, token);
        wx.setStorageSync(USER_KEY, user);
        wx.showToast({ title:'登录成功', icon:'success' });
        this.goBackOrHome();
      },
      fail: () => wx.showToast({ title:'微信登录失败', icon:'none' })
    });
  },

  onGuest() {
    wx.showToast({ title:'以游客身份进入', icon:'none' });
    // 直接去首页，不管 redirect / 上一页
    wx.switchTab({ url: '/pages/home/home' }); // 按你的首页路径调整
  },

  onForgot() {
    wx.showToast({ title:'请联系管理员重置', icon:'none' });
  },

  onRegister() {
    wx.showToast({ title:'注册页未实现', icon:'none' });
    // 可跳到 /pages/register/register
  },

  goBackOrHome() {
    const redirect = this.data.redirect;
    if (redirect) {
      wx.reLaunch({ url: redirect });
      return;
    }
    // 返回上一页；如果没有上一页，就回首页
    const pages = getCurrentPages();
    if (pages.length > 1) wx.navigateBack();
    else wx.switchTab({ url: '/pages/home/home' }); // 按你的首页路径调整
  }
});
