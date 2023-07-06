<script setup>
import { onMounted, watch } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import CustomerServices from "../services/CustomerServices.js";
import OrderServices from "../services/OrderServices.js";
import Loading from "../components/Loading.vue";
import LeftNavbar from "../components/LeftNavbar.vue";

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
const streets = [ 1,2,3,4,5,6,7]
const avenues = ["A","B","C","D","E","F","G"]
const pickupUser = ref(null)
const deliveryUser = ref(null)
const pickupLocation = ref({ street:"",avenue: ""})
const deliveryLocation = ref({ street:"",avenue: ""})

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
  if(pickupLocation.value.avenue == "" || pickupLocation.value.street == "") {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "Pickup Street/Avenue is empty!";
  }
   else if(deliveryLocation.value.avenue == "" || deliveryLocation.value.street == "") {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "Pickup Street/Avenue is empty!";
  }
  else {
    isLoading.value = true
    const body = {
      pickupLocation: pickupLocation.value.street+pickupLocation.value.avenue ,
      deliveryLocation: deliveryLocation.value.street+deliveryLocation.value.avenue
    }
    await OrderServices.calculateOrderDetails(body)
        .then((response) => {
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "order details retrieved successfully!";
            isLoading.value = false
            console.log("res",response)
            const responseBody = {
              distance : response.data.distance,
              timeForDelivery: response.data.distance * 3 ,
              cost: response.data.distance * 10
            }
            orderDetails.value = responseBody
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
    const location = {
      pickupLocation: "Street "+pickupLocation.value.street+", Avenue "+pickupLocation.value.avenue ,
      deliveryLocation: "Street "+deliveryLocation.value.street+", Avenue "+deliveryLocation.value.avenue
    }
    await OrderServices.addOrder({...order.value,...orderDetails.value,...location, placedByUserId: user.value.id})
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

 watch(
      pickupUser,
      (newValue, oldValue) => {
        console.log("new",newValue.address)
          order.value.pickupCustomerId = newValue.id
          pickupLocation.value = {
            street: newValue?.address.charAt(0),
            avenue: newValue?.address.charAt(1)
          }
          console.log("pic",pickupLocation.value)
      }
    );
  
  watch(
      deliveryUser,
      (newValue, oldValue) => {
        order.value.deliveryCustomerId = newValue.id
        deliveryLocation.value = {
            street: newValue?.address.charAt(0),
            avenue: newValue?.address.charAt(1)
        }
      }
    );

</script>

<template>
  <v-container>
    <div class="flex flex-1">
      <LeftNavbar/>
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
              <select class="form-control" id="dropdown" v-model="pickupUser">
                <option value="">Select Customer</option>
                <option v-for="customer in customers" :key="customer.id" :value="customer"> {{customer.lastName}} {{customer.firstName}}</option>
              </select>
          </div>
          <div class="row" style="display:flex;justify-content:space-between;" v-if="order.pickupCustomerId">
            <div class="col-6">
              <label for="Apartment" class="form-label">Pickup Street</label>
              <select class="form-control" id="dropdown" v-model="pickupLocation.street" >
                <option value="">Select Street</option>
                <option v-for="street in streets" :key="street" :value="street"> Street - {{street}}</option>
              </select>
            </div>
            <div class="col-6">
                <label for="Apartment" class="form-label">Pickup Avenue</label>
                <select class="form-control" id="dropdown" v-model="pickupLocation.avenue">
                <option value="">Select Avenue</option>
                <option v-for="avenue in avenues" :key="avenue" :value="avenue"> Avenue - {{avenue}}</option>
              </select>
            </div>
          </div>
          <div class="mb-3" style="margin-top:10px;">
              <label for="user" class="form-label">Delivery Customer</label>
              <select class="form-control" id="dropdown" v-model="deliveryUser">
                <option value="">Select Customer</option>
                <option v-for="customer in customers" :key="customer.id" :value="customer"> {{customer.lastName}} {{customer.firstName}}</option>
              </select>
          </div>
          <div class="row" style="display:flex;justify-content:space-between;" v-if="order.deliveryCustomerId">
            <div class="col-6">
              <label for="Apartment" class="form-label">Delivery Street</label>
              <select class="form-control" id="dropdown" v-model="deliveryLocation.street" >
                <option value="">Select Street</option>
                <option v-for="street in streets" :key="street" :value="street"> Street - {{street}}</option>
              </select>
            </div>
            <div class="col-6">
                <label for="Apartment" class="form-label">Delivery Avenue</label>
                <select class="form-control" id="dropdown" v-model="deliveryLocation.avenue">
                <option value="">Select Avenue</option>
                <option v-for="avenue in avenues" :key="avenue" :value="avenue"> Avenue - {{avenue}}</option>
              </select>
            </div>
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