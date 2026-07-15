# Cyberpunk TCG Submodule

Production surfaces:

- Platform pages: `https://tcg.online/cyberpunk/*`
- Mounted simulator: `https://tcg.online/cyberpunk/simulator`

Load `.agents/skills/cyberpunk-tcg-rules/SKILL.md` before changing gameplay,
card text, prompts, rules-facing UI or tests, AI, or balance. Treat the rules
source selected by that skill as authoritative unless the repository documents
an intentional divergence.

Keep Cyberpunk rules, cards, engine semantics, and native wording here. Expose
runtime and browser behavior through `../agnostic-simulator` adapters and
contracts.

## Where To Look

- `packages/engine/src` - moves, prompts, targeting, automation, and gameplay.
- `packages/cards/src` - card definitions and generated exports.
- `packages/types/src` - Cyberpunk card and game types.
- `packages/server-adapter/src` - legacy/local adapter code; confirm the active
  platform adapter before editing runtime integration.
- `../agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk` -
  current browser simulator and practice/match routes.
- `tools/parser`, `tools/scraper`, `tools/ai-runner` - ingestion and automation.

## Deck-Builder Practice

The platform deck-builder embeds
`/cyberpunk/simulator/play/practice?source=card-db` and imports the deck through
`cyberpunk.deck.import.v1`. This is a local practice surface, not a hosted
match; post-game behavior must not assume analytics, rematch, or matchmaking
return actions.

## Focused Evidence

- Browser behavior: focused app test or route, then visible board proof.
- Engine/card legality: focused engine or card test using local rules terms.
- Bot/automation: use `.agents/skills/self-improve-bot/SKILL.md` and its
  documented runner or strategy gate.
- Live match/matchmaking: prove platform gateway/game-server behavior
  separately from engine or browser behavior.

Do not use blind autoplay as UI proof. Inspect the board, legal actions, logs,
or backend state relevant to the report.

Run focused `vp check`, `vp test`, or `bun test` commands in this workspace;
use `pnpm run ci:cyberpunk:check` from the root after they pass.
