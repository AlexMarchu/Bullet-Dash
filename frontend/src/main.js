import { createApp } from "vue";
import App from "./App.vue";
import router from "./services/router.ts";

const app = createApp(App);
app.use(router);

app.mount("#application");