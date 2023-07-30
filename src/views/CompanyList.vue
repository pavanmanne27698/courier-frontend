<script setup>
import { onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import CompanyServices from "../services/CompanyServices.js";
import { ref } from "vue";
import Loading from "../components/Loading.vue";
import LeftNavbar from "../components/LeftNavbar.vue";
import { getUrl } from "../common"

const companies = ref([]);
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
  await getCompanies();
  isLoading.value = false;
});

const setSnackbar = (text,color="error") => {
    snackbar.value.value = true;
    snackbar.value.color = color;
    snackbar.value.text = text;
}
function goToUpdatePage(id) {
  router.push({ name: "updateCompany",params: { id } })
}
function goToCreatePage(id) {
  router.push({ name: "addCompany" })
}

async function getCompanies() {
  await CompanyServices.getCompanies()
    .then((res) => {
      companies.value = res.data;
      actualResponse.value = res.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

const deleteCompany = async(id,index) => {

    await CompanyServices.deleteCompany(id)
    .then((res) => {
      companies.value.splice(index, 1);
      setSnackbar("Company is deleted successfully!","green")
    })
    .catch((error) => {
      console.log(error);
      setSnackbar(error.response.data.message)
    });
}
function closeSnackBar() {
  snackbar.value.value = false;
}
 watch(
      search,
      (newValue, oldValue) => {
          const filteredCompanies = actualResponse.value.filter(company => 
          company.name.toLowerCase().includes(newValue.toLowerCase()) ||
          company.email.toLowerCase().includes(newValue.toLowerCase())
          );
          companies.value = filteredCompanies;
      }
    );
</script>

<template>
<v-container>
   <div class="flex flex-1">
      <LeftNavbar/>
    <div class="container" style="margin-top: 20px">
      <div style="display: flex; justify-content: center;">
        <h3>Companies</h3>
      <a class="btn btn-danger create" @click="goToCreatePage()" style="margin-left:10px;" >Add Company</a>
      </div>
      <br/>
      <input class="col-12 form-control searchbar" type="search" placeholder="Search Company" aria-label="Search" v-model="search"/><br/>
      <Loading v-if="isLoading" />
      <div class="col-md-12 container elevation-4 companies" v-else-if="companies.length != 0">
              <table class="table" style="background-color: white;">
                  <thead class="thead-dark">
                      <tr>
                      <th scope="col">id</th>
                      <th scope="col">Name</th>
                      <th scope="col">Location</th>
                      <th scope="col">Email</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr v-for="(company,index) in companies" :key="index" >
                      <th scope="row">{{ company.id }}</th>
                      <td>{{ company.name }}</td>
                      <td>{{ company.location }}</td>
                      <td>{{ company.email }}</td>
                      <td>
                          <div class="btn-group" role="group" aria-label="Basic example">
                              <img class="button-image" :src="[getUrl()+'/edit.png']" width="20" height="20" @click="goToUpdatePage(company.id)" />
                              <img class="button-image" src="/delete.png" width="20" height="20" @click="deleteCompany(company.id,index)" />
                          </div>         
                      </td>
                      </tr>
                  </tbody>
                  </table>
            </div>
        <div class="text-center" v-else>
        <h4 class="text-muted">No Companies Found!</h4>
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

.companies {
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