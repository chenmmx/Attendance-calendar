import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import './registerServiceWorker'

import ChCalendar from './components/ChCalendar'

Vue.config.productionTip = false
Vue.use(ElementUI)

Vue.component(ChCalendar.name, ChCalendar)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
