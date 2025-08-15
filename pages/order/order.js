import { categories, products } from '../../utils/data';
import { loadCart, add as addCart } from '../../utils/cart';

Page({
  data: {
    categories,
    currentCategory: 'all',
    search: '',
    list: products,
    filtered: [],
    cart: [],

    // ↓↓↓ 新增：数量弹窗所需状态
    showQty: false,
    qty: 1,
    pending: null // 待加入的商品对象
  },

  onShow() {
    this.setData({ cart: loadCart() });
    this.filter();
  },

  chooseType(e) {
    const type = e.currentTarget.dataset.type; // 'bulk' | 'personal'
    // 如果重复点击同一种类型，可以不再提示（可选）
    if (this.data.purchaseType === type) {
      wx.showToast({
        title: `已选择${type === 'bulk' ? '船舶集采' : '个人采购'}`,
        icon: 'success',
        duration: 1200
      });
      return;
    }
  
    this.setData({ purchaseType: type });
  
    // 反馈提示
    wx.showToast({
      title: `已选择${type === 'bulk' ? '船舶集采' : '个人采购'}`,
      icon: 'success',
      duration: 1200
    });
  
    // 可选：轻微震动增强反馈（模拟器可能无效）
    // wx.vibrateShort({ type: 'light' });
  },
  onSearch(e)  { this.setData({ search: e.detail.value.trim() }); this.filter(); },
  onCategory(e){ this.setData({ currentCategory: e.currentTarget.dataset.key }); this.filter(); },

  filter() {
    const { list, currentCategory, search, cart } = this.data;
    const filtered = list.filter(p =>
      (currentCategory === 'all' || p.category === currentCategory) &&
      (!search || p.name.includes(search))
    ).map(p => ({
      ...p,
      badge: (cart.find(x => x.id === p.id)?.quantity) || 0
    }));
    this.setData({ filtered });
  },

  // ====== 新增：打开数量弹窗 ======
  showQuantityModal(e) {
    const id = e.currentTarget.dataset.id;
    const item = this.data.list.find(x => x.id === id);
    if (!item) {
      console.error('商品未找到', id);
      wx.showToast({ title: '商品不存在', icon: 'none' });
      return;
    }
    this.setData({
      showQty: true,
      qty: 1,
      pending: item
    });
  },

  // ====== 新增：数量增减 ======
  decQty() {
    const q = Math.max(1, (this.data.qty || 1) - 1);
    this.setData({ qty: q });
  },
  incQty() {
    const q = Math.min(999, (this.data.qty || 1) + 1);
    this.setData({ qty: q });
  },
  onQtyInput(e) {
    let v = parseInt(e.detail.value, 10);
    if (Number.isNaN(v)) v = 1;
    v = Math.min(999, Math.max(1, v));
    this.setData({ qty: v });
  },

  // ====== 新增：确认/取消 ======
  confirmQty() {
    const { pending, qty } = this.data;
    if (!pending) return this.setData({ showQty: false });
    const cart = addCart(this.data.cart, pending, qty);
    this.setData({ cart, showQty: false, pending: null });
    this.filter();
    wx.showToast({ title: '已加入', icon: 'success' });
  },
  cancelQty() {
    this.setData({ showQty: false, pending: null });
  },

  // （可保留原 add，但现在按钮改为 showQuantityModal 了）
  add(e) {
    const id = e.currentTarget.dataset.id;
    const item = this.data.list.find(x => x.id === id);
    if (!item) { console.error('商品未找到', id); return; }
    const cart = addCart(this.data.cart, item, 1);
    this.setData({ cart });
    this.filter();
    wx.showToast({ title: '已加入', icon: 'success' });
  }
});
