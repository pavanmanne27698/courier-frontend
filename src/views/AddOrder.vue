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
  pickupDateTime: "",
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
      deliveryLocation: deliveryLocation.value.street+deliveryLocation.value.avenue,
      companyId: user.value.companyId
    }
    await OrderServices.calculateOrderDetails(body)
        .then((response) => {
          isLoading.value = false
          if(response.data.distance != null) {
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "order details retrieved successfully!";
            const detailedDistance = response.data.detailedDistance
            const totalDistance = detailedDistance.fromOfficeToPickup+ detailedDistance.fromPickupToDelivery+detailedDistance.returnToOffice
            const responseBody = {
              distance : totalDistance,
              timeForDelivery: totalDistance * 3 ,
              cost: totalDistance * 1.5
            }
            orderDetails.value = responseBody
          } else {
              snackbar.value.value = true;
              snackbar.value.color = "error";
              snackbar.value.text = "Cannot find a path!";
          }

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
    await OrderServices.addOrder({...order.value,...orderDetails.value,...location, placedByUserId: user.value.id,companyId: user.value.companyId})
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
          order.value.pickupCustomerId = newValue.id
          pickupLocation.value = {
            street: newValue?.address.charAt(0),
            avenue: newValue?.address.charAt(1)
          }
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
            <label for="pickup_time" class="form-label">Pickup Time</label>
            <input type="datetime-local" class="form-control form-control-lg" id="pickup_time" v-model="order.pickupDateTime"/>
          </div>
          <div class="mb-3">
              <label for="user" class="form-label">Pickup Customer </label>
              <select class="form-control form-control-lg" id="dropdown" v-model="pickupUser">
                <option value="">Select Customer</option>
                <option v-for="customer in customers" :key="customer.id" :value="customer"> {{customer.lastName}} {{customer.firstName}}</option>
              </select>
          </div>

          <div class="mb-3">
              <label for="user" class="form-label">Delivery Customer </label>
              <select class="form-control form-control-lg" id="dropdown" v-model="deliveryUser">
                <option value="">Select Customer</option>
                <option v-for="customer in customers" :key="customer.id" :value="customer"> {{customer.lastName}} {{customer.firstName}}</option>
              </select>
          </div>

          <div class="row" style="display:flex;justify-content:space-between;" v-if="order.pickupCustomerId">
            <div class="col-6">
              <label for="pickup" class="form-label">Pickup Street</label>
              <select class="form-control form-control-lg" id="dropdown" v-model="pickupLocation.street" >
                <option value="">Select Street</option>
                <option v-for="street in streets" :key="street" :value="street"> Street - {{street}}</option>
              </select>
            </div>
            <div class="col-6">
                <label for="pickup" class="form-label">Pickup Avenue</label>
                <select class="form-control form-control-lg" id="dropdown" v-model="pickupLocation.avenue">
                <option value="">Select Avenue</option>
                <option v-for="avenue in avenues" :key="avenue" :value="avenue"> Avenue - {{avenue}}</option>
              </select>
            </div>
          </div>
          <div class="row" style="display:flex;justify-content:space-between;margin-top:10px;" v-if="order.deliveryCustomerId">
            <!-- <h5 for="pickup" class="form-label" style="margin-top:10px;margin-bottom:10px;">Shipping Details</h5> -->
            <div class="col-6">
              <label for="delivery" class="form-label">Delivery Street</label>
              <select class="form-control form-control-lg" id="dropdown" v-model="deliveryLocation.street" >
                <option value="">Select Street</option>
                <option v-for="street in streets" :key="street" :value="street"> Street - {{street}}</option>
              </select>
            </div>
            <div class="col-6">
                <label for="delivery" class="form-label">Delivery Avenue</label>
                <select class="form-control form-control-lg" id="dropdown" v-model="deliveryLocation.avenue">
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
            <p> Price for Order is <strong>$ {{ orderDetails.cost }}</strong></p>
            <p> Time takes to deliver order is <strong>{{ orderDetails.timeForDelivery }} Minutes</strong></p>
            <p> Total distance (including office) is <strong>{{ orderDetails.distance }} Miles</strong></p>
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
