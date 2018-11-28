import Vue from 'vue'
import Router from 'vue-router'
import SignCamera from '@/components/SignCamera'
import MultipleCamera from '@/components/MultipleCamera'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SignCamera',
      component: SignCamera
    },
    {
      path: '/MultipleCamera',
      name: 'MultipleCamera',
      component: MultipleCamera
    }
  ]
})
