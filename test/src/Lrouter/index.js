import Vue from 'vue'
// import VueRouter from 'vue-router'
import VueRouter from './lvue-router.js'
import Home from '../views/Home.vue'

// VueRouter.install(Vue)
Vue.use(VueRouter)

// 路由映射表
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    children: [
      {
        path: '/about/info',
        component: {render(h){return h('div', 'info page')}}
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
