# Lorcana Rules Memory Bank

Schema: [`schema.md`](./schema.md) (extends canonical [`../../lorcana-cards/memory/schema.md`](../../lorcana-cards/memory/schema.md)). Demoted/expired entries: [`archive.md`](./archive.md).

CR version pinned: **2.0.1**, effective **2026-02-05**.

## Guardrails

- **G-01**: Use index-first retrieval; avoid broad full-document scans. Why: noise drowns signal and inflates context. Applies: every lookup.
- **G-02**: Include CR citations for every implementation-relevant ruling. Why: downstream skills need the receipt to validate claims. Applies: Mode B JSON output.
- **G-03**: Distinguish confirmed rule text from inference. Why: paraphrase becomes "law" if not flagged. Applies: every Mode A or Mode B output.
- **G-04**: Flag uncertainty explicitly when CR text is ambiguous; do not invent a ruling. Why: hallucinated rulings poison engine and card decisions. Applies: every output.
- **G-05**: A Promoted Rule must cite both a CR section and a runnable section-spec test. Why: rule + test = falsifiable claim. Applies: every promotion.

## Promoted Rules

### PR-01 — floating-triggers-live-outside-bag

- **claim**: Generated triggered abilities (e.g. "Whenever ... this turn") exist outside the bag for their stated duration. They create a bag instance only when their condition fires; while bag entries remain, normal play pauses; the ability expires when the duration window ends.
- **scope**: Any rules handoff describing temporary or duration-bound triggered text.
- **evidence**: CR `6.2.7.1`, `6.2.3`, `7.7.3.1`, `7.7.4.2`–`7.7.4.5`, `6.1.13.4`. Consumed by triggered-ability engine implementation 2026-03-09.
- **verification**: `bun test packages/lorcana/lorcana-engine/src/runtime-moves/effects/triggered-abilities.test.ts`
- **last_checked**: 2026-04-27

### PR-02 — phase-advance-gated-on-bag-empty

- **claim**: Phase changes must not be driven by generic flow hooks alone when a rule-specific transition state (turn transition, bag, pending choices/effects) is active. Beginning phase, in particular, may not advance to Main while a start-of-turn bag still exists.
- **scope**: Engine flow config and any phase-spec tests.
- **evidence**: CR `3.2.3.2`, `7.7.4.5`, `3.2.2.3`. O-2026-03-10-section-03 fix to `runtime-flow-config`.
- **verification**: `bun test packages/lorcana/lorcana-engine/src/__tests__/section-03.test.ts`
- **last_checked**: 2026-04-27

### PR-03 — replacement-effects-resolve-at-event

- **claim**: Replacement effects inspect and modify the resolving event before it happens. Self-replacement first, then one application per effect per event, then duplicate-instance collapse.
- **scope**: Authoring or testing replacement effects (`"instead"`, prevention shields, redirects).
- **evidence**: CR `6.5.3`–`6.5.8`, `6.5.6`, `6.5.7.1`, `6.5.5`, `6.5.8`. Section-06-05 spec implementation 2026-03-10.
- **verification**: `bun test packages/lorcana/lorcana-engine/src/__tests__/section-06-05.test.ts`
- **last_checked**: 2026-04-27

### PR-04 — payment-modifiers-apply-to-alternate-costs

- **claim**: Payment modifiers (generic character cost reductions) apply to alternate costs including Shift, unless a `playMethod`-scoped restriction excludes them.
- **scope**: Cost-reduction authoring, Shift interactions.
- **evidence**: CR `4.3.2.3`, `4.3.6`, `8.10.1`, Fabled release note (Pluto / Good Dog).
- **verification**: `bun test packages/lorcana/lorcana-engine/src/runtime-moves/rules/static-ability-utils.test.ts`; `bun test packages/lorcana/lorcana-simulator/src/testing/keyword-abilities/shift.test.ts`
- **last_checked**: 2026-04-27

### PR-05 — resist-applies-to-deal-damage-only

- **claim**: Resist reduces "deal damage" (CR `8.8.1`–`8.8.2`); it does not apply to effects that "put" or "move" damage counters (CR `8.8.3`).
- **scope**: Damage-effect authoring and Resist interactions.
- **evidence**: CR `6.7.2.3`, `8.8.1`, `8.8.2`, `8.8.3`. 2026-03-11 split of `put-damage-effect.ts` from `deal-damage-effect.ts`.
- **verification**: `bun test packages/lorcana/lorcana-engine/src/runtime-moves/action-effect/deal-damage-effect.test.ts`; `bun test packages/lorcana/lorcana-engine/src/__tests__/section-08-resist.test.ts`
- **last_checked**: 2026-04-27

### PR-06 — that-card-requires-exact-instance-and-zone

- **claim**: "That card" references must check both the exact card instance and the named zone. Fallback to "another matching discard card" violates CR.
- **scope**: Authoring or runtime resolution of trigger-subject-referencing effects.
- **evidence**: CR `6.1.11`, `6.1.11.1`. Ursula "that song" replay fix 2026-03-11; Belle Snowfield Strategist 2026-03-27.
- **verification**: `bun test packages/lorcana/lorcana-engine/src/__tests__/section-06-01.test.ts`; `bun test packages/lorcana/lorcana-engine/src/runtime-moves/resolution/action-effects/target-resolver.test.ts`
- **last_checked**: 2026-04-27
- **cross-ref**: `lorcana-cards` PR-04 (DSL shape).

### PR-07 — optional-may-only-cancels-at-start

- **claim**: For "you may A, then B" effects, the `may` is the choice to perform the effect at all. Once accepted, remaining steps resolve in order; later steps are not cancelable unless a separate `may` or `up to` appears in the printed text.
- **scope**: Authoring or testing optional triggered abilities with multi-step effects.
- **evidence**: CR `1.7.2`, `1.7.3`, `1.7.6`, `1.7.7`, `6.7.2.4`, `7.3.4`. Confirmed 2026-03-30.
- **verification**: Indexed CR sections; no isolated runtime regression test (rule is enforced by general bag/effect resolution).
- **last_checked**: 2026-04-27

### PR-08 — turn-owner-separate-from-priority-holder

- **claim**: Only one player has the turn. The bag may temporarily require another player to act. Once the bag is empty, control returns to the active player. Engine code must derive turn ownership from turn state, not transient priority.
- **scope**: Engine work on turn transitions, opponent-choice triggered effects, multiplayer flow.
- **evidence**: CR `1.3.4.1`, `3.3.2.1`, `3.4.1.1`, `3.4.2`, `7.7.4.5`. Cursed Merfolk repro 2026-03-28.
- **verification**: `bun test packages/lorcana/lorcana-engine/src/runtime-moves/moves/turn/pass-turn.test.ts`
- **last_checked**: 2026-04-27
- **cross-ref**: `lorcana-cards` PR-06.

### PR-09 — vanish-only-on-action-resolution-be-chosen

- **claim**: Vanish triggers only when the character is chosen as part of resolving an action's effect. Activated character/item abilities that "choose" do not trigger Vanish even if they may satisfy other "be-chosen" triggers.
- **scope**: Vanish authoring and rule-grounded keyword tests.
- **evidence**: CR `8.14.1`, `8.14.2`, `7.7.2`, `7.7.3.1`, `7.7.4.5`. Angel + Palace Guard 2026-04-01.
- **verification**: `bun test packages/lorcana/lorcana-cards/src/cards/008/characters/045-palace-guard-spectral-sentry.test.ts`; `bun test packages/lorcana/lorcana-simulator/src/testing/rules/section-08-vanish.test.ts`
- **last_checked**: 2026-04-27

### PR-10 — public-vs-private-zone-information-policy

- **claim**: Fair-information bots/automation may inspect only public zones (play, discard) for opponent profiling. Hand, deck, and inkwell are private unless a printed effect explicitly reveals them.
- **scope**: Automation, simulator helpers, AI policy boundaries.
- **evidence**: CR `7.1.2`, `7.1.2.1`, `7.1.3`, `7.2.2`, `7.3.2`, `7.5.4`, `7.6.2`. 2026-03-30 dual-mode best-AI strategy.
- **verification**: index check of CR `7.1`–`7.6`; runnable verification lives in the simulator's policy tests (specific path TBD; demote if no runnable test by next sweep).
- **last_checked**: 2026-04-27

## Candidates

### C-01 — sing-trigger-bag-flush-timing

- **pattern**: Sing triggers must be flushed to the bag only after the song's pending effect fully resolves, never mid-action. Engine already implements correctly; codifying as a Promoted Rule needs a dedicated runtime test (currently inferred from `play-card.ts` call-site placement).
- **hits**: 1 (most recent: 2026-03-27)
- **promote_when**: a dedicated test exists for the flush-timing invariant.
- **demote_at**: 2026-06-20

## Observations

(none new since the migration sweep — observations from individual section work folded into Promoted Rules during the 2026-04-27 migration. New observations land here as section specs and engine work generate them.)
