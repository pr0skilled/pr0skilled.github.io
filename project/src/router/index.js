import Vue from 'vue'
import VueRouter from 'vue-router'
//import Home from '../views/Home.vue'
import sign from '../views/Sign.vue'
import register from '../views/Register.vue'
import chats from '../views/Chats.vue'
Vue.use(VueRouter)

const ifAuth= function(to,from,next){
  if(localStorage.getItem('username')){
    next();
  }
  else{
    router.push('/sign')
  }
}

const routes = [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/sign',
    name: 'Sign',
    component: sign
  },
  {
    path: '/register',
    name: 'Register',
    component: register
  },
  {
    path: '/chats',
    name: 'Chats',
    component: chats,
    beforeEnter: ifAuth
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
