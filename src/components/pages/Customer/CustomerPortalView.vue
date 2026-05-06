<script setup>
import CustomerSidebarNav from '@/components/organisms/CustomerSidebarNav.vue'
import CustomerBottomNav from '@/components/organisms/CustomerBottomNav.vue'
import CustomerAccountCard from '@/components/molecules/CustomerAccountCard.vue'
import CustomerTransactionItem from '@/components/molecules/CustomerTransactionItem.vue'

const accounts = [
	{
		title: 'Main Checking',
		iban: 'NL93 INGB 0123 4567 89',
		balance: 'EUR 4,250.00',
		status: 'APPROVED',
		icon: 'pi pi-credit-card',
		pending: false,
		accent: 'bg-orange-100',
	},
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
	<section class="bg-[#f6efec]">
		<div class="mx-auto flex min-h-[calc(100vh-60px)] max-w-350">
			<CustomerSidebarNav />

			<div class="w-full px-4 pb-24 pt-6 md:px-8 md:pb-8">
				<header class="mb-6 flex flex-wrap items-start justify-between gap-4">
					<div>
						<p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Total Balance</p>
						<h1 class="mt-2 text-5xl font-semibold text-slate-900">EUR 16,650.00</h1>
					</div>

					<div class="flex flex-wrap gap-2">
						<button type="button" class="rounded-lg bg-[#b54d08] px-4 py-2 text-sm font-semibold text-white hover:bg-[#a74407]">
							<i class="pi pi-send mr-1.5"></i>
							Transfer Money
						</button>
						<button type="button" class="rounded-lg bg-[#f7e7e0] px-4 py-2 text-sm font-medium text-slate-900 hover:bg-[#f1dbd1]">
							<i class="pi pi-plus-circle mr-1.5"></i>
							Request New Account
						</button>
						<button type="button" class="hidden rounded-lg bg-[#f7e7e0] px-4 py-2 text-sm font-medium text-slate-900 hover:bg-[#f1dbd1] lg:inline-flex">
							<i class="pi pi-table mr-1.5"></i>
							View All Transactions
						</button>
					</div>
				</header>

				<section>
					<h2 class="mb-3 text-4xl font-semibold text-slate-900">Your Accounts</h2>
					<div class="grid gap-4 lg:grid-cols-3">
						<CustomerAccountCard
							v-for="account in accounts"
							:key="account.title"
							:title="account.title"
							:iban="account.iban"
							:balance="account.balance"
							:status="account.status"
							:icon="account.icon"
							:pending="account.pending"
							:accent="account.accent"
						/>
					</div>
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

		<CustomerBottomNav />
	</section>
</template>
