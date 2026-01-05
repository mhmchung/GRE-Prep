const KEY = 'gre_flashcards_v1'

function safeParse(json, fallback) {
  try { return JSON.parse(json) } catch { return fallback }
}

export function getOrCreateUserId() {
  const raw = localStorage.getItem(KEY)
  const data = raw ? safeParse(raw, {}) : {}
  if (data.userId) return data.userId
  const userId = crypto.randomUUID()
  localStorage.setItem(KEY, JSON.stringify({ ...data, userId }))
  return userId
}

export function loadState() {
  const raw = localStorage.getItem(KEY)
  return raw ? safeParse(raw, null) : null
}

export function saveState(partial) {
  const current = loadState() ?? {}
  const next = { ...current, ...partial, updatedAt: new Date().toISOString() }
  localStorage.setItem(KEY, JSON.stringify(next))
  return next
}

export function resetAll() {
  localStorage.removeItem(KEY)
}
