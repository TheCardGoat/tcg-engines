# Lorcana Cards Memory Archive

Append-only audit trail of demoted, expired, or superseded entries. Schema: [`schema.md`](./schema.md).

Entries are listed reverse-chronologically. Each line links the original observation and notes what consumed it.

## 2026-04-27 — initial schema migration

The previous flat `bank.md` was migrated to the tiered schema. The dated learnings below were folded into Promoted Rules and Candidates in the new bank, then archived here. Each entry retains its original signal/impact/verification triple in case future work needs to re-examine it.

### O-2026-03-30-fair-information-bot-gating

- signal: Deck-aware automation needs an explicit information-policy boundary. Fair-policy bots may only inspect public zones (play, discard); oracle mode may use full deck signatures.
- folded_into: PR (engine-policy boundary candidate, not yet promoted; lives in lorcana-rules memory if relevant).
- verification: CR `7.1.2`, `7.1.3`, `7.2.2`, `7.3.2`, `7.5.4`, `7.6.2`.

### O-2026-03-30-optional-effect-continuation

- signal: For "you may draw, then choose and discard", the `may` is the choice to perform the effect at all. After acceptance, remaining steps are mandatory.
- folded_into: PR-05 (optional-no-legal-targets-still-bags) and CR-grounded authoring guidance.
- verification: CR `1.7.2`, `1.7.3`, `1.7.6`, `1.7.7`, `6.7.2.4`, `7.3.4`.

### O-2026-03-28-turn-owner-vs-priority

- signal: `passTurn` was trusting priority-shaped state; opponent-choice bag flows could leave priority on the chooser at turn end.
- folded_into: PR-06 (turn-owner-not-priority-holder).
- verification: see PR-06.

### O-2026-03-27-that-card-zone-lock

- signal: Belle Snowfield Strategist exposed both an authoring shape (use trigger-subject ref) and a resolver bug (zones constraint was ignored for reference targets).
- folded_into: PR-04 (that-card-needs-trigger-ref-and-zone).
- verification: see PR-04.

### O-2026-03-27-sing-trigger-bag-entry-timing

- signal: Sing triggers must be flushed to bag only after the song's pending effect fully resolves, never mid-action.
- folded_into: engine invariant (no PR yet — single-source observation about runtime that has not been challenged).
- verification: CR `7.7.3.1`; `play-card.ts` flushTriggeredEventsToBag call sites.

### O-2026-03-27-optional-no-legal

- signal: Optional triggered abilities with no legal target choices were suppressed at enqueue, contradicting CR.
- folded_into: PR-05 (optional-no-legal-targets-still-bags).
- verification: see PR-05.

### O-2026-03-27-shift-payment-modifiers

- signal: Generic character cost reductions apply to Shift; `playMethod: "standard"` reductions do not. Initial confusion was an API-contract drift (`NOT_ENOUGH_INK` vs `INSUFFICIENT_INK`).
- folded_into: shift-rules-handoff observation in bank; not yet promoted.
- verification: CR `4.3.2.3`, `4.3.6`, `8.10.1` + Pluto / Good Dog Fabled note.

### O-2026-03-22-chosen-opponent-bag-then-discard

- signal: `target: "OPPONENT"` triggers surface a bag step before the discard-choice pending; with zero legal candidates, effects auto-resolve fully.
- folded_into: testing pattern in `lorcana-test-generation`.

### O-2026-03-22-ordered-put-on-bottom-snapshots

- signal: Ordered `put-on-bottom` pending effects need a `selectionContext` snapshot; recomputing legality during resolution rejects later cards.
- folded_into: engine invariant; covered by composed-effect-resolver tests.

### O-2026-03-21-jasmine-fearless-princess-discard-cost

- signal: Activated abilities with "choose and discard a card" cost need `discardCards: 1, discardChosen: true` and a `name:` field for `activateAbility(...)` routing.
- folded_into: PATTERNS.md activated-cost reference.

### O-2026-03-19-multiple-card-specific (group)

- entries: sapphire-aura, explicit-discard-to-play-song, sing-event-song-triggers, pay-cost-triggered-item-banish, discard-play-action-still-covered, trigger-time-board-state-conditions, support-aura-static-filter, discard-classification-condition, conditional-enters-play-exerted, classification-limited-ready-challenge-grant, return-from-discard-trigger-selection, quest-triggered-opponent-discard-pending, evasive-challenge-gameplay-check, rush-challenge-gameplay-check.
- folded_into: PATTERNS.md DSL examples and `lorcana-test-generation` patterns.

### O-2026-03-18-batch-and-fixture (group)

- entries: inventory-slug-drift-before-blocking, draw-then-discard-character-sequence, set-006-apostrophe-slug-drift.
- folded_into: C-03 (apostrophe-slug-drift candidate).

### O-2026-03-15-engine-extensions (group)

- entries: engine-first-blocker-proof, nested-play-bodyguard-and-printed-cost-triggers, dynamic-classification-trigger-snapshots, self-banish-trigger-candidates, fixture-self-discounts-and-heal-draw-snapshots.
- folded_into: PR-01, PR-03; engine-side per-variant tests now cover the runtime claims.

### O-2026-03-14-skill-rewrite-full-card-reality

- signal: Skill was action-only while the package had become mixed card-definition + parser + generation workspace with uneven non-action quality.
- folded_into: this skill rewrite (2026-04-27); SKILL.md now branches by card type.

### Pre-2026-03-14 entries

Earlier entries had no surviving load-bearing claims at the 2026-04-27 migration; they are not retained here. The git history of `bank.md` preserves them if needed.
