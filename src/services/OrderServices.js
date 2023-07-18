import apiClient from "./services";

export default {
  getOrders(type,userId) {
    if(!userId || !type)
    return apiClient.get("orders");
  else {
    if(type == "placed"){
      return apiClient.get("ordersPlacedByClerk/"+userId)
    } else if(type == "my-orders") {
      return apiClient.get("ordersByDeliveryBoy/"+userId)
    } 
    else {
      return apiClient.get("orders")
    }
  }
   
  },
  getOrder(id) {
    return apiClient.get("orders/" + id);
  },
  addOrder(order) {
    return apiClient.post("orders", order);
  },
  calculateOrderDetails(order) {
    return apiClient.post("orders/getDetails",order);
  },
  updateOrder(order) {
    return apiClient.put("orders/" + order.id, order);
  },
  deleteOrder(orderId) {
    return apiClient.delete("orders/" + orderId);
  },
  pickedup(orderId) {
    return apiClient.post("orderpicked/" + orderId);
  },
  delivered(orderId) {
    return apiClient.post("orderdelivered/" + orderId);
  }
};