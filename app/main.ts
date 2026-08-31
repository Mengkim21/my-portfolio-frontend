import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import ui from '@nuxt/ui/vue-plugin';
import './assets/css/main.css';
import App from "./app.vue";
import Home from './pages/index.vue';

const app = createApp(App);

const router = createRouter({
  routes: [
    { path: '/', component: Home },
  ],
  history: createWebHistory()
});

app.use(router);
app.use(ui);

app.mount('#app');