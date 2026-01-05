<template>
  <div v-if="!session" class="card section">
    <h1 class="h1">No active session</h1>
    <p class="p">Go back to Home to start a new set.</p>
    <div class="row" style="margin-top:12px">
      <RouterLink class="btn btnPrimary" to="/">Start a session →</RouterLink>
    </div>
  </div>

  <div v-else class="card section">
    <div class="row" style="justify-content: space-between; align-items:flex-end">
      <div>
        <div class="tag">Session</div>
        <h1 class="h1" style="margin-top:8px">Study</h1>
        <p class="p">Self-score each card: “knew it” or “didn’t”.</p>
      </div>
      <div class="row">
        <button class="btn" @click="restart">Restart</button>
        <RouterLink class="btn" to="/results">Results</RouterLink>
      </div>
    </div>

    <div class="hr"></div>

    <KpiRow :total="stats.total" :answered="stats.answered" :correct="stats.correct" :accuracy="stats.accuracy" />

    <div style="margin-top:14px" class="progressbar" aria-label="progress">
      <div :style="{ width: `${Math.round((stats.answered / Math.max(1, stats.total)) * 100)}%` }"></div>
    </div>

    <div class="hr"></div>

    <div class="flashcard">
      <div class="row" style="justify-content: space-between">
        <div class="tag">Card {{ currentIndex + 1 }} / {{ stats.total }}</div>
        <div class="tag">WordNet</div>
      </div>

      <div class="word">{{ card.word }}</div>

      <div class="row" style="margin-top:6px">
        <button class="btn btnPrimary" @click="reveal = !reveal">
          {{ reveal ? 'Hide meaning' : 'Reveal meaning' }}
        </button>
        <span class="small muted">Try to recall first, then reveal.</span>
      </div>

      <div v-if="reveal" class="def">
        <template v-if="card.def?.length">
          <div v-for="(g, i) in card.def" :key="i" style="margin-bottom:8px">
            • {{ g }}
          </div>
        </template>
        <template v-else>
          <div class="muted">No definition found in WordNet for this word.</div>
        </template>
      </div>

      <div class="hr"></div>

      <div class="row">
        <button class="btn btnBad" @click="answer(false)">Didn’t know</button>
        <button class="btn btnGood" @click="answer(true)">Knew it</button>

        <button class="btn" @click="skip" :disabled="isLast">
          Skip →
        </button>
        <span class="small muted" v-if="isLast">Last card — finish to see results.</span>
        <button class="btn btnPrimary" v-if="isLast" @click="finish">
          Finish →
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import KpiRow from '../components/KpiRow.vue'
import { loadSession, saveSession, computeStats, buildDeck } from '../lib/session'

const router = useRouter()
const session = ref(loadSession())
const reveal = ref(false)

const stats = computed(() => computeStats(session.value))
const currentIndex = computed(() => session.value?.index ?? 0)
const isLast = computed(() => currentIndex.value >= (stats.value.total - 1))
const card = computed(() => session.value?.deck?.[currentIndex.value] ?? { word: '', def: null })

watchEffect(() => {
  // If session disappeared (e.g., reset), keep UI consistent
  if (!session.value) return
  if (session.value.index < 0) session.value.index = 0
})

function answer(correct) {
  if (!session.value) return
  const w = card.value.word

  // prevent double-answering same card
  const already = session.value.answers.find(a => a.index === currentIndex.value)
  if (!already) {
    session.value.answers.push({
      index: currentIndex.value,
      word: w,
      correct,
      at: new Date().toISOString(),
    })
  } else {
    already.correct = correct
    already.at = new Date().toISOString()
  }

  reveal.value = false
  if (isLast.value) return
  session.value.index += 1
  saveSession(session.value)
}

function skip() {
  if (!session.value) return
  reveal.value = false
  if (isLast.value) return
  session.value.index += 1
  saveSession(session.value)
}

function finish() {
  if (!session.value) return
  saveSession(session.value)
  router.push('/results')
}

async function restart() {
  if (!session.value) return
  const cfg = session.value.config
  const deck = await buildDeck(cfg)
  session.value = {
    ...session.value,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    deck,
    index: 0,
    answers: [],
  }
  reveal.value = false
  saveSession(session.value)
}
</script>
