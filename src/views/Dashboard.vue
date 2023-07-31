<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import DashboardServices from "../services/DashboardServices.js";
import { ref } from "vue";
import Loading from "../components/Loading.vue";
import LeftNavbar from "../components/LeftNavbar.vue";
import Linechart from "../components/Linechart.vue";

const dashboard = ref(null)
const isLoading = ref(true);
const router = useRouter();
const user = ref(null);
const id = null
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const lastWeekChartData = ref([])
onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
    if(!user.value) {
    router.push({ name: "login" });
  }
  await getDashboard();
  await getLastWeekReport();
  isLoading.value = false;
});

async function getDashboard() {
  await DashboardServices.getDashboard()
    .then((res) => {
        dashboard.value = res.data
    })
    .catch((error) => {
      console.log(error);
    });
}
async function getLastWeekReport() {
  await DashboardServices.getLastWeekReport()
    .then((res) => {
        generateLastWeekChart(res.data)
    })
    .catch((error) => {
      console.log(error);
    });
}

const generateLastWeekChart = (data) =>{
    const lastWeekLabels= data.map((item) => item.date);
    const lastWeekDeliveredOrders = data.map((item) => item.delivered);
    lastWeekChartData.value = {
    labels: lastWeekLabels,
    datasets: [
        {
        label: 'Last Week Delivered Orders',
        backgroundColor: '#e8b200',
        data: lastWeekDeliveredOrders
        }
    ]
    }
}
</script>

<template>
<v-container>
     <div class="flex flex-1">
      <LeftNavbar/>
  <div class="container" style="margin-top: 20px">
    <div style="display: flex;">
      <h3>Dashboard</h3>
    </div>
    <br/>
    <Loading v-if="isLoading" />
    <div class="col-md-12 container elevation-4 dashboard" v-else-if="dashboard">
        <div class="row">
            <div class="col-6">
                <Linechart :chartData="lastWeekChartData" style="width:500px;height:500px;" />
            </div>
            <div style="display:flex;justify-content:space-around;">
             <div class="col-6 static">
                <div class="dashboard-static-data">
                     <p> Total Orders </p>
                    <h4> {{ dashboard.progressOrders + dashboard.pendingOrders + dashboard.deliveredOrders  }} </h4> 
                </div>
                <div class="dashboard-static-data">
                     <p> Pending Orders </p>
                    <h4> {{ dashboard.deliveredOrders }} </h4> 
                </div>
                    <div class="dashboard-static-data">
                     <p> Progress Orders </p>
                    <h4> {{ dashboard.deliveredOrders }} </h4> 
                </div>
                <div class="dashboard-static-data">
                     <p> Delivered Orders </p>
                    <h4> {{ dashboard.deliveredOrders }} </h4> 
                </div>
                <div class="dashboard-static-data">
                    <p> Delivered in Time </p>
                    <h4> {{ dashboard.deliveryInTimeCount }} </h4> 
                </div>
                <div class="dashboard-static-data">
                     <p> Orders Amount </p>
                    <h4> $ {{ dashboard.ordersAmount }} </h4> 
                </div>   
             </div> 
            <div class="col-6 static">
               <div class="dashboard-static-data">
                     <p> Total Admins </p>
                    <h4> {{ dashboard.admins  }} </h4> 
                </div>
                <div class="dashboard-static-data">
                     <p> Total Clerks </p>
                    <h4> {{ dashboard.clerks  }} </h4> 
                </div>
                <div class="dashboard-static-data">
                     <p> Total Delivery Boys </p>
                    <h4> {{ dashboard.deliveryBoys  }} </h4> 
                </div>
                <div class="dashboard-static-data">
                     <p> Total Customers </p>
                    <h4> {{ dashboard.customers  }} </h4> 
                </div>
            </div>          
            </div>
        </div>
    </div>
    <div class="text-center" v-else>
      <h4 class="text-muted">Unable to fetch data</h4>
      <hr/>
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
  </div>
     </div>
</v-container>
</template>

<style scoped>
.dashboard {
    background-color: white;
    padding: 30px;
}
.col-6{
    margin-bottom: 50px;
}
.dashboard-static-data {
    display: flex;
    width: 40%;
    justify-content: space-between;
}
.static {
    margin-top: 40px;
}
</style>