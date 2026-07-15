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
- **last_checked**: 2026-04-27

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
- **last_checked**: 2026-04-27

### PR-07 — set-counts (current-state)

- **claim**: Migration state by card type — actions 340 defs / 2 missing; locations 87 / 0; items 204 / 125; characters 1936 / 1569.
- **scope**: Sizing batches and choosing reference surfaces.
- **evidence**: Migration audit 2026-04-21.
- **verification**: `rg -l 'missingImplementation: true' packages/lorcana/lorcana-cards/src/cards/<TYPE>/ | wc -l`
- **last_checked**: 2026-04-21

## Candidates

### C-01 — cant-play-actions-cost-filter-gap

- **pattern**: `cant-play-actions` restriction does not support cost-based filtering ("can't play actions with cost 4 or more"). Cards needing this currently broaden to all actions.
- **hits**: 1 (most recent: 2026-04-21)
- **promote_when**: ≥3 distinct cards request the cost filter.
- **demote_at**: 2026-06-20

### C-02 — union-classification-not-first-class

- **pattern**: Single-classification discard and cost-reduction surfaces don't model unions like "Princess or Queen".
- **hits**: 1 (most recent: 2026-04-21)
- **promote_when**: ≥3 distinct cards or a clean engine surface to add the union.
- **demote_at**: 2026-06-20

### C-03 — apostrophe-slug-drift

- **pattern**: Inventory rows mark cards `MISSING` with apostrophe-split slugs (`world-s-...`) when the repo uses normalized slugs (`worlds-...`). Affects audit triage, not authoring.
- **hits**: 3 (2026-03-15, 2026-03-15, 2026-03-18)
- **promote_when**: stable across the next two audit batches without contradiction.
- **demote_at**: 2026-06-20

## Observations

Recent observations move to `archive.md` after 30 days unless they back a Candidate or Promoted Rule. The full prior log lives in [`archive.md`](./archive.md).

### O-2026-05-24-partial-mandatory-target-selection

- **signal**: Escape Plan replay triage showed a mandatory `choose 2` pending target selection with one legal candidate being marked `autoRejected`, causing the engine/UI to resolve with no own targets. Selection contexts now keep zero-candidate mandatory effects auto-resolvable but clamp required selections to the available candidate count when at least one candidate exists, so "do as much as possible" prompts still appear.
- **impact**: Future "choose N only affected opponent" or partial-board reports should inspect pending `selectionContext.autoRejected`, `minSelections`, and `maxSelections` before changing card DSL from exact counts to `upTo`.
- **verification**: `bun test --cwd packages/lorcana/lorcana-cards ./src/cards/012/actions/164-escape-plan.test.ts`; `bun test --cwd packages/lorcana/lorcana-engine ./src/targeting/runtime/target-availability.test.ts ./src/runtime-moves/resolution/action-effects/selection-context.test.ts ./src/lorcana-engine-base.zero-candidate-auto-resolve.test.ts ./src/lorcana-engine-base.auto-resolve-bag.test.ts`
- **candidate_for**: new

### O-2026-05-05-sugar-rush-speedway-visual-fixture

- **signal**: Sugar Rush Speedway Starting Line and Finish Line can be staged in one simulator visual fixture by placing a ready racer at Starting Line, Finish Line as the free move destination, and another racer at a different location to expose the Starting Line same-location target filter.
- **impact**: Future location-to-location move visual repros should include an off-location character when the reported behavior depends on source-location target filtering, not only the happy-path destination.
- **verification**: `bun test --cwd packages/lorcana/lorcana-simulator ./src/lib/features/simulator-devtools/fixtures/registry.test.ts ./src/lib/features/simulator-devtools/routes/test-routes.test.ts`
- **candidate_for**: new

### O-2026-05-05-optional-scry-reveal-play

- **signal**: Mufasa - Betrayed Leader and Chief Bogo - Commanding Officer both needed the printed "you may reveal the top card" modeled as an `optional` wrapper around `scry`, not as mandatory scry or a separate `reveal-top-card` plus `if-you-do` sequence. Chief Bogo also needed the play destination to keep the printed cost-5-or-less character filter and omit `entersExerted`.
- **impact**: Future reveal-top/free-play reports should first compare against the optional `scry` destination pattern, including printed destination filters and entry-state text, before adding reveal/conditional sequences.
- **verification**: `bun test --cwd packages/lorcana/lorcana-cards ./src/cards/002/characters/014-mufasa-betrayed-leader.test.ts ./src/cards/008/characters/018-chief-bogo-commanding-officer.test.ts`
- **candidate_for**: new

### O-2026-05-05-mufasa-bogo-visual-fixture

- **signal**: The simulator visual route `/tests/triage-2026-05-05-mufasa-bogo-reveal-play` can stage both reported reveal/free-play flows on one board by stacking playerOne's deck with two eligible characters: Mufasa can challenge into an exerted Maui to reveal/play the top character exerted, then after passing turn Maui can banish an exerted Bodyguard to trigger Chief Bogo for the next top character.
- **impact**: Future paired visual repros can combine sequential trigger paths in one fixture when deck order and turn passing keep the validation steps deterministic.
- **verification**: `bun run --cwd packages/lorcana/lorcana-simulator check-types`; `bun test --cwd packages/lorcana/lorcana-simulator ./src/lib/features/simulator-devtools/fixtures/registry.test.ts ./src/lib/features/simulator-devtools/routes/test-routes.test.ts`
- **candidate_for**: new

### O-2026-05-05-fixed-move-to-location-slots

- **signal**: Goofy - Set for Adventure exposed that `move-to-location` prompts with a fixed `trigger-destination` can have only one user target DSL entry while still carrying `expectedSlottedKind: "move-to-location"`; the interaction view and simulator session must fill the location slot from the source card's current `atLocationId` instead of waiting for a location click.
- **impact**: Future fixed-destination move prompts should distinguish user-selected subject count from total slotted payload count, and serialize the fixed location even when `maxSelections` is 1.
- **verification**: `bun test --cwd packages/lorcana/lorcana-interaction ./src/build-player-interaction-view.test.ts`; `bun test --cwd packages/lorcana/lorcana-simulator ./src/lib/features/simulator/context/game-context.mobile-actions.test.ts ./src/lib/features/simulator/board/resolution-target-overlay.test.ts`
- **candidate_for**: new

### O-2026-05-04-pongo-inkwell-reveal-log-detail

- **signal**: Pongo - Dear Old Dad's inkwell reveal is best represented as private detail attached to the pending bag-resolution move log, so the chooser sees "Started resolving..." plus the revealed inkwell card names in one row while the primary ability flow remains intact.
- **impact**: Future hidden-zone reveal reports should preserve the action/bag log as the primary row and append scoped reveal detail instead of letting reveal/lookup entries displace the main move.
- **verification**: `bun test --cwd packages/lorcana/lorcana-simulator ./src/testing/ui-state/pongo-dear-old-dad.test.ts`; `bun run ci-check`
- **candidate_for**: new

### O-2026-05-01-bibbidi-bobbidi-boo-visual-target-flow

- **signal**: Bibbidi Bobbidi Boo's current card DSL and simulator visual route support a sequential two-target flow: first choose your character in play to return, then the UI narrows the hand choices using that character's cost before resolving the free character play. Returning Tamatoa enabled cost-2 follow-up characters; returning Flynn narrowed the second choice to cost-1 Flynn copies and disabled higher-cost hand cards.
- **impact**: Future reports that Bibbidi Bobbidi Boo cannot be played should inspect the simulator target-gathering UI/version first, especially the second target's projected eligibility after the first target is selected, before changing the action definition.
- **verification**: `bun test --cwd packages/lorcana/lorcana-cards ./src/cards/002/actions/096-bibbidi-bobbidi-boo.test.ts`; Playwright manual route check at `/tests/bibbidi-bobbidi-boo`.
- **candidate_for**: new

### O-2026-05-01-meeko-or-branch-auto-banish

- **signal**: Meeko - Skittish Scrounger's `or` trigger already auto-resolves to the banish branch when the discard branch becomes illegal after another pending discard empties the controller's hand; the prior card regression test expected a stale bag choice and was asserting against intended engine behavior.
- **impact**: Future reports involving mandatory `or` choices should distinguish "requested branch became illegal, auto-pick only legal branch" from optional decline or empty-target fizzle before changing engine flow.
- **verification**: `bun test --cwd packages/lorcana/lorcana-cards "./src/cards/011/characters/046-meeko-skittish-scrounger.test.ts"`
- **candidate_for**: new

### O-2026-05-01-nested-free-play-bodyguard-exert

- **signal**: Optional play-card effects must keep "accept the free play" (`resolveOptional`) separate from the Bodyguard entry-mode choice (`enterPlayExerted`); pending prompts such as Woody - Jungle Guide and Just in Time now play Bodyguard cards ready by default and only exert them when the player explicitly chooses that mode.
- **impact**: Future nested free-play Bodyguard reports should inspect the `enterPlayExerted` plumbing and target-selection UI before treating optional acceptance as an exert intent.
- **verification**: `bun test --cwd packages/lorcana/lorcana-cards "./src/cards/012/characters/015-woody-jungle-guide.test.ts" "./src/cards/001/actions/029-just-in-time.test.ts"`
- **candidate_for**: new

### O-2026-04-30-choice-option-labels-and-card-text

- **signal**: Education or Elimination's choice prompt needed explicit `optionLabels` on the card to avoid generic option text, while the engine selection context now derives readable labels for common unlabeled choice branches and falls back to `Option N` only for unrecognized shapes. Follow-up scan found older choice cards such as Trust In Me, Prepare Your Bot, Hot Potato, Wrong Lever!, She's Your Person, and Firefly Swarm relying on unlabeled branches; fallback coverage now includes damage, ready, remove-damage, return-to-hand, bottom-deck, and conditional branches. The simulator choice overlay renders the source card's flattened printed text near the card identity.
- **impact**: Future choice-prompt UX reports should check card-authored `optionLabels` first, then engine-derived fallback labels, before changing simulator presentation.
- **verification**: `bun run ci-check`
- **candidate_for**: new

### O-2026-04-30-auto-resolved-slotted-target-offset

- **signal**: Madam Mim - Elephant's `move-damage` prompt auto-resolves the `from` slot to the source card, so the active visual slot index is `1` while the only explicit `targetDsl` entry is index `0` for the destination. Candidate filtering in `@tcg/lorcana-interaction` must subtract auto-resolved leading slots before indexing `targetDsl`; otherwise the destination prompt falls back to the full candidate pool and can offer the source card.
- **impact**: Future slotted prompt bugs with `{ ref: "self" }` / auto-resolved leading slots should inspect visual-slot-to-DSL index mapping before changing card DSL.
- **verification**: `bun test --cwd packages/lorcana/lorcana-interaction ./src/build-player-interaction-view.test.ts`
- **candidate_for**: new

### O-2026-04-29-scry-play-destination-uses-play-card

- **signal**: Robin Hood - Sharpshooter playing Vision of the Future from a `scry` `zone: "play"` destination exposed that direct zone movement bypassed the played action's own effects; `scry` play destinations now route through `resolvePlayCardEffect`, move non-play destinations first so looked-at remainder cards are no longer deck-top for nested effects, and nested played actions clear inherited reveal snapshots before resolving their own effects.
- **impact**: Future "played for free from scry/reveal did not resolve" reports should test with a real action that creates a pending effect, not an empty mock action.
- **verification**: `bun test --cwd packages/lorcana/lorcana-cards "./src/cards/005/characters/118-robin-hood-sharpshooter.test.ts"`
- **candidate_for**: new

### O-2026-05-01-meeko-ui-discard-branch-legality

- **signal**: Meeko - Skittish Scrounger's visible simulator UI needed resolution-target candidates included in hand-card selectable state and projected legal `or` options; otherwise the empty-hand discard branch could remain clickable even though the engine should force banish.
- **impact**: Future visible UI skip reports around `or` choices plus target prompts should validate both wrapper disabled state for resolution targets and projected choice legality, not only harness moves.
- **verification**: `bun run --cwd packages/lorcana/lorcana-simulator test:e2e -- e2e/regressions/bug-13-meeko-skittish-scrounger.e2e.ts --project=chromium`
- **candidate_for**: new

### O-2026-04-29-all-hand-inkwell-and-any-discard-card

- **signal**: HeiHei - Expanded Consciousness needed an all-card hand source selector for CLEAR YOUR MIND, and Anna - Little Sister's discard target needed no `cardTypes` restriction because the printed text says "a card."
- **impact**: Future generated `put-into-inkwell` from hand definitions should distinguish single chosen hand cards from mandatory all-hand movement; discard "a card" effects should avoid character-only filters unless printed.
- **verification**: `bun test --cwd packages/lorcana/lorcana-cards "./src/cards/007/characters/163-heihei-expanded-consciousness.test.ts" "./src/cards/011/characters/052-anna-little-sister.test.ts"`
- **candidate_for**: new

### O-2026-04-28-sid-phillips-opponent-banish-mandatory

- **signal**: Sid Phillips - Toy Surgeon's `PLAYTIME'S OVER` already keeps only the controller sacrifice optional; the opponent's follow-up banish is a mandatory `chosenBy: "opponent"` pending target selection. An explicit empty target selection is rejected while the opponent has a legal character, and the continuation drains only when they have no characters.
- **impact**: Future reports that Sid lets the opponent skip should check simulator/UI prompt behavior or deployed version drift before changing the card DSL.
- **verification**: `bun test --cwd packages/lorcana/lorcana-cards "./src/cards/012/characters/126-sid-phillips-toy-surgeon.test.ts"`
- **candidate_for**: new

### O-2026-04-28-prevented-damage-no-deal-damage-trigger

- **signal**: Merida - Formidable Archer's `deal-damage` trigger does not fire when an action's damage is fully prevented by Resist; `Three Arrows` into `Tiana - Celebrating Princess` leaves the target at 0 damage and no `STEADY AIM` bonus applies.
- **impact**: Future "whenever your action deals damage" tests can assert fully prevented damage as no trigger without engine changes, using a Resist value equal to or greater than the action damage.
- **verification**: `bun test --cwd packages/lorcana/lorcana-cards "./src/cards/012/characters/191-merida-formidable-archer.test.ts"`
- **candidate_for**: new

### O-2026-04-28-special-printings-spread-base

- **signal**: All 306 special-rarity source files now spread their same-canonical base card; the new aux `reprintSharedFields` validation passes across 404 same-set special printings with 9,696 shared-field comparisons.
- **impact**: Future alternate-art/promo source drift should be caught by aux generation, and special printing authoring should keep only printing identity plus i18n overrides in the variant file.
- **verification**: `bun --cwd packages/lorcana/lorcana-cards scripts/generate-card-aux.ts`
- **candidate_for**: reinforces G-07

### O-2026-04-28-optional-pay-cost-unpayable-drains

- **signal**: Clarabelle - Clumsy Guest exposed that `optional -> pay-cost -> chosen target` triggers could leave a target-selection bag prompt even when the controller could not pay the nested ink cost. Optional-skip analysis now validates nested pay-cost costs and drains/suppresses unpayable optionals; related tests for Ursula's Shell Necklace, Ariel - Sonic Warrior, Go Go Tomago, and Finnick now assert no bag/pending prompt when the cost cannot be paid.
- **impact**: Future "stuck on pending action" reports for "you may pay N ink to..." cards should check nested pay-cost affordability before UI/presenter changes.
- **verification**: `bun run ci-check`
- **candidate_for**: new

### O-2026-04-28-reprint-each-player-choice-parity

- **signal**: Kida - Crystal Scion base and enchanted reprint needed identical split `FLOOD OF POWER` controller/opponent effects; opponent-side put-into-inkwell effects need `chosenBy: "opponent"` (not only `chooser: "OPPONENT"`) for pending target selection to be assigned to the opponent.
- **impact**: Future "each player may..." reprint fixes should sync base/enchanted ability arrays and use `chosenBy` when the opponent chooses their own source cards.
- **verification**: `bun test --cwd packages/lorcana/lorcana-cards ./src/cards/012/characters/160-kida-crystal-scion.test.ts`
- **candidate_for**: reinforces G-07

### O-2026-04-28-optional-chosen-target-bag-scope

- **signal**: CI exposed that trigger-fire suppression must distinguish optional chosen-target effects from source-pool optionals. Chosen-target optionals with zero legal candidates must still enter the bag, but return-from-discard / play-from-hand source-pool optionals may still suppress when their source pool is empty.
- **impact**: Future optional no-target fixes should check for chosen target slots before disabling skip logic globally.
- **verification**: `bun test --cwd packages/lorcana/lorcana-engine "./src/lorcana-engine-base.zero-candidate-auto-resolve.test.ts" "./src/lorcana-engine-base.auto-resolve-bag.test.ts" "./src/targeting/runtime/resolution-requirements.test.ts"`; `bun test --cwd packages/lorcana/lorcana-cards "./src/cards/008/characters/023-king-candy-sugar-rush-nightmare.test.ts" "./src/cards/001/characters/193-tinker-bell-giant-fairy.test.ts" "./src/cards/010/characters/074-finnick-tiny-terror.test.ts"`
- **candidate_for**: reinforces PR-05

### O-2026-04-28-lady-miss-park-avenue-ui-prompt

- **signal**: Lady - Miss Park Avenue's card-side resolver already returns 2 eligible cost-2-or-less character cards from discard, and simulator UI regression coverage expects the return-to-hand prompt to expose 2 slots and stay on slot 2 after the first selection.
- **impact**: For future "up to N only allows 1" reports, check simulator prompt state (`maxSelections`, active slot, repeated-slot copy) before changing card DSL that already has `count: { upTo: N }`.
- **verification**: `bun test --cwd packages/lorcana/lorcana-simulator ./src/testing/ui-state/lady-miss-park-avenue.test.ts ./src/lib/features/simulator/model/resolution-target-prompt.test.ts`; `bun test --cwd packages/lorcana/lorcana-cards ./src/cards/007/characters/028-lady-miss-park-avenue.test.ts`
- **candidate_for**: new

### O-2026-04-28-right-behind-you-no-repro

- **signal**: Right Behind You's current action DSL and simulator regression tests correctly require both a Seven Dwarfs character and a Princess character in play before offering the optional free Seven Dwarfs play. Even forced input with `resolveOptional: true` and a Seven Dwarfs hand target leaves the character in hand when the board condition is false.
- **impact**: If this player report recurs, inspect simulator UI/projection or stale deployed code before changing the card definition or condition resolver.
- **verification**: `bun test packages/lorcana/lorcana-simulator/src/testing/effects/right-behind-you.test.ts`; `bun --cwd packages/lorcana/lorcana-simulator -e '<forced resolveOptional repro>'`
- **candidate_for**: new

### O-2026-04-21-set-012-batch-missing-cards

- **signal**: 15 cards in set 012 had `missingImplementation: true` with text but no abilities array. All resolved without engine changes using existing DSL — keyword helpers, triggered abilities, static conditions, "may enter play exerted" two-ability pattern, `property-modification` for name aliases, `CHARACTERS_HERE` location triggers.
- **impact**: Batch authoring should start by matching printed text against PATTERNS.md before considering engine work.
- **verification**: `bun test --cwd packages/lorcana/lorcana-cards src/cards/012/`; `rg -l 'missingImplementation: true' packages/lorcana/lorcana-cards/src/cards/012/ --type ts` (empty).
- **candidate_for**: reinforces PR-01, PR-02. Adds support to C-01 (Gizmoduck cost filter).

### O-2026-04-11-shift-trigger-rules-handoff

- **signal**: THE-958 reproduced as a shift-trigger interaction; rules already covered it (CR `4.3.2`, `4.3.3.1`, `6.2.2`, `6.2.7`, `6.7.2.1`, `8.10.1`). No engine bug.
- **impact**: For "if you used Shift" bug reports, validate both shift and hard-cast branches; intervening-if checks resolve at trigger resolution time.
- **verification**: Indexed CR sections under `lorcana-rules/indexes/by-section/04` and `08`.
- **candidate_for**: new (shift-trigger-handoff).
