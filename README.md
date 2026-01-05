# GRE Flashcards (Vue + Vite)

A no-login, no-backend GRE vocab flashcard drill.

- Select deck size
- Reveal WordNet meanings
- Self-score (knew / didn’t)
- See accuracy + missed words
- Persists in localStorage

## Quick start

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## GitHub Pages deploy

1. Create a GitHub repo (e.g. `gre-flashcards`).
2. In `vite.config.js`, set `base` to `'/gre-flashcards/'` (your repo name).
3. Push the code.
4. Enable Pages: Settings → Pages → Source: GitHub Actions.
5. The included workflow will publish on each push to `main`.

## Data

Starter word list is in `src/data/words.json`.

You can replace it with your own list of words (strings). Definitions come from WordNet via `wordpos` + `wordnet-db` (client-side).

## Licences / attributions

- WordNet is provided by Princeton University under the WordNet licence.
- The app code in this repo is MIT (you can choose another licence).
