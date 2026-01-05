<template>
  <div v-if="!session" class="card section">
    <h1 class="h1">No results yet</h1>
    <p class="p">Start a session first.</p>
    <div class="row" style="margin-top:12px">
      <RouterLink class="btn btnPrimary" to="/">Start →</RouterLink>
    </div>
  </div>

  <div v-else class="card section">
    <div class="row" style="justify-content: space-between; align-items:flex-end">
      <div>
        <div class="tag">Summary</div>
        <h1 class="h1" style="margin-top:8px">Results</h1>
        <p class="p">Your self-scored accuracy for this session.</p>
      </div>
      <div class="row">
        <RouterLink class="btn" to="/study">Back to study</RouterLink>
        <RouterLink class="btn btnPrimary" to="/">New session</RouterLink>
      </div>
    </div>

    <div class="hr"></div>

    <KpiRow :total="stats.total" :answered="stats.answered" :correct="stats.correct" :accuracy="stats.accuracy" />

    <div class="hr"></div>

    <div class="notice">
      <div><strong>Rough “score”:</strong> {{ roughBand }}</div>
      <div class="small" style="margin-top:6px">
        This isn’t an ETS score conversion — it’s just an easy way to gauge vocab recall today.
      </div>
    </div>

    <div class="hr"></div>

    <h2 class="h2">Review (missed words)</h2>

    <div v-if="missed.length === 0" class="small muted">
      Nice — no missed words (or you didn’t answer any cards yet).
    </div>

    <div v-else class="row" style="gap:10px">
      <div v-for="m in missed" :key="m.word" class="tag" :title="m.word">
        {{ m.word }}
      </div>
    </div>

    <div class="hr"></div>

    <h2 class="h2">Session details</h2>
    <div class="small muted">
      Cards: {{ session.config.deckSize }} · Shuffle: {{ session.config.shuffle ? 'On' : 'Off' }} ·
      Strict defs: {{ session.config.includeOnlyWithDefinitions ? 'Yes' : 'No' }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import KpiRow from '../components/KpiRow.vue'
import { loadSession, computeStats } from '../lib/session'

const session = ref(loadSession())
const stats = computed(() => computeStats(session.value))

const missed = computed(() => {
  const answers = session.value?.answers ?? []
  return answers.filter(a => !a.correct).slice(0, 60)
})

const roughBand = computed(() => {
  const a = stats.value.accuracy
  if (stats.value.answered < 5) return 'Do a few more cards'
  if (a >= 0.9) return 'Excellent recall'
  if (a >= 0.75) return 'Solid'
  if (a >= 0.6) return 'Developing'
  return 'Needs work'
})
</script>
