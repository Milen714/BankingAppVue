import { createRouter, createWebHistory } from 'vue-router'
import Homepage from '@/components/pages/Home/Homepage.vue'


const router = createRouter({
  history: createWebHistory(),
  routes: [
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
