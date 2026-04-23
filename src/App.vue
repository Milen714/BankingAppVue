<script setup>
import MainNavBar from './components/organisms/MainNavBar.vue';
</script>

<template>
  <MainNavBar />
  <main class="mt-15">
    <router-view />
  </main>
</template>
