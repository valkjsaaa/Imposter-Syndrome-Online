import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Game from './views/Game.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/game',
      name: 'game',
      component: Game,
      beforeEnter(to, from, next) {
        //no roomcode or player name
        if (Object.keys(to.params).length === 0) {
          next('/'); //go back to home
        } else {
          next(); //continue to game
        }
      }
    }
  ]
})
