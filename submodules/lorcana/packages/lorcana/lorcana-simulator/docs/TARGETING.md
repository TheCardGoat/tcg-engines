# Targeting: How `lorcana-simulator` Handles Targets for `lorcana-engine` Effects and Triggers

Audience: AI agents implementing or fixing Lorcana cards, debugging target-selection UI, or extending the automation planner. Read this before touching anything that produces, consumes, or validates a target.

All paths are repo-relative. Line numbers reflect state on `feat/slotted-targets-engine-and-sim-updates` (2026-04-22) — re-grep if they look off.

---

## 1. TL;DR

```
 ┌─────────────────────────┐   ┌──────────────────────────────┐
 │ 1. Engine analyzes      │   │ 2. Engine publishes a        │
 │    the effect's targets │──▶│    ResolutionSelectionContext│
 │    (analyzeEffectTargets│   │    on board.pendingChoice    │
 └─────────────────────────┘   └──────────────┬───────────────┘
                                              │
                ┌─────────────────────────────┼───────────────────────────────┐
                ▼                                                             ▼
 ┌──────────────────────────────┐                       ┌──────────────────────────────────┐
 │ 3a. Simulator UI renders a   │                       │ 3b. Automation planner enumerates│
 │     prompt (slotted or flat) │                       │     & scores target combinations │
 │     → player picks           │                       │     → picks best                 │
 └──────────────┬───────────────┘                       └──────────────┬───────────────────┘
                │                                                      │
                └──────────────────────────┬───────────────────────────┘
                                           ▼
                          ┌────────────────────────────────────┐
                          │ 4. engine.dispatch(moveId, params) │
                          │    with flat CardInstanceId[] OR   │
                          │    SlottedTargetInput              │
                          │    → engine validates + applies    │
                          └────────────────────────────────────┘
```

Triggered abilities go through exactly the same pipeline — the engine fires the trigger, builds a `ResolutionSelectionContext` identical in shape to an active move, and the simulator/planner respond the same way. **Do not write a separate target path for triggers.**

---

## 2. Layer 1 — Engine analyzes target requirements

`analyzeEffectTargets()` is the authoritative entry point for "what can legally be picked?".

- File: [`packages/lorcana/lorcana-engine/src/targeting/runtime/target-analysis.ts`](../../../../lorcana-engine/src/targeting/runtime/target-analysis.ts) — exported at L1463.
- Re-exported from [`targeting/runtime/index.ts`](../../../../lorcana-engine/src/targeting/runtime/index.ts) and consumed by `resolve-effect.ts` (see L42–48 of [`resolve-effect.ts`](../../../../lorcana-engine/src/runtime-moves/resolution/resolve-effect.ts)).

It returns a `TargetAnalysis` describing:

- Legal card ids (by zone) and legal player ids.
- Allowed zones (`deck | hand | play | discard | inkwell | limbo`).
- `minSelections` / `maxSelections`, `ordered`.
- Forced target constraints (effects that require a specific target).
- Whether the selection can be auto-rejected (no legal targets).

Sibling helpers in the same module that agents commonly need: `validateAndNormalizeTargetSelection`, `countExplicitTargetSelections`, `hasExplicitTargetSelectionInput`, `buildMissingTargetSelectionError`.

---

## 3. Layer 2 — Engine publishes a selection context

The analysis is packaged into a **discriminated** `ResolutionSelectionContext` and exposed via `board.pendingChoice` on the projected board view. The only variant that carries targets is `TargetResolutionSelectionContext`.

File: [`packages/lorcana/lorcana-engine/src/types/resolution-selection.ts`](../../../../lorcana-engine/src/types/resolution-selection.ts) — L89–108.

```ts
export type TargetResolutionSelectionContext = ResolutionSelectionContextBase & {
  kind: "target-selection" | "discard-choice";
  submitField: "targets";
  originatesFromOptional?: boolean;
  canDeclineSelection?: boolean;
  targetDsl: LorcanaTargetDSL[];           // Per-position DSL (owner filter, etc.)
  cardCandidateIds: CardInstanceId[];      // Legal card targets
  playerCandidateIds: PlayerId[];          // Legal player targets (rare)
  allowedZones: ResolutionSelectionZone[];
  minSelections: number;
  maxSelections: number;
  ordered: boolean;
  autoRejected: boolean;                   // true ⇒ no legal targets existed
  expectedSlottedKind?: SlottedTargetKind; // see §6
};
```

Base fields (L52–60) every variant carries: `origin` (`"pending-effect" | "bag"`), `requestId`, `sourceCardId`, `chooserId`, `currentSelection`, `submitField`.

**Note the casing.** The *type* field is `requestId` (lowercase `d`). The *projected board view* surfaces it as `board.pendingChoice?.requestID` (uppercase `ID`) — see [`derived-state.ts:1423`](../src/lib/features/simulator/model/derived-state.ts). They are the same logical id; follow the casing of whichever layer you are in.

Other selection variants (out of scope here but share the same `pendingChoice` slot): `choice-selection`, `optional-selection`, `name-card-selection`, `scry-selection`. If `kind !== "target-selection" && kind !== "discard-choice"`, this document does not apply.

---

## 4. Layer 3a — Simulator UI consumes the context

### 4.1 Orchestrator

`GameContext` ([`context/game-context.svelte.ts`](../src/lib/features/simulator/context/game-context.svelte.ts)) owns all engine interaction:

- Imports `dispatchSimulatorMove` at L117.
- Calls it at L1098 to forward every player action into the engine.
- Reads `board.pendingChoice?.requestID` at L4172 and L4285 to detect an open selection.

### 4.2 Dispatch helper (single chokepoint)

[`model/move-dispatch.ts`](../src/lib/features/simulator/model/move-dispatch.ts:10):

```ts
export function dispatchSimulatorMove<K extends LorcanaSimulatorMoveId>(
  engine: LorcanaEngineBase,
  playerId: string,
  moveId: K,
  params: LorcanaSimulatorMoveParams[K],
): CommandResult {
  return engine.dispatch(moveId, playerId, params as Record<string, unknown>);
}
```

Every move (play card, activate ability, resolve pending effect, resolve bag) flows through this function. Targets ride in `params.targets` as either `CardInstanceId[]` or `SlottedTargetInput`.

### 4.3 Prompt builder

[`model/resolution-target-prompt.ts`](../src/lib/features/simulator/model/resolution-target-prompt.ts) is the only module that translates a `TargetResolutionSelectionContext` into UI state.

Key exports:

| Export | Line | Purpose |
| --- | --- | --- |
| `SupportedResolutionTargetEffectType` | L14 | UI-supported families: `"move-damage" \| "move-to-location" \| "deal-damage"`. |
| `isSupportedResolutionTargetEffectType` | L157 | Type guard before calling the builder. |
| `buildResolutionTargetPromptState` | L167 | Main entry. Builds per-slot state + filtered candidates. |
| `getResolutionTargetPromptMessage` | L253 | Human-readable prompt copy per effect+slot. |
| `buildSlottedTargetsFromSelection` | L295 | Serializes the flat selection into a `SlottedTargetInput`. |

Internal helpers (not exported) worth knowing:

- `buildSlotStates` (L68) — maps `SLOT_LABELS` / `SLOT_CARD_TYPES` to per-slot records, including auto-resolved source slots.
- `buildCandidateEntriesForSlot` — filters `AvailableMovesSelectionEntry[]` by the active slot's card type and enforces `context.targetDsl[slotIndex].owner`.

Auto-resolved slots (e.g. `move-damage` with `from: { ref: "self" }`): when `maxSelections < totalSlots`, slot 0 is pre-filled with `context.sourceCardId` and locked (L193–202). The raw `session.selectedTargets` array does **not** include auto-resolved slots — subtract `autoResolvedFromSlots` when translating visual slot index to storage index.

### 4.4 Pending-resolution move surfacing

The move `resolveEffect` is added to the simulator's legal-move list only when the engine has an open pending choice. See [`derived-state.ts:1407–1432`](../src/lib/features/simulator/model/derived-state.ts):

```ts
if (hasMove(legalMoves, "resolveEffect") && board.pendingChoice?.requestID) {
  entries.push({
    id: `resolveEffect:${board.pendingChoice.requestID}`,
    moveId: "resolveEffect",
    params: { effectId: board.pendingChoice.requestID, params: {} },
  });
}
```

`resolveBag` is added similarly (L1413–1421), one entry per pending bag effect. The actual target payload is filled in by the UI before dispatch.

### 4.5 Tests to read when changing UI behavior

- [`resolution-target-prompt.test.ts`](../src/lib/features/simulator/model/resolution-target-prompt.test.ts) — slot construction, candidate filtering, slotted serialization.
- [`discard-target-dsl.test.ts`](../src/lib/features/simulator/model/discard-target-dsl.test.ts) — discard-choice variant.
- [`derived-state.test.ts`](../src/lib/features/simulator/model/derived-state.test.ts) — move surfacing.

---

## 5. Layer 3b — Automation planner (AI opponent) consumes the context

When the active player is automated, the planner takes the same `TargetResolutionSelectionContext` and submits targets without touching the UI.

### 5.1 Planner

[`packages/lorcana/lorcana-engine/src/automation/planner.ts`](../../../../lorcana-engine/src/automation/planner.ts):

| Function | Line | Purpose |
| --- | --- | --- |
| `prioritizeTargetIds` | 304 | Sort a flat candidate pool by score + deterministic tiebreaker. |
| `prioritizeTargetVariants` | 344 | Sort enumerated combinations. |
| `buildTargetVariants` | 1210 | Enumerate legal combinations under search caps and return the top N. |

Search caps live in [`automation/types.ts`](../../../../lorcana-engine/src/automation/types.ts) — typically `targetPool: 20`, `targetCombinationsPerFamily: 10`. These exist to keep the planner tractable on wide boards; agents adding a new scoring axis should not remove them.

### 5.2 Scoring

[`automation/target-priority.ts`](../../../../lorcana-engine/src/automation/target-priority.ts):

- `scoreAutomatedActionTargets` (L323) — numeric score per combination.
- `getGenericTargetPreference` (~L139) — default role weights for removal / challenge families.

Scoring inputs:

1. **Effect polarity** — [`automation/effect-polarity.ts`:301](../../../../lorcana-engine/src/automation/effect-polarity.ts) — `classifyTargetedStepPolarity(effect)` returns beneficial / harmful / neutral. The sign of every weight flips accordingly (harmful effects want opponents' high-value cards; beneficial effects want your own).
2. **Deck-aware card roles** — tags like `drawEngine`, `mustAnswerThreat`, `evasiveThreat`, `synergyAnchor`, `tempoThreat` from `automation/deck-profile.ts` and `deck-aware-strategy.ts`.
3. **Board state** — lore, strength, damage, exerted status.
4. **Player-level preferences** — `actorPlayerScore` and `opponentPlayerScore` for targeting a player instead of a card.

### 5.3 Slotted handling in the planner

The planner currently submits **flat** candidate arrays; when `expectedSlottedKind` is set, engine-side validation/normalization re-forms the slotted shape via `resolveSlottedTargetInputWith` (see §6). Do not add per-slot candidate generation to the planner unless a new slotted kind has a legal combination space that cannot be expressed as a flat list.

---

## 6. Slotted targets

Slotted targets are **multi-slot** inputs where each slot has its own filter. A single step can ask "pick a character to banish **and** a card to play" — two distinct filters — without the engine losing track of which id goes in which slot.

All types live in [`packages/lorcana/lorcana-engine/src/targeting/slotted-targets.ts`](../../../../lorcana-engine/src/targeting/slotted-targets.ts).

### 6.1 Canonical shape (L15)

```ts
export type SlottedTargetInput =
  | { kind: "move-damage";      from: ReadonlyArray<CardInstanceId>; to: ReadonlyArray<CardInstanceId> }
  | { kind: "move-to-location"; subject: ReadonlyArray<CardInstanceId>; location: ReadonlyArray<CardInstanceId> }
  | { kind: "shift-and-choose"; chosenCard: ReadonlyArray<CardInstanceId> }
  | { kind: "banish-and-play";  banish: ReadonlyArray<CardInstanceId>; play: ReadonlyArray<CardInstanceId> };
```

Supporting constants and helpers in the same file:

- `SlottedTargetKind` (L36) — union of the `kind` strings.
- `SLOTTED_TARGET_KINDS` (L38) — runtime list. Used for `isSlottedTargetInput` dispatch.
- `SLOTTED_TARGET_SLOT_KEYS` (L50) — single source of truth for per-kind slot-key order.
- `isSlottedTargetInput` (L59) / `isSlotted<K>` (L71) — runtime guards.
- `assertNeverSlottedKind` (L78) — the exhaustiveness hammer; adding a new kind without updating every switch is a compile error here.
- `flattenSlottedTargets` (L87) — positional fallback for resolvers that aren't slot-aware yet.
- `slotKeysFor<K>` (L107) — slot-key list for one kind.
- `SlottedTargetInputOf<T>` (L117) — the unresolved form (slots contain `CardInput` rather than resolved ids).
- `resolveSlottedTargetInputWith` (L123) — turns `SlottedTargetInputOf<T>` into `SlottedTargetInput` using a caller-provided resolver.
- `isUnresolvedSlottedTargetInput` (L163) — lets the engine base accept pre-resolution slotted input (e.g. from tests) without widening `isSlottedTargetInput`.

### 6.2 How the engine signals "slotted"

`context.expectedSlottedKind: SlottedTargetKind` on the `TargetResolutionSelectionContext`. When present, the caller **must** submit a `SlottedTargetInput` (or `SlottedTargetInputOf<T>` in tests) of that kind. When absent, targets are a flat array.

### 6.3 How the simulator serializes

[`buildSlottedTargetsFromSelection(kind, selected)`](../src/lib/features/simulator/model/resolution-target-prompt.ts:295):

```ts
export function buildSlottedTargetsFromSelection(
  kind: SlottedTargetKind,
  selected: readonly string[],
): SlottedTargetInput {
  const at = (i: number) => (selected[i] ? [selected[i] as CardInstanceId] : []);
  switch (kind) {
    case "move-damage":      return { kind, from: at(0), to: at(1) };
    case "move-to-location": return { kind, subject: at(0), location: at(1) };
    case "shift-and-choose":
    case "banish-and-play":
      throw new Error(`slotted kind ${kind} is not wired to a UI prompt yet`);
    default: return assertNeverSlottedKind(kind);
  }
}
```

**Current wiring state (2026-04-22):** Only `move-damage` and `move-to-location` have UI prompts. `shift-and-choose` and `banish-and-play` are declared in the engine's type surface but the simulator throws if asked to serialize them — they currently reach the engine by other paths (e.g. `playCard` directly passing `SlottedTargetInputOf<CardInput>` from card implementations or tests). Wire a prompt before enabling them in interactive play.

### 6.4 Flat vs slotted — quick rule

- **Flat** `CardInstanceId[]`: one filter, "pick N of the same thing". Single-filter "pick a character" style effects.
- **Slotted**: two or more distinct filters at one resolution step. If you would otherwise need a second pending choice to carry the next slot, use slotted.

---

## 7. Triggered abilities with targets

Triggers use the same target pipeline as active moves. There is no separate "trigger target" API.

### 7.1 Registration

[`runtime-moves/resolution/action-effects/create-triggered-ability-effect.ts`](../../../../lorcana-engine/src/runtime-moves/resolution/action-effects/create-triggered-ability-effect.ts):

- `isCreateTriggeredAbilityEffect` (L30) — guard.
- `abilityEffectRequiresPreviousTarget` (L82) — returns true when the inner effect targets `"previous-target"`.
- `resolveCreateTriggeredAbilityEffect` (L102) — the registration entry. At L108–115 it **skips registration** if the ability's inner effect references `previous-target` but the prior step had no targets. This is the most common footgun for trigger-based cards: if your damage step finds no targets, the downstream "bounce the target" trigger never registers at all.
- Delegates to `registerAbility` (imported from `../../effects/triggered-abilities`; the actual function lives at [`triggered-abilities/index.ts:1862`](../../../../lorcana-engine/src/triggered-abilities/index.ts)).

### 7.2 Firing

When the trigger fires, `triggered-abilities` enqueues a `PendingActionEffect`. The engine then:

1. Calls `analyzeEffectTargets` on the trigger's inner effect.
2. Builds a `TargetResolutionSelectionContext` exactly like an active move.
3. Places it on `board.pendingChoice`.

From the simulator's / planner's perspective, the next action is simply `resolveEffect` — same move id, same params shape.

---

## 8. End-to-end worked example: "Banish a character and play another"

1. **Dispatch.** Player clicks the card. UI calls `dispatchSimulatorMove(engine, playerId, "playCard", { card: ref, ... })`.
2. **Engine analysis.** `play-card.ts` → `analyzeEffectTargets()` determines two slots: banish candidate (opposing character in play), play candidate (card in hand).
3. **Context publication.** Engine stores a `TargetResolutionSelectionContext` with `expectedSlottedKind: "banish-and-play"`, `cardCandidateIds` containing the union of both pools, `minSelections: 2`, `maxSelections: 2`. Surfaces as `board.pendingChoice`.
4. **Simulator surfaces `resolveEffect`.** `buildPendingResolutionMoves` (derived-state.ts:1407) adds an entry.
5. **Prompt.** `buildResolutionTargetPromptState` ideally renders two filtered slots. *(At time of writing, this kind has no UI prompt — it is test-only; see §6.3.)*
6. **Submit.** UI (or card test) calls:
   ```ts
   dispatchSimulatorMove(engine, playerId, "playCard", {
     card: ref,
     targets: { kind: "banish-and-play", banish: [charId], play: [cardId] },
   });
   ```
7. **Engine validates.** `resolveActionEffect` in [`resolve-effect.ts`](../../../../lorcana-engine/src/runtime-moves/resolution/resolve-effect.ts) (imports `flattenSlottedTargets` and `isSlottedTargetInput` at L50) validates each slot against its DSL filter, then applies the effect. Pending choice clears; any triggered abilities register and begin a new pending-choice cycle.

---

## 9. Quick reference — files & functions

### Engine side

| File | Symbol | Purpose |
| --- | --- | --- |
| [`src/types/resolution-selection.ts`](../../../../lorcana-engine/src/types/resolution-selection.ts):89 | `TargetResolutionSelectionContext` | The target-selection contract. |
| [`src/targeting/slotted-targets.ts`](../../../../lorcana-engine/src/targeting/slotted-targets.ts):15 | `SlottedTargetInput` | Multi-slot target input union. |
| [`src/targeting/slotted-targets.ts`](../../../../lorcana-engine/src/targeting/slotted-targets.ts):87 | `flattenSlottedTargets` | Slotted → positional fallback. |
| [`src/targeting/slotted-targets.ts`](../../../../lorcana-engine/src/targeting/slotted-targets.ts):123 | `resolveSlottedTargetInputWith` | `SlottedTargetInputOf<T>` → `SlottedTargetInput`. |
| [`src/targeting/runtime/target-analysis.ts`](../../../../lorcana-engine/src/targeting/runtime/target-analysis.ts):1463 | `analyzeEffectTargets` | Enumerate legal targets for an effect. |
| [`src/runtime-moves/resolution/resolve-effect.ts`](../../../../lorcana-engine/src/runtime-moves/resolution/resolve-effect.ts) | move handler | Validates & normalizes target payloads. |
| [`src/runtime-moves/resolution/action-effects/create-triggered-ability-effect.ts`](../../../../lorcana-engine/src/runtime-moves/resolution/action-effects/create-triggered-ability-effect.ts):102 | `resolveCreateTriggeredAbilityEffect` | Registers trigger; skips on missing prior target. |
| [`src/triggered-abilities/index.ts`](../../../../lorcana-engine/src/triggered-abilities/index.ts):1862 | `registerAbility` | Trigger registration entry. |
| [`src/automation/planner.ts`](../../../../lorcana-engine/src/automation/planner.ts):1210 | `buildTargetVariants` | Enumerate candidate combinations for AI. |
| [`src/automation/planner.ts`](../../../../lorcana-engine/src/automation/planner.ts):304 | `prioritizeTargetIds` | Sort by score + deterministic tiebreaker. |
| [`src/automation/planner.ts`](../../../../lorcana-engine/src/automation/planner.ts):344 | `prioritizeTargetVariants` | Sort combinations. |
| [`src/automation/target-priority.ts`](../../../../lorcana-engine/src/automation/target-priority.ts):323 | `scoreAutomatedActionTargets` | Numeric score for a combination. |
| [`src/automation/effect-polarity.ts`](../../../../lorcana-engine/src/automation/effect-polarity.ts):301 | `classifyTargetedStepPolarity` | Beneficial / harmful / neutral classifier. |

### Simulator side

| File | Symbol | Purpose |
| --- | --- | --- |
| [`src/lib/features/simulator/context/game-context.svelte.ts`](../src/lib/features/simulator/context/game-context.svelte.ts):1098 | call site | Dispatches every player move through the helper. |
| [`src/lib/features/simulator/model/move-dispatch.ts`](../src/lib/features/simulator/model/move-dispatch.ts):10 | `dispatchSimulatorMove` | Single chokepoint to `engine.dispatch`. |
| [`src/lib/features/simulator/model/resolution-target-prompt.ts`](../src/lib/features/simulator/model/resolution-target-prompt.ts):167 | `buildResolutionTargetPromptState` | Build per-slot state + filtered candidates. |
| [`src/lib/features/simulator/model/resolution-target-prompt.ts`](../src/lib/features/simulator/model/resolution-target-prompt.ts):253 | `getResolutionTargetPromptMessage` | Human-readable prompt copy. |
| [`src/lib/features/simulator/model/resolution-target-prompt.ts`](../src/lib/features/simulator/model/resolution-target-prompt.ts):295 | `buildSlottedTargetsFromSelection` | Flat selection → `SlottedTargetInput`. |
| [`src/lib/features/simulator/model/derived-state.ts`](../src/lib/features/simulator/model/derived-state.ts):1407 | `buildPendingResolutionMoves` | Surface `resolveEffect` / `resolveBag` moves. |
| [`src/lib/features/simulator/model/contracts.ts`](../src/lib/features/simulator/model/contracts.ts) | types | `AvailableMovesSelectionEntry`, `ResolutionTargetSelectionSlotState`. |

---

## 10. Sharp edges — read before changing anything

1. **`expectedSlottedKind` is an obligation, not a hint.** When set, the submitted `targets` must be a `SlottedTargetInput` of that exact kind. Flat arrays will be rejected by engine validation.
2. **UI coverage ≠ type coverage.** `shift-and-choose` and `banish-and-play` are legal engine types but the simulator prompt throws on them. Before enabling an interactive path for a new slotted kind, extend `SLOT_LABELS`, `SLOT_CARD_TYPES`, and `buildSlottedTargetsFromSelection`.
3. **`autoResolvedFromSlots` offsets the selection array.** `buildResolutionTargetPromptState` pre-fills auto-resolved source slots (e.g. `from: { ref: "self" }` on `move-damage`). The raw selection array skips these, so `visualSlotIndex - autoResolvedFromSlots` gives the storage index. Same applies to `targetDsl` indexing — adjust before reading owner filters.
4. **`autoRejected: true` ≠ user error.** It means the engine found zero legal targets. Surface a neutral "no legal targets" UX rather than an error.
5. **`canDeclineSelection` / `originatesFromOptional`.** Some targets are opt-out. Card tests routinely forget this — exercise both branches in new-card tests.
6. **Triggers with `previous-target`.** If the prior step had no targets, the trigger is **not registered** (see `resolveCreateTriggeredAbilityEffect` L108–115). Don't write assertions that assume the trigger always registers — assume it only registers when the upstream step produced targets.
7. **`requestId` vs `requestID`.** The type field is `requestId` (type system). `board.pendingChoice.requestID` (uppercase) is the projected-view field. Match the layer you're in — do not rename.
8. **Planner still submits flat.** If you add a new `SlottedTargetKind` whose candidate space cannot be expressed as a flat list (e.g. slots have disjoint pools), the planner needs updating too. If slots share the same pool, engine-side normalization is enough.
9. **The simulator is not the source of truth.** Engine validation is. Never trust a UI-only check to keep the engine consistent — always validate server-side in the move handler.

---

## 11. When adding a new card with targets

A practical checklist:

1. Express the target requirement in the card's `Effect` DSL (see `@tcg/lorcana-types`).
2. Run a card test using `LorcanaMultiplayerTestEngine`. If it produces a `pending-effect` with `kind: "target-selection"`, the engine layer is wired.
3. Inspect `board.pendingChoice` in the test — if `expectedSlottedKind` is set, ensure the effect DSL actually needs distinct per-slot filters. If not, keep it flat.
4. If flat: no simulator changes needed — existing generic target prompt handles it.
5. If slotted and an existing `SLOTTED_TARGET_KINDS` entry matches: ensure `SLOT_LABELS` / `SLOT_CARD_TYPES` cover the UI. Exercise in a strategy test.
6. If slotted with a new kind: extend `SlottedTargetInput`, `SLOTTED_TARGET_SLOT_KEYS`, `flattenSlottedTargets`, `resolveSlottedTargetInputWith`, `buildSlottedTargetsFromSelection`, and `SLOT_LABELS` / `SLOT_CARD_TYPES`. The `assertNeverSlottedKind` branches will tell you every site.
7. If the card is trigger-based: no extra work — the trigger path uses the same pipeline. Just be aware of the previous-target skip rule.

---

## 12. See also

- [`packages/lorcana/lorcana-simulator/src/lib/lorcana-simulator/ARCHITECTURE.md`](../src/lib/lorcana-simulator/ARCHITECTURE.md) — broader simulator architecture.
- [`packages/lorcana/lorcana-engine/src/automation/README.md`](../../../../lorcana-engine/src/automation/README.md) — planner design notes.
- Spec tests under [`src/testing/rules/`](../src/testing/rules/) and [`src/testing/strategy/`](../src/testing/strategy/) for realistic target scenarios.
