import { initialRecipient } from '../../utils/data';
import * as cart from '../../utils/cart.js'; 

Page({
  data: { info: initialRecipient, items: [], total: 0, displayTime: '' },
  onShow(){
    const items = cart.loadCart().filter(x=>x.selected);
    const { amount } = cart.summary(items);
    const d = new Date(this.data.info.time);
    const displayTime = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    this.setData({ items, total: amount, displayTime });
  },
  submit(){
    wx.navigateTo({ url:'/pages/success/success' });
  }
});