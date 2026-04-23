import { createRouter, createWebHashHistory } from 'vue-router'
import Homepage from '@/components/pages/Home/Homepage.vue'
import LoginView from '@/components/pages/Login/LoginView.vue'
import RegisterView from '@/components/pages/Register/RegisterView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/',
      name: 'home',
      component: Homepage
    }
    // ,
    // {
    //   path: '/articles/:id',
    //   name: 'article-detail',
    //   component: ArticleDetailPage,
    //   props: true
    // }
  ]
})

export default router
