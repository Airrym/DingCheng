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
      this.loadUserProfile();
      this.loadOrderData();
    },
  
    onShow: function() {
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
  
    // 加载订单数据（可从缓存或API）
    loadOrderData: function() {
      const cachedOrders = wx.getStorageSync('userOrders');
      if (cachedOrders && cachedOrders.length > 0) {
        this.setData({ orders: cachedOrders });
      } else {
        // 如果没有缓存，可以调用API获取
        this.fetchOrderData();
      }
    },
  
    // 从API获取订单数据
    fetchOrderData: function() {
      wx.showLoading({
        title: '加载订单中...',
      });
  
      // 模拟API请求
      setTimeout(() => {
        // 这里应该是真实的API请求
        // wx.request({
        //   url: 'your-api-url',
        //   success: (res) => {
        //     this.processOrderData(res.data);
        //   }
        // });
  
        // 模拟数据
        const orders = this.data.orders; // 使用初始数据
        this.setData({ orders });
        wx.setStorageSync('userOrders', orders);
        wx.hideLoading();
      }, 800);
    },
  
    // 格式化商品显示
    formatProducts: function(products) {
      if (!products || products.length === 0) return '无商品信息';
      return products.map(p => `${p.name} x${p.quantity}${p.unit}`).join('，');
    },
  
    // 跳转到编辑个人信息页面
    goToEditProfile: function() {
      wx.navigateTo({
        url: '/pages/edit-profile/edit-profile',
        events: {
          acceptProfileUpdate: (data) => {
            this.setData({ profileInfo: data });
            wx.setStorageSync('userProfile', data);
          }
        },
        success: (res) => {
          res.eventChannel.emit('sendProfileData', this.data.profileInfo);
        }
      });
    },
  
    // 查看全部订单
    viewAllOrders: function() {
      wx.navigateTo({
        url: '/pages/order-list/order-list',
        success: (res) => {
          res.eventChannel.emit('sendOrderData', {
            orders: this.data.orders,
            profileInfo: this.data.profileInfo
          });
        }
      });
    },
  
    // 查看订单详情
    viewOrderDetail: function(e) {
      const orderId = e.currentTarget.dataset.id;
      const order = this.data.orders.find(item => item.id === orderId);
      
      if (!order) {
        wx.showToast({
          title: '订单不存在',
          icon: 'none'
        });
        return;
      }
      wx.navigateTo({
        url: '/pages/order-detail/order-detail?orderId=' + orderId
      })
  
      wx.navigateTo({
        url: '/pages/order-detail/order-detail',
        success: (res) => {
          res.eventChannel.emit('sendOrderData', {
            order: order,
            profileInfo: this.data.profileInfo
          });
        }
      });
    },
  
    // 评价订单
    reviewOrder: function(e) {
      const orderId = e.currentTarget.dataset.id;
      const order = this.data.orders.find(item => item.id === orderId);
      
      if (!order) {
        wx.showToast({
          title: '订单不存在',
          icon: 'none'
        });
        return;
      }
  
      wx.navigateTo({
        url: `/pages/review/review?orderId=${orderId}`,
        success: (res) => {
          res.eventChannel.emit('sendOrderData', {
            order: order,
            profileInfo: this.data.profileInfo
          });
        }
      });
    },
  
    // 去购物
    goShopping: function() {
      wx.switchTab({
        url: '/pages/shop/shop'
      });
    },
  
    // 刷新数据
    onPullDownRefresh: function() {
      this.fetchOrderData();
      wx.stopPullDownRefresh();
    }
  });