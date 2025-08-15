// utils/data.js

/* === 静态数据 === */
export const categories = [
  { key: 'all', name: '全部商品' },
  { key: 'grains', name: '粮油米面' },
  { key: 'meat', name: '肉类' },
  { key: 'vegetables', name: '蔬菜水果' },
  { key: 'drinks', name: '饮品' },
  { key: 'daily', name: '日用品' }
];

export const products = [
  { id: '1', name: '大米', unit:'袋 / 50kg', price:280, category:'grains' },
  { id: '2', name: '面粉', unit:'袋 / 25kg', price:160, category:'grains' },
  { id: '3', name: '食用油', unit:'桶 / 10L', price:120, category:'grains' },
  { id: '4', name: '猪肉', unit:'kg', price:48, category:'meat' },
  { id: '5', name: '鸡肉', unit:'kg', price:38, category:'meat' },
  { id: '6', name: '土豆', unit:'kg', price:6, category:'vegetables' },
  { id: '7', name: '白菜', unit:'kg', price:4, category:'vegetables' },
  { id: '8', name: '饮用水', unit:'箱 / 24瓶', price:48, category:'drinks' }
];

export const initialRecipient = {
  name: '张明',
  email: 'zhangming@ship.com',
  address: '新加坡港，T3泊位',
  voyage: 'SG-2023-056',
  time: '2023-06-15T14:00'
};

export const initialProfile = {
  name: '张明',
  position: '大副',
  ship: '中远海运-星辰号',
  phone: '138****5678',
  email: 'zhangming@ship.com',
  address: '新加坡港，T3泊位'
};

export const orders = {
  '20230612001': {
    id:'20230612001', date:'2023-06-12 09:35', status:'待发货', type:'船舶集采',
    totalAmount: 720,
    products:[
      { name:'大米', quantity:1, unit:'袋 / 50kg', price:280 },
      { name:'面粉', quantity:1, unit:'袋 / 25kg', price:160 },
      { name:'食用油', quantity:2, unit:'桶 / 10L', price:120 }
    ]
  },
  '20230605003': {
    id:'20230605003', date:'2023-06-05 14:20', status:'已完成', type:'船舶集采',
    totalAmount: 770,
    products:[
      { name:'猪肉', quantity:10, unit:'kg', price:48 },
      { name:'鸡肉', quantity:5, unit:'kg', price:38 },
      { name:'土豆', quantity:20, unit:'kg', price:5 }
    ]
  }
};

