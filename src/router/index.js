import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Homepage from '@/components/pages/Home/Homepage.vue'
import LoginView from '@/components/pages/Login/LoginView.vue'
import RegisterView from '@/components/pages/Register/RegisterView.vue'
import CustomerPortalView from '@/components/pages/Customer/CustomerPortalView.vue'
import CustomerPortalRequestAccountView from '@/components/pages/Customer/CustomerPortalRequestAccountView.vue'
import CustomerAccountTransactions from '@/components/pages/Customer/CustomerAccountTransactions.vue'
import CustomerTransferView from '@/components/pages/Customer/CustomerTransferView.vue'
import CustomerWithdrawView from '@/components/pages/Customer/CustomerWithdrawView.vue'
import CustomerDepositView from '@/components/pages/Customer/CustomerDepositView.vue'
import CustomerBankAccountsView from '@/components/pages/Customer/CustomerBankAccountsView.vue'
import CustomerAccountView from '@/components/pages/Customer/CustomerAccountView.vue'
import CustomerProfileView from '@/components/pages/Customer/CustomerProfileView.vue'
import CustomerAccountSettings from '@/components/pages/Customer/BankAccountSettings.vue'
import EmployeePortalView from '@/components/pages/Employee/EmployeePortal.vue'
import UserManagementView from '@/components/pages/Employee/UserManagementView.vue'
import UserBankAccountManagementView from '@/components/pages/Employee/UserBankAccountManagementView.vue'
import BankAccountLimitsAndTransactions from '@/components/pages/Employee/BankAccountLimitsAndTransactions.vue'
// import NotFound from '@/components/pages/NotFound.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/',
      name: 'home',
      component: Homepage,
    },
    {
      path: '/customer',
      name: 'customer-portal',
      component: CustomerPortalView,
      meta: { requiresAuth: true, requiresCustomer: true },
    },
    {
      path: '/customer/request-account',
      name: 'customer-request-account',
      component: CustomerPortalRequestAccountView,
      meta: { requiresAuth: true, requiresCustomer: true },
    },
    {
      path: '/customer/transactions',
      name: 'customer-transactions',
      component: CustomerAccountTransactions,
      meta: { requiresAuth: true, requiresCustomer: true },
    },
    {
      path: '/customer/accounts',
      name: 'customer-bank-accounts',
      component: CustomerBankAccountsView,
      meta: { requiresAuth: true, requiresCustomer: true },
    },
    {
      path: '/customer/accounts/:iban',
      name: 'customer-bank-account',
      component: CustomerAccountView,
      props: true,
      meta: { requiresAuth: true, requiresCustomer: true },
    },
    {
      path: '/customer/transfer',
      name: 'customer-transfer',
      component: CustomerTransferView,
      meta: { requiresAuth: true, requiresCustomer: true },
    },
    {
      path: '/customer/withdraw',
      name: 'customer-withdraw',
      component: CustomerWithdrawView,
      meta: { requiresAuth: true, requiresCustomer: true },
    },
    {
      path: '/customer/deposit',
      name: 'customer-deposit',
      component: CustomerDepositView,
      meta: { requiresAuth: true, requiresCustomer: true },
    },
    {
      path: '/customer/profileSettings',
      name: 'customer-profile',
      component: CustomerProfileView,
      meta: { requiresAuth: true, requiresCustomer: true },
    },
    {
      path: '/customer/accounts/settings/:iban',
      name: 'customer-account-settings',
      component: CustomerAccountSettings,
      props: true,
      meta: { requiresAuth: true, requiresCustomer: true },
    },
    {
      path: '/employee',
      name: 'employee-portal',
      component: EmployeePortalView,
      meta: { requiresAuth: true, requiresEmployee: true },
    },
    {
      path: '/employee/user-management',
      name: 'employee-user-management',
      component: UserManagementView,
      meta: { requiresAuth: true, requiresEmployee: true },
    },
    {
      path: '/employee/account-management',
      name: 'employee-user-bank-account-management',
      component: UserBankAccountManagementView,
      meta: { requiresAuth: true, requiresEmployee: true },
    },
    {
      path: '/employee/account-management/:iban',
      name: 'employee-account-settings',
      component: BankAccountLimitsAndTransactions,
      props: true,
      meta: { requiresAuth: true, requiresEmployee: true },
    },
    {
      path: '/employee/account-management/settings/:iban',
      name: 'employee-account-settings-set-limits',
      component: CustomerAccountSettings,
      props: true,
      meta: { requiresAuth: true, requiresEmployee: true },
    },
    // {
    //     path: '/:catchAll(.*)', name: 'not-found', component: NotFound,
    // }
  ],
})
// Initialize auth on any navigation
let authInitialized = false

router.beforeEach(async to => {
  const authStore = useAuthStore()

  // Initialize auth on first navigation
  if (!authInitialized) {
    authInitialized = true
    // Always try to restore user if we have a token, regardless of loading state
    if (authStore.token && !authStore.user) {
      await authStore.fetchLoggedInUser()
    }
  }

  // For any protected route, ensure user is loaded
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    // If we have a token but no user, try to fetch the user
    if (authStore.token && !authStore.user) {
      await authStore.fetchLoggedInUser()
    }

    // If still not logged in, redirect to login
    if (!authStore.isLoggedIn) {
      return { name: 'login', query: { redirect: to.path } }
    }
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
