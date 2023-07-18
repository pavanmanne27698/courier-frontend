<script setup>
import { onMounted, watch,defineProps, toRef  } from "vue";
import { useRouter } from "vue-router";
import OrderServices from "../services/OrderServices.js";
import { ref } from "vue";
import Loading from "../components/Loading.vue";


const isLoading = ref(true);
const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const router = useRouter()

const props = defineProps({
  order: Object,
});
const order = toRef(props, 'order');

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  isLoading.value = false;
});

const setSnackbar = (text,color="error") => {
    snackbar.value.value = true;
    snackbar.value.color = color;
    snackbar.value.text = text;
}

const deleteOrder = async() => {
    await OrderServices.deleteOrder(order.value.id)
    .then((res) => {
      setSnackbar("Order is deleted successfully!","green")
    })
    .catch((error) => {
      console.log(error);
      setSnackbar(error.response.data.message)
    });
}
function closeSnackBar() {
  snackbar.value.value = false;
}
const pickedup = async() => {
    await OrderServices.pickedup(order.value.id)
    .then((res) => {
      setSnackbar("Order is pickeup successfully!","green")
    })
    .catch((error) => {
      console.log(error);
      setSnackbar(error.response.data.message)
    });
}
const delivered = async() => {
    await OrderServices.delivered(order.value.id)
    .then((res) => {
      setSnackbar("Order is delivered successfully!","green")
    })
    .catch((error) => {
      console.log(error);
      setSnackbar(error.response.data.message)
    });
}
</script>

<template>
<v-container>
  <div style="margin-top: 20px;margin-left:30px;margin-right:30px;">
    <br/>
    <Loading v-if="isLoading" />
     <div class="col-md-12 orders" v-else>
        <div class="flex">
            <table>
                <tr>
                <th>Order Id</th>
                <td>{{ order.id }}</td>
                </tr>
                <tr>
                <th>Status</th>
                <td>{{ order.status }}</td>
                </tr>
                <tr>
                <th>Price</th>
                <td> ${{ order.cost }}</td>
                </tr>
                <tr>
                <th>Distance</th>
                <td> {{ order.distance }} miles</td>
                </tr>
                <tr v-if="order.deliveryBoyPoints">
                <th>Delivery Boy Bonus</th>
                <td> {{ order.deliveryBoyPoints }} Points</td>
                </tr>
                <tr>
                <th>Expected Time for Delivery </th>
                <td> {{ order.timeForDelivery }} Minutes</td>
                </tr>
                <tr>
                 <th>Created At</th>
                <td> {{ order.createdAt }} </td>
                </tr>
                <tr v-if="order.pickedupDateTime" >
                 <th>Picked up At</th>
                <td> {{ order.pickedupDateTime }} </td>
                </tr>
                <tr v-if="order.deliveredDateTime" >
                 <th>Delivered At</th>
                <td> {{ order.deliveredDateTime }} </td>
                </tr>
                <tr v-if="order.isDeliveredInTime" >
                 <th>Delivered in time</th>
                <td> {{ order.isDeliveredInTime ? "Yes" : "No" }} </td>
                </tr>
                 <tr v-if="order.pickupCustomer" >
                 <th>Pickup Details</th>
                <td> 
                    <p> Name - {{ order.pickupCustomer.firstName}} {{ order.pickupCustomer.lastName}} <br/>
                     Email - {{ order.pickupCustomer.email}} <br/>
                     Contact - {{ order.pickupCustomer.mobile}} <br/>
                     Address -  Street {{ order.pickupCustomer.streetNumber}}, Avenue {{ order.pickupCustomer.avenue }}  <br/>
                     </p>
                </td>
                </tr>
                <tr  v-if="order.placedByUser">
                <th>Clerk Details</th>
                <td> 
                    <p> Name - {{ order.placedByUser.firstName}} {{ order.placedByUser.lastName}} <br/>
                     Email - {{ order.placedByUser.email}} <br/>
                     Contact - {{ order.placedByUser.mobile}} <br/>
                    </p>
                </td>
                </tr>
                <tr v-if="order.deliveryBoyUser">
                <th>Delivery Boy Details</th>
                <td> 
                    <p> Name - {{ order.deliveryBoyUser.firstName}} {{ order.deliveryBoyUser.lastName}} <br/>
                     Email - {{ order.deliveryBoyUser.email}} <br/>
                     Contact - {{ order.deliveryBoyUser.mobile}} <br/>
                    </p>
                </td>
                </tr>
                <tr v-if="user.role =='3' && !order.deliveredDateTime ">
                    <th></th>
                    <td>
                        <div class="btn-group" role="group" aria-label="Basic example">
                        <button type="button" class="btn btn-secondary edit" v-if="!order.pickedupDateTime" @click="pickedup()">Picked Up</button>
                        <button type="button" class="btn btn-secondary edit" v-if="order.pickedupDateTime && !order.deliveredDateTime" @click="delivered()">Delivered</button>
                        </div> 
                    </td>
                </tr>

                
            </table>

        </div>
    </div>
  </div>
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
  <br/>
</v-container>

</template>

<style scoped>

table, th, td {
  border: 1px solid black;
  border-collapse: collapse;
}
table {
    width: 80%;
}
td {
    width: 80%;
    padding: 10px;
}
th {
    padding-left: 10px;
}
.flex {
    display: flex;
    justify-content: space-around;
}
.orders {
    background-color: white;
}
.orders {
  padding: 30px;
}
.order {
  margin-top: 30px;
  width:100%;
  padding:15px;
  margin-left: 20px;
}
.btn-danger {
  margin-left: 20px;
}
.users{
  margin-top: 20px;
  margin-bottom: 20px;
}
.underline {
  width: 40%;
  margin-bottom: 10px;
}
.create {
    background-color: #80162B ;
    margin-left: 20px;
    padding-top: -10px;
    color: white;
}
.edit {
  background-color: #80162B;
  color: white;
}
.delete {
  background-color: #dc3545;
  color: white;
}
.search {
  margin-left: 70%;
  width: 30%;
}
</style>