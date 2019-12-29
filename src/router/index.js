import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/index/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})

export default router
