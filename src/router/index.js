import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth';
import Homepage from '@/components/pages/Home/Homepage.vue'
import LoginView from '@/components/pages/Login/LoginView.vue'
import RegisterView from '@/components/pages/Register/RegisterView.vue'
import CustomerPortalView from '@/components/pages/Customer/CustomerPortalView.vue'
import CustomerPortalRequestAccountView from '@/components/pages/Customer/CustomerPortalRequestAccountView.vue'
import CustomerAccountTransactions from '@/components/pages/Customer/CustomerAccountTransactions.vue'
import CustomerTransferView from '@/components/pages/Customer/CustomerTransferView.vue'

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
    },
    {
      path: '/customer',
      name: 'customer-portal',
      component: CustomerPortalView
    },
    {
      path: '/customer/request-account',
      name: 'customer-request-account',
      component: CustomerPortalRequestAccountView
    },
    {
      path: '/customer/transactions',
      name: 'customer-transactions',
      component: CustomerAccountTransactions
    },
    {
      path: '/customer/transfer',
      name: 'customer-transfer',
      component: CustomerTransferView
    },
    {
      path: '/employee',
      name: 'employee-portal',
      component: CustomerPortalView,
      meta: { requiresAuth: true, requiresEmployee: true }
    }
    // {
    //     path: '/:catchAll(.*)', name: 'not-found', component: NotFound,
    // }
  ]
});
// Global navigation guard to check authentication
router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  
  // Wait for auth to be initialized if not already done
  if (authStore.loading) {
    await authStore.fetchLoggedInUser()
  }
  
  // If route requires auth but user is not logged in
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return { name: 'login', query: { redirect: to.path } }
  }

    if (to.meta.requiresEmployee && authStore.user?.role !== 'ROLE_EMPLOYEE') {
        return { path: '/login', name: 'login' }
    }
    if (to.meta.requiresCustomer && authStore.user?.role !== 'ROLE_CUSTOMER') {
        return { path: '/login', name: 'login' }
    }

  return true
})

export default router
