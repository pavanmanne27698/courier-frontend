<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import LeftNavbar from "../components/LeftNavbar.vue";

const router = useRouter();
onMounted(async () => {
  if (localStorage.getItem("user") == null) {
    router.push({ name: "login" });
  }
});
</script>


<template>
      <div class="flex flex-1">
        <LeftNavbar/>
        <p>Dashboard comes here</p>
    </div>
</template>