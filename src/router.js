import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("./views/Dashboard.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/add-order",
      name: "addOrder",
      component: () => import("./views/AddOrder.vue"),
    },
    {
      path: "/add-customer",
      name: "addCustomer",
      component: () => import("./views/AddCustomer.vue"),
    },
    {
      path: "/users",
      name: "users",
      component: () => import("./views/UserList.vue"),
    },
    {
      path: "/customers",
      name: "customers",
      component: () => import("./views/CustomerList.vue"),
    },
    {
      path: "/orders",
      name: "orders",
      component: () => import("./views/OrderList.vue"),
    },
  ],
});

export default router;
