<template>
  <div class="card section">
    <h1 class="h1">Quick GRE vocab practice</h1>
    <p class="p">
      Pick how many cards you want, then run through them like a flashcard drill.
      You decide if you “knew” the word (self-scored). Your progress is saved in this browser.
    </p>

    <div class="hr"></div>

    <div class="grid2">
      <div class="card section" style="background: rgba(0,0,0,.12)">
        <h2 class="h2">Session setup</h2>

        <div class="row">
          <div class="field">
            <label>Number of cards (5–200)</label>
            <input v-model="deckSize" type="number" min="5" max="200" />
            <div class="small">Tip: 20–40 is a good daily set.</div>
          </div>

          <div class="field">
            <label>Deck options</label>
            <select v-model="mode">
              <option value="strict">Only words with WordNet definitions</option>
              <option value="lenient">Allow missing definitions</option>
            </select>
            <div class="small">WordNet lookup is local (no API calls).</div>
          </div>
        </div>

        <div class="row" style="margin-top:10px">
          <button class="btn" @click="toggleShuffle">
            Shuffle: <strong>{{ shuffle ? 'On' : 'Off' }}</strong>
          </button>

          <button class="btn btnPrimary" @click="start">
            Start session →
          </button>
        </div>

        <div v-if="loading" class="notice" style="margin-top:12px">
          Building your deck (first load can take a few seconds)…
        </div>

        <div v-if="err" class="notice" style="margin-top:12px">
          {{ err }}
        </div>
      </div>

      <div class="card section" style="background: rgba(0,0,0,.12)">
        <h2 class="h2">How “remember user” works</h2>
        <p class="p">
          Because there’s no login and no backend, the app “remembers” you by saving a random
          <span class="tag">userId</span> and your latest session into <span class="tag">localStorage</span>.
        </p>

        <div class="hr"></div>

        <div class="small">
          ✓ Remembers you on the same browser/device<br/>
          ✗ Won’t sync across devices / incognito / cleared storage
        </div>

        <div class="hr"></div>

        <div class="small muted">
          Data source: built-in starter list (you can replace it with your own list later).
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ensureUser, getDefaultConfig, buildDeck, saveSession } from '../lib/session'

const router = useRouter()

const deckSize = ref(20)
const shuffle = ref(true)
const mode = ref('strict')
const loading = ref(false)
const err = ref('')

onMounted(() => {
  ensureUser()
  const defaults = getDefaultConfig()
  deckSize.value = defaults.deckSize
  shuffle.value = defaults.shuffle
})

function toggleShuffle() {
  shuffle.value = !shuffle.value
}

async function start() {
  err.value = ''
  loading.value = true
  try {
    const cfg = {
      deckSize: deckSize.value,
      shuffle: shuffle.value,
      includeOnlyWithDefinitions: mode.value === 'strict',
    }

    const deck = await buildDeck(cfg)
    const session = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      config: cfg,
      deck,
      index: 0,
      answers: [],
    }
    saveSession(session)
    router.push('/study')
  } catch (e) {
    err.value = 'Something went wrong while building the deck. Try again.'
  } finally {
    loading.value = false
  }
}
</script>
