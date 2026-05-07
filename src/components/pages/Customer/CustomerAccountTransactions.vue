<script setup>
import CustomerSidebarNav from '@/components/organisms/CustomerSidebarNav.vue'
import CustomerBottomNav from '@/components/organisms/CustomerBottomNav.vue'
import PortalHeader from '@/components/organisms/PortalHeader.vue'
import CustomerTransactionItem from '@/components/molecules/CustomerTransactionItem.vue'


const transactions = [
	{
		title: 'Albert Heijn Supermarket',
		subtitle: 'Today, 14:32 • Main Checking',
		amount: '-EUR 84.50',
		positive: false,
		pending: false,
		icon: 'pi pi-shopping-bag',
	},
	{
		title: 'Salary Deposit - Tech Corp',
		subtitle: 'Yesterday, 09:00 • Main Checking',
		amount: '+EUR 4,250.00',
		positive: true,
		pending: false,
		icon: 'pi pi-wallet',
	},
	{
		title: 'Bistro Amsterdam',
		subtitle: 'Oct 24, 20:15 • Main Checking',
		amount: '-EUR 120.00',
		positive: false,
		pending: true,
		icon: 'pi pi-shop',
	},
	{
		title: 'KPN Internet Services',
		subtitle: 'Oct 22, 11:00 • Main Checking',
		amount: '-EUR 45.00',
		positive: false,
		pending: false,
		icon: 'pi pi-wifi',
	},
]

</script>

<template>
    <section class="bg-[#f6efec]">
    <div class="mx-auto flex min-h-[calc(100vh-60px)]">
      <CustomerSidebarNav />

      <div class="w-full px-4 pb-24 pt-6 md:px-8 md:pb-8">
        <PortalHeader
          :title="'Account Transactions'"
          :buttons="[
            { label: 'New Transfer', icon: 'pi pi-send', type: 'primary', linkTo: '/customer/transfer' },
            { label: 'Withdraw Funds', icon: 'pi pi-money-bill', type: 'primary', linkTo: '/customer/withdraw' },
          ]"
        />

        <ul class="mt-4 overflow-hidden rounded-2xl border border-[#e7c9bd] bg-white">
            <CustomerTransactionItem
                v-for="item in transactions"
                :key="item.title + item.subtitle"
                :title="item.title"
                :subtitle="item.subtitle"
                :amount="item.amount"
                :positive="item.positive"
                :pending="item.pending"
                :icon="item.icon"
            />
        </ul>
      </div>
    </div>

    <CustomerBottomNav />
  </section>

</template>