// pages/order-detail/order-detail.js
import * as cart from '../../utils/cart.js';

// 状态样式（按你原来的 class 命名习惯）
function statusClassOf(status) {
  if (status === '待发货') return 'bg-yellow-100 text-yellow-600';
  if (status === '已完成') return 'bg-green-100 text-green-600';
  if (status === '已取消') return 'bg-neutral-100 text-neutral-500';
  return 'bg-neutral-100 text-neutral-500';
}

// 从本地 orders（对象：{id:order}）取订单
function getOrderFromStore(orderId) {
  let store = wx.getStorageSync('orders');
  if (!store || typeof store !== 'object' || Array.isArray(store)) store = {};
  return store[orderId] || null;
}

// 写回本地 orders
function saveOrderToStore(order) {
  let store = wx.getStorageSync('orders');
  if (!store || typeof store !== 'object' || Array.isArray(store)) store = {};
  store[order.id] = order;
  wx.setStorageSync('orders', store);
}

Page({
  data: {
    order: null
  },

  onLoad(options) {
    // 兼容 ?id=xxx 或 ?orderId=xxx
    const orderId = options.id || options.orderId;
    if (!orderId) {
      wx.showToast({ title: '缺少订单ID', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1200);
      return;
    }
    this.loadOrderDetail(orderId);
  },

  loadOrderDetail(orderId) {
    const order = getOrderFromStore(orderId);

    if (order) {
      // 兜底：若 totalAmount/产品合计没填，现算一遍
      const totalAmount =
        typeof order.totalAmount === 'number'
          ? order.totalAmount
          : (order.products || []).reduce((s, p) => s + (p.price || 0) * (p.quantity || 0), 0);

      // 给每个明细补一个 total 字段（单行小计），便于 WXML 展示
      const products = (order.products || []).map(p => ({
        ...p,
        total: (p.price || 0) * (p.quantity || 0)
      }));

      const patched = {
        ...order,
        totalAmount,
        products,
        statusClass: order.statusClass || statusClassOf(order.status)
      };

      this.setData({ order: patched });
      // 同步回存（补齐的字段带回本地）
      saveOrderToStore(patched);
    } else {
      wx.showToast({ title: '订单不存在', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1200);
    }
  },

  handleAction(e) {
    const action = e.currentTarget.dataset.action;
    const order = this.data.order;
    if (!order) return;

    switch (action) {
      case 'cancel': {
        if (order.status === '已取消') {
          wx.showToast({ title: '订单已取消', icon: 'none' });
          return;
        }
        if (order.status === '已完成') {
          wx.showToast({ title: '已完成订单不可取消', icon: 'none' });
          return;
        }
        wx.showModal({
          title: '确认取消',
          content: `确定要取消订单 #${order.id} 吗？`,
          success: (res) => {
            if (res.confirm) {
              const updated = {
                ...order,
                status: '已取消',
                statusClass: statusClassOf('已取消')
              };
              saveOrderToStore(updated);
              this.setData({ order: updated });
              wx.showToast({ title: `订单 #${order.id} 已取消`, icon: 'success' });
            }
          }
        });
        break;
      }
      case 'review':
        wx.showToast({ title: `评价功能待实现（#${order.id}）`, icon: 'none' });
        break;

      case 'rebuy':
      case 'reorder': {
        // 直接把本订单商品加到购物车（叠加数量）
        let c = cart.loadCart();
        (order.products || []).forEach(p => {
          // 购物车 add(cart, item, qty)
          // 兼容购物车字段：id/name/price/unit
          const item = {
            id: `${order.id}:${p.name}:${p.unit || ''}`, // 防止与现有商品冲突（简单生成唯一键）
            name: p.name,
            price: p.price,
            unit: p.unit || ''
          };
          cart.add(c, item, Number(p.quantity || 1));
          // cart.add 内部会 saveCart，这里不必额外 save
          c = cart.loadCart(); // 取回最新
        });
        wx.showToast({ title: '已加入购物车', icon: 'success' });
        wx.switchTab({ url: '/pages/cart/cart' });
        break;
      }

      default:
        wx.showToast({ title: '未知操作', icon: 'none' });
    }
  }
});
