<script setup>
import { onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import UserServices from "../services/UserServices.js";
import { ref } from "vue";
import Loading from "../components/Loading.vue";
import { getUrl } from "../common"
import LeftNavbar from "../components/LeftNavbar.vue";

const users = ref([]);
const isLoading = ref(true);
const user = ref(null);
const router = useRouter();
const actualResponse = ref([])
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const sorting = ref(0)
const search = ref("")
const options = [
  { value: 0, label: 'All' },
  { value: 1, label: 'Available' },
  { value: 2, label: 'Not Available' },
  { value: 3, label: 'Clerk' },
  { value: 4, label: 'Delivery Boy' },
];
onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
  if(!user.value) {
    router.push({ name: "login" });
  }
  await getUsers();
  isLoading.value = false;
});

const setSnackbar = (text,color="error") => {
    snackbar.value = true;
    snackbar.color = color;
    snackbar.text = text;
}

async function getUsers() {
  await UserServices.getUsers()
    .then((res) => {
      users.value = res.data;
      actualResponse.value = res.data
    })
    .catch((error) => {
      console.log(error);
    });
}
 watch(
      sorting,
      (newValue, _) => {
        var sortedUsers = actualResponse.value
        if (newValue != 0) {
          if(newValue ==1) {
            sortedUsers = actualResponse.value.sort(user => user.isAvailable == 1);
          } else if(newValue == 2) {
            sortedUsers = actualResponse.value.sort(user => user.isAvailable == 0);
          } else if(newValue == 3) {
            sortedUsers = actualResponse.value.sort(user => user.role == 2);
          } else if(newValue == 4) {
            sortedUsers = actualResponse.value.sort(user => user.role == 3);
          }
        } 
        users.value = sortedUsers
      }
    );
 watch(
      search,
      (newValue, _) => {
        if(newValue){
            const sortedUsers = users.value.sort(user => 
            user.firstName.toLowerCase().includes(newValue.toLowerCase()) ||
            user.lastName.toLowerCase().includes(newValue.toLowerCase()) ||
            user.email.toLowerCase().includes(newValue.toLowerCase()) ||
            user.mobile.toLowerCase().includes(newValue.toLowerCase())
            );
            users.value = sortedUsers;
        } else {
          users.value = actualResponse.value
          sorting.value = 0
        }

      }
    );
const deleteUser = async(id,index) => {
    await UserServices.deleteUser(id)
    .then((res) => {
      users.value.splice(index, 1);
      snackbar.value = setSnackbar("User is deleted!","green")
    })
    .catch((error) => {
      console.log(error);
      snackbar.value = setSnackbar(error.response.data.message)
    });
}

</script>

<template>
<v-container>
   <div class="flex flex-1">
      <LeftNavbar/>
    <div class="container" style="margin-top: 20px">
      <div style="display: flex; justify-content: center;">
        <h3>Users</h3>
         <div style="display:flex;" class="heading">
    <router-link to="/add-user" class="headline mb-2">Add User</router-link>
  </div>
      </div>
      <br/>
      <div style="display:flex;margin-top:5px;">
        <div>
          <select class="form-control" id="dropdown" style="margin-left:20px;" v-model="sorting">
            <option v-for="(option, index) in options" :key="index" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        <input class="form-control searchbar" type="search" placeholder="Search" aria-label="Search" v-model="search"/><br/>
      </div>
      <Loading v-if="isLoading" />
      <div class="col-md-12 container elevation-4 users" v-else-if="users.length != 0">
                  <table class="table" style="background-color: white;">
                  <thead class="thead-dark">
                      <tr>
                      <th scope="col">id</th>
                      <th scope="col">First Name</th>
                      <th scope="col">Last Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Mobile</th>
                      <th scope="col">Role</th>
                      <th scope="col">Is Available Now</th>
                      <th scope="col">Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr v-for="(user,index) in users" :key="index" >
                      <th scope="row">{{ user.id }}</th>
                      <td>{{ user.firstName }}</td>
                      <td>{{ user.lastName }}</td>
                      <td>{{ user.email }}</td>
                      <td>{{ user.mobile }}</td>
                      <td>{{ user.role == 1 ? "ADMIN" : user.role == 2 ? "CLERK" : "Delivery Boy" }}</td>
                      <td v-if="user.availabilty == 1">Yes</td>
                      <td v-else>No</td>
                      <td>
                          <div class="btn-group" role="group">
                            <img class="button-image" :src="[getUrl()+'edit.png']" width="20" height="20" />
                            <img class="button-image" :src="[getUrl()+'delete.png']" width="20" height="20" />
                          </div>         
                      </td>
                      </tr>
                  </tbody>
                  </table>
            </div>
      <div class="text-center" style="margin-top:20px;" v-else>
        <h4 class="text-muted">No Users available</h4>
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

.users {
  padding: 30px;
  background-color: white;
}
.btn-danger {
  margin-left: 20px;
}
.users{
  margin-top: 20px;
  margin-bottom: 20px;
}
.underline {
  border-bottom: 2px solid black;
  width: 40%;
  margin-bottom: 10px;
}
 a:hover {
    text-decoration: none;
    color: white;
  }
.create {
    background-color: #80162B ;
    margin-left: 20px;
    padding-top: -10px;
    color: white;
}
.searchbar {
  margin-left: 3%;
  width: 70%;
}
</style>