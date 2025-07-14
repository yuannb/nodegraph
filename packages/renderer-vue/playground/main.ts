import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from '../router'
import "@baklavajs/themes/dist/syrup-dark.css";
import mitt from "mitt";
const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.mount("#app");
