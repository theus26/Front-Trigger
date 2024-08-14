import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";

import axios from "axios";
import VueAxios from "vue-axios";
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';


const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "light",
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
});

const app = createApp(App);

app.use(Vue3Toastify, {
  autoClose: 3000,
} as ToastContainerOptions);
app.use(VueAxios, axios);
app.use(createPinia());
app.use(router);
app.use(vuetify);

app.mount("#app");
