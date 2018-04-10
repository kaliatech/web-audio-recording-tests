import 'babel-polyfill'
import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './App.vue'
import router from '@/router/index.js'

// import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  theme: {
    primary: '#546E7A',
    secondary: '#B0BEC5',
    accent: '#448AFF',
    error: '#EF5350',
    warning: '#FFF176',
    info: '#2196f3',
    success: '#4caf50'
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
