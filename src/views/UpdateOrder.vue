<script setup>
import { onMounted, watch } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import CustomerServices from "../services/CustomerServices.js";
import OrderServices from "../services/OrderServices.js";
import UserServices from "../services/UserServices.js";
import Loading from "../components/Loading.vue";
import LeftNavbar from "../components/LeftNavbar.vue";

const router = useRouter();
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const order = ref({});
const isLoading = ref(true);
const user = ref(null);
const customers = ref([]);
const deliveryBoys = ref([]);

onMounted(async () => {
    user.value = JSON.parse(localStorage.getItem("user"));
    await getCustomers();
    await getOrderDetails();
    await getAvailableDeliveryBoys();
    isLoading.value = false;
});
async function getAvailableDeliveryBoys() {
  await UserServices.getAvailableDeliveryBoys()
    .then((response) => {
      deliveryBoys.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function getCustomers() {
  await CustomerServices.getCustomers()
    .then((response) => {
      customers.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

function closeSnackBar() {
  snackbar.value.value = false;
}

async function getOrderDetails() {
    isLoading.value = true
    await OrderServices.getOrder(router.currentRoute.value.params.id)
        .then((response) => {
            order.value = response.data
            isLoading.value = false
        })
        .catch((error) => {
            isLoading.value = false
        });
}

async function updateOrder() {
    isLoading.value = true
    await OrderServices.updateOrder(order.value)
        .then((response) => {
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "order updated successfully!";
            isLoading.value = false
        })
        .catch((error) => {
            console.log(error);
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
            isLoading.value = false
        });
}

</script>

<template>
  <v-container>
    <div class="flex flex-1">
      <LeftNavbar/>
      <div id="body">
        <v-card class="rounded-lg elevation-5">
          <div style="display:flex;" class="heading">
            <v-card-title class="headline mb-2">Update Order </v-card-title>
          </div>
          <Loading v-if="isLoading" />
          <v-card-text v-else>
            <div class="mb-3">
            <label for="pickup_time" class="form-label">Pickup Time</label>
            <input type="text" class="form-control form-control-lg" id="pickup_time" v-model="order.pickupDateTime"/>
          </div>
          <div class="mb-3">
              <label for="user" class="form-label">Pickup Customer </label>
              <select class="form-control form-control-lg" id="dropdown" v-model="order.pickupCustomerId">
                <option value="">Select Customer</option>
                <option v-for="customer in customers" :key="customer.id" :value="customer.id"> {{customer.lastName}} {{customer.firstName}}</option>
              </select>
          </div>
          <div class="row" style="display:flex;justify-content:space-between;margin-top:10px;">
            <div class="col-6">
              <label for="pickup" class="form-label">Pickup Location</label>
            <input type="text" class="form-control form-control-lg" id="pickup" v-model="order.pickupLocation"/>
            </div>
            <div class="col-6">
                <label for="delivery" class="form-label">Delivery Location</label>
                <input type="text" class="form-control form-control-lg" id="delivery" v-model="order.deliveryLocation"/>
            </div>
          </div>
            <div class="row" style="display:flex;justify-content:space-between;margin-top:10px;">
            <div class="col-6">
              <label for="cost" class="form-label">Cost</label>
            <input type="text" class="form-control form-control-lg" id="cost" v-model="order.cost"/>
            </div>
            <div class="col-6">
                <label for="distance" class="form-label">Distance</label>
                <input type="text" class="form-control form-control-lg" id="distance" v-model="order.distance"/>
            </div>
          </div>
            <div class="row" style="display:flex;justify-content:space-between;margin-top:10px;">
            <div class="col-6">
              <label for="status" class="form-label">Status</label>
            <input type="text" class="form-control form-control-lg" id="status" v-model="order.status"/>
            </div>
            <div class="col-6">
                <label for="time" class="form-label">Minimum Time takes to Deliver (minutes)</label>
                <input type="text" class="form-control form-control-lg" id="time" v-model="order.timeForDelivery"/>
            </div>
          </div>
        <div class="mb-3" style="margin-top:10px;">
            <label for="user" class="form-label">Delivery Boy</label>
            <select class="form-control" id="dropdown" v-model="order.deliveryBoyUserId">
              <option v-for="deliveryBoy in deliveryBoys" :key="deliveryBoy.id" :value="deliveryBoy.id"> {{deliveryBoy.lastName}} {{deliveryBoy.firstName}}</option>
            </select>
        </div>
          </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="primary" @click="updateOrder()">Update</v-btn>
          </v-card-actions>
        </v-card>
        <v-snackbar v-model="snackbar.value" rounded="pill">
          {{ snackbar.text }}

          <template v-slot:actions>
            <v-btn
              :color="snackbar.color"
              variant="text"
              @click="closeSnackBar()"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </div>
    </div>
  </v-container>
</template>

<style scoped>
.add {
  margin-right: 20px;
  height: 40px;
  margin-top: 5px;
}
.heading {
    margin-top: 10px;
    justify-content: space-between;
}
.orderDetails {
  margin-left: 30px;
}
.place-order {
  margin-left:40%;
}
#body {
  margin-top: 20px;
}
</style>