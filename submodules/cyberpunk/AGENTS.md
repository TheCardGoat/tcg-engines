# Cyberpunk

Owns game rules, cards, engine behavior, and import tools. For rules-facing
work, use `.agents/skills/cyberpunk-tcg-rules/SKILL.md`.

- `packages/engine/src`: moves, prompts, targeting, and automation.
- `packages/cards/src` and `packages/types/src`: definitions and native types.
- `tools/parser`, `tools/scraper`, `tools/ai-runner`: import and automation tools.
- Browser UI: `../agnostic-simulator/apps/multi-game-simulator/src/games/cyberpunk`.
- `packages/server-adapter` is legacy/local; confirm the active adapter before
  changing platform integration.

For selectors, costs, conditions, counts, and event filters, follow
[shared rule ownership](docs/shared-rule-authoring.md). Preserve the distinction
between current state and state at the time of an event.

Deck-builder practice uses `/cyberpunk/simulator/play/practice?source=card-db`
and `cyberpunk.deck.import.v1`. It is local practice; hosted-match post-game
actions do not apply.

For bot improvement, use `.agents/skills/self-improve-bot/SKILL.md`. Browser
proof needs inspection of the board and interactions; autoplay alone is not
UI proof. Verify hosted runtime behavior separately when that boundary changes.
