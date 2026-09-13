# Flesh and Blood — jsdom integration POM

Fluent Page Object Model for simulator integration tests, aligned with unit
`FabTestEngine` verbs.

## Files

| File                                     | Role                                                                                                        |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `render-fab-simulator.tsx`               | Renders shipped `FleshAndBloodPracticePage` for a scenario id                                               |
| `fab-simulator-pom.ts`                   | Fluent POM (`as` / `play` / `pitch` / `pass` / `passBoth` / `blockWith` / `life` / `prompt` / `combatStep`) |
| `fab-simulator-pom.integration.test.tsx` | Dual-target + life outcome cases                                                                            |

## Verb parity (unit ↔ integration)

| Unit `FabTestEngine`                | Integration POM                                                           |
| ----------------------------------- | ------------------------------------------------------------------------- |
| `FabTestEngine.start(a, b)`         | `renderFabSimulatorScenario({ scenarioId })` + `await pom.waitForReady()` |
| `game.as(hero)`                     | `game.as("player-1")` / `game.as("player-2")`                             |
| `player.play(card, { target })`     | `await player.play("Snatch", { target: "player-2" })`                     |
| `player.play(card)` (no target)     | `await player.play("Snatch")` → select-attack-target UI                   |
| `player.selectTarget(opp)`          | `await player.selectTarget("player-2")`                                   |
| `player.pitch(card)`                | `await player.pitch(card)`                                                |
| `player.pass()` / `game.passBoth()` | `await player.pass()` / `await game.passBoth()`                           |
| `player.blockWith(card)`            | `await player.blockWith(card)` / `defend`                                 |
| `player.life()`                     | `await player.life()`                                                     |
| `player.hand()` / hand size         | `await player.hand()` / `await player.handCount()`                        |
| `player.zone("graveyard")`          | `await player.zone("graveyard")` / `zoneHas("graveyard", "Snatch")`       |
| `game.combat()?.step`               | `await game.combatStep()`                                                 |
| `game.prompt()`                     | `await game.prompt()` / `hasSelectAttackTargetPrompt()`                   |

Zone/hand readbacks use shipped DOM: `fab-hand-${side}`, seat `[data-zone="…"]`, and face-up card `aria-label`s.

Rules stay in production `FabMatchRuntime`. The POM only clicks match-actions
testids and reads board attributes.

## Run

```bash
pnpm --dir submodules/agnostic-simulator/apps/multi-game-simulator exec vp test run \
  src/games/flesh-and-blood/testing/fab-simulator-pom.integration.test.tsx
```

Scenario under test: `dual-target-open` (Snatch WTR167 stats + hit→draw ability,
opponent pass-only bot).
