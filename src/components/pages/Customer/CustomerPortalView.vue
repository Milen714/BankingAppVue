<script setup>
import CustomerSidebarNav from '@/components/organisms/CustomerSidebarNav.vue'
import CustomerBottomNav from '@/components/organisms/CustomerBottomNav.vue'
import CustomerTransactionItem from '@/components/molecules/CustomerTransactionItem.vue'
import PortalHeader from '@/components/organisms/PortalHeader.vue'
import CustomerAccountsCompact from '@/components/organisms/CustomerAccountsCompact.vue'

const currentAccounts = [
	{
		title: 'Main Checking',
		iban: 'NL93 INGB 0123 4567 89',
		balance: 'EUR 4,250.00',
		status: 'APPROVED',
		icon: 'pi pi-credit-card',
		pending: false,
		accent: 'bg-orange-100',
	},
	
]

const savingsAccounts = [
	{
		title: 'Instant Savings',
		iban: 'NL21 INGB 9876 5432 10',
		balance: 'EUR 12,400.00',
		status: 'APPROVED',
		icon: 'pi pi-star-fill',
		pending: false,
		accent: 'bg-sky-100',
	},
	{
		title: 'Holiday Fund',
		iban: 'Account generation in progress',
		balance: '---',
		status: 'PENDING APPROVAL',
		icon: 'pi pi-send',
		pending: true,
		accent: 'bg-slate-100',
	},
]

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
	<section class="bg-[#f6efec] ">
		<div class="mx-auto flex min-h-[calc(100vh-60px)] ">
			<CustomerSidebarNav />	

			<div class="w-full px-4 pb-24 pt-6 md:px-8 md:pb-8">
					<PortalHeader :title="'Overview'" :buttons="[
						{ label: 'New Transfer', icon: 'pi pi-send', type: 'primary', linkTo: '/customer/transfer' },
						{ label: 'Withdraw Funds', icon: 'pi pi-money-bill', type: 'primary', linkTo: '/customer/withdraw' },
						{ label: 'Request New Account', icon: 'pi pi-plus-circle', type: 'secondary', linkTo: '/customer/request-account' },
					]" />

				<!-- Compact Accounts Layout -->
				<section class="bg-white p-6 mt-4">
					<CustomerAccountsCompact
						:title="'Current Accounts'"
						:accounts="currentAccounts"
					/>
					<CustomerAccountsCompact
						:title="'Savings Accounts'"
						:accounts="savingsAccounts"
					/>
				</section>
					
				<section class="mt-8">
						<div class="mb-3 flex items-center justify-between">
							<h2 class="text-4xl font-semibold text-slate-900">Recent Transactions</h2>
							<button type="button" class="text-sm font-medium text-[#cc570f] hover:text-[#b14c0d]">View all</button>
						</div>
						<ul class="overflow-hidden rounded-2xl border border-[#e7c9bd] bg-white">
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
					</section>
			</div>
		</div>

		<!-- <CustomerBottomNav /> -->
	</section>
</template>
