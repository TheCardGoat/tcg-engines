# Star Wars Unlimited Testing

Start with focused engine validation in `packages/engine`.

The card corpus is declarative: `packages/cards/src/cards` owns printed
metadata and typed ability/effect definitions, while `packages/engine/src`
interprets those definitions through commands, target resolution, and effect
execution. Behavior tests should exercise the runtime through real commands
and pending choices, with catalog integrity tests covering static card shape.

Recommended layers:

- Engine Only: targeted tests under `packages/engine/src` for card behavior,
  legality, costs, targeting, combat, and prompt resolution.
- JSDOM: add simulator adapter fixtures after a Star Wars Unlimited simulator
  surface exists.
- Playwright: add user-visible route coverage after the game is mounted in the
  shared simulator or a game-specific app.
