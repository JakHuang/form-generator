import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import '@/styles/index.scss'
import '@/icons'

Vue.config.productionTip = false

window.addEventListener('message', init, false)

function init(event) {
  if (event.data.cmd === 'mountApp') {
    window.$DB = event.data.data
    new Vue({
      router,
      render: h => h(App)
    }).$mount('#app')
  }
}
