<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
import Loading from "../components/Loading.vue";
import LeftNavbar from "../components/LeftNavbar.vue";


const router = useRouter();
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const user = ref({
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  isAvailable: ""
});
const isLoading = ref(false);
onMounted(async () => {
    await getUser();
    isLoading.value = false
});

function closeSnackBar() {
  snackbar.value.value = false;
}
async function getUser() {
    isLoading.value = true
    await UserServices.getUser(router.currentRoute.value.params.id)
        .then((response) => {
            user.value = response.data
            isLoading.value = false
        })
        .catch((error) => {
            isLoading.value = false
        });
}

async function updateUser() {
  if(user.value.firstName === "") {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "First name is empty!";
  }
  else if(user.value.lastName === "") {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "Last name is empty!";
  }
  else if(user.value.email === "") {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "Email is empty!";
  }
  else if(user.value.mobile === "") {
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = "Mobile is empty!";
  }
  else {
    isLoading.value = true
    await UserServices.updateUser(user.value)
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
            <input type="text" class="form-control form-control-lg" id="firstName" v-model="user.firstName"/>
          </div>
          <div class="mb-3">
            <label for="lastName" class="form-label">Last Name</label>
            <input type="text" class="form-control form-control-lg" id="lastName" v-model="user.lastName"/>
          </div>
            <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="text" class="form-control form-control-lg" id="email" v-model="user.email"/>
          </div>
          <div class="mb-3">
            <label for="mobile" class="form-label">Mobile</label>
            <input type="text" class="form-control form-control-lg" id="mobile" v-model="user.mobile"/>
          </div>  
            <div class="mb-3">
                <label for="role" class="form-label">Available</label>
                <select class="form-control " id="role" v-model="user.isAvailable">
                    <option value="0" key="0">No</option>
                    <option value="1" key="1">Yes</option>
                </select>
            </div>   
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="primary" @click="updateUser()">Update</v-btn>
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