import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '@/views/Home'
import Diagnostics from '@/views/Diagnostics'
import Test1 from '@/views/Test1'
import Test2 from '@/views/Test2'
import Test3 from '@/views/Test3'
import Test4 from '@/views/Test4'
import Test5 from '@/views/Test5'
import Test6 from '@/views/Test6'
import Version from '@/views/Version'

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
    },
    {
      path: '/test4',
      name: 'test4',
      component: Test4
    },
    {
      path: '/test5',
      name: 'test5',
      component: Test5
    },
    {
      path: '/test6',
      name: 'test6',
      component: Test6
    },
    {
      path: '/version',
      name: 'version',
      component: Version
    }
  ]
})

export default router
