# Gundam Deck Builder Workbench

**Status**: completed
**Owner**: Codex
**Started**: 2026-07-11
**Completed**: 2026-07-11

## Goal

Turn the Gundam deck builder tabs into a complete analysis and practice
workbench. Players should understand their deck's construction, evaluate
sample hands and draw horizons, launch a real practice game without leaving
the page, and inspect available market information with transparent affiliate
links.

## Scope

- In scope: richer Stats and Draw tabs, tested hand-quality heuristics and
  probability calculations, an embedded legal-deck practice simulator, a new
  Market tab, responsive tab navigation, localization, and browser proof.
- Out of scope: inventing market prices, changing Gundam gameplay rules,
  collection-based missing-card calculations, or adding a new simulator
  protocol when the existing practice deck URL can carry the deck.

## Approach

- Centralize deck distributions, draw probabilities, and playtest scoring in a
  pure web analysis module with focused tests.
- Keep legality authoritative and separate from playtest advice. The quality
  score is a visible heuristic based on early cards, Unit access, role mix,
  and high-level concentration.
- Reuse the Gundam simulator's base64url deck payload on its practice route and
  expose both embedded and full-screen play.
- Show only prices present on card data. Market links use the existing
  TCGplayer affiliate redirect and include a clear commission disclosure.

## Verification

- Focused analysis, simulator URL, affiliate-link, and SSR component suites:
  17 passing tests across four files.
- Paraglide compilation passed. Changed-file Svelte diagnostics were clean.
- Production web build passed with an 8 GB Node heap.
- The local Docker simulator practice route returned HTTP 200 on port 5182,
  and the URL helper test confirms local development pages target that route.
- Live in-app browser interaction could not be completed in this turn because
  the browser URL policy rejected access to the open `127.0.0.1` tab. The
  component SSR tests cover rendered controls and URLs, but visual desktop and
  mobile proof should be rerun when that browser connection is permitted.

## Open questions

- Resource decks containing multiple Resource designs remain editable, but
  embedded practice follows the current engine payload contract and asks for
  one 10-card Resource entry.

## Decision log

- 2026-07-11 - Treat opening-hand quality as coaching, not a rules ruling.
  Gundam rules define a five-card starting hand and one optional full redraw;
  they do not define a universal quality score.
- 2026-07-11 - Reuse the simulator's existing encoded `deck` query contract
  instead of introducing a second iframe messaging protocol.
