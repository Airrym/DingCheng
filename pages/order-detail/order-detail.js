Page({
    data: {
      order: null
    },
  
    onLoad(options) {
      const orderId = options.orderId;
      this.loadOrderDetail(orderId);
    },
  
    loadOrderDetail(orderId) {
      // 这里应该是从服务器获取订单详情，这里用模拟数据
      const orders = {
        "20230612001": {
          id: "20230612001",
          date: "2023-06-12 09:35",
          status: "待发货",
          statusClass: "bg-yellow-100 text-yellow-600",
          type: "船舶集采",
          paymentMethod: "公司月结",
          voyage: "SG-2023-056",
          totalAmount: 720,
          contactPerson: "张明（大副）",
          contactPhone: "138****5678",
          contactEmail: "zhangming@ship.com",
          shipName: "中远海运-星辰号",
          port: "新加坡港",
          berth: "T3泊位",
          arrivalTime: "2023-06-15 10:00",
          departureTime: "2023-06-16 08:00",
          products: [
            {name: "大米", quantity: 1, unit: "袋 / 50kg", price: 280, total: 280},
            {name: "面粉", quantity: 1, unit: "袋 / 25kg", price: 160, total: 160},
            {name: "食用油", quantity: 2, unit: "桶 / 10L", price: 120, total: 240}
          ],
          logistics: [
            {time: "2023-06-12 09:35", status: "订单已提交，等待供应商确认"},
            {time: "2023-06-12 10:15", status: "供应商已接收订单，正在准备商品"}
          ],
          actions: [
            {text: "取消订单", class: "bg-white border border-danger text-danger", action: "cancel"}
          ]
        },
        "20230605003": {
          id: "20230605003",
          date: "2023-06-05 14:20",
          status: "已完成",
          statusClass: "bg-green-100 text-green-600",
          type: "船舶集采",
          paymentMethod: "公司月结",
          voyage: "SG-2023-055",
          totalAmount: 770,
          contactPerson: "张明（大副）",
          contactPhone: "138****5678",
          contactEmail: "zhangming@ship.com",
          shipName: "中远海运-星辰号",
          port: "新加坡港",
          berth: "T2泊位",
          arrivalTime: "2023-06-08 14:00",
          departureTime: "2023-06-09 10:00",
          products: [
            {name: "猪肉", quantity: 10, unit: "kg", price: 48, total: 480},
            {name: "鸡肉", quantity: 5, unit: "kg", price: 38, total: 190},
            {name: "土豆", quantity: 20, unit: "kg", price: 5, total: 100}
          ],
          logistics: [
            {time: "2023-06-05 14:20", status: "订单已提交，等待供应商确认"},
            {time: "2023-06-05 15:05", status: "供应商已接收订单，正在准备商品"},
            {time: "2023-06-08 13:30", status: "商品已送达指定泊位"},
            {time: "2023-06-08 14:15", status: "船员已确认收货，订单完成"}
          ],
          actions: [
            {text: "查看评价", class: "bg-white border border-primary text-primary", action: "review"},
            {text: "再次购买", class: "bg-primary text-white", action: "rebuy"}
          ]
        },
        "20230528002": {
          id: "20230528002",
          date: "2023-05-28 16:45",
          status: "已取消",
          statusClass: "bg-neutral-100 text-neutral-500",
          type: "个人采购",
          paymentMethod: "在线支付",
          voyage: "SG-2023-054",
          totalAmount: 540,
          contactPerson: "张明（大副）",
          contactPhone: "138****5678",
          contactEmail: "zhangming@ship.com",
          shipName: "中远海运-星辰号",
          port: "新加坡港",
          berth: "T1泊位",
          arrivalTime: "2023-06-01 09:00",
          departureTime: "2023-06-02 16:00",
          products: [
            {name: "饮用水", quantity: 10, unit: "箱 / 24瓶", price: 48, total: 480},
            {name: "白菜", quantity: 15, unit: "kg", price: 4, total: 60}
          ],
          logistics: [
            {time: "2023-05-28 16:45", status: "订单已提交，等待供应商确认"},
            {time: "2023-05-29 08:30", status: "供应商已接收订单，正在准备商品"},
            {time: "2023-05-30 10:15", status: "订单已取消，原因：航次变更"}
          ],
          actions: [
            {text: "重新下单", class: "bg-primary text-white", action: "reorder"}
          ]
        }
      };
  
      const order = orders[orderId];
      console.log(order);
      if (order) {
        this.setData({ order: order });
      } else {
        // wx.showToast({
        //   title: '订单不存在',
        //   icon: 'none'
        // });
        // setTimeout(() => {
        //   wx.navigateBack();
        // }, 1500);
      }
    },
  
    handleAction(e) {
      const action = e.currentTarget.dataset.action;
      const orderId = e.currentTarget.dataset.orderId;
      const order = this.data.order;
  
      switch(action) {
        case 'cancel':
          wx.showModal({
            title: '确认取消',
            content: `确定要取消订单 #${orderId} 吗？`,
            success: (res) => {
              if (res.confirm) {
                wx.showToast({
                  title: `订单 #${orderId} 已取消`,
                  icon: 'success'
                });
                setTimeout(() => {
                  wx.navigateBack();
                }, 1500);
              }
            }
          });
          break;
        case 'review':
          wx.showToast({
            title: `评价功能待实现，订单 #${orderId}`,
            icon: 'none'
          });
          break;
        case 'rebuy':
        case 'reorder':
          // 将订单商品添加到购物车
          const products = order.products;
          wx.setStorageSync('rebuyProducts', products);
          wx.showToast({
            title: `已将订单 #${orderId} 的商品添加到购物车`,
            icon: 'success'
          });
          wx.switchTab({
            url: '/pages/cart/cart'
          });
          break;
      }
    }
  });