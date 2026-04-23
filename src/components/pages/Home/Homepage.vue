<script setup>
import HomeHeroCard from '@/components/organisms/HomeHeroCard.vue'
import HomeQuickLinks from '@/components/organisms/HomeQuickLinks.vue'
import HomeServicesGrid from '@/components/organisms/HomeServicesGrid.vue'

const quickLinks = [
    { label: 'Open an account', icon: 'pi pi-user-plus', href: '#' },
    { label: 'Activate the app', icon: 'pi pi-mobile', href: '#' },
    { label: 'About secure banking', icon: 'pi pi-lock', href: '#' },
    { label: 'For expats', icon: 'pi pi-globe', href: '#' },
]

const services = [
    {
        title: 'Payments',
        description: 'Open within 10 minutes your Payment account.',
        icon: 'pi pi-wallet',
        iconBg: 'bg-sky-100',
    },
    {
        title: 'Savings',
        description: 'What you need to build a buffer.',
        icon: 'pi pi-money-bill',
        iconBg: 'bg-pink-100',
    },
    {
        title: 'Investing',
        description: 'Find a way of investing that suits you.',
        icon: 'pi pi-chart-line',
        iconBg: 'bg-purple-100',
    },
    {
        title: 'Mortgages',
        description: 'From dreaming to doing: your living wishes are central to us.',
        icon: 'pi pi-home',
        iconBg: 'bg-yellow-100',
    },
]
</script>

<template>
    <main class="min-h-screen bg-[#f3f4f6] pt-24 pb-10">
        <div class="mx-auto w-full max-w-7xl px-3 sm:px-5 lg:px-6">
            <header>
                <h1 class="text-5xl font-semibold tracking-tight text-slate-900">Welcome to DMT</h1>
                <HomeQuickLinks :links="quickLinks" />
            </header>

            <HomeHeroCard
                title="Open Savings Account"
                description="Secure your future with high-yield savings and flexible access."
            />

            <HomeServicesGrid :services="services" />
        </div>
    </main>
</template>