import Vue from 'vue'
import Router from 'vue-router'
import baseNav from '@/view/baseNav.vue'
import my from '@/view/my.vue'
import home from '@/view/home.vue'
import discovery from '@/view/discovery.vue'
import myBlog from '@/view/myBlog.vue'
import myFollow from '@/view/myFollow.vue'
import myFollower from '@/view/myFollower.vue'
Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/',
    component: baseNav,
    children: [{
        path: '/home',
		component: home
      },
      {
        path: '/discovery',
        component: discovery
      },
      {
        path: '/my',
        component: my,
        children: [{
            path: '/my/myBlog',
            component: myBlog
          },
          {
            path: '/my/myFollow',
            component: myFollow
          },
          {
            path: '/my/myFollower',
            component: myFollower
          },
          {
            path: '/',
            redirect: '/my/myBlog'
          }
        ]
      },
      {
        path: '/',
        redirect: '/home'
      }
    ]
  }]
})

router.beforeEach((to, from, next) => {
  console.log('to', to)
  console.log('from', from)
  console.log('next', next)
  next()
})

export default router
