# Cyberpunk TCG Submodule

Production entry points:

- Platform pages: `https://tcg.online/cyberpunk/*`
- Mounted simulator: `https://tcg.online/cyberpunk/simulator`

Always load the `cyberpunk-tcg-rules` skill at
`.agents/skills/cyberpunk-tcg-rules/SKILL.md` before changing gameplay logic,
card text, simulator prompts, rules-facing UI copy, tests, AI, or balance.
Treat `https://cyberpunktcg.com/gameplay-guide` as the current alpha rules
source unless the repo documents an intentional divergence.

Platform runtime or shared simulator exposure should map Cyberpunk concepts
through `../agnostic-simulator` contracts/adapters. Keep Cyberpunk rules, cards,
engine semantics, and glossary-native wording inside this submodule.

## Where To Look

- `packages/engine/src` - rules engine, moves, prompts, targeting, automation,
  and deterministic gameplay behavior.
- `packages/cards/src` - card definitions and generated/exported card data.
- `packages/types/src` - shared Cyberpunk card/game types.
- `packages/server-adapter/src` - adapter used by platform `game-server` and
  `general-api`.
- `../agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk` -
  migrated browser simulator source and practice/match routes.
- `tools/parser`, `tools/scraper`, `tools/ai-runner` - ingestion, generation,
  and automation support.

## Platform Deck-Builder Practice Embed

The platform deck-builder Play tab embeds the mounted simulator in an iframe at
`/cyberpunk/simulator/play/practice?source=card-db` and sends the deck through the
`cyberpunk.deck.import.v1` postMessage bridge. Treat this as a local
deck-builder practice surface, not a hosted match: post-game UI should use the
`deck-builder-practice` surface and must not assume match-history analytics,
rematch, or matchmaking return actions are available.

## Bug Triage

- Production navigation/deck/community bugs usually start in
  `../platform/apps/web/src/lib/games/cyberpunk` or platform routes, then cross
  into this submodule if the simulator payload or card data is wrong.
- Runtime matchmaking or live-match bugs cross three layers: platform
  `apps/gateway`, platform `apps/game-server`, then
  `packages/server-adapter`/`packages/engine`.
- Player-visible simulator bugs should be validated in
  `../agnostic-simulator/apps/multi-game-simulator` with a focused test or
  browser route. If a built package feeds platform, rebuild or repack before
  trusting stale localhost behavior.

## Agent Backpressure Gates

Use the root `/backpressured` command for long-running Cyberpunk work. Load the
`cyberpunk-tcg-rules` skill before rules-facing edits.

- Simulator/UI behavior: focused app test or route proof, then browser
  inspection of the visible board or interaction.
- Engine legality or card behavior: focused engine/card test first, using
  rules terminology from the local skill.
- Bot or automation changes: use `.agents/skills/self-improve-bot/SKILL.md`
  and validate with the documented AI-runner or strategy command.
- Platform live-match/matchmaking: prove the platform gateway/game-server path
  separately from the Cyberpunk engine or simulator path.

Do not use blind autoplay scripts as proof for UI readiness. Inspect the board,
legal actions, logs, backend state, or Redis state that the report depends on.

## Validation

- From this submodule: `vp check`, `vp test`, focused `bun test`, or
  `pnpm run ci-check` depending on the package touched.
- From repo root: `bun run ci:cyberpunk:check`.

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.

<!--VITE PLUS END-->
