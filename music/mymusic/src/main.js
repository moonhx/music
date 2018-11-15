import Vue from 'vue'
import VueResource from "vue-resource"
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import "./filter"
import router from "./router"

import App from './App.vue'
import store from "./store"
Vue.use(MintUI)
Vue.use(VueResource);

new Vue({
  el: '#app',
  render: h => h(App),
  router:router,
  store
})
