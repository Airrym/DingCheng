// pages/confirm/confirm.js
import { initialRecipient } from '../../utils/data';
import * as cart from '../../utils/cart.js';

// 内部采购类型 -> 展示文案
function mapOrderType(type) {
  if (type === 'bulk') return '船舶集采';
  if (type === 'personal') return '个人采购';
  return '个人采购';
}

// 生成订单号：YYYYMMDD + 三位流水
function genOrderId(existing = {}) {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const prefix = `${y}${m}${d}`;
  const todayIds = Object.keys(existing).filter(id => id.startsWith(prefix));
  const maxSeq = todayIds.reduce((acc, id) => {
    const seq = parseInt(id.slice(prefix.length), 10) || 0;
    return Math.max(acc, seq);
  }, 0);
  return `${prefix}${String(maxSeq + 1).padStart(3, '0')}`;
}

// 时间格式：YYYY-MM-DD HH:mm
function fmtDisplayTime(dateLike) {
  const d = dateLike ? new Date(dateLike) : new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

Page({
  data: {
    info: initialRecipient,
    items: [],
    total: 0,
    displayTime: ''
  },

  onShow() {
    // 展示：仅显示已勾选的商品与金额
    const items = cart.loadCart().filter(x => x.selected);
    const { amount } = cart.summary(items);
    const displayTime = fmtDisplayTime(this.data.info?.time);
    this.setData({ items, total: amount, displayTime });
  },

  // 点击“提交订单” ——> 真正创建订单
  submit() {
    const items = this.data.items;
    if (!items || items.length === 0) {
      wx.showToast({ title: '请选择商品', icon: 'none' });
      return;
    }
  
    // 读取与规范化 orders（确保为对象而不是数组）
    let existing = wx.getStorageSync('orders');
    if (!existing || typeof existing !== 'object' || Array.isArray(existing)) {
      existing = {};
    }
  
    // 订单类型
    const pt = cart.getPurchaseType(); // 'bulk'|'personal'|null
    const orderType = pt === 'bulk' ? '船舶集采' : '个人采购';
  
    // 生成订单号：YYYYMMDD + 3位流水
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const prefix = `${y}${m}${d}`;
    const todayIds = Object.keys(existing).filter(id => id.startsWith(prefix));
    const maxSeq = todayIds.reduce((acc, id) => Math.max(acc, parseInt(id.slice(prefix.length), 10) || 0), 0);
    const id = `${prefix}${String(maxSeq + 1).padStart(3, '0')}`;
  
    // 时间
    const date = (() => {
      const pad = n => String(n).padStart(2, '0');
      return `${y}-${m}-${d} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    })();
  
    // 商品列表
    const products = items.map(it => ({
      name: it.name,
      quantity: it.quantity, // 购物车里维护的是 quantity
      unit: it.unit || '',
      price: it.price
    }));
  
    // 新订单
    const newOrder = {
      id,
      date,
      status: '待发货',
      type: orderType,
      totalAmount: this.data.total,
      products
    };
  
    try {
      existing[id] = newOrder;
      wx.setStorageSync('orders', existing);
  
      // 立刻回读校验
      const verify = wx.getStorageSync('orders');
      console.log('保存后的 orders：', verify);
      if (!verify || !verify[id]) {
        wx.showToast({ title: '写入失败，请重试', icon: 'none' });
        return;
      }
  
      // 清理已选商品
      const remain = cart.loadCart().filter(x => !x.selected);
      cart.saveCart(remain);
  
      wx.showToast({ title: '下单成功', icon: 'success' });
      wx.navigateTo({ url: '/pages/success/success' });
    } catch (e) {
      console.error('写入 orders 失败：', e);
      wx.showToast({ title: '写入失败', icon: 'none' });
    }
  }
  
}) 