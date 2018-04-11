import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/views/Home'
import Diagnostics from '@/views/Diagnostics'
import Test1 from '@/views/Test1'
import Test2 from '@/views/Test2'
import Test3 from '@/views/Test3'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'hash',
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
    },
    {
      path: '/test2',
      name: 'test2',
      component: Test2
    },
    {
      path: '/test3',
      name: 'test3',
      component: Test3
    }

  ]
})

export default router
