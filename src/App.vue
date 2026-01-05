<template>
  <div class="app">
    <header class="topbar">
      <div class="brand" @click="goHome" role="button" tabindex="0">
        <span class="dot"></span>
        <span>GRE Flashcards</span>
      </div>
      <nav class="nav">
        <RouterLink to="/" class="navlink">Home</RouterLink>
        <RouterLink to="/study" class="navlink">Study</RouterLink>
        <RouterLink to="/results" class="navlink">Results</RouterLink>
      </nav>
    </header>

    <main class="container">
      <RouterView />
    </main>

    <footer class="footer">
      <div class="muted">
        No login / no backend — progress is saved in your browser (localStorage).
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function goHome() { router.push('/') }
</script>
