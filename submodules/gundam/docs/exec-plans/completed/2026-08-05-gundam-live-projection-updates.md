# Gundam Live Projection Updates

**Status**: complete
**Owner**: Codex
**Started**: 2026-08-05
**Completed**: 2026-08-05

## Goal

Make server-authoritative Gundam matches apply every privacy-filtered gateway
snapshot without a page refresh, while making it impossible for the live
renderer to accept a raw replay snapshot containing hidden card identities.

## Scope

- In scope: the Gundam live-message reducer, projection hydration boundary,
  replay/live constructor split, focused privacy and update tests, and local
  browser proof.
- Out of scope: game rules, card behavior, shared gateway wire shapes,
  production deployment, and compatibility aliases for the old mixed API.

## Approach

- Decode `FilteredMatchView` at the Gundam live boundary and reject raw
  `{ G, ctx }` engine snapshots there.
- Give live projection hydration and replay snapshot hydration distinct typed
  entry points, sharing only private renderer construction helpers.
- Carry validated projections through `LiveMatchView`, apply them to the
  existing runtime on every accepted gateway update, and fail closed with a
  bounded resync request plus a sanitized diagnostic for invalid payloads.
- Cover the real server projection shape through the reducer and renderer,
  including hidden opponent cards and state-version advancement.

## Verification

- 31 focused live-message, live-state, live-page, privacy, replay-hydration,
  and token-projection tests pass.
- A rendered integration test proves a projected priority update changes the
  mounted board without remounting or refreshing.
- Local browser smoke proof advanced the main-phase fixture to Turn 2 with no
  browser console errors.
- Changed files pass focused formatting and TypeScript reports no diagnostics
  in the changed surface. The package-wide checks remain blocked by unrelated
  existing Cyberpunk, Flesh and Blood, Naruto, and Gundam diagnostics.
- `git diff --check` passes.

## Decision Log

- 2026-08-05 — Keep the shared protocol state opaque and validate it only at
  the Gundam boundary so shared protocol code remains game-agnostic.
- 2026-08-05 — Raw snapshots are replay-only. The live route rejects them even
  though the renderer can technically reconstruct them.
- 2026-08-05 — Invalid live payloads retain the last verified projection and
  use the existing two-second state-sync deduplication window to avoid loops.
- 2026-08-05 — Replay hydration accepts both viewer-safe server projections
  and fully validated legacy raw snapshots; only the latter may carry `ctx`.
