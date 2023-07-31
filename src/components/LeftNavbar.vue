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
    name: "Dashboard"
  },
   {
    path: "/companies",
    name: "Companies"
  },
  {
    path: "/users",
    name: "Users"
  },
  {
    path: "/orders",
    name: "Orders"
  },
  {
    path: "/customers",
    name: "Customers"
  },
  {
    path: "/orders/placed",
    name: "My Placed orders"
  }
  ],
  2:[
    {
    path: "/",
    name: "Dashboard"
    },
   {
    path: "/users",
    name: "Delivery Boys"
   },
    {
      path: "/orders",
      name: "Orders"
    },
    {
      path: "/customers",
      name: "Customers"
    },
    {
      path: "/orders/placed",
      name: "My Placed orders"
    }
    ],
  3: [
    {
    path: "/",
    name: "Dashboard"
    },
    {
    path: "/orders/my-orders",
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
