import { initialProfile, orders } from '../../utils/data';

Page({
  data: { profile: initialProfile, orderList: [] },
  onShow(){
    const orderList = Object.values(orders).map(o=>({
      ...o,
      summary: o.products.map(p=>`${p.name} x${p.quantity}`).join('，')
    }));
    this.setData({ orderList });
  },
  edit(){ wx.showToast({ title:'示例：可跳转编辑页面', icon:'none' }); },
  detail(e){ wx.showToast({ title:`查看订单 ${e.currentTarget.dataset.id}`, icon:'none' }); }
});