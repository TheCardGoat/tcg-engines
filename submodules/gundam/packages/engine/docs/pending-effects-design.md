# Unified effect resolution via `pendingEffects`

Status: **PR A, PR B, PR C, PR D landed; PR C.5 and PR E in review.** PR C.5 adds the `postActions` hook + migrates `play-command`; PR E deletes `TriggerQueue` + `g.bag`.

## Problem

Before this redesign, effects resolved through four disjoint paths:

| Path                           | Entry points                                                                                     | Notes                                                                           |
| ------------------------------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| `TriggerQueue` (in-memory)     | `deploy-unit`, `deploy-base`, `attack-step`, `resolve-direct` (burst/destroyed), `pilot-pairing` | Synchronous `flush()` inside the triggering move. Deleted in PR E.              |
| `executeCardEffect` inline     | `activate-ability`, `play-command`                                                               | Synchronous, no queue. Migrated in PR C / PR C.5.                               |
| `g.bag: BagItem[]`             | `executor.lookAtTopDeck`, `executor.deployFromTrash`                                             | Narrow; `resolveBag` move never actually consumed these types. Deleted in PR E. |
| `g.turnMetadata.pendingCombat` | `enter-battle`                                                                                   | Combat-specific, not effects. Unchanged.                                        |

Each triggering move owned its own plumbing. Target resolution was also inconsistent: `chosenTargets` on queued triggers vs. `input.args.targets` on moves. No single state field represented "effects waiting to resolve", which made the Section 10 rules (esp. 10-1-6-5/6/7/8) impossible to enforce uniformly.

## Target design

Single queue `g.pendingEffects: PendingEffect[]` replaces both `g.bag` and the in-memory `TriggerQueue`. Triggering moves **enqueue, never execute**. An engine-level drain at every flow transition auto-resolves effects with no player choice; effects that require a choice halt the flow until the controller submits a `resolveEffect` move.

```ts
interface PendingEffect {
  id: string;
  controllerId: PlayerId; // whose decisions drive resolution
  sourceCardId: string;
  effect: CardEffect; // triggered | activated | command
  effectIndex: number;
  kind: "burst" | "triggered" | "activated" | "command";
  trigger?: { type: string; [k: string]: unknown };
  chosenTargets?: readonly string[]; // pre-committed by the move, or filled by resolveEffect
}
```

**Priority ordering** (rule 10-1-6-8 → 10-1-6-6 → 10-1-6-5):

| Tier | Contents                                                  |
| ---- | --------------------------------------------------------- |
| 0    | `kind: "burst"`                                           |
| 1    | `kind: "triggered"` where `controllerId === activePlayer` |
| 2    | `kind: "triggered"` where `controllerId !== activePlayer` |
| 3    | `kind: "activated"` / `"command"` (arrival order)         |

Within a tier: stable sort preserves insertion order. **A new effect that triggers mid-resolution** (rule 10-1-6-7) is inserted at the **front** via `enqueuePendingEffect(g, entry, { preempt: true })`; the current directive completes first, then the preempting effect resolves next.

### Auto-resolve heuristic

`requiresPlayerChoice(pe)` returns true iff:

- any directive is `optional: true` ("you may" — rule 10-1-3), or
- any directive's action has a `target` filter with `owner !== "self"` and `pe.chosenTargets` is not yet set.

The drain resolves heads that return false; otherwise it halts and waits for a `resolveEffect` move.

## What shipped in PR A

| File                                     | Change                                                                                                                                             |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `types/flow-types.ts`                    | `FlowDefinition.onTransitionCheck?: (ctx) => boolean`                                                                                              |
| `runtime/match-runtime.flow.ts`          | `resolveOneTransition` calls `onTransitionCheck` first; if it returns `true`, loop restarts                                                        |
| `gundam/types.ts`                        | `PendingEffect` type, `GundamG.pendingEffects`, `ResolveEffectArgs` / `Input`                                                                      |
| `gundam/config.ts`                       | initializes `pendingEffects: []`                                                                                                                   |
| `gundam/effects/pending-effects.ts`      | `enqueuePendingEffect`, `drainPendingEffects`, `priorityHead` / `priorityHeadIndex`, `requiresPlayerChoice`, `buildExecCtx`, `nextPendingEffectId` |
| `gundam/moves/core/resolve-effect.ts`    | `resolveEffect` move (gated by the drain's activePlayer shift, validates head + controller, executes via `executeCardEffect`)                      |
| `gundam/flow.ts`                         | `onTransitionCheck: drainPendingEffects` wired; `resolveEffect` added to every step's `validMoves`                                                 |
| `gundam/testing/test-engine.ts`          | `PlayerActions.resolveEffect()` helper                                                                                                             |
| `gundam/effects/pending-effects.test.ts` | 7 tests covering auto-drain, player-choice halt, tier ordering                                                                                     |

No existing code enqueues to `pendingEffects` yet. The queue is empty during every existing test; no behavior change.

## PR B — migrate `deploy-unit` / `deploy-base` [LANDED]

Replaced inline `TriggerQueue.publishDirect + publish + flush` with enqueue. Added `enqueueOwnCardTriggers` and `enqueueObserverTriggers` helpers in `effects/pending-effects.ts`; both moves now call:

```ts
const event = { type: "unitDeployed" | "baseDeployed", cardId, playerId };
enqueueOwnCardTriggers(g, event, cardId, playerId, framework, { chosenTargets: targets });
enqueueObserverTriggers(g, event, framework);
```

and return. All 103 existing tests (including observer-trigger coverage in `deploy-unit-rules.test.ts`) pass without modification.

Original sketch for reference:

```ts
// deploy-unit.ts — execute() (sketch)
// BEFORE:
const queue = new TriggerQueue({ G, framework, activePlayerId });
for (const effect of ownEffects) queue.publishDirect(..., chosenTargets);
queue.publish({ type: "unitDeployed", ... });
queue.flush();

// AFTER:
// 1. Own-card Deploy triggers
for (const [i, effect] of attackerDef.effects.entries() ?? []) {
  if (matchesTiming(effect, "deploy")) {
    enqueuePendingEffect(g, {
      id: nextPendingEffectId(),
      controllerId: playerId,
      sourceCardId: cardId,
      effect,
      effectIndex: i,
      kind: "triggered",
      trigger: { type: "unitDeployed", cardId, playerId },
      chosenTargets: validatedTargets,   // pre-chosen at play-time per rule 10-1-8-1-1
    });
  }
}
// 2. Observer scan: extract existing TriggerQueue.getCardsToScan logic into
//    a helper `enqueueObserverTriggers(g, event, framework, kind: "triggered")`
//    that iterates in-play cards and enqueues matching effects with
//    chosenTargets: undefined (those need the controller's selection).
enqueueObserverTriggers(g, { type: "unitDeployed", cardId, playerId }, framework);
// Move returns. Flow engine auto-drains no-choice effects, halts on choice effects.
```

Existing tests continue to pass: `deploy-unit` already pre-validates targets at play-time (`validateEffectTargets`), so the resulting `PendingEffect` ships with `chosenTargets` set and auto-drains immediately. Observer triggers without targets also auto-drain.

## PR C — migrate `activate-ability` [LANDED]

`activate-ability` now pushes `kind: "activated"` with `chosenTargets: input.args.targets`. The ability's cost (rest self, pay resources, discard, rest friendly units) is paid synchronously inside the move — cost is not an effect. `ABILITY_ACTIVATED` and the `resetActionStepOnAction` call stay inline because they belong to the _activation_, not the resolution.

### PR C.5 — `postActions` hook + play-command [IN REVIEW]

Added a `postActions?: readonly PostResolveAction[]` field on `PendingEffect`. Data, not callbacks, so queue entries stay serializable across clients / replays. Two action kinds for now: `moveToTrash` and `emitEvent`.

`drainPendingEffects` and `resolveEffect.execute` call `runPostActions(pending.postActions, ctx)` immediately after `executeCardEffect`. Order is: effect body → post-actions in declared order.

`play-command` now enqueues:

```ts
enqueuePendingEffect(g, {
  ...,
  kind: "command",
  chosenTargets: targets,
  postActions: [
    { kind: "moveToTrash", cardId, playerId: ownerId },
    { kind: "emitEvent", event: { kind: "COMMAND_PLAYED", payload: { cardId, playerId } } },
  ],
});
```

The move no longer calls `executeCardEffect`, `moveCard(→ trash)`, or emits `COMMAND_PLAYED` inline. Rule 3-4-3 (card stays in `removalArea` during resolution) and rule 3-4-4 (trash after) fall out naturally because `postActions` fire between effect completion and the next drain iteration. `COMMAND_REVEALED`, cost payment, and the `removalArea` move stay inline because they precede effect resolution.

Sketch:

```ts
type PostResolveAction =
  | { kind: "moveToTrash"; cardId: string; playerId: string }
  | { kind: "emitEvent"; event: GundamDomainEvent };

// play-command execute:
framework.zones.moveCard(cardId, { zone: "removalArea" });
enqueuePendingEffect(g, {
  ...,
  kind: "command",
  chosenTargets: targets,
  postActions: [
    { kind: "moveToTrash", cardId, playerId: ownerId },
    { kind: "emitEvent", event: { kind: "COMMAND_PLAYED", payload: { cardId, playerId } } },
  ],
});
// Do NOT move to trash or emit COMMAND_PLAYED here.
```

The drain runs `executeCardEffect`, then iterates `postActions` in order. PR C.5 will implement the hook and migrate `play-command`.

## PR D — migrate attack-step, shield-destroy, unit-destroy [IN REVIEW]

- `attack-step.ts` (attack triggers — rule 8-2-2): own-card + observer enqueue for the `attackDeclared` event. Drains inline immediately so the rule 8-2-4 `isCombatBroken` check sees post-trigger state; halted queue entries (activated/command that need choice — no triggered effects hit this branch) stop the flow via `onTransitionCheck` on the next iteration.
- `resolve-direct.ts` shield burst (rule 8-5-2-3-1): one `enqueueOwnCardTriggers` call per removed shield. Two-shield Suppression (rule 13-1-7-4) falls out naturally — each shield enqueues independently at tier 0 (burst).
- `resolve-direct.ts` base-destroyed + `effects/handlers/combat.ts` `handleUnitDefeated`: `unitDestroyed` event via `enqueueOwnCardTriggers` before moving the card to trash (rule 10-1-6-4 permits the trigger to activate even after the card leaves). No observer scan (mirrors legacy TriggerQueue which returned empty for destroy events).

### requiresPlayerChoice tightening by kind

`requiresPlayerChoice` now halts only for `kind: "activated"` / `"command"` when targets are unresolved (they have an `input.args.targets` channel on their move), plus any effect with `optional: true`. `kind: "triggered"` / `"burst"` effects auto-pick candidates (matches legacy TriggerQueue/executor). Triggered/burst effects are fired by the engine, not the player — halting on "please pick a target" would deadlock the attack step because there's no move to supply chosenTargets mid-trigger.

Future PR can tighten this to rule-strict "choose at activation" (rule 10-3-3) per trigger type, paired with a player-input channel for mid-trigger target selection.

## PR E — delete `TriggerQueue` + `g.bag` [IN REVIEW]

- Migrate `pilot-pairing.executePilotPairing` (WhenPaired / WhenLinked triggers on the unit) onto `enqueueOwnCardTriggers`. This was the last `TriggerQueue` consumer — pending `pilotPaired` triggers now auto-drain via `onTransitionCheck`.
- `lookAtTopDeck` / `deployFromTrash` executor cases previously pushed `BagItem`s that no resolver ever consumed (dead code). Dropped the push and left a TODO — implementing either action end-to-end is follow-up work. The design doc originally promised enqueueing them as interactive `kind: "activated"` pending effects; that remains the intended shape.
- Delete `g.bag`, `BagItem`, `ResolveBagArgs` / `ResolveBagInput`, and `moves/core/resolve-bag.ts`. Remove `resolveBag` from the move registry and `main-phase` valid moves.
- Delete `effects/trigger-queue.ts` and drop its re-exports from `gundam/index.ts`. All of its logic now lives in `pending-effects.ts` + the observer-scan helper.
- Rename `projectGundamBoardView.bagCount` → `pendingEffectCount` (external API break — no existing callers in this repo).

## PR F — player-choice UX (optional, deferred)

The foundation permits these features without further engine changes:

- **Rule 10-1-6-5** (within-controller ordering): reintroduce a `pendingEffectId` arg on `ResolveEffectArgs`, restricted by `resolveEffect.validate` to entries at the current minimal tier (and owned by `playerId`). PR A intentionally resolves only the `priorityHead` to avoid exposing an API that could bypass priority.
- **Rule 10-1-6-8 / 13-1-7-4** (burst resolution order): same `pendingEffectId` mechanism — multiple tier-0 bursts owned by one player can be picked in any order by that player.
- **"You may" prompt** (rule 10-1-3): extend `ResolveEffectArgs` with an `optionalChoices` map; `executor.executeAction` skips directives whose `optional: true` flag was answered "no".

## Out of scope

- **Substitution effects (rule 10-1-9)** — don't fit the queue model; closer to middleware on action handlers. Separate design.
- **Constant effects (rule 10-1-5)** — passive, already evaluated by `derived-state.getEffectiveStats`. Not queued.

## Rule coverage matrix

| Rule                                             | Implementation                                                                                                               |
| ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| 10-1-6-5 (within-controller order)               | Deferred to PR F; foundation resolves priority head only                                                                     |
| 10-1-6-6 (active player first)                   | Tier 1 vs tier 2 in `priorityHeadIndex`                                                                                      |
| 10-1-6-7 (new trigger preempts)                  | `enqueuePendingEffect(.., { preempt: true })` inserts at front; drain runs at every transition                               |
| 10-1-6-8 (Burst priority)                        | Tier 0                                                                                                                       |
| 10-1-6-8-1 (Burst-during-Burst)                  | Same mechanism — new Burst preempts inside tier 0                                                                            |
| 10-1-8-1-1 (command targets chosen at play time) | Triggering move pre-validates and ships `chosenTargets`                                                                      |
| 10-3-3-1 (target unavailable → no activation)    | Triggering move refuses to enqueue; or `resolveEffect.validate` fails if `chosenTargets` don't match the filter (needs PR D) |
