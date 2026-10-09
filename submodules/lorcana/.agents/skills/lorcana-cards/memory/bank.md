# Lorcana Cards Memory Bank

Schema: [`schema.md`](./schema.md). Demoted/expired entries: [`archive.md`](./archive.md).

## Guardrails

- **G-01**: Resolve the exact card file and test file before editing. Why: avoid acting on a generated stub or stale legacy file. Applies: every card task.
- **G-02**: Probe engine support before declaring a gap. Why: most "gaps" are authoring drift from current DSL. Applies: any card with `missingImplementation: true` or a failing behavior test.
- **G-03**: Treat active Bun tests as the only source of truth, not commented Jest history. Why: legacy comments rot and mislead. Applies: when picking reference examples.
- **G-04**: A test asserting only `missingImplementation`, `missingTests`, or empty `abilities` is not coverage. Why: hides regressions and inflates green metrics. Applies: review and authoring.
- **G-05**: If the same engine gap blocks 2+ cards in one batch, stop and fix shared support first. Why: repeated per-card workarounds calcify. Applies: batch implementation work.
- **G-06**: Use authoritative server state for hidden-zone, under-card, facedown-ink, or chooser-projection assertions. Why: client snapshots can be optimistically successful. Applies: tests touching hidden zones.
- **G-07**: Enchanted/epic variants share `canonicalId` and must have abilities identical to the base card. Why: drift breaks Shift and reprint logic. Applies: variant authoring.

## Promoted Rules

### PR-01 — actions-and-locations-as-syntax-references

- **claim**: Actions are the most mature DSL surface; locations are second. Items are mixed; characters are least reliable.
- **scope**: Picking reference examples for new card authoring.
- **evidence**: O-2026-03-14, O-2026-03-15-engine-first, set-001/002/003/004/005 item batches all required corrections starting from non-action templates.
- **verification**: `rg -l 'missingImplementation: true' packages/lorcana/lorcana-cards/src/cards/<SET>/<TYPE>` — current counts: actions 2/340, locations 0/87, items 125/204, characters 1569/1936.
- **last_checked**: 2026-04-27

### PR-02 — may-enter-play-exerted-two-ability-shape

- **claim**: "May enter play exerted" is two abilities — a static `restriction: "may-enter-play-exerted"` plus a triggered ability gated by `condition: { type: "is-exerted" }`.
- **scope**: Character authoring with optional exerted entry.
- **evidence**: `012/characters/078-lord-macguffin-clever-swordsman.ts`, set-012 batch (2026-04-21), engine-first proof (2026-03-15).
- **verification**: `bun test packages/lorcana/lorcana-cards/src/cards/012/characters/078-lord-macguffin-clever-swordsman.test.ts`
- **last_checked**: 2026-04-27

### PR-03 — printed-cost-vs-discounted-cost-for-triggers

- **claim**: Trigger eligibility checks like "cost X or less" must filter against printed cost, not discounted play cost.
- **scope**: Authoring triggered abilities with cost predicates.
- **evidence**: O-2026-03-15-nested-play-bodyguard, Stitch–Rock Star case via Lantern.
- **verification**: `bun test packages/lorcana/lorcana-cards/src/cards/001/items/033-lantern.test.ts`
- **last_checked**: 2026-04-27

### PR-04 — that-card-needs-trigger-ref-and-zone

- **claim**: Card text using "that card from your <zone>" must use `source: { ref: "trigger-subject", zones: ["<zone>"] }`. Plain `source: "<zone>"` lets the resolver pick unrelated cards; plain `ref` without `zones` ignores zone movement.
- **scope**: Triggered abilities referencing a specific prior card identity.
- **evidence**: O-2026-03-27-that-card-zone-lock (Belle Snowfield Strategist), CR `6.1.11`/`6.1.11.1`.
- **verification**: `bun test packages/lorcana/lorcana-cards/src/cards/011/characters/158-belle-snowfield-strategist.test.ts`
- **last_checked**: 2026-08-01

### PR-05 — optional-no-legal-targets-still-bags

- **claim**: A triggered optional ability whose later target choice has zero legal candidates still enters the bag and resolves with no effect. Do not author or assert it as suppressed.
- **scope**: Triggered optional abilities with chosen-target effects.
- **evidence**: O-2026-03-27-optional-no-legal (Be Prepared multi-trigger), CR `6.2.2`, `6.2.9`, `1.7.7`.
- **verification**: `bun test packages/lorcana/lorcana-engine/src/triggered-abilities/index.ts` and `bun test packages/lorcana/lorcana-simulator/src/testing/triggered-abilities/multiple-triggers.test.ts`
- **last_checked**: 2026-04-27

### PR-06 — turn-owner-not-priority-holder

- **claim**: `passTurn` and similar turn-ownership checks must derive turn owner from OTP + completed turns, not from priority holder. Priority can transfer to opponents during opponent-choice bag flows without changing turn ownership.
- **scope**: Engine work on turn transitions and opponent-choice triggered effects on the active player's turn.
- **evidence**: O-2026-03-28-turn-owner-vs-priority, Cursed Merfolk repro, CR `1.3.4.1`, `3.4.2`, `7.7.4.5`.
- **verification**: `bun test packages/lorcana/lorcana-engine/src/runtime-moves/moves/turn/pass-turn.test.ts`
- **last_checked**: 2026-08-01

### PR-07 — set-counts (current-state)

- **claim**: Migration state by card type — actions 340 defs / 2 missing; locations 87 / 0; items 204 / 125; characters 1936 / 1569.
- **scope**: Sizing batches and choosing reference surfaces.
- **evidence**: Migration audit 2026-04-21.
- **verification**: `rg -l 'missingImplementation: true' packages/lorcana/lorcana-cards/src/cards/<TYPE>/ | wc -l`
- **last_checked**: 2026-04-21

## Candidates

### C-04 — team-name-shift-targets

- **pattern**: A team card whose Shift reminder text names alternatives must use `shift("Name A or Name B", cost)` rather than plain `shift(cost)`, which only permits an exact same-name base.
- **hits**: 2 (most recent: 2026-07-15)
- **promote_when**: ≥3 distinct team cards need the explicit alternative-name target.
- **demote_at**: 2026-09-13


## Observations

Recent observations move to `archive.md` after 30 days unless they back a Candidate or Promoted Rule. The full prior log lives in [`archive.md`](./archive.md).

### O-2026-10-02-ink-drop-payment-integrity

- **signal**: PR-review pass hardened the ink-drop payment contract. (1) `validateInkCost` now rejects an `inkDrops` claim larger than the drops actually held EVEN when ready ink alone covers the cost — previously the claim validated, `spendInk` clamped silently, and `paidWithInkDrops` recorded the requested amount (wrongly satisfying paid-with-drop conditions like Intense Research / Jousting Match / Wasabi). (2) `payBasicCost`'s success result now carries `inkDropsSpent` (optional claimed spend + mandatory `cost.inkDrops`), and playCard's `cardPlayedPayload.paidWithInkDrops` records THAT instead of the client request. (3) `moveCharacterToLocation` validation counts drops only up to the claimed amount (was: all held drops → free moves with 0 ready ink). (4) playCard availability stopped summing held drops into `availableInk` (validation only credits claimed drops; nothing sends claims yet) and its shift branch now resolves candidates for ink-drop-only Shifts (`inkDropsCost` without `inkCost` was unreachable). (5) Baymax Supercharge replacement: `applyInkwellReplacementForPlayer` returns whether it inked a card; an EMPTY deck now falls through to the normal ink-drop gain instead of consuming it.
- **impact**: Card tests that claim `inkDrops` must seed the drops they claim (see Madam Mim Bauble Game fixture fix — the old test passed because the unbacked claim validated and spent nothing). Authoring "pay N with drops" texts can rely on `paidWithInkDrops` reflecting real removal. Client/action-surface work that wants drop-funded plays MUST pass `inkDrops` explicitly; availability will list such plays once the action surface sends claims (tracked on #4176).
- **verification**: `bun test --cwd packages/lorcana/lorcana-engine "./src/runtime-moves/rules/__tests__/ink-drops.test.ts" "./src/runtime-moves/rules/play-card-rules.test.ts"`; cards: `bun test ./src/cards/014/actions/164-intense-research.test.ts ./src/cards/014/characters/059-madam-mim-resourceful-trickster.test.ts ./src/cards/014/characters/158-baymax-amped-up.test.ts`
- **candidate_for**: new

### O-2026-10-01-ink-drop-engine-support

- **signal**: Hyperia City (set 14) introduces ink drops — player-attached counters a player may remove to pay 1 {I} of any ink cost. Engine support landed as: `G.inkDrops: Record<PlayerId, number>` + `turnMetadata.inkDropsGainedThisTurn/inkDropsRemovedThisTurn`; `gain-ink-drop` effect (resolver + `ACTION_EFFECT_RESOLVER_TYPES` + probe registry); `resource-count what: "ink-drops"` condition; `ink-drops-gained/removed` turn metrics; `ink-drop-gained/removed` buffered trigger events (with `triggerAmount` snapshot); payment opt-in via `inkDrops?: number` on `playCard` / `activateAbility` / `moveCharacterToLocation` move args, split inside `spendInk` (inkwell exerts first, then drops); `generate-legacy` unaffected. G resolver helper: `src/runtime-moves/rules/ink-drops.ts` (`getInkDropCount` / `gainInkDrops` / `removeInkDrops` / `resolveInkDropStore` — minimal cost contexts carry G via `framework.state.G`, move contexts directly).
- **impact**: Set-14 batch work should model "get N ink drop(s)" with `gain-ink-drop` (targets CONTROLLER/EACH_PLAYER/EACH_OPPONENT/CHOSEN_PLAYER), drop-funded plays by passing `inkDrops` in move args, and drop-count conditions with `resource-count`. Payment is opt-in ("may"): omitting `inkDrops` never spends drops, so Wasabi Future Thinker / Madam Mim payment-triggered texts stay authorable. Known deferral: Baymax - Amped Up's "you may put the top card of your deck into your inkwell instead" needs an optional gain-replacement primitive that does not exist yet — card stays `missingImplementation` until then.
- **verification**: `bun test --cwd packages/lorcana/lorcana-engine "./src/runtime-moves/rules/__tests__/ink-drops.test.ts" "./src/runtime-moves/resolution/action-effects/__tests__/gain-ink-drop.test.ts"`
- **candidate_for**: new

### O-2026-10-01-triggered-condition-cardplayed-semantics

- **signal**: `ability.condition` on a triggered ability whose printed text reads "the card you played" (e.g. Jukebox ON REPEAT: "whenever you play a song, if it has the same name as a card in your discard") must evaluate against the EVENT's played card, not the ability source. Fixed in `lorcana-engine/src/triggered-abilities/index.ts`: (1) `evaluateTriggeredAbilityCondition` now takes `event?: PendingTriggeredEvent`; the board-state whitelist case (target-query/played-card-name/…) builds its condition context with `cardPlayed: event?.cardPlayed ?? candidate.cardPlayed`; (2) `createTriggeredAbilityBagItem`-style bag creation now seeds the bag item's `cardPlayed` from `event.cardPlayed ?? candidate.cardPlayed`, so resolution-time condition re-checks see the trigger subject. New condition `played-card-name` (`zone: "discard"|"play"`, `cardTypes`, `excludeSelf`, `requireAbsent`) added to lorcana-types + condition-evaluator for these texts.
- **impact**: When authoring "whenever you play X, if [that card]…" conditions, use `played-card-name` (not source-scoped conditions). RESOLVED end-to-end: Jukebox set14 items/134 passes both its tests (trigger + optional ready + cant-quest restriction) after the event-payload threading above; verify with `bun test --cwd packages/lorcana/lorcana-cards "./src/cards/014/items/134-jukebox.test.ts"`.
- **verification**: `bun test --cwd packages/lorcana/lorcana-engine "./src/rules/conditions/__tests__/played-card-name.test.ts"`
- **candidate_for**: new

### O-2026-10-01-set14-stubs-zero-plus-engine-primitives

- **signal**: Set-14 implementation pass COMPLETE: 0 `missingImplementation` stubs remain (Baymax - Amped Up included — shift-drop engine support + Supercharge redirect both live). Engine primitives added this pass beyond the ink-drop core: `played-card-this-turn` condition (evaluate + excludeSource), `revealed-has-keyword` + `discarded-card-is-card-type` + `has-character-with-highest-cost` + `opponent-count` conditions (all with coverage tests), `played-card-name` with zone/cardTypes/excludeSelf/requireAbsent, `reveal-tops-highest-cost-to-hand` effect (deck-bottom = zone "deck" index 0), `distinct-item-names-in-play` count amount, `from-deck` trigger restriction + per-card mill discard events with batchKey dedupe for player-scoped deck-origin triggers, `enable-play-from-discard` `entersExerted`/`scope: "all-cards"` (player-wide permissions), `PutInHandEffect.source: "inkwell"`, reveal-inkwell now writes revealedCardIds to the snapshot, SelfReplacementCondition `selected-target-has-damage`, PlayContextCondition `paid-with-ink-drop`, `requireSameName` target validation (TARGETS_MUST_SHARE_NAME), ScryInkwellDestination min-1 support exercised by Cinderella BESPOKE DESIGN.
- **impact**: All of set 14 now has behavior coverage (768 tests, 0 fail; every implemented pair has a test file). RESOLVED: the observer-trigger auto-decline had TWO more instances beyond resolve-bag's drain — (1) `bagEffectNeedsPlayerDecision` (lorcana-engine-base.ts) and (2) resolveBag's execute-stage `shouldResolve` both evaluated conditions against `bagEffect.cardPlayed` (the observer's own payload); both now prefer `bagEffect.eventCardPlayed`. Rule of thumb: ANY condition evaluation of a bag/pending trigger must read the play-event subject. There are FOUR evaluation sites: (1) trigger-enqueue gate in evaluateTriggeredAbilityCondition, (2) resolveBag's abilityConditionWillFail drain check, (3) resolveBag's execute-stage shouldResolve check, and (4) lorcana-engine-base's bagEffectNeedsPlayerDecision. All four now prefer eventCardPlayed. Also: Set-14 manual QA fixtures ship in fixtures/set14-manual-validation.ts (15 fixture entries registered in fixtures/index.ts: ink-drop gain/spend, shift pairs, songs+singers, discard/deck matters, items+collection, locations+movement, vanilla board, actions, six color chunks) — the package.json `./cards/014` (and `./cards/013/actions`) subpath exports were added for the simulator imports; set13 card gallery hand count assertion updated 241→262 after set13 grew. Supercharge redirect is now implemented as `applyInkwellReplacementForPlayer` (gain-ink-drop-effect.ts) — called from the gain-ink-drop resolver loop when `redirectGainToInkwellReplacement` is true; it moves the top deck card to inkwell (moveCard + patchMeta exerted/faceDown) and emits a cardInked event. Watch for concurrent agents re-deleting this body — the observable symptom is ink drops staying 0 (redirect returns true, gain skipped) while the inkwell never grows. Remember Me name-uniqueness is now ENFORCED: `uniqueByName` on the all-cards permission + `playedNames` recording in playCard execute + gate in getActivePlayFromDiscardPermission; note all-cards permissions are NOT consumed on play (consumePlayFromDiscardPermission early-returns for allCards) — they persist for their duration. Also: `put-in-hand` source union now includes "inkwell"; ready-chosen inside optional resolves via top-level targets (resolveNextPending/resolvePendingByCard with targets). Baymax's Supercharge "may" choice auto-applies while the deck has cards (documented nuance). Remember Me's name-uniqueness clause ("can't play characters with the same name...") is not yet enforced by the all-cards permission — potential follow-up. Cross-check new conditions against `rules/conditions/__tests__/_coverage.test.ts` before adding variants.
- **verification**: `cd packages/lorcana/lorcana-cards && bun test ./src/cards/014/ && bun run check-types`; engine suite 1203/0.
- **candidate_for**: new

### O-2026-10-01-set14-ink-drop-character-open-repros

- **signal**: Set-14 ink-drop characters implemented with failing-test repros kept intentionally (defs are text-faithful; tests encode the printed clauses). OPEN: (1) `139-wasabi-future-thinker` — SAFETY FIRST trigger (`condition: play-context paid-with-ink-drop`, effect gain-keyword Resist/Ward to YOUR_OTHER_CHARACTERS, duration until-start-of-next-turn) never enqueues a bag item on a paid play (`paidWithInkDrops` now flows on BOTH playCard payload constructions — main + trigger-candidate snapshot); trigger/gate/drain path needs a look. (2) `192-kit-cloudkicker-sure-shot` — AERIAL ACROBATICS quest choice: bag item appears but `respondWithChoice` says "No pending effect waiting for this player" — bag items resolve via `resolvePendingByCard(card, {choiceIndex})` or `resolveBag`, not the pending-effect responder. (3) `241-mickey-mouse-best-in-town-iconic` — HOT DOG! end-turn trigger never fires after `playCard(card, {enterPlayExerted: true})`; the option left state "ready" — exert via quest instead or fix the option. (4) `195-shere-khan-khan-industries-ceo` — after resolving one of his two play-triggers, the other bag item blocks challenges ("Cannot challenge while bag effects are pending"); resolve both before challenging. (5) `241-mickey-mouse-best-in-town-iconic` HOT DOG! - the gate is-exerted case reads state "ready" during the end-of-turn window even though authoritative meta shows `exerted` right after the quest; def is correct as authored (condition is-exerted + gain-ink-drop EACH_PLAYER). Statics note: Adventurous must be TWO separate static abilities (cant-challenge, must-quest) - a sequence-of-restrictions static corrupted quest exertion state.
- **impact**: Anyone finishing these four should read their test files (kept as active repros, not skipped) plus O-2026-10-01-triggered-condition-cardplayed-semantics. Baymax - Amped Up (158) remains `missingImplementation` pending an optional gain-replacement primitive (named gap).
- **verification**: `cd packages/lorcana/lorcana-cards && bun test src/cards/014/characters/139-wasabi-future-thinker.test.ts src/cards/014/characters/192-kit-cloudkicker-sure-shot.test.ts src/cards/014/characters/241-mickey-mouse-best-in-town-iconic.test.ts src/cards/014/characters/195-shere-khan-khan-industries-ceo.test.ts`
- **candidate_for**: new

### O-2026-08-01-selected-target-name-ampersand

- **signal**: Darkwing's Chair Set's `selfReplacement` condition `selected-target-name: "Darkwing Duck"` used exact `getCardName === name` equality, so choosing "Darkwing Duck & Launchpad" only removed 2 damage instead of 4. Engine now routes that condition through `cardHasName` (CR 5.2.6.1 + aliases). Simulator amount-selection UI had the same gap on card labels and now splits `" & "` name halves.
- **impact**: Future "named X" self-replacement / amount-cap reports involving team ampersand cards should check `selected-target-name` paths for exact string equality before reauthoring the card. Also benefits Stolen Scimitar's same condition.
- **verification**: `bun test --cwd packages/lorcana/lorcana-cards "./src/cards/011/items/168-darkwings-chair-set.test.ts"`; `bun test --cwd packages/lorcana/lorcana-simulator "./src/lib/features/simulator/model/resolution-amount-selection.test.ts"`
- **candidate_for**: new

### O-2026-08-01-start-of-turn-ready-choice

- **signal**: A `ready-only-one-character` start-of-turn restriction cannot choose the first eligible character by play-zone order; when multiple characters can ready, the turn transition must suspend with a chooser-owned projected target selection and resume after that selection resolves.
- **impact**: Future Ready-step restrictions that limit rather than prohibit readying should reuse the pending-effect projection path so the affected player retains the printed choice and the simulator receives legal candidates.
- **verification**: `bun test packages/lorcana/lorcana-cards/src/cards/011/characters/053-marshmallow-cranky-climber.test.ts packages/lorcana/lorcana-engine/src/runtime-moves/moves/turn/pass-turn.test.ts`
- **candidate_for**: new

### O-2026-07-13-team-name-shift-targets

- **signal**: Winnie the Pooh & Piglet - Hunny Mages was authored with plain `shift(3)`, so Shift only targeted exact same-name cards instead of the printed Winnie the Pooh or Piglet bases. Existing set 13 examples use structured `shift("Name A or Name B", cost)` for team cards with either-name Shift.
- **impact**: Future ampersand/team-name Shift reports should compare the ability helper's structured target string against printed reminder text before changing engine target resolution.
- **verification**: `bun test packages/lorcana/lorcana-cards/src/cards/013/characters/062-winnie-the-pooh-piglet-hunny-mages.test.ts`; `bun run --cwd packages/lorcana/lorcana-cards check-types`
- **candidate_for**: new

### O-2026-07-15-carl-russell-shift-targets

- **signal**: Carl Fredricksen & Russell - Intrepid Explorers likewise used plain `shift(4)`, which rejected the printed Carl Fredricksen or Russell bases. `shift("Carl Fredricksen or Russell", 4)` uses the existing named-alternative resolver, and regression tests now cover both bases. Darkwing Duck & Launchpad already used this shape and passes both target cases.
- **impact**: Reinforces that team-name Shift defects are card-authoring drift, not an engine support gap, when the named-alternative resolver is already present.
- **verification**: `bun test packages/lorcana/lorcana-cards/src/cards/013/characters/098-carl-fredricksen-russell-intrepid-explorers.test.ts packages/lorcana/lorcana-cards/src/cards/013/characters/165-darkwing-duck-launchpad-st-canards-finest.test.ts`; `bun run --cwd packages/lorcana/lorcana-cards check-types`
- **candidate_for**: C-04
