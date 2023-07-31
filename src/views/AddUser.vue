<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
import LeftNavbar from "../components/LeftNavbar.vue";
import Loading from "../components/Loading.vue";

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
  password: "",
  mobile: "",
  role: ""
});
const isLoading = ref(false);
var roleOptions =  ref([
        {
            id:"1",
            role:"Admin"
        },
        {
            id:"2",
            role:"Clerk"
        },
         {
            id:"3",
            role:"Delivery Boy"
        }
      ])
const isLoggedIn = ref(null)
onMounted(async () => {
    isLoggedIn.value = JSON.parse(localStorage.getItem("user"));
    if(!isLoggedIn.value) {
    router.push({ name: "login" });
  }
  if(isLoggedIn.value.role == 2){
    roleOptions.value =  [
         {
            id:"3",
            role:"Delivery Boy"
        }
      ]
  }
});
const setSnackbar = (text,color="error") => {
    snackbar.value.value = true;
    snackbar.value.color = color;
    snackbar.value.text = text;
}
function closeSnackBar() {
  snackbar.value.value = false;
}

async function addUser() {
    if(user.value.firstName === "") {
    setSnackbar("First Name is Empty")
    }
    else if(user.value.lastName === "") {
        setSnackbar("Last Name is Empty")
    }
    else if(user.value.email === "") {
      setSnackbar("Email is Empty")
    }
    else if(user.value.mobile === "") {
      setSnackbar("Mobile is Empty")
    }
    else if(user.value.password === "") {
      setSnackbar("Password is Empty")
    }
    else if(user.value.role === "") {
        setSnackbar("Role is Empty")
    }
    else {
        isLoading.value = true
        await UserServices.addUser({...user.value, companyId: isLoggedIn.value.companyId })
              .then((response) => {
            setSnackbar("User is created successfully!","green")
            isLoading.value = false
        })
        .catch((error) => {
            console.log(error);
            setSnackbar(error.response.data.message || "Error occurred")
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
          <v-card-title class="headline mb-2">Add User </v-card-title>
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
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control form-control-lg" id="password" v-model="user.password"/>
          </div>
        <div class="mb-3">
        <label for="user" class="form-label">Role</label>
        <select class="form-control form-control-lg" id="dropdown" v-model="user.role">
            <option value="">Select Role</option>
            <option v-for="item in roleOptions" :key="item.id" :value="item.id"> {{item.id}}.{{item.role}}</option>
        </select>
        </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="flat" color="primary" @click="addUser()">Add</v-btn>
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
</style>