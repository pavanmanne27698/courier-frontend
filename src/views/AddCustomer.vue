<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
import CustomerServices from "../services/CustomerServices.js";
import Loading from "../components/Loading.vue";

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
onMounted(async () => {

});

function closeSnackBar() {
  snackbar.value.value = false;
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
  else if(customer.value.address === "") {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "Address is empty!";
  }
    else if(customer.value.apartmentNumber === "") {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "Apartment number is empty!";
  }
  else {
    isLoading.value = true
    await CustomerServices.addCustomer(customer.value)
        .then((response) => {
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "Customer is created successfully!";
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
    <div id="body">
      <v-card class="rounded-lg elevation-5">
        <div style="display:flex;" class="heading">
          <v-card-title class="headline mb-2">Create Customer </v-card-title>
        </div>
        <Loading v-if="isLoading" />
        <v-card-text v-else>
          <div class="mb-3">
          <label for="firstName" class="form-label">First Name</label>
          <input type="text" class="form-control" id="firstName" v-model="customer.firstName"/>
        </div>
        <div class="mb-3">
          <label for="lastName" class="form-label">Last Name</label>
          <input type="text" class="form-control" id="lastName" v-model="customer.lastName"/>
        </div>
          <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="text" class="form-control" id="email" v-model="customer.email"/>
        </div>
        <div class="mb-3">
          <label for="mobile" class="form-label">Mobile</label>
          <input type="text" class="form-control" id="mobile" v-model="customer.mobile"/>
        </div>
        <div class="mb-3">
          <label for="Address" class="form-label">Address</label>
          <input type="text" class="form-control" id="Address" v-model="customer.address"/>
        </div>   
         <div class="mb-3">
          <label for="Apartment" class="form-label">Apartment Number</label>
          <input type="text" class="form-control" id="Apartment" v-model="customer.apartmentNumber"/>
        </div>   
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" color="primary" @click="addCustomer()">Create</v-btn>
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
</style>