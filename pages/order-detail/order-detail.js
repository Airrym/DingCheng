Page({
  data: {
    profileInfo: {
      name: "张明",
      position: "大副",
      ship: "中远海运-星辰号",
      phone: "138****5678",
      email: "zhangming@ship.com",
      address: "新加坡港，T3泊位"
    },
    orders: [
      {
        id: "20230612001",
        date: "2023-06-12 09:35",
        status: "待发货",
        statusClass: "bg-yellow-100",
        products: [
          {name: "大米", quantity: 1, unit: "袋 / 50kg"},
          {name: "面粉", quantity: 1, unit: "袋 / 25kg"},
          {name: "食用油", quantity: 2, unit: "桶 / 10L"}
        ],
        totalAmount: 720
      },
      {
        id: "20230605003",
        date: "2023-06-05 14:20",
        status: "已完成",
        statusClass: "bg-green-100",
        products: [
          {name: "猪肉", quantity: 10, unit: "kg"},
          {name: "鸡肉", quantity: 5, unit: "kg"},
          {name: "土豆", quantity: 20, unit: "kg"}
        ],
        totalAmount: 770
      },
      {
        id: "20230528002",
        date: "2023-05-28 16:45",
        status: "已取消",
        statusClass: "bg-neutral-100",
        products: [
          {name: "饮用水", quantity: 10, unit: "箱 / 24瓶"},
          {name: "白菜", quantity: 15, unit: "kg"}
        ],
        totalAmount: 540
      }
    ]
  },
  onLoad() {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('sendOrderData', (data) => {
      this.setData({ orders: data });
    });
  }
});
