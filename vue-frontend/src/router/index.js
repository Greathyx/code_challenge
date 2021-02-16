import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import RestaurantDetail from "@/views/RestaurantDetail";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/restaurant_detail',
    name: 'RestaurantDetail',
    component: RestaurantDetail,
    props: (route) => ({ query: route.query.id })
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
