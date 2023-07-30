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
onMounted(async () => {
    await getCompany();
});

function closeSnackBar() {
  snackbar.value.value = false;
}
async function getCompany() {
    isLoading.value = true
    await CompanyServices.getCompany(router.currentRoute.value.params.id)
        .then((response) => {
            company.value = response.data
            isLoading.value = false
        })
        .catch((error) => {
            isLoading.value = false
        });
}

async function updateCompany() {
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
  else if(company.value.location === "") {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "Location is empty!";
  }
  else {
    isLoading.value = true
    await CompanyServices.updateCompany(company.value)
        .then((response) => {
            snackbar.value.value = true;
            snackbar.value.color = "green";
            snackbar.value.text = "Company is updated successfully!";
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
            <v-card-title class="headline mb-2">Update Company </v-card-title>
          </div>
          <Loading v-if="isLoading" />
          <v-card-text v-else>
            <div class="mb-3">
            <label for="firstName" class="form-label">Name</label>
            <input type="text" class="form-control form-control-lg" id="firstName" v-model="company.name"/>
          </div>
          <div class="mb-3">
            <label for="lastName" class="form-label">Email</label>
            <input type="text" class="form-control form-control-lg" id="lastName" v-model="company.email"/>
          </div>
          <div class="mb-3">
            <label for="mobile" class="form-label">Location</label>
            <input type="text" class="form-control form-control-lg" id="mobile" v-model="company.location"/> 
          </div> 
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="primary" @click="updateCompany()">Update</v-btn>
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