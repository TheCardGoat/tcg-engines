# Grand Archive UI completion loop

Started 11 October 2026. Owner: agnostic-simulator. Scope: the existing Grand Archive simulator, its native adapters, and reusable presentation components. This is local simulator work; it does not certify hosted transport or every card implementation.

## Direction

Keep the existing R3F table, Cambria art, readable physical cards, and mirrored seats. Use compact edge controls and contextual decisions. DOM owns accessible prompts and inspection; R3F owns card geometry and motion. Native engine state owns legality and outcomes. Retain shared motion timing, sound settings, and reduced-motion behavior.

Do not build another renderer or fixture catalog. Extract a shared component only where Grand Archive and an existing Alpha Clash or Cyberpunk consumer can use it. Keep rules and private-zone visibility in game adapters.

## Audit and work queue

| Area | Existing foundation | Work and acceptance |
| --- | --- | --- |
| Board | R3F board-renderer with shared Canvas, SceneCard, pose and texture hooks | Preserve production board and stable mounted scene across actor changes |
| Opening | Engine pregame, opening presentation fixtures, materialization | Connect real opening choices and shared animation/audio; prove native progression |
| Combat | Targeting fixture, intent and stack, combat flow | Exercise attacker, target, opportunity and resolution; preserve native submissions |
| Selections | Canonical draft supports native decisions | Expose usable board and focused choices, multi-selection, optional choices, ordering, allocation and partition where native engine supports them |
| Costs | Native structured declaration inputs | Exercise reserve/memory, materialization and multi-input payment through the same draft |
| Deck and zones | Viewer-safe piles and inspector | Native search/reveal/top-bottom/recollection fixtures; preserve private information and native order |
| Status and counters | Counter projection and screen-position overlays | Audit every native state/counter; supply readable non-color badges and counts |
| Inspection and hand | Existing preview and zone tools | Reuse compatible interaction primitives; keyboard/touch access and viewer-local arrangement |
| Motion and sound | Shared presentation package; GA prototype sounds | Connect production feedback to shared settings and cues; no replay/undo sound bursts |
| Evidence | Existing game fixture routes and focused tests | Extend with legal pre-action native fixtures and player-visible results |

## Coordinator loop

1. Audit one bounded surface against native adapter capabilities and current consumers.
2. Assign one owner per file group. Agents preserve other work and report dependencies before editing shared files.
3. Implement the smallest complete native flow. Reuse shared components before adding game-specific presentation.
4. Run focused checks in the owning package. For compound requests, test each input transition through the active UI, including omitted optional costs and fixed downstream values. A successful complete payload alone does not prove that the player can reach it. Start only the simulator needed for browser proof.
5. Review the code and exercise player actions in the in-app browser at desktop and portrait sizes. Inspect screenshots for R3F states.
6. Record failures and their owning boundary here. Repair confirmed failures, then repeat the failed check.
7. Update the coverage ledger with evidence and explicit limits. Assign the next open item. Finish only when the scoped native interaction inventory has no unhandled UI paths.

## Evidence ledger

- Initial audit: the active board is already R3F, not a DOM migration target.
- Initial gap: adapter entity state projection retains ready/rested but drops other native states.
- Initial gap: most interaction fixtures are frozen snapshots; only a few allow native submissions.
- Initial gap: production GA feedback does not use the shared sound system.
- Environment: existing host simulator runs from the main checkout, not this worktree. Prepare a separate simulator without restarting existing services.

## Validation boundaries

Require legal pre-action fixtures and native actions for interaction proof. Static seeded decisions remain presentation-only evidence. Verify visible results and rejected-submission retry, private candidates, optional zero selection, keyboard controls, reduced motion, and no hidden-zone identity leakage. Focused adapter and UI tests plus local browser proof are the default; no deployment or platform startup is required.

## Browser review and repair ledger

All browser checks below use the real local server adapter and production R3F board at `http://127.0.0.1:5193/grand-archive/simulator/tests/`. Screenshots are in the repository's `output/grand-archive-ui/` directory. Desktop is 1440 × 900; portrait is 390 × 844.

| Flow | Observed native result | Review outcome |
| --- | --- | --- |
| `attack-targeting` | Declared Port Smuggler attack, chose Spirit of Wind, passed opportunities, resolved 1 damage | Attacking/Defending states, rested attacker, damage badge/counter and history verified |
| `native-opening` | Completed pregame; both Spirits entered, local hand showed seven faces and opponent seven backs | Native result and anonymous opponent hand verified; opening planner tests verify reveal/deal sequence |
| `native-glimpse` | Activated Scry, paid Woodland Squirrels, resolved Rai trigger, put Gray Wolf bottom and Favorable Winds top; confirmation changed Memory 1→2, Deck 4→3 and cleared stack | Found missing serialized art and a stalled forced trailing input; both repaired and retested in portrait |
| `native-recollection` | Materialized Rai, paid one memory, resolved entry trigger | Two Enlighten counters and touch inspector verified; visible material chooser added after discoverability review |
| `native-number` | Orb of Hubris drew two cards, then returned two selected hand cards to main deck | Number control, multi-selection and exact native outcome verified |
| `native-distribution` | Played Song of Nurturing, paid two cards, played Rhapsody, banished three Fire cards, split damage 1/2 across Spirit and Tortoise | Native outcome, damage badges/counters and history verified; shared modal clipping repaired and full cards/confirmation retested at desktop and portrait sizes |
| `native-search` | Activated Luxera's Map; shared search selected Gray Wolf and moved it into memory | Full-card shared chooser, minimize/restore, native submission, and private candidate removal on viewer change verified |
| `native-starcall` | Activated Scry the Stars, chose the legal Woodland Squirrels, put the other viewed cards on the bottom, confirmed and passed Opportunity | Free Starcall skips invalid payment proposals; Woodland enters the field with Starcalled badge and the stack/decision clear. Sequential UI regression now covers the full flow |
| Local hand arrangement | Moved Scry from position 1 to 2 using Enter in its inspector | Touch-sized controls, full payment label and compact portrait layout verified; invariant tests prove no native submission or non-hand reorder |

Additional review repairs: sidebar champion lookup now uses the field instead of the first authorized champion in any zone; queued audio cancels after reset or unmount; continuous removal of named player states no longer leaves stale badges. Shared draft preservation is repaired at the shared interaction boundary, so fixed downstream values survive earlier choice edits.

Sound and reduced-motion switches were exercised in the portrait activity drawer and restored to their initial values. Audio tests verify cue dispatch, silent initial/Undo/viewer baselines, and cancellation of queued cues; browser work does not certify speaker output. The final browser checks had no new console errors after the earlier HMR context-replacement failure.

Starcall review also showed why native complete-payload tests are insufficient: the active UI first stalled at an irrelevant optional champion payment. Native-probe filtering now removes invalid Glimpse proposals before building inputs. Shared optional-selection controls can advance a genuinely optional step before a later required input. Both boundaries have focused regressions.

The standalone simulator runs in this checkout. Other checkouts' Vite and Docker services were left running. Browser review uses a temporary ignored Vite config with HMR disabled to avoid module-context replacement during concurrent edits. This is not a product or deployment configuration change.


## Adapter and status evidence — 11 October 2026

Native object and activation state unions have exhaustive badge labels. Effective keywords come from the engine's active-keyword read API. Public player states use effective continuous-state evaluation, including removal of a named state value. Status tests drive real Speed Potion (Agility) and Hidden Secrets (Stealth) through native actions. Named counters and mastery remain distinct. Both viewers receive public states; private objects and decision resources stay scoped to the authorized viewer.

The adapter enriches partition, allocation and semantic Glimpse candidates in both direct and serialized viewer paths. Real Scry the Skies verifies art, names, native top/bottom submission and observer privacy. Glimpse candidate proposals are checked with native runtime probes before UI inputs are derived; a real Scry the Stars regression verifies that free Woodland Starcall does not expose the invalid champion-payment step and that probes preserve the authoritative state root. Repeated catalog selections use the existing allocation input and decode counts back to repeated native IDs. The native read descriptor supplies allowed candidates and count bounds; native command validation remains authoritative. The wire uses its maximum safe integer for an unbounded native count. Engine-only tests verify fixed and variable totals, duplicate generation, invalid values, names/art and chooser-only resources. Lorraine Ascendant Wings is not claimed as a practical real-card UI fixture: its 2024-reserve action and lineage requirements do not provide a practical legal fixture here.

Focused adapter run: **45 tests passed across 8 files** (`adapter`, `selection-matching`, `counter-presentation`, `status-presentation`, `player-status-presentation`, `partition-presentation`, `glimpse-presentation`, `repeated-selection`). Engine viewer/status checks: **8 passed**. Counter/status component checks: **11 passed**. Later UI/native-fixture checks are listed in their own evidence sections.

The known TypeScript failure at engine `procedures/effects/evaluation.ts:2910` was reproduced from a temporary `git archive HEAD` copy of the engine source and its HEAD tsconfig, using the installed dependencies. The baseline reports the same missing exhaustive cases (`event-origin`, `bound-activation-origin`). This is not a passing typecheck; no unrelated evaluation repair is included.

### Native decision inventory

The table audits every current `GrandArchiveDecision` kind against the active canonical-input path. “Shared fallback” means the active prompt supports the native candidate input types; it does not claim a dedicated real-card fixture or exhaustive rules proof.

| Native kind | Canonical shared input | Native fixture / focused evidence | Remaining UI gap |
| --- | --- | --- | --- |
| `choose-replacement` | Boolean or option | Shared fallback | No missing input renderer; dedicated real-card fixture absent |
| `choose-unique-object` | Card selection | Shared fallback | Dedicated real-card fixture absent |
| `choose-preserve-destination` | Boolean | `native-preserve` | None in input shape |
| `choose-retaliators` | Optional card selection, board handles | Combat adapter/component tests | No missing input renderer |
| `order-retaliation-damage` | Ordering | Adapter six-object permutation test | Dedicated real-card fixture absent |
| `resolve-critical` | Semantic boolean/options/targets | Shared fallback | Dedicated real-card fixture absent |
| `declare-resolved-attack` | Semantic attacker/weapon/target selections | Attack adapter and native combat component tests | No missing input renderer |
| `choose-delegated-defender` | Card selection | Shared fallback | Dedicated real-card fixture absent |
| `discard-to-influence-limit` | Fixed-count card selection | Shared fallback | Dedicated real-card fixture absent |
| `choose-recollection` | Fixed-count card selection | `native-recollection`, `native-restricted-recollection` | None in input shape |
| `announce-triggered-ability` | Semantic targets/modes/payment | Trigger adapter tests | Complex native declaration enumeration can limit candidates |
| `order-triggered-abilities` | Effect ordering with authored labels | `native-trigger-order`, adapter trigger-label test | None in input shape |
| `resolve-optional-effect` | Boolean | `native-optional` | None in input shape |
| `resolve-effect-choice` | Cards, options, number; repeated choices as allocation | `native-search`, `native-graveyard`, `native-number`, repeated-selection engine-only test | Constraint combinations still depend on native validation; no practical real-card repeat fixture |
| `retarget-stack-item` | Semantic targets | Selection-matching adapter tests | Dedicated real-card fixture absent |
| `remode-stack-item` | Semantic options | Selection-matching copied-activation test | No missing input renderer |
| `resolve-effect-payment` | Semantic accept/payment | Shared fallback | Dedicated real-card fixture absent |
| `resolve-level-up` | Card selection | Shared fallback | Dedicated real-card fixture absent |
| `resolve-direction-choice` | Option | Shared fallback | Dedicated real-card fixture absent |
| `resolve-distribution` | Allocation | `native-distribution` | None in input shape |
| `resolve-move-partition` | Ordered destination groups | `native-reveal-partition`, adapter partition test | None in input shape |
| `resolve-counter-allocation` | Allocation | `native-counter-allocation` | None in input shape |
| `announce-effect-attack` | Semantic attack declarations | Shared fallback | Dedicated real-card fixture absent |
| `announce-effect-materialization` | Semantic card/payment declarations | Shared fallback | Dedicated real-card fixture absent |
| `announce-effect-activation` | Semantic card/mode/payment declarations | Shared fallback | Native declaration sampling may omit valid combinations |
| `resolve-glimpse` | Top/bottom groups plus optional Starcall route/card/payment | `native-glimpse`, `native-starcall`, real Scry adapter test | Native sampling may limit compound choices; Starcall partition repaired |

Opening, ordinary materialization, activation modes, load, transform and combat entry are native actions outside this decision union. Their fixtures and browser checks are recorded separately. No additional unhandled canonical input kind was found. The confirmed repeat and Starcall representation gaps were repaired; native candidate enumeration limits are a separate engine scope.

### Native fixture coverage ledger

All 17 `native-*` scenarios begin with real catalog cards before activation. Each fixture exposes the native server interaction view and submits through `buildInteractionSubmission` and `submitInteraction`. No fixture seeds a pending choice. Actor controls keep the board mounted; the native opening route keeps a stable viewer and offers the other player's native pass action.

| Native fixture | Confirmed action and outcome |
| --- | --- |
| `native-opening` | Both players complete real pregame; native snapshots reveal spirits and deal seven cards per player. Opening planner uses shared transfer motion and stays silent on load, Undo, and viewer change. |
| `native-recollection` | Materialize Rai, pay memory, gain enlighten, and recollect remaining memory. |
| `native-glimpse` | Scry the Skies orders top/bottom, including bottom-all, and draws the correct next card into memory. |
| `native-distribution` | Song of Nurturing harmonizes Erupting Rhapsody; banish Fire cards and split damage. Initial hand is bounded to six cards. |
| `native-number` | Orb of Hubris chooses a draw count, then returns that many cards to the shuffled deck. |
| `native-modes` | Hidden Secrets selects a mode and applies its result. |
| `native-optional` | Creative Shock draws/discards and accepts or declines its optional damage. |
| `native-search` | Luxera's Map exposes a private native search and moves the selected card to memory. |
| `native-graveyard` | Erupting Rhapsody selects multiple graveyard cards for banishment. |
| `native-trigger-order` | Two Sage's Urn triggers are reordered, then both receive age counters. |
| `native-reveal-partition` | Advent of the Stormcaller reveals cards and confirms ordered top/bottom routes. |
| `native-counter-allocation` | Charge Static creates three counters; Triboelectric Fortification removes two, deals two damage, and gives Training Sword two durability. |
| `native-restricted-recollection` | Hoarfrost Hold receives frost through its native effect; the opponent chooses two of three memory cards at recollection. Only that actor sees choice inputs. |
| `native-transform` | Idle Fatestone reveals an odd-cost real card and switches to its transformed face. |
| `native-load` | Viridescent Aetherstreak selects distant/load modes and loads onto Salamander's Breath with the correct native host link. |
| `native-preserve` | Tera Sight enters the material deck preserved and returns to hand through a later native materialization action. |
| `native-starcall` | Scry the Stars opens native Glimpse; Woodland Squirrels activates for zero reserve through the explicit Starcall route. The alternate branch returns all viewed cards to the ordered deck. |

Evidence limits: these fixtures prove local native-engine/protocol behavior, not hosted matches. Browser evidence is recorded separately by the coordinator. Repeated effect selection is adapter-tested but has no practical real-card fixture: Lorraine, Ascendant Wings costs 2024 reserve and requires an Ascendant Lorraine; no legal setup with that subtype grant was established. Multi-retaliator order has no separate real-card fixture in this registry; existing attack-targeting covers combat. Viridescent's third mode pair (prevent damage/load) is not exposed in the current bounded legal-command sample; the fixture uses the available distant/load pair. This is a native declaration enumeration boundary, not proof that every legal combination is reachable in the UI.

Validation: `vp test run --configLoader runner src/games/grand-archive/native-fixtures.test.ts` passed all 37 tests from `apps/multi-game-simulator` (2026-10-11). Fixture registry, confirmed opening planner, and Board tests also passed in the preceding focused run; the coordinator records the final consolidated count. The app-wide TypeScript check remains blocked by existing unrelated diagnostics; no diagnostic references `native-fixtures` or `board-renderer/opening`.

### Final active UI and shared-consumer validation — 11 October 2026

The final combined app run passed **244 tests across 20 files** in 62.22 seconds. This includes active Grand Archive UI, all 37 native-fixture tests, the opening planner, shared search/allocation prompts, and affected Alpha Clash search, native choice, and hand-arrangement consumers. The actual serialized native UI tests drive Scry the Skies and Scry the Stars from legal pre-action fixtures through each prompt. The Starcall case ends with the exact chosen Woodland Squirrels instance on the field, an empty stack, and no pending decision. Separate regressions verify that a genuinely optional payment with a positive minimum can be skipped before a required next input; existing zero-selection board gestures still work.

Run from `apps/multi-game-simulator`:

```sh
pnpm exec vp test run --configLoader runner src/games/grand-archive/GrandArchive*.test.tsx src/games/grand-archive/native-fixtures.test.ts src/games/grand-archive/board-renderer/opening.test.ts src/components/SearchRetrievePrompt.test.tsx src/components/SharedInteractionPrompt.test.tsx src/games/alpha-clash/search-retrieve-fixture.test.ts src/games/alpha-clash/choice-controls.native.test.tsx src/games/alpha-clash/components/Arena3D/inspection-arrangement.test.ts
```

The unchanged shared draft/prompt package checks passed **68 tests across 2 files**. This scope verifies forced implicit input retention, optional step navigation, and shared prompt behavior. Combined coverage for these app and package commands is **312 tests across 22 files**; adapter and engine checks elsewhere in this document are separate.

Run from `packages/simulator-ui`:

```sh
pnpm exec vp test run src/interactions/InteractionDraftContext.test.tsx src/components/InteractionResolutionPrompt.test.tsx
```

`git diff --check` passed. The final app `pnpm exec tsc --noEmit` still reports the known unrelated cross-game diagnostics and baseline engine evaluation failure noted above; no diagnostics reference the changed active Grand Archive UI, shared search/allocation prompt, local card-order helper, or Alpha hand-arrangement helper. These checks prove local UI/protocol behavior and shared consumer compatibility; they do not prove hosted matches or deployment.

## Second browser review — 11 October 2026

All 17 new native scenarios were exercised through the in-app browser on the existing standalone simulator. Review started from legal pre-action fixtures and used the visible native controls. Desktop review used the default approximately 1265×712 viewport; focused mobile checks used 390×844. No platform services were started.

Confirmed defects and repairs:

- Compact number, boolean, and payment-order prompts inherited an absolute-position height limit from the board overlay. Inside Grand Archive's small HUD host, the controls collapsed to a thin strip. Shared `SharedInteractionPrompt` now accepts inline placement, with content-sized rows and viewport-bounded scrolling. Alpha Clash retains the default overlay placement. Number, optional-effect, mode, and cost-order controls were exercised after reload; mobile payment order completed native transformation into Bolstered Boar.
- Mode declarations displayed internal IDs such as `mode-1`. The Grand Archive adapter now uses the mode text already authored in native card definitions, without changing submitted IDs. Hidden Secrets' stealth and draw modes both completed; the draw mode was submitted at mobile width.
- Preserve return was accessible only through zone inspection. It now appears in the existing materialization chooser with return-to-hand wording. Tera Sight was activated, preserved, and returned through the new visible chooser on turn three.
- Reserved fixture labels were incorrect after following the other player. Board identity, pile labels, targets, and sidebar now resolve You/Opponent relative to the current viewer; actual player names remain unchanged. Browser verification showed the correct opposing/own hands and piles after the turn switch.
- Untouched zero allocation said Ready to confirm but disabled confirmation. Shared readiness and draft confirmation now support an explicit empty allocation. Opening or clearing the prompt does not auto-submit. Triboelectric Fortification confirmed zero directly, resolved without damage or counter removal, and retained the three static counters. A separate two-counter playthrough verified damage and durability changes.
- Starcall offered invalid cards in its destination group. The adapter now supplies existing per-route candidate limits from native legal answers. Gray Wolf and Favorable Winds have disabled Starcall controls; Woodland Squirrels remains legal.
- Three quick-placement buttons overflowed into the adjacent card, intercepting pointer clicks. Shared destination controls now stack inside each card, wrap labels, and retain a 44px minimum height. The previously intercepted Favorable Winds click now moves the card; the remaining Gray Wolf placement and native Starcall resolution completed on mobile.

Scenario outcomes: opening revealed both spirits and dealt seven cards with opponent privacy; Rai materialization gained two enlighten counters and recollected both remaining memory cards; Glimpse handled bottom-all and the subsequent memory draw; Harmonize allocated native damage; Orb accepted zero; Hidden Secrets applied stealth and drew into memory; Creative Shock discarded and dealt optional damage; Luxera's Map searched into memory; Rhapsody banished two chosen graveyard cards; reversed Urn triggers each gained age; reveal partition accepted ordered destinations; static allocation handled two and zero; restricted recollection selected two of three cards; Idle Fatestone transformed; Viridescent loaded onto its weapon; Preserve returned Tera Sight; Starcall put Woodland Squirrels on the field with its badge.

Validation for this round:

- Final app regression command: 82 tests passed across native fixtures, serialized native choices, shared prompt, and affected Alpha Clash native/search consumers (5 files).
- Board/Tabletop regressions: 48 passed, including native Preserve and relative-player-label cases.
- Adapter mode/selection/core checks: 39 passed; Glimpse/partition checks: 3 passed.
- Shared simulator-ui draft/prompt/allocation checks: 72 passed; shared ordering checks: 5 passed.
- Shared simulator-ui typecheck passed. The adapter typecheck still reports the previously verified engine `evaluation.ts:2910` baseline error. A full app typecheck was not repeated.
- No browser console errors were recorded in this review tab. `git diff --check` passed.

Screenshots are under `output/grand-archive-ui/round-2/`, including repaired desktop/mobile cost order, zero allocation, Preserve return, and Starcall destination controls. The earlier engine enumeration limits remain; this review does not prove every card combination, hosted matches, deployment, or speaker output.

Review-loop improvement: test untouched zero values as well as positive values; inspect both short and long compact choices; follow the opposing viewer; and verify pointer placement with adjacent cards and three destinations. A successful semantic action or full native payload alone does not prove that the visible pointer control is usable.

## Third browser review — mobile, combat, and multi-step choices

Reviewed the existing standalone simulator in the in-app browser at 320×568, 390×844, and 844×390. Confirmed 1024×768 still uses the desktop sidebar. No platform service or hosted flow was involved.

Repairs:

- The shared viewport shell now uses its existing mobile drawer for short windows up to 1024px wide and 520px high, including precise-pointer browser review. Existing explicit layout overrides remain authoritative. The Grand Archive board uses the space assigned by the shell in both layouts, so zone controls and the board no longer extend behind the mobile rails.
- The shared resolving prompt honors an explicit presentation title. Grand Archive's small-screen discard/target rail now says Choose cards instead of displaying the whole card text in uppercase. Full native effect text remains available under Prompt controls → Show details. Native choices without an override retain their original heading.
- Glimpse partitions now follow the selected branch using existing conditional inputs. Reorder contains only top/bottom routes. Starcall requires the selected card in its Starcall route and the remaining cards on the bottom. No new shared contract or engine rule was needed.
- Native declaration labels identify the controller of card targets. Same-name opposing Spirit of Wind cards now read your Spirit of Wind and opponent's Spirit of Wind; submitted target IDs are unchanged.

Browser evidence:

- Declared Port Smuggler against the opposing Port Smuggler, chose retaliation, and reached one damage on each unit and combat cleanup. A second playthrough chose Take hit and recorded only incoming damage. Attack cancellation left the board at Opportunity without an attack. Combat badges and activity history were inspected in portrait and landscape.
- Creative Shock completed payment → draw → discard → optional choice → target → damage at small phone width. Declining the optional effect also resolved. Prompt details, hiding details, and repositioning worked while the choice stayed active.
- Orb of Hubris drew three, accepted selection/deselection and replacement of a selected card, then returned exactly three cards and left the unselected Gray Wolf in hand.
- Deck ordering supported reordering, minimize/restore with the draft intact, and native submission. Fresh replays verified both repaired Starcall branches on mobile; Woodland Squirrels entered with Starcalled after the Starcall branch.
- Viridescent Aetherstreak completed mode/payment → resolution → weapon choice. The repaired opponent-labelled target made the opposing champion Distant and loaded the card onto Salamander's Breath.
- No error entries were recorded by the browser console for this review. Evidence is in `output/grand-archive-ui/round-3/`.

Focused checks: shared viewport shell 17/17; shared resolving prompt 57/57; shared prompt and affected Gundam consumers 36/36; affected Grand Archive adapter suites 43/43; native fixture tests 37/37; serialized native choice tests 3/3. Full app typecheck and hosted flows were not repeated; previously documented engine typecheck and enumeration limits remain.

The final combined app run passed 126 tests across five files: Grand Archive Hands, Board, and NativeChoices, Alpha Clash native choice controls, and SharedInteractionPrompt. This overlaps some checks above; the counts are not additive. Final `git diff --check` passed.

Review-loop improvement: include short landscape windows, alternate combat decisions, changing a selection before submission, minimized drafts, and each conditional destination branch. Check visible labels for same-name cards controlled by different players.

## Mobile crowded-board review — 2026-10-11

Browser scope: native local fixtures at 667×375 and 844×390, with a 375×667 rotation check. No hosted match or physical-device proof.

Confirmed issues and changes:

- Narrow card inspection hid artwork and rules below long actions. Grand Archive now composes shared `CardInspectionDialog` and `CardInspectionLayout`; short landscape keeps complete artwork beside independently scrolling details. Hand movement and nested status inspection remain usable.
- Hand status buttons could cover a card in a thirteen-card hand. Hand states now appear in card inspection, while field state badges remain on the board.
- Crowded-field overflow text overlapped card names and had no direct action. Each player's overflow now opens the existing zone inspector. Zone grids have readable names for both field crops and full cards, plus a 44px close control.
- Shared search choices clipped large cards behind the footer. Short landscape now shows complete cards with name captions, a compact resolving-card row, a separately scrolling candidate list, and fixed 44px controls. This also applies to Alpha Clash's shared search surface.
- Payment display labels group repeated names (`Woodland Squirrels ×12`) without changing native card IDs, payment order, or names containing commas.

Browser evidence: inspected cards from both crowded fields and an eight-card graveyard; opened an overflow Luxera's Map; moved a hand card; opened and closed Efficiency details; scrolled long rules with artwork retained. Completed the twelve-card Map search, scrolled to the final candidates, rotated with the choice open, searched for Arcane Sight, selected it, and verified native memory/shuffle events in history. Screenshots and history are under `output/grand-archive-ui/mobile-round3-*`.

Focused validation: Board, Statuses, and SearchRetrievePrompt 41/41; native fixture/catalog tests 42/42; payment-label and mode-presentation tests 4/4. Broader shared TargetModal checks retained two callback expectation failures, reproduced with this round's caption removed. A Cyberpunk prompt test failed in native setup with NOT_YOUR_TURN before UI assertions.

Known engine limit: a main-phase fixture with eight own and seven opposing non-champion field cards stalls in legal attack enumeration. It expands target/weapon subsets before rejecting invalid attacks, even for rested units. Engine code was not changed in this presentation round. The crowded native inspection fixture therefore starts before materialization; the twelve-card native search is a separate playable fixture. Crowded main-phase combat is not validated by this round.
