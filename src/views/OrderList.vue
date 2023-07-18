<script setup>
import { onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import OrderServices from "../services/OrderServices.js";
import { ref } from "vue";
import Loading from "../components/Loading.vue";
import LeftNavbar from "../components/LeftNavbar.vue";
import { getUrl } from "../common"
import OrderDetails from "./OrderDetails.vue"

const orders = ref([]);
const isLoading = ref(true);
const user = ref(null);
const router = useRouter();
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const actualResponse = ref([])
const sort = ref(0)
const search = ref("")
const selectedOrder = ref(null)
const options = [
  { value: 0, label: 'All' },
  { value: 1, label: 'Pending' },
  { value: 2, label: 'Delivered' },
  { value: 3, label: 'Progress' },
  { value: 4, label: 'Not Assigned' },
];
onMounted(async () => {
   user.value = JSON.parse(localStorage.getItem("user"));
  if(!user.value) {
    router.push({ name: "login" });
  }
  await getOrders();
  isLoading.value = false;
});

const setSnackbar = (text,color="error") => {
    snackbar.value.value = true;
    snackbar.value.color = color;
    snackbar.value.text = text;
}

async function getOrders() {
  await OrderServices.getOrders(router.currentRoute.value.params.type,user.value.id)
    .then((res) => {
      orders.value = res.data;
      actualResponse.value = res.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

const deleteOrder = async(id,index) => {

    await OrderServices.deleteOrder(id)
    .then((res) => {
      orders.value.splice(index, 1);
      setSnackbar("Customer is deleted successfully!","green")
    })
    .catch((error) => {
      console.log(error);
      setSnackbar(error.response.data.message)
    });
}
function closeSnackBar() {
  snackbar.value.value = false;
}
function goToUpdatePage(id) {
  router.push({ name: "updateOrder",params: { id } })
}
function goToCreatePage(id) {
  router.push({ name: "addOrder" })
}

watch(
      () => router.currentRoute.value.params.type,
      (newType, oldType) => {
        if (newType !== oldType) {
          location.reload();
        }
      }
    );

 watch(
      sort,
      (newValue, _) => {
        var sortedOrders = actualResponse.value
        if (newValue != 0) {
          if(newValue ==1) {
            sortedOrders = actualResponse.value.filter(order => order.status.toLowerCase() == "pending");
          } else if(newValue == 2) {
            sortedOrders = actualResponse.value.filter(order => order.status.toLowerCase() == "progress");
          } else if(newValue == 3) {
            sortedOrders = actualResponse.value.filter(order => order.status.toLowerCase() == "delivered");
          } else if(newValue == 4) {
            sortedOrders = actualResponse.value.filter(order => !order.deliveryBoyUserId);
          }
        } 
        orders.value = sortedOrders
      }
    );

 watch(
      search,
      (newValue, oldValue) => {
        if(!newValue) {
          orders.value = actualResponse.value
          return;
        }
        const filteredOrders = actualResponse.value.filter(order => 
        order.id == newValue
        );
        orders.value = filteredOrders;
      }
    );
  
</script>

<template>
<v-container>
   <div class="flex flex-1">
      <LeftNavbar/>
    <div class="container" style="margin-top: 20px">
      <div style="display: flex; justify-content: center;">
        <h3>Orders</h3>
      <a class="btn btn-danger create" @click="goToCreatePage()" style="margin-left:10px;" v-if="user && user.role != 3" >Add Order</a>
      </div>
      <br/>
      <div style="display:flex;margin-top:5px;margin-bottom:20px;">
        <div>
          <select class="form-control" id="dropdown" style="margin-left:20px;" v-model="sort">
            <option v-for="(option, index) in options" :key="index" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        <input class="form-control searchbar" type="search" placeholder="Search by Order id" aria-label="Search" v-model="search"/><br/>
      </div>
      <Loading v-if="isLoading" />
      <div class="col-md-12 container elevation-4 orders" v-else-if="orders.length != 0">
              <table class="table" style="background-color: white;">
                <thead class="thead-dark">
                    <tr>
                    <th scope="col">id</th>
                    <th scope="col">Pickup Customer</th>
                    <th v-if="user.role_id != 3"> Delivery Boy </th>
                    <th scope="col">Pickup Time</th>
                    <th scope="col">Price of Order</th>
                    <th scope="col">Distance</th>
                    <th scope="col">Status</th>
                    <th scope="col" v-if="user.role_id != 3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(order,index) in orders" :key="index" >
                    <th scope="row">{{ order.id }}</th>
                    <td>{{ order.pickupCustomer.firstName }} {{ order.pickupCustomer.lastName }}</td>
                    <td v-if="order.deliveryBoyUserId">{{ order.deliveryBoyUser.firstName }} {{ order.deliveryBoyUser.laststName }}</td>
                    <td v-else-if="user.role_id != 3"> Not Assigned</td>
                    <td>{{ order.pickupDateTime }}</td>
                    <td>${{ order.cost }}</td>
                    <td >{{ order.distance }} Miles</td>
                    <td> {{ order.status.toLowerCase() }} </td>
                    <td v-if="user.role != 3">
                        <div class="btn-group" role="group" aria-label="Basic example">
                              <img class="button-image" :src="[getUrl()+'/edit.png']" width="20" height="20" @click="goToUpdatePage(order.id)" />
                              <img class="button-image" src="/delete.png" width="20" height="20" @click="deleteOrder(order.id,index)" />
                          </div>      
                    </td>
                    <td>
                        <a type="button" class="btn btn-secondary edit" data-bs-toggle="modal" data-bs-target="#orderModal" @click="selectedOrder=order">View Order</a>
                    </td>
                    </tr>
                </tbody>
                </table>
            </div>
        <div class="text-center" v-else>
        <h4 class="text-muted">No orders Found!</h4>
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
    <div class="modal fade" id="orderModal" tabindex="-1" aria-labelledby="orderModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="orderModalLabel">Courier Details</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
              <OrderDetails :order="selectedOrder" />
            </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary edit" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  <br/>
</v-container>

</template>

<style scoped>

.orders {
  padding: 30px;
  background-color: white;
}
.create,.edit {
    background-color: #80162B ;
    margin-left: 20px;
    padding-top: -10px;
    color: white;
}
.searchbar {
  margin-left: 3%;
  width: 70%;
}
.button-image {
  cursor: pointer;
}
</style>