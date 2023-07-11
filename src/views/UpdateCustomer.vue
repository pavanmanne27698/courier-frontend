<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
import CustomerServices from "../services/CustomerServices.js";
import Loading from "../components/Loading.vue";
import LeftNavbar from "../components/LeftNavbar.vue";


const router = useRouter();
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const customer = ref({
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  address: "",
  apartmentNumber: "",
});
const isLoading = ref(false);
const address = ref({ street:"",avenue: ""})
const streets = [ 1,2,3,4,5,6,7]
const avenues = ["A","B","C","D","E","F","G"]
onMounted(async () => {
    await getCustomer();
    isLoading.value = false
});

function closeSnackBar() {
  snackbar.value.value = false;
}
async function getCustomer() {
    isLoading.value = true
    await CustomerServices.getCustomer(router.currentRoute.value.params.id)
        .then((response) => {
            customer.value = response.data
            address.value.street = response.data.address?.charAt(0) || ""
            address.value.avenue = response.data.address?.charAt(1) || ""
            isLoading.value = false
        })
        .catch((error) => {
            isLoading.value = false
        });
}

async function addCustomer() {
  if(customer.value.firstName === "") {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "First name is empty!";
  }
  else if(customer.value.lastName === "") {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "Last name is empty!";
  }
  else if(customer.value.email === "") {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "Email is empty!";
  }
  else if(customer.value.mobile === "") {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "Mobile is empty!";
  }
  else if(address.value.avenue == "" || address.value.street == "") {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "Address Street/Avenue is empty!";
  }
  else if(customer.value.apartmentNumber === "") {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "Apartment number is empty!";
  }
  else {
    isLoading.value = true
    await CustomerServices.updateCustomer({...customer.value,address: address.value.street+address.value.avenue})
        .then((response) => {
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "Customer is updated successfully!";
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
}
</script>

<template>
  <v-container>
    <div class="flex flex-1">
      <LeftNavbar/>
      <div id="body">
        <v-card class="rounded-lg elevation-5">
          <div style="display:flex;" class="heading">
            <v-card-title class="headline mb-2">Update Customer </v-card-title>
          </div>
          <Loading v-if="isLoading" />
          <v-card-text v-else>
            <div class="mb-3">
            <label for="firstName" class="form-label">First Name</label>
            <input type="text" class="form-control form-control-lg" id="firstName" v-model="customer.firstName"/>
          </div>
          <div class="mb-3">
            <label for="lastName" class="form-label">Last Name</label>
            <input type="text" class="form-control form-control-lg" id="lastName" v-model="customer.lastName"/>
          </div>
            <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="text" class="form-control form-control-lg" id="email" v-model="customer.email"/>
          </div>
          <div class="mb-3">
            <label for="mobile" class="form-label">Mobile</label>
            <input type="text" class="form-control form-control-lg" id="mobile" v-model="customer.mobile"/>
          </div>
          <div class="row" style="display:flex;justify-content:space-between;">
            <div class="col-6">
              <label for="street" class="form-label">Street</label>
              <select class="form-control form-control-lg" id="dropdown" v-model="address.street" >
                <option value="">Select Street</option>
                <option v-for="street in streets" :key="street" :value="street"> Street - {{street}}</option>
              </select>
            </div>
            <div class="col-6">
                <label for="avenue" class="form-label">Avenue</label>
                <select class="form-control form-control-lg" id="dropdown" v-model="address.avenue">
                <option value="">Select Avenue</option>
                <option v-for="avenue in avenues" :key="avenue" :value="avenue"> Avenue - {{avenue}}</option>
              </select>
            </div>
          </div>  
          <div class="mb-3" style="margin-top:10px;">
            <label for="Apartment" class="form-label">Apartment Number</label>
            <input type="text" class="form-control form-control-lg" id="Apartment" v-model="customer.apartmentNumber"/>
          </div>   
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="primary" @click="addCustomer()">Update</v-btn>
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
#body {
  margin-top: 20px;
}
</style>