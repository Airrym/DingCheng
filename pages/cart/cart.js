import { loadCart, saveCart, add as addCart, remove as rm, updateSelectAll, toggle as tg, summary } from '../../utils/cart';

Page({
  data: { cart: [], allSelected: false, sum: { count:0, amount:0 } },
  onShow(){ this.refresh(); },
  refresh(){
    const cart = loadCart();
    const allSelected = cart.length>0 && cart.every(x=>x.selected);
    this.setData({ cart, allSelected, sum: summary(cart) });
  },
  toggleAll(e){ updateSelectAll(this.data.cart, e.detail.value.length>0); this.refresh(); },
  toggle(e){ tg(this.data.cart, e.currentTarget.dataset.id); this.refresh(); },
  step(e){
    const { id, delta } = e.currentTarget.dataset;
    const item = this.data.cart.find(x=>x.id===id);
    addCart(this.data.cart, item, Number(delta));
    this.refresh();
  },
  remove(e){ rm(this.data.cart, e.currentTarget.dataset.id); this.refresh(); },
  clear(){ wx.showModal({ title:'清空购物车', content:'确认清空？', success:res=>{ if(res.confirm){ this.setData({ cart:[] }); saveCart([]); this.refresh(); } } }); },
  goOrder(){ wx.switchTab({ url:'/pages/order/order' }); },
  submit(){
    if (this.data.sum.count===0) { wx.showToast({ title:'请选择商品', icon:'none' }); return; }
    wx.navigateTo({ url:'/pages/confirm/confirm' });
  }
});