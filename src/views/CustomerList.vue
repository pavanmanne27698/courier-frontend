<script setup>
import { onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import CustomerServices from "../services/CustomerServices.js";
import { ref } from "vue";
import Loading from "../components/Loading.vue";
import LeftNavbar from "../components/LeftNavbar.vue";
import { getUrl } from "../common"

const customers = ref([]);
const isLoading = ref(true);
const user = ref(null);
const router = useRouter();
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const actualResponse = ref([])
const search = ref("")
onMounted(async () => {
   user.value = JSON.parse(localStorage.getItem("user"));
  if(!user.value) {
    router.push({ name: "login" });
  }
  await getCustomers();
  isLoading.value = false;
});

const setSnackbar = (text,color="error") => {
    snackbar.value = true;
    snackbar.color = color;
    snackbar.text = text;
}

async function getCustomers() {
  await CustomerServices.getCustomers()
    .then((res) => {
      customers.value = res.data;
      actualResponse.value = res.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

const deleteCustomer = async(id,index) => {
    // setSnackbar("Customer is deleted!","green")

    // await CustomerServices.deleteCustomer(id)
    // .then((res) => {
    //   users.value.splice(index, 1);
    //   setSnackbar("Customer is deleted successfully!","green")
    // })
    // .catch((error) => {
    //   console.log(error);
    //   setSnackbar(error.response.data.message)
    // });
}
function closeSnackBar() {
  snackbar.value.value = false;
}
 watch(
      search,
      (newValue, oldValue) => {
          const filteredCustomers = actualResponse.value.filter(customer => 
          customer.firstName.toLowerCase().includes(newValue.toLowerCase()) ||
          customer.lastName.toLowerCase().includes(newValue.toLowerCase()) ||
          customer.email.toLowerCase().includes(newValue.toLowerCase()) ||
          customer.mobile.toLowerCase().includes(newValue.toLowerCase())
          );
          customers.value = filteredCustomers;
      }
    );
</script>

<template>
<v-container>
   <div class="flex flex-1">
      <LeftNavbar/>
    <div class="container" style="margin-top: 20px">
      <div style="display: flex; justify-content: center;">
        <h3>Customers</h3>
      <a class="btn btn-danger create" :href="[getUrl() + 'add-customer']" style="margin-left:10px;" >Add Customer</a>
      </div>
      <br/>
      <input class="col-12 form-control searchbar" type="search" placeholder="Search Customer" aria-label="Search" v-model="search"/><br/>
      <Loading v-if="isLoading" />
      <div class="col-md-12 container elevation-4 customers" v-else-if="customers.length != 0">
              <table class="table" style="background-color: white;">
                  <thead class="thead-dark">
                      <tr>
                      <th scope="col">id</th>
                      <th scope="col">First Name</th>
                      <th scope="col">Last Name</th>
                      <th scope="col">Email</th>
                      <th scope="col">Mobile</th>
                      <th scope="col">Apartment Number</th>
                      <th scope="col">Street Number</th>
                      <th scope="col">Avenue</th>
                      <th scope="col">Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr v-for="(customer,index) in customers" :key="index" >
                      <th scope="row">{{ index+1 }}</th>
                      <td>{{ customer.firstName }}</td>
                      <td>{{ customer.lastName }}</td>
                      <td>{{ customer.email }}</td>
                      <td>{{ customer.mobile }}</td>
                      <td>{{ customer.apartmentNumber }}</td>
                      <td>{{ customer.address.charAt(0) }}</td>
                      <td>{{ customer.address.charAt(1) }}</td>
                      <td>
                          <div class="btn-group" role="group" aria-label="Basic example">
                              <img class="button-image" :src="[getUrl()+'/edit.png']" width="20" height="20" />
                              <img class="button-image" :src="[getUrl()+'/delete.png']" width="20" height="20" />
                              <!-- <img class="button-image" src="/delete.png" width="20" height="20" @click="deleteCustomer(customer.id,index)" /> -->
                          </div>         
                      </td>
                      </tr>
                  </tbody>
                  </table>
            </div>
        <div class="text-center" v-else>
        <h4 class="text-muted">No Customers Found!</h4>
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

.customers {
  padding: 30px;
  background-color: white;
}
.create {
    background-color: #80162B ;
    margin-left: 20px;
    padding-top: -10px;
    color: white;
}
.searchbar {
  margin-left: 20%;
  margin-right: 20%;
  width: 60%;
}
.button-image {
  cursor: pointer;
}
</style>