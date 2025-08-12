// utils/cart.js
const KEY = 'dc_cart';

export function loadCart() {
  try { return wx.getStorageSync(KEY) || []; } catch(e) { return []; }
}

export function saveCart(cart) {
  wx.setStorageSync(KEY, cart);
}

export function add(cart, item, qty=1) {
  const i = cart.findIndex(x => x.id === item.id);
  if (i >= 0) { cart[i].quantity += qty; } else { cart.push({ ...item, quantity: qty, selected: true }); }
  if (cart[i]?.quantity <= 0) cart.splice(i,1);
  saveCart(cart); return cart;
}

export function updateSelectAll(cart, selected) {
  cart.forEach(x => x.selected = selected); saveCart(cart); return cart;
}

export function toggle(cart, id) {
  const i = cart.findIndex(x => x.id===id); if (i>=0) cart[i].selected = !cart[i].selected; saveCart(cart); return cart;
}

export function remove(cart, id) {
  const i = cart.findIndex(x => x.id===id); if (i>=0) cart.splice(i,1); saveCart(cart); return cart;
}

export function clear() { saveCart([]); return []; }

export function summary(cart) {
  const selected = cart.filter(x => x.selected);
  const count = selected.reduce((s,x)=>s+x.quantity,0);
  const amount = selected.reduce((s,x)=>s+x.quantity*x.price,0);
  return { count, amount };
}
