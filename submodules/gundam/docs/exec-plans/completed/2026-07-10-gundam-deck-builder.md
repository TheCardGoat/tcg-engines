# Gundam Deck Builder

**Status**: completed
**Owner**: Codex
**Started**: 2026-07-10
**Completed**: 2026-07-10

## Goal

Ship an indexable, engaging Gundam Card Game deck builder at the existing
`/gundam/deck-builder` route. The builder must model the current construction
rules end to end: exactly 50 non-resource cards, exactly 10 Resource cards,
one or two main-deck colors, and no more than four copies of a main-deck card
number.

## Scope

- In scope: Gundam catalog resources, save/edit contracts, legality feedback,
  import/export, responsive builder UI, draw analysis, simulator handoff,
  canonical and social metadata, structured data, sitemap discovery, and the
  matchmaking projection needed to preserve the Resource Deck.
- Out of scope: a new database column or table, public deck-list browsing,
  collection ownership, pricing, and changes to other games' builders.

## Approach

- Keep the shared `deck_versions` schema unchanged. Store Gundam's Resource
  Deck in `sideboard_json`, expose it as `resourceDeck` in Gundam-facing API
  contracts, and keep `maybeboard_json` empty for new Gundam versions.
- Include the 50-card main deck and 10-card Resource Deck in the immutable
  playable deck-list identity so format validation and match creation receive
  all 60 cards.
- Extend the Gundam UI catalog response with Resource cards while preserving
  the existing main-card response consumed by card browsing.
- Replace inherited Sideboard and Maybeboard interactions with a dedicated
  Resource Deck picker, color legality, rule-native status, and a compact
  hangar-style workbench that adapts structurally on mobile.
- Make only the base Gundam builder indexable. Edit URLs remain noindex and
  canonicalize to the base route.

## Verification

- In-app browser passed at desktop and 390x844 mobile: card search, filtering,
  add/remove, Resource selection, legal 50+10 import, legality state, stats,
  draw, playtest handoff, export, metadata, and zero horizontal overflow.
- `/v1/gundam/ui/cards` exposes constructible Resource cards separately from
  the main catalog. The base builder emits canonical, Open Graph, and JSON-LD
  metadata and is included in the sitemap; edit routes remain noindex.
- Focused engine, adapter, API, API-core, web schema, and sitemap tests passed.
  Package checks passed for the Gundam packages, changed-file lint passed, and
  the production web build passed with an 8 GB Node heap.

## Open questions

- None. The shared persistence column is an implementation detail; every
  Gundam-facing surface uses the rules-native `resourceDeck` name.

## Decision log

- 2026-07-10 - Reused `sideboard_json` for the Resource Deck because it is an
  existing secondary playable board and avoids a database migration. The
  Gundam API and UI do not expose sideboard terminology.
- 2026-07-10 - Kept the route shared and extended its Gundam branch instead of
  introducing a parallel URL, preserving current navigation and analytics.
