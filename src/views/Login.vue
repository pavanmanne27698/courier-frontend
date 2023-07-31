<script setup>
import { onMounted } from "vue";
import { ref, toRaw } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
// import CompanyServices from "../services/CompanyServices.js";

const router = useRouter();
const isCreateAccount = ref(false);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const selectedRole = ref("Clerk")
const selectedCompany = ref()
const user = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  mobile: ""
});

const roleOptions =  [ "Clerk","Courier Boy"]

onMounted(async () => {
  if (localStorage.getItem("user") !== null) {
    router.push({ name: "home" });
  }
});

async function createAccount() {
  await UserServices.addUser({...user.value, role: selectedRole.value === "Admin" ? 1 : selectedRole.value === "Clerk" ? 2 : 3, companyId: 1})
    .then((res) => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Account created successfully!";
      isCreateAccount.value = false;
      router.push({ name: "login" });
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function login() {
  console.log(user.value);
  await UserServices.loginUser(user)
    .then((data) => {
      window.localStorage.setItem("user", JSON.stringify(data.data));
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = "Login successful!";
      router.push({ name: "home" });
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

function openCreateAccount() {
  isCreateAccount.value = true;
}

function closeCreateAccount() {
  isCreateAccount.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">Login </v-card-title>
        <v-card-text>
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="text" class="form-control form-control-lg" id="email" v-model="user.email" required/>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control form-control-lg" id="password" v-model="user.password" required/>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="flat" color="secondary" @click="openCreateAccount()"
            >Create Account</v-btn
          >
          <v-spacer></v-spacer>

          <v-btn variant="flat" color="primary" @click="login()">Login</v-btn>
        </v-card-actions>
      </v-card>

      <v-dialog persistent v-model="isCreateAccount" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">Create Account </v-card-title>
          <v-card-text>
          <div class="mb-3">
            <label for="fname" class="form-label">First Name</label>
            <input type="text" class="form-control form-control-lg" id="fname" v-model="user.firstName" required/>
          </div>
          <div class="mb-3">
            <label for="lname" class="form-label">Last Name</label>
            <input type="text" class="form-control form-control-lg" id="lname" v-model="user.lastName" required/>
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input type="text" class="form-control form-control-lg" id="email" v-model="user.email" required/>
          </div>
          <div class="mb-3">
            <label for="mobile" class="form-label">Mobile</label>
            <input type="text" class="form-control form-control-lg" id="mobile" v-model="user.mobile" required/>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input type="password" class="form-control form-control-lg" id="password" v-model="user.password" required/>
          </div>
             <v-select
                v-model="selectedRole"
                label="Role"
                :items="roleOptions"
                required
              ></v-select>
         <!-- <v-select
            v-model="selectedCompany"
            label="Company"
            :items="companies"
            item-text="name"
            item-value="id"
            required
          >
          </v-select> -->
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              variant="flat"
              color="secondary"
              @click="closeCreateAccount()"
              >Close</v-btn
            >
            <v-btn variant="flat" color="primary" @click="createAccount()"
              >Create Account</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

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