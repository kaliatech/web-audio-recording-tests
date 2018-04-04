import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/views/Home'
import Diagnostics from '@/views/Diagnostics'
import Test1 from '@/views/Test1'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/diagnostics',
      name: 'diagnostics',
      component: Diagnostics
    },
    {
      path: '/test1',
      name: 'test1',
      component: Test1
    }
  ]
})

export default router
