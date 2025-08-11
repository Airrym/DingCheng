import { categories, products } from '../../utils/data';
import { loadCart, add as addCart } from '../../utils/data';

Page({
  data: { categories, currentCategory:'all', search:'', list: products, filtered: [], cart: [] },
  onShow() { this.setData({ cart: loadCart() }); this.filter(); },
  chooseType(e) { this.setData({ purchaseType: e.currentTarget.dataset.type }); },
  onSearch(e){ this.setData({ search: e.detail.value.trim() }); this.filter(); },
  onCategory(e){ this.setData({ currentCategory: e.currentTarget.dataset.key }); this.filter(); },
  filter(){
    const { list, currentCategory, search, cart } = this.data;
    const filtered = list.filter(p =>
      (currentCategory==='all' || p.category===currentCategory) &&
      (!search || p.name.includes(search))
    ).map(p=>({
      ...p,
      badge: (cart.find(x=>x.id===p.id)?.quantity)||0
    }));
    this.setData({ filtered });
  },
  add(e){
    const id = e.currentTarget.dataset.id;
    const item = this.data.list.find(x=>x.id===id);
    const cart = addCart(this.data.cart, item, 1);
    this.setData({ cart });
    this.filter();
    wx.showToast({ title:'已加入', icon:'success' });
  }
});