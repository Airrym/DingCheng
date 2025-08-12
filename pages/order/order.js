Page({
    data: {
      purchaseType: 'bulk', // 采购类型 bulk:船舶集采 personal:个人采购
      currentCategory: 'all', // 当前分类
      searchTerm: '', // 搜索关键词
      products: [ // 商品列表
        { id: '1', name: '大米', unit: '袋 / 50kg', price: 280, category: 'grains', cartCount: 0 },
        { id: '2', name: '面粉', unit: '袋 / 25kg', price: 160, category: 'grains', cartCount: 0 },
        { id: '3', name: '食用油', unit: '桶 / 10L', price: 120, category: 'grains', cartCount: 0 },
        { id: '4', name: '猪肉', unit: 'kg', price: 48, category: 'meat', cartCount: 0 },
        { id: '5', name: '鸡肉', unit: 'kg', price: 38, category: 'meat', cartCount: 0 },
        { id: '6', name: '土豆', unit: 'kg', price: 6, category: 'vegetables', cartCount: 0 },
        { id: '7', name: '白菜', unit: 'kg', price: 4, category: 'vegetables', cartCount: 0 },
        { id: '8', name: '饮用水', unit: '箱 / 24瓶', price: 48, category: 'drinks', cartCount: 0 }
      ],
      filteredProducts: [], // 过滤后的商品列表
      scrollHeight: 0, // 商品列表滚动区域高度
      showModal: false, // 是否显示数量选择弹窗
      selectedProduct: null, // 当前选择的商品
      currentQuantity: 1, // 当前选择的数量
      cartItems: [] // 购物车商品
    },
  
    onLoad() {
      // 计算商品列表滚动区域高度
      this.calculateScrollHeight();
      // 初始化过滤商品
      this.filterProducts();
      // 获取购物车数据
      this.getCartItems();
    },
  
    onShow() {
      // 每次页面显示时更新购物车数据
      this.getCartItems();
    },
  
    // 计算商品列表滚动区域高度
    calculateScrollHeight() {
      const systemInfo = wx.getSystemInfoSync();
      const query = wx.createSelectorQuery();
      query.select('.product-list-container').boundingClientRect();
      query.exec(res => {
        const containerHeight = res[0].height;
        this.setData({
          scrollHeight: systemInfo.windowHeight - containerHeight - 60
        });
      });
    },
  
    // 获取购物车数据
    getCartItems() {
      const cartItems = wx.getStorageSync('cartItems') || [];
      this.setData({ cartItems });
      this.updateProductCartCounts();
    },
  
    // 更新商品列表中的购物车数量显示
    updateProductCartCounts() {
      const { products, cartItems } = this.data;
      const updatedProducts = products.map(product => {
        const cartItem = cartItems.find(item => item.id === product.id);
        return {
          ...product,
          cartCount: cartItem ? cartItem.quantity : 0
        };
      });
      this.setData({ products: updatedProducts });
      this.filterProducts();
    },
  
    // 过滤商品列表（根据分类和搜索词）
    filterProducts() {
      const { currentCategory, searchTerm, products } = this.data;
      const filtered = products.filter(product => {
        const categoryMatch = currentCategory === 'all' || product.category === currentCategory;
        const searchMatch = searchTerm === '' || 
          product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return categoryMatch && searchMatch;
      });
      this.setData({ filteredProducts: filtered });
    },
  
    // 切换采购类型
    switchPurchaseType(e) {
      const type = e.currentTarget.dataset.type;
      this.setData({ purchaseType: type });
      wx.showToast({
        title: `已选择：${type === 'bulk' ? '船舶集采' : '个人采购'}`,
        icon: 'none'
      });
    },
  
    // 切换商品分类
    switchCategory(e) {
      const category = e.currentTarget.dataset.category;
      this.setData({ currentCategory: category });
      this.filterProducts();
    },
  
    // 处理搜索输入
    handleSearch(e) {
      this.setData({ searchTerm: e.detail.value });
      this.filterProducts();
    },
  
    // 显示数量选择弹窗
    showQuantityModal(e) {
      const product = e.currentTarget.dataset.product;
      // 查找购物车中是否已有该商品
      const cartItem = this.data.cartItems.find(item => item.id === product.id);
      
      this.setData({
        showModal: true,
        selectedProduct: product,
        currentQuantity: cartItem ? cartItem.quantity : 1
      });
    },
  
    // 隐藏数量选择弹窗
    hideQuantityModal() {
      this.setData({ showModal: false });
    },
  
    // 增加数量
    increaseQuantity() {
      this.setData({
        currentQuantity: this.data.currentQuantity + 1
      });
    },
  
    // 减少数量
    decreaseQuantity() {
      if (this.data.currentQuantity > 1) {
        this.setData({
          currentQuantity: this.data.currentQuantity - 1
        });
      }
    },
  
    // 确认添加到购物车
    confirmAddToCart() {
      const { selectedProduct, currentQuantity, cartItems } = this.data;
      
      // 查找购物车中是否已有该商品
      const existingItemIndex = cartItems.findIndex(item => item.id === selectedProduct.id);
      
      if (existingItemIndex >= 0) {
        // 如果已存在，更新数量
        cartItems[existingItemIndex].quantity = currentQuantity;
      } else {
        // 否则添加新商品
        cartItems.push({
          id: selectedProduct.id,
          name: selectedProduct.name,
          unit: selectedProduct.unit,
          price: selectedProduct.price,
          quantity: currentQuantity
        });
      }
      
      // 保存到本地存储
      wx.setStorageSync('cartItems', cartItems);
      
      // 更新UI
      this.setData({ cartItems });
      this.updateProductCartCounts();
      
      // 隐藏弹窗
      this.hideQuantityModal();
      
      // 显示成功提示
      wx.showToast({
        title: `${selectedProduct.name} 数量已更新为 ${currentQuantity}`,
        icon: 'none'
      });
    }
  });