import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/index/Home.vue'
import Parser from '@/components/parser/example/Index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/parser',
    name: 'parser',
    component: Parser
  }
]

const router = new VueRouter({
  routes
})

export default router
