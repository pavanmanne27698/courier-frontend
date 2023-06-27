import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("./views/Login.vue"),
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
  ],
});

export default router;
