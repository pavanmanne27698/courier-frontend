<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
import CompanyServices from "../services/CompanyServices.js";
import Loading from "../components/Loading.vue";
import LeftNavbar from "../components/LeftNavbar.vue";


const router = useRouter();
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const company = ref({
  name: "",
  location: "",
  email: "",
});
const isLoading = ref(false);
const address = ref({ street:"",avenue: ""})
const streets = [ 1,2,3,4,5,6,7]
const avenues = ["A","B","C","D","E","F","G"]
onMounted(async () => {

});

function closeSnackBar() {
  snackbar.value.value = false;
}

async function addCompany() {
  if(company.value.name === "") {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "Name is empty!";
  }
  else if(company.value.email === "") {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "Email is empty!";
  }
  else if(address.value.street === "" || address.value.avenue === "") {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "Avenue/Street is empty!";
  }
  else {
    isLoading.value = true
    await CompanyServices.addCompany({...company.value,location: "Street "+ address.value.street+", Avenue "+address.value.avenue})
        .then((response) => {
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "Company is created successfully!";
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
            <v-card-title class="headline mb-2">Create Company </v-card-title>
          </div>
          <Loading v-if="isLoading" />
          <v-card-text v-else>
            <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input type="text" class="form-control form-control-lg" id="name" v-model="company.name"/>
          </div>
            <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="text" class="form-control form-control-lg" id="email" v-model="company.email"/>
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
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="primary" @click="addCompany()">Add</v-btn>
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