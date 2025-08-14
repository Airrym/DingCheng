import { initialRecipient, loadCart, summary, saveCart } from '../../utils/data';

Page({
  data: { info: initialRecipient, items: [], total: 0, displayTime: '' },
  onShow(){
    const items = loadCart().filter(x=>x.selected);
    const { amount } = summary(items);
    const d = new Date(this.data.info.time);
    const displayTime = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    this.setData({ items, total: amount, displayTime });
  },
  submit(){
    const { items, total } = this.data;
    const now = new Date();
    const id = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}${String(now.getSeconds()).padStart(2,'0')}`;
    const date = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    const order = {
      id,
      date,
      status: '待发货',
      statusClass: 'bg-yellow-100',
      products: items.map(x=>({ name: x.name, quantity: x.quantity, unit: x.unit })),
      totalAmount: total
    };
    const orders = wx.getStorageSync('userOrders') || [];
    orders.unshift(order);
    wx.setStorageSync('userOrders', orders);

    const cart = loadCart().filter(x=>!x.selected);
    saveCart(cart);

    wx.navigateTo({ url:'/pages/success/success' });
  }
  });
