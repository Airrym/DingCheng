// pages/edit-profile/edit-profile.js
Page({
    data: {
      profileInfo: {
        name: "",
        position: "",
        ship: "",
        phone: "",
        email: "",
        address: ""
      },
      errors: {
        name: false,
        position: false,
        ship: false,
        phone: false,
        email: false,
        address: false
      }
    },
  
    onLoad: function(options) {
      // 从全局或缓存获取用户信息
      const userProfile = wx.getStorageSync('userProfile') || {
        name: "张明",
        position: "大副",
        ship: "中远海运-星辰号",
        phone: "138****5678",
        email: "zhangming@ship.com",
        address: "新加坡港，T3泊位"
      };
      
      this.setData({
        profileInfo: userProfile
      });
    },
  
    // 表单验证
    validateForm: function(formData) {
      const errors = {};
      let isValid = true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^1[3-9]\d{9}$|^\+65 \d{4} \d{4}$/;
  
      // 验证姓名
      if (!formData.name.trim()) {
        errors.name = true;
        isValid = false;
      } else {
        errors.name = false;
      }
  
      // 验证职位
      if (!formData.position.trim()) {
        errors.position = true;
        isValid = false;
      } else {
        errors.position = false;
      }
  
      // 验证船名
      if (!formData.ship.trim()) {
        errors.ship = true;
        isValid = false;
      } else {
        errors.ship = false;
      }
  
      // 验证电话
      if (!formData.phone.trim() || !phoneRegex.test(formData.phone.trim())) {
        errors.phone = true;
        isValid = false;
      } else {
        errors.phone = false;
      }
  
      // 验证邮箱
      if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
        errors.email = true;
        isValid = false;
      } else {
        errors.email = false;
      }
  
      // 验证地址
      if (!formData.address.trim()) {
        errors.address = true;
        isValid = false;
      } else {
        errors.address = false;
      }
  
      this.setData({ errors });
      return isValid;
    },
  
    // 保存个人信息
    saveProfile: function(e) {
      const formData = e.detail.value;
      
      if (!this.validateForm(formData)) {
        return;
      }
  
      // 保存到全局或缓存
      wx.setStorageSync('userProfile', formData);
      
      // 更新全局数据
      const app = getApp();
      if (app.globalData) {
        app.globalData.userProfile = formData;
      }
  
      // 显示成功提示
      wx.showToast({
        title: '个人信息已保存',
        icon: 'success'
      });
  
      // 返回上一页
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    },
  
    // 取消编辑
    cancelEdit: function() {
      wx.navigateBack();
    }
  })