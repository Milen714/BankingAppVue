import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from '@/utils/axios.js'
import { useAuthStore } from './auth.js'

export const useBankAccountStore = defineStore('bankAccount', () => {
  // State
  const myAccounts = ref([])
  const mySavingsAccounts = ref([])
  const myCurrentAccounts = ref([])
  const loading = ref(false)
  const error = ref(null)
  const selectedAccount = ref(null)
  const selectedAccountTransactions = ref([])
  const recentTransactions = ref([])
    // Actions
    /**
     * Fetch all bank accounts for the logged in user from the API
     * @param {boolean} force - Force refresh even if accounts are already cached
     */
    async function fetchMyBankAccounts(force = false) { 
        const authStore = useAuthStore();
        if (myAccounts.value.length > 0 && !force) {
            return; // Already have accounts, no need to fetch again
        }
        
        // Always wait for auth to be ready
        if (authStore.loading) {
            await authStore.fetchLoggedInUser();
        }
        
        if (!authStore.isLoggedIn) {
            error.value = 'You must be logged in to view your bank accounts.';
            return;
        }
        
        loading.value = true;
        error.value = null;
        try {
          const response = await axios.get('/accounts?ownerId=' + authStore.user.id);
          console.log('Fetched bank accounts:', response.data);
          myAccounts.value = response.data.data;
          sortAccountsByType();
        } catch (err) {
          error.value = err.response?.data || 'An error occurred while fetching bank accounts.';
        } finally {
          loading.value = false;
        }
    }

    async function fetchBankAccountByIban(iban) {
        const account = myAccounts.value.find(acc => acc.iban === iban);
        if (account) {
            selectedAccount.value = account
            return account
        }
    
        loading.value = true;
        error.value = null;
        try {
            const response = await axios.get(`/accounts?iban=${iban}`);
            selectedAccount.value = response.data.data;
            return selectedAccount.value;
        } catch (err) {
            error.value = err.response?.data || 'An error occurred while fetching the bank account.';
            throw new Error(error.value);
        } finally {
            loading.value = false;
        }
    }
    /**
     * Perform a transfer between accounts using the API
     * @param {*} payload 
     * @returns 
     */
    async function executeTransaction(payload) {
        loading.value = true;
        error.value = null;
        try {
            const response = await axios.post('/transactions', payload);
            await fetchMyBankAccounts(true); // Refresh accounts to reflect new balances, force=true to bypass cache
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.response?.data?.error || 'An error occurred while executing the transfer.';
            error.value = errorMessage;
            throw new Error(errorMessage);
        } finally {
            loading.value = false;
        }
    }
    /**
     * Sort accounts into savings and current based on their type. This is called after fetching accounts to keep the logic in one place.
     */
    function sortAccountsByType() {
        mySavingsAccounts.value = myAccounts.value.filter(account => account.type === 'SAVINGS');
        myCurrentAccounts.value = myAccounts.value.filter(account => account.type === 'CHECKING');
    }

    /**
     * Fetch transactions for a specific account
     * @param {string} iban - The IBAN of the account for which to fetch transactions
     */
    async function fetchAccountTransactions(iban) {
        loading.value = true;
        error.value = null;
        try {
            const response = await axios.get(`/transactions?iban=${iban}`);
            recentTransactions.value = response.data.data;
            console.log('Fetched transactions for account', iban, response.data);
        } catch (err) {
            error.value = err.response?.data || 'An error occurred while fetching transactions.';
        } finally {
            loading.value = false;
        }
    }

    /**
     * Fetch recent transactions for the logged in user
     */
    async function fetchRecentTransactions() {
        const authStore = useAuthStore();
        if (!authStore.isLoggedIn) {
            error.value = 'You must be logged in to view transactions.';
            return;
        }

        loading.value = true;
        error.value = null;
        try {
            const response = await axios.get(`/transactions?ownerId=${authStore.user.id}`);
            recentTransactions.value = response.data.data;
            console.log('Fetched recent transactions:', response.data);
        } catch (err) {
            error.value = err.response?.data || 'An error occurred while fetching transactions.';
        } finally {
            loading.value = false;
        }
    }

    async function requestNewAccount(payload) {
        loading.value = true;
        error.value = null;
        try {
            const response = await axios.post('/accounts', payload);
            await fetchMyBankAccounts(true); // Refresh accounts to reflect new balances, force=true to bypass cache
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.response?.data?.error || 'An error occurred while requesting a new account.';
            error.value = errorMessage;
            throw new Error(errorMessage);
        } finally {
            loading.value = false;
        }
    }

  return {
    myAccounts,
    mySavingsAccounts,
    myCurrentAccounts,
    recentTransactions,
    selectedAccount,
    loading,
    error,
    fetchMyBankAccounts,
    fetchBankAccountByIban,
    sortAccountsByType,
    executeTransaction,
    fetchAccountTransactions,
    fetchRecentTransactions,
    requestNewAccount,  
  }
})