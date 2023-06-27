import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import "vuetify/dist/vuetify.css";
import '@fortawesome/fontawesome-free/css/all.css';

loadFonts();

createApp(App).use(vuetify).use(router).mount("#app");
