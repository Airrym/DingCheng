/* === 购物车工具函数 === */
const KEY = 'dc_cart';
const PT_KEY   = 'cart_purchaseType'; // 采购类型单独存储：'bulk' | 'personal'
export function getPurchaseType() {
  return wx.getStorageSync(PT_KEY) || null; // 没设置过返回 null
}
export function setPurchaseType(type) {
  // 可选：做个校验
  if (type !== 'bulk' && type !== 'personal') {
    console.warn('Unknown purchaseType:', type);
  }
  wx.setStorageSync(PT_KEY, type);
}
export function loadCart() {
  try { return wx.getStorageSync(KEY) || []; } catch(e) { return []; }
}

export function saveCart(cart) {
  wx.setStorageSync(KEY, cart);
}

export function add(cart, item, qty = 1) {
  const i = cart.findIndex(x => x.id === item.id);
  if (i >= 0) {
    cart[i].quantity += qty;
    if (cart[i].quantity <= 0) cart.splice(i, 1);
  } else {
    cart.push({ ...item, quantity: qty, selected: true });
  }
  saveCart(cart);
  return cart;
}

export function remove(cart, id) {
  const i = cart.findIndex(x => x.id === id);
  if (i >= 0) cart.splice(i, 1);
  saveCart(cart);
  return cart;
}

export function updateSelectAll(cart, selected) {
  cart.forEach(x => x.selected = selected);
  saveCart(cart);
  return cart;
}

export function toggle(cart, id) {
  const i = cart.findIndex(x => x.id === id);
  if (i >= 0) cart[i].selected = !cart[i].selected;
  saveCart(cart);
  return cart;
}

export function clear() {
  saveCart([]);
  return [];
}

export function summary(cart) {
  const selected = cart.filter(x => x.selected);
  const count = selected.reduce((s, x) => s + x.quantity, 0);
  const amount = selected.reduce((s, x) => s + x.quantity * x.price, 0);
  return { count, amount };
}
