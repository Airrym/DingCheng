// pages/user/user.js
Page({
    data: {
      profileInfo: {
        name: "张明",
        position: "大副",
        ship: "中远海运-星辰号",
        phone: "138****5678",
        email: "zhangming@ship.com",
        address: "新加坡港，T3泊位"
      },
      orders: [
        {
          id: "20230612001",
          date: "2023-06-12 09:35",
          status: "待发货",
          statusClass: "bg-yellow-100",
          products: [
            {name: "大米", quantity: 1, unit: "袋 / 50kg"},
            {name: "面粉", quantity: 1, unit: "袋 / 25kg"},
            {name: "食用油", quantity: 2, unit: "桶 / 10L"}
          ],
          totalAmount: 720
        },
        {
          id: "20230605003",
          date: "2023-06-05 14:20",
          status: "已完成",
          statusClass: "bg-green-100",
          products: [
            {name: "猪肉", quantity: 10, unit: "kg"},
            {name: "鸡肉", quantity: 5, unit: "kg"},
            {name: "土豆", quantity: 20, unit: "kg"}
          ],
          totalAmount: 770
        },
        {
          id: "20230528002",
          date: "2023-05-28 16:45",
          status: "已取消",
          statusClass: "bg-neutral-100",
          products: [
            {name: "饮用水", quantity: 10, unit: "箱 / 24瓶"},
            {name: "白菜", quantity: 15, unit: "kg"}
          ],
          totalAmount: 540
        }
      ]
    },
  
    onLoad: function(options) {
      // 从缓存加载用户数据
      this.loadUserProfile();
    },
  
    onShow: function() {
      // 页面显示时检查是否有更新的用户数据
      this.loadUserProfile();
    },
  
    // 从缓存加载用户资料
    loadUserProfile: function() {
      const userProfile = wx.getStorageSync('userProfile');
      if (userProfile) {
        this.setData({
          profileInfo: userProfile
        });
      }
    },
  
    // 格式化商品显示
    formatProducts: function(products) {
      return products.map(p => `${p.name} x${p.quantity}`).join('，');
    },
  
    // 跳转到编辑个人信息页面
    goToEditProfile: function() {
      // 传递当前用户数据到编辑页面
      wx.navigateTo({
        url: '/pages/edit-profile/edit-profile',
        events: {
          // 接收从编辑页面返回的数据
          acceptProfileUpdate: (data) => {
            this.setData({
              profileInfo: data
            });
          }
        },
        success: (res) => {
          // 发送当前用户数据到编辑页面
          res.eventChannel.emit('sendProfileData', this.data.profileInfo);
        }
      });
    },
  
    // 查看全部订单
    viewAllOrders: function() {
      wx.navigateTo({
        url: '/pages/order-list/order-list'
      });
    },
  
    // 查看订单详情
    viewOrderDetail: function(e) {
      const orderId = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/order-detail/order-detail?id=${orderId}`
      });
    },
  
    // 评价订单
    reviewOrder: function(e) {
      const orderId = e.currentTarget.dataset.id;
      wx.showToast({
        title: `评价功能待实现，订单 #${orderId}`,
        icon: 'none'
      });
    },
  
    // 加载用户数据（API方式）
    loadUserData: function() {
      // 这里可以调用API获取用户数据
      wx.showLoading({
        title: '加载中...',
      });
      
      // 模拟API请求
      setTimeout(() => {
        // 假设从API获取的数据
        const userData = {
          name: "张明",
          position: "大副",
          ship: "中远海运-星辰号",
          phone: "138****5678",
          email: "zhangming@ship.com",
          address: "新加坡港，T3泊位"
        };
        
        this.setData({
          profileInfo: userData
        });
        
        wx.hideLoading();
      }, 500);
    }
  })