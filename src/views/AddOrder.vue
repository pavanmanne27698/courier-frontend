<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import CustomerServices from "../services/CustomerServices.js";
import OrderServices from "../services/OrderServices.js";
import Loading from "../components/Loading.vue";

const router = useRouter();
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const order = ref({
  pickupTime: "",
  pickupCustomerId: "",
  deliveryCustomerId: "",
  deliveryLocation:"",
  pickupLocation:""
});
const isLoading = ref(true);
const user = ref(null);
const customers = ref([]);
const orderDetails = ref(null)

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  await getCustomers();
  isLoading.value = false;
});

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
  if(order.value.pickupTime === "") {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "Pick up time is empty!";
  }
  else if(order.value.pickupCustomerId === "") {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "Pickup Customer is empty!";
  }
  else if(order.value.deliveryIustomerId === "") {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "Delivery Customer is empty!";
  }
  else {
    isLoading.value = true
    await OrderServices.calculateOrderDetails(order.value)
        .then((response) => {
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "order details retrieved successfully!";
            isLoading.value = false
            console.log("res",response)
            orderDetails.value = response.data
        })
        .catch((error) => {
            console.log(error);
            snackbar.value.value = true;
            snackbar.value.color = "error";
            snackbar.value.text = error.response.data.message;
            isLoading.value = false
        });
  }
}
async function addOrder() {
    isLoading.value = true
    await OrderServices.addOrder({...order.value,...orderDetails.value, placedByUserId: user.value.id})
        .then((response) => {
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "order created successfully!";
            isLoading.value = false
            console.log("res",response)
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
    <div id="body">
      <v-card class="rounded-lg elevation-5">
        <div style="display:flex;" class="heading">
          <v-card-title class="headline mb-2">Create Order </v-card-title>
        </div>
        <Loading v-if="isLoading" />
        <v-card-text v-else>
          <div class="mb-3">
          <label for="first_name" class="form-label">Pickup Time</label>
          <input type="text" class="form-control" id="first_name" v-model="order.pickupTime"/>
        </div>
        <div class="mb-3">
            <label for="user" class="form-label">Pickup Customer </label>
            <select class="form-control" id="dropdown" v-model="order.pickupCustomerId">
              <option value="">Select Customer</option>
              <option v-for="customer in customers" :key="customer.id" :value="customer.id"> {{customer.lastName}} {{customer.firstName}}</option>
            </select>
        </div>
        <div class="mb-3">
          <label for="pickupLocation" class="form-label">Pickup Location</label>
          <input type="text" class="form-control" id="pickupLocation" v-model="order.pickupLocation"/>
        </div>
        <div class="mb-3">
            <label for="user" class="form-label">Delivery Customer</label>
            <select class="form-control" id="dropdown" v-model="order.deliveryCustomerId">
              <option value="">Select Customer</option>
              <option v-for="customer in customers" :key="customer.id" :value="customer.id"> {{customer.lastName}} {{customer.firstName}}</option>
            </select>
        </div>
        <div class="mb-3">
          <label for="deliveryLocation" class="form-label">Delivery Location</label>
          <input type="text" class="form-control" id="deliveryLocation" v-model="order.deliveryLocation"/>
        </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" color="primary" @click="getOrderDetails()">Get Order Details</v-btn>
        </v-card-actions><br/>


        <div v-if="orderDetails != null" class="orderDetails">
          <h4 style="text-decoration:underline;">Order Details</h4>
          <p> Price for Order is <strong>{{ orderDetails.cost }}</strong></p>
          <p> Time takes to deliver order is <strong>{{ orderDetails.timeForDelivery }}</strong></p>
          <p> Distance between pickup and drop location is <strong>{{ orderDetails.distance }}</strong></p>
          <v-card-actions>
            <!-- <v-spacer></v-spacer> -->
            <v-btn variant="flat" class="place-order" color="primary" @click="addOrder()">Place Order</v-btn>
          </v-card-actions><br/>
        </div>
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
</style>