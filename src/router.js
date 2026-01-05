import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import StudyView from './views/StudyView.vue'
import ResultsView from './views/ResultsView.vue'

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/study', name: 'study', component: StudyView },
    { path: '/results', name: 'results', component: ResultsView },
  ],
})
