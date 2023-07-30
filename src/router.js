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
      path: "/add-user",
      name: "addUser",
      component: () => import("./views/AddUser.vue"),
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
    {
      path: "/orders/:type",
      name: "filterorders",
      component: () => import("./views/OrderList.vue"),
    },
    {
      path: "/update-user/:id",
      name: "updateUser",
      component: () => import("./views/UpdateUser.vue"),
    },
    {
      path: "/update-customer/:id",
      name: "updateCustomer",
      component: () => import("./views/UpdateCustomer.vue"),
    },
    {
      path: "/update-order/:id",
      name: "updateOrder",
      component: () => import("./views/UpdateOrder.vue"),
    },
    {
      path: "/companies",
      name: "companies",
      component: () => import("./views/CompanyList.vue"),
    },
    {
      path: "/update-company/:id",
      name: "updateCompany",
      component: () => import("./views/UpdateCompany.vue"),
    },
    {
      path: "/add-company",
      name: "addCompany",
      component: () => import("./views/AddCompany.vue"),
    },

  ],
});

export default router;
