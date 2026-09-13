# FAB Test Harness — API Cheatsheet

A **map, not the territory**. Use this to find the right surface fast, then open the
source file for the current, exact signature. Source of truth lives in
`packages/engine/src/testing/`.

Public entrypoint: `@tcg/flesh-and-blood-engine/testing`
(re-exports `test-engine`, `test-fixtures`, `play-options`, `harness-config`,
`card-ref`, `player-fluent`, `fluent-assert`, `intent`, `rules-aaa`, wait-state).

## Start a game

```ts
FabTestEngine.start(playerA, playerB, config?)
```

- `playerA` / `playerB`: `FabPlayerSetup` objects (see `test-fixtures.ts` for the full
  type). Commonly used fields observed in real tests:
  `hero`, `hand`, `deck`, `life`, `resourcePoints`, `head`, `chest`, `arms`, `legs`,
  `weapon1`, `weapon2`, `arsenal`, `graveyard`, `banished`, `soul`, `inventory`,
  and `arena`.
- Returns a `FabTestEngine`. Get a player handle with `game.as(heroCard)`.
- Omitted `hand` (or `hand: "filler"`) seats **DEFAULT_HAND** — the legacy
  4-card Browbeat / Enlightened Strike dummy hand. Write `hand: []` explicitly
  when you need an empty hand (the empty-hand RP default is 3).
- Array `deck` and `deckTop` are bottom-first: the last entry is the top card and
  therefore the first drawn. Prefer `deckTop` when only the top cards matter.

## Harness config (3rd arg) — `harness-config.ts`

All optional; smart defaults are **ON**.

| Field              | Default        | Opt out when…                                                            |
| ------------------ | -------------- | ------------------------------------------------------------------------ |
| `autoPitch`        | `true`         | You test payment selection / need a specific pitch.                      |
| `autoPassPriority` | `true`         | You test priority timing (only passes when no non-pass action is legal). |
| `pitchStack`       | `"as-pitched"` | You test CR 4.4.3c end-turn pitch order — use `"manual"`.                |

Manual preset used across suites — import `FAB_MANUAL_HARNESS` from the public
barrel (same shape as `{ autoPassPriority: false, autoPitch: false, pitchStack: "manual" }`).

## Player handle — `game.as(hero)` (`test-engine.ts`)

| Verb / property                                                                                                   | Purpose                                                                                                                                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `.id`                                                                                                             | The player's id (use as `target`).                                                                                                                                                                                             |
| `.playAttack(card, opts?)`                                                                                        | Play an attack; stop at Defend. `{ stopAt: "on-attack" }` leaves the on-attack decision. Does **not** invent targets or decline optionals.                                                                                     |
| `.activateAttack(card, opts?)`                                                                                    | Activate a weapon and drain to Defend (same stop policy as `playAttack`).                                                                                                                                                      |
| `.attackWith(card, opts?)`                                                                                        | **Legacy.** Same as play-to-Defend but auto-declines optionals and auto-picks the first entity-target (often self). Prefer `playAttack`.                                                                                       |
| `.play(card, opts?)`                                                                                              | Play a non-attack/aura/item from hand.                                                                                                                                                                                         |
| `.defendWith(...cards)`                                                                                           | Declare blockers (rest args **or** one array). Call with no args to decline.                                                                                                                                                   |
| `.blockWith(...cards)`                                                                                            | Alias of `defendWith`.                                                                                                                                                                                                         |
| `.activate(card, opts?)`                                                                                          | Activate a permanent/hero/equipment ability (does **not** advance to Defend).                                                                                                                                                  |
| `.decline()` / `.accept()`                                                                                        | Answer a pending optional boolean or pay/decline option.                                                                                                                                                                       |
| `.choose(nameOrId)`                                                                                               | Closed-list `option` / `effect-resolution` by printed name or id; unique id/label substring if exact misses.                                                                                                                   |
| `.target(...cardsOrPlayers, opts?)`                                                                               | Player intent: name the parameter. Empty `.target()` is choose-none (up-to / min=0). Determined (CR 1.8.6c) is a no-op. Default identity `"attack"` prefers a live attack-proxy; `{ identity: "source" }` forces the original. |
| `.pass()` / `.endTurn()` / `.concede()`                                                                           | Priority / turn / game end.                                                                                                                                                                                                    |
| `.life()`                                                                                                         | Current life.                                                                                                                                                                                                                  |
| `.isMarked()` / `.activeContract()` / `.diplomacyChoice()` / `.hasChargedThisTurn()` / `.hasCrowdBooedThisTurn()` | CR-visible player flags (prefer fluent asserts).                                                                                                                                                                               |
| `.zone(zone)`                                                                                                     | Instance ids in a zone (`"hand"`, `"graveyard"`, …).                                                                                                                                                                           |
| `.findCardInZone(zone, card)`                                                                                     | Resolve a card ref to its instance id in a zone.                                                                                                                                                                               |
| `.hasPriority()`                                                                                                  | True when this player holds priority.                                                                                                                                                                                          |
| `.chooseNumeric(n)`                                                                                               | Answer a pending numeric prompt; throws outside `[min, max]`.                                                                                                                                                                  |
| `.must`                                                                                                           | Chainable fluent surface (see below).                                                                                                                                                                                          |

### Chainable `.must` surface — `player-fluent.ts`

```ts
game.as(bravo).must.pitch(heartOfFyendal).playAttack(snatchRed);
```

`playAttack` / `play` / `playInstant` / `playReaction` / `playFromArsenal` /
`defend(...cards)` / `pitch(...cards)` / `activate(card)` / `passPriority()` /
`endTurn()` / `concede()`. Each play verb returns `{ instanceId, canonicalId, and }`
so you can chain follow-up assertions/acts.

## Engine-level — `FabTestEngine`

| Surface                                                                | Purpose                                                                                                             |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `game.getState()`                                                      | Raw match state. Kernel/serialization/contract tests only; forbidden as proof in card behavior and play-line tests. |
| `game.combat()`                                                        | Public combat view for interaction control. In gameplay assertions use `expectCombat(game)`.                        |
| `game.waitState()`                                                     | Public wait-state for bounded interaction control. In gameplay assertions use `expectWait(game)`.                   |
| `game.lastDieFace()`                                                   | Last committed die face (`roll`, else `roll-request` `roll-result`). Throws if none.                                |
| `game.advanceUntil({ stopAt })`                                        | One drain: `"on-attack"` / `"defend"` / `"reaction"` / `"combat-close"` / `"idle"`.                                 |
| `game.toReaction("attacker" \| "defender")`                            | Advance to the reaction step.                                                                                       |
| `game.closeCombat({ optionals? })`                                     | Close the open chain. Optionals throw unless `optionals: "decline" \| "accept"`.                                    |
| `game.untilIdle({ optionals?, ordering? })`                            | Action-phase idle (no combat, empty stack).                                                                         |
| `game.getRuntime()`                                                    | The match runtime (for `listLegalCommands`, etc.).                                                                  |
| `game.advanceCombatTo(step)`                                           | **Legacy** pass loop to a named step. Prefer `advanceUntil` / `toReaction`.                                         |
| `game.pass(playerId)` / `game.passBoth()`                              | Explicit priority passes.                                                                                           |
| `game.exec({ move, actorId, payload })`                                | Low-level dispatch (e.g. `answer-decision`).                                                                        |
| `game.objectLife(id)` / `game.committedEvents()` / `game.playerLogs()` | Inspection helpers.                                                                                                 |

### `game.helpers.*`

| Helper                                                           | Purpose                                                                                                       |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `.attackToDefend(attacker, card, defender?, opts?)`              | Legacy play-to-Defend (same auto-answers as `attackWith`). Prefer `playAttack`.                               |
| `.toReaction(as?)` / `.closeCombat(opts?)` / `.untilIdle(opts?)` | Intent drains (same as `game.toReaction` / `closeCombat` / `untilIdle`).                                      |
| `.resolveUntilIdle(opts?)`                                       | Legacy pass/answer until idle. `optionalBoolean` gates reload **and** auto-passes combat. Prefer `untilIdle`. |
| `.resolveRestOfCombat()`                                         | Legacy close from Defend. Prefer `closeCombat`.                                                               |
| `.passPriorityTo(player)`                                        | Pass public priority until the named player holds it; fail if that cannot be reached.                         |
| `.expectStep(step)`                                              | Assert the current combat step.                                                                               |

## Fluent asserts — `fluent-assert.ts`

Import from the public barrel: `expectFabPlayer`, `expectFabCard`, `expectCombat`, `expectFabToken`, `expectWait`.

| Assertion                    | Methods                                                                                                                                                                                                                                                                                                                                                              |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `expectFabPlayer(h)`         | `.toHaveLife(n)` `.toHaveHandCount(n)` `.toHaveResourceCount(n)` `.toHaveAP(n)` `.toBeActive()` `.toHaveTokenCount(slug, n)` `.toBeMarked()` / `.notToBeMarked()` `.toHaveActiveContract(text\|null)` `.toHaveDiplomacyChoice(...)` `.toHaveChargedThisTurn()` `.toHaveCrowdBooedThisTurn()`                                                                         |
| `expectFabCard(h, card)`     | `.toBeIn(zone)` `.toBeBanished()` `.toHaveCounters(n, name?)` `.toHaveDefenseCounters(n)` `.toHavePower(n)` `.toHaveCost(n)` `.toHaveColor("Red"\|"Yellow"\|"Blue"\|null)` `.toHaveKeyword(kw)` `.notToHaveKeyword(kw)` `.toBeFaceDown()` `.toBeTapped()` `.toBeReady()` `.toBeFrozen()` / `.notToBeFrozen()` `.toHaveSupertype(name)` / `.notToHaveSupertype(name)` |
| `expectCombat(game)`         | `.toBeOpen()` `.toBeClosed()` `.toBeAtStep(step)` `.toHaveAttackPower(n)` `.toHaveKeyword(kw)` `.notToHaveKeyword(kw)` `.toHaveAttackSupertype(name)` / `.notToHaveAttackSupertype(name)` `.toHaveClashWinner(player)`                                                                                                                                               |
| `expectWait(game)`           | `.toBeIdle()` `.toHaveDecision(kind)` — never compare `getState().decision`                                                                                                                                                                                                                                                                                          |
| `expectFabToken(game, slug)` | `.toHaveCount(n)` `.toBeIn(zone)` — created tokens are `token:<slug>`, not the catalog module                                                                                                                                                                                                                                                                        |

There is no `expectFabCombat` alias — use `expectCombat`.

## Composite flows — `rules-aaa.ts`

These helpers are exported from `@tcg/flesh-and-blood-engine/testing`. They are
sugar over the fluent layer and production moves; open `rules-aaa.ts` before use
because several flows exist for older suites and may dispatch at a lower level.

| Flow                                                     | Purpose                                                                      |
| -------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `attackToDefend(game, attacker, card, defender?, opts?)` | Attack layer → defend.                                                       |
| `resolveRestOfCombat(game)`                              | Close combat.                                                                |
| `advanceToStep(game, step)` / `expectStep(game, step)`   | Step control/verify.                                                         |
| `playCostedAttackToDefend(game, card, opts?)`            | Attack + auto-pitch Nimblism Blues for cost.                                 |
| `playResolve(game, card, opts?)`                         | Non-attack/instant play + pass stack; seeds RP if needed.                    |
| `activateFirst(game, player, card, extra?)`              | Find + exec first legal `activate`.                                          |
| `advanceCombatToReaction(game, att?, def?)`              | Advance to reaction step (attacker priority).                                |
| `advanceToReactionAsDefender(game, att?, def?)`          | As above, then pass so **defender** has priority (for defense reactions).    |
| `playDefenseReaction(game, card, opts?)`                 | Play a DR during the reaction step.                                          |
| `playAttackReaction(game, card, opts?)`                  | Play an AR during the reaction step.                                         |
| `fragmentOnce(game, defender?)`                          | Defend with one Nimblism Blue (OMN Fragment fires once).                     |
| `seedPitchedPower6(game, hero?)`                         | Seed the "pitched a card with {p}≥6 this turn" flag (sanctioned state seed). |
| `arenaHas / arenaCount / zoneHas(...)`                   | Rule-visible arena/zone queries.                                             |
