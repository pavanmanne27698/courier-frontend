<script setup>
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
import { ref, onMounted, watch } from "vue";
import {getUrl} from "../common";

const router = useRouter();
const user = ref(null);
onMounted(() => {
  user.value = JSON.parse(localStorage.getItem("user"));
});

const routes = {
  1:[
    {
    path: "/",
    icon: getUrl()+"/dashboard.png",
    name: "Dashboard"
  },
   {
    path: "/companies",
    name: "Companies"
  },
  {
    path: "/users",
    icon: getUrl()+"/admin.png",
    name: "Users"
  },
  {
    path: "/orders",
    icon: getUrl()+"/order.png",
    name: "Orders"
  },
  {
    path: "/customers",
    icon: getUrl()+"/customer.png",
    name: "Customers"
  },
  {
    path: "/orders/placed",
    icon: getUrl()+"/order.png",
    name: "My Placed orders"
  }
  ],
  2:[
    {
    path: "/",
    icon: getUrl()+"/dashboard.png",
    name: "Dashboard"
    },

 /*   {
    path: "/users",
    icon: getUrl()+"/admin.png",
    name: "Users"
   }, */
    {
      path: "/orders",
      icon: getUrl()+"/order.png",
      name: "Orders"
    },
    {
      path: "/customers",
      icon: getUrl()+"/customer.png",
      name: "Customers"
    },
    {
      path: "/orders/placed",
      icon: getUrl()+"/order.png",
      name: "My Placed orders"
    }
    ],
  3: [
    {
    path: "/",
    icon: getUrl()+"/dashboard.png",
    name: "Dashboard"
    },
    {
    path: "/orders/my-orders",
    icon: getUrl()+"/order.png",
    name: "My Orders"
    }
  ],
}
</script>
<template>
    <v-navigation-drawer app>
      <v-list style="margin-top:20px;">
        <v-list-item v-for="route in routes[user?.role]" :key="route.path" :to="route.path" link>
          <div style="display:flex">
            <!-- <img :src="route.icon" width="25" height="25" style="margin-right:20px;"/> -->
            <p style="color:black;">{{ route.name }}</p>
          </div>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
</template>
<style>

</style>
