import apiClient from "./services";

export default {
  getDashboard() {
    return apiClient.get("dashboard");
  },
  getLastWeekReport() {
    return apiClient.get("lastWeekOrders");
  }
};