Page({
    data: {
      cart: [], // 购物车商品列表
      selectAll: false, // 是否全选
      selectedCount: 0, // 选中商品数量
      totalAmount: 0 // 总金额
    },
  
    onLoad() {
      // 从全局获取购物车数据
      this.loadCartData();
    },
  
    onShow() {
      // 每次页面显示时更新购物车数据
      this.loadCartData();
    },
  
    // 加载购物车数据
    loadCartData() {
      const app = getApp();
      this.setData({
        cart: app.globalData.cart || [],
        selectAll: this.checkSelectAll(),
        selectedCount: this.calculateSelectedCount(),
        totalAmount: this.calculateTotalAmount()
      });
    },
  
    // 检查是否全选
    checkSelectAll() {
      const { cart } = this.data;
      if (cart.length === 0) return false;
      return cart.every(item => item.selected);
    },
  
    // 计算选中商品数量
    calculateSelectedCount() {
      const { cart } = this.data;
      return cart.filter(item => item.selected).reduce((sum, item) => sum + item.quantity, 0);
    },
  
    // 计算总金额
    calculateTotalAmount() {
      const { cart } = this.data;
      return cart.filter(item => item.selected).reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
  
    // 全选/取消全选
    toggleSelectAll(e) {
      const isSelected = e.detail.value;
      const { cart } = this.data;
      
      // 更新所有商品选中状态
      const updatedCart = cart.map(item => ({
        ...item,
        selected: isSelected
      }));
      
      // 更新全局购物车数据
      getApp().globalData.cart = updatedCart;
      
      this.setData({
        cart: updatedCart,
        selectAll: isSelected,
        selectedCount: this.calculateSelectedCount(),
        totalAmount: this.calculateTotalAmount()
      });
    },
  
    // 切换商品选中状态
    toggleItemSelect(e) {
      const productId = e.currentTarget.dataset.id;
      const isSelected = e.detail.value;
      const { cart } = this.data;
      
      // 更新对应商品的选中状态
      const updatedCart = cart.map(item => 
        item.id === productId ? { ...item, selected: isSelected } : item
      );
      
      // 更新全局购物车数据
      getApp().globalData.cart = updatedCart;
      
      this.setData({
        cart: updatedCart,
        selectAll: this.checkSelectAll(),
        selectedCount: this.calculateSelectedCount(),
        totalAmount: this.calculateTotalAmount()
      });
    },
  
    // 减少商品数量
    decreaseQuantity(e) {
      const productId = e.currentTarget.dataset.id;
      const { cart } = this.data;
      
      const updatedCart = cart.map(item => {
        if (item.id === productId) {
          const newQuantity = Math.max(1, item.quantity - 1);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0); // 数量为0时移除商品
      
      // 更新全局购物车数据
      getApp().globalData.cart = updatedCart;
      
      this.setData({
        cart: updatedCart,
        selectedCount: this.calculateSelectedCount(),
        totalAmount: this.calculateTotalAmount()
      });
    },
  
    // 增加商品数量
    increaseQuantity(e) {
      const productId = e.currentTarget.dataset.id;
      const { cart } = this.data;
      
      const updatedCart = cart.map(item => 
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      );
      
      // 更新全局购物车数据
      getApp().globalData.cart = updatedCart;
      
      this.setData({
        cart: updatedCart,
        selectedCount: this.calculateSelectedCount(),
        totalAmount: this.calculateTotalAmount()
      });
    },
  
    // 移除商品
    removeItem(e) {
      const productId = e.currentTarget.dataset.id;
      const { cart } = this.data;
      
      wx.showModal({
        title: '提示',
        content: '确定要删除该商品吗？',
        success: (res) => {
          if (res.confirm) {
            const updatedCart = cart.filter(item => item.id !== productId);
            
            // 更新全局购物车数据
            getApp().globalData.cart = updatedCart;
            
            this.setData({
              cart: updatedCart,
              selectAll: this.checkSelectAll(),
              selectedCount: this.calculateSelectedCount(),
              totalAmount: this.calculateTotalAmount()
            });
            
            wx.showToast({
              title: '已删除',
              icon: 'success'
            });
          }
        }
      });
    },
  
    // 清空购物车
    clearCart() {
      const { cart } = this.data;
      if (cart.length === 0) return;
      
      wx.showModal({
        title: '提示',
        content: '确定要清空购物车吗？',
        success: (res) => {
          if (res.confirm) {
            // 清空全局购物车数据
            getApp().globalData.cart = [];
            
            this.setData({
              cart: [],
              selectAll: false,
              selectedCount: 0,
              totalAmount: 0
            });
            
            wx.showToast({
              title: '购物车已清空',
              icon: 'success'
            });
          }
        }
      });
    },
  
    // 去下单
    goShopping() {
      wx.switchTab({
        url: '/pages/order/order'
      });
    },
  
    // 去结算
    goToCheckout() {
      const { selectedCount } = this.data;
      if (selectedCount === 0) {
        wx.showToast({
          title: '请选择要购买的商品',
          icon: 'none'
        });
        return;
      }
      
      wx.navigateTo({
        url: '/pages/confirm/confirm'
      });
    }
  });
