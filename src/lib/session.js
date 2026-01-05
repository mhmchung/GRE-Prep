import words from '../data/words.json'
import WordPOS from 'wordpos'
import { getOrCreateUserId, loadState, saveState } from './storage'

const wordpos = new WordPOS()

function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function ensureUser() {
  return getOrCreateUserId()
}

export function getDefaultConfig() {
  return {
    deckSize: 20,
    includeOnlyWithDefinitions: true,
    shuffle: true,
  }
}

export async function buildDeck(config) {
  const deckSize = Math.max(5, Math.min(200, Number(config.deckSize || 20)))
  const pool = config.shuffle ? shuffle(words) : words.slice()

  const deck = []
  for (const w of pool) {
    const def = await getDefinition(w)
    if (config.includeOnlyWithDefinitions && !def) continue
    deck.push({ word: w, def })
    if (deck.length >= deckSize) break
  }

  // If we couldn't fill it (rare, but possible), allow empty definitions:
  if (deck.length < deckSize) {
    for (const w of pool) {
      if (deck.some(d => d.word === w)) continue
      deck.push({ word: w, def: null })
      if (deck.length >= deckSize) break
    }
  }

  return deck
}

export async function getDefinition(word) {
  // Returns a short set of glosses across POS.
  // WordPOS wraps WordNet; this is entirely client-side and works on GitHub Pages.
  try {
    const results = await wordpos.lookup(word)
    if (!results || results.length === 0) return null

    // Prefer the most common senses; keep it short.
    const glosses = []
    for (const r of results) {
      if (r && r.gloss) glosses.push(r.gloss)
      if (glosses.length >= 2) break
    }
    return glosses.length ? glosses : null
  } catch {
    return null
  }
}

export function loadSession() {
  const state = loadState()
  return state?.session ?? null
}

export function saveSession(session) {
  ensureUser()
  saveState({ session })
}

export function clearSession() {
  saveState({ session: null })
}

export function computeStats(session) {
  const total = session?.deck?.length ?? 0
  const answered = session?.answers?.length ?? 0
  const correct = session?.answers?.filter(a => a.correct).length ?? 0
  const incorrect = answered - correct
  const accuracy = answered ? correct / answered : 0
  return { total, answered, correct, incorrect, accuracy }
}
