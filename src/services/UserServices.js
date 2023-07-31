import apiClient from "./services";

export default {
  getUser(id) {
    if(!id)
      return apiClient.get("users");
    return apiClient.get("users/"+id)
  },
  addUser(user) {
    return apiClient.post("users", user);
  },
  updateUser(user) {
    return apiClient.put("users/" + user.id, user);
  },
  loginUser(user) {
    console.log(user);
    return apiClient.post("login", user.value, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        crossDomain: true,
        Authorization:
          "Basic " + btoa(user.value.email + ":" + user.value.password),
      },
    });
  },
  logoutUser() {
    return apiClient.post("logout");
  },
  getUsers(role) {
    console.log("role",role)
    if(role == 1)
      return apiClient.get("users/")
    else {
      return apiClient.get("users/deliveryBoys")
    }
  },
  deleteUser(userId) {
    return apiClient.delete("users/" + userId);
  },
  getAvailableDeliveryBoys() {
    return apiClient.get("users/deliveryBoys");
  }
};
