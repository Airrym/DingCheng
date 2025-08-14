// pages/order-detail/order-detail.js
Page({
    data: {
      order: {},
      profileInfo: {}
    },
  
    onLoad(options) {
      const eventChannel = this.getOpenerEventChannel();
      
      eventChannel.on('sendOrderData', (data) => {
        this.setData({
          order: data.order,
          profileInfo: data.profileInfo
        });
      });
    },
  
    navigateBack() {
      wx.navigateBack();
    },
  
    reviewOrder() {
      wx.navigateTo({
        url: `/pages/review/review?orderId=${this.data.order.id}`
      });
    }
  });