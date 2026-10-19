# Validation report — 2026-10-10

## Required browser path

Use board controls, card inspection and dedicated choice controls for gameplay. Do not use **Match actions & log / More** to activate actions, submit choices, pass, undo or otherwise advance the game. It is an escape hatch, not the acceptance path. If a needed action is absent from the board, stop that case and record a UI reachability failure; native tests can still establish engine/adapter behavior separately.

Earlier runs that used this escape hatch are retained only as diagnostic evidence. They do **not** establish accepted real-board completion, even if their final board state is correct. This affects the recorded Death and Trugg ability flows, Rizlac recovery, T-Bone response, reveal fallback selection, and any other run whose steps use that panel. Revalidate those cases through board controls after the missing controls are addressed. Do not use the log as a substitute for visible board feedback.


## Result and scope

The audit package contains **37 interaction cases and 56 named board variants**. All 56 boards contain official cards, start before the tested command, and pass the native deck-construction validator. Shared factories preserve existing fixture IDs and now complete background card ledgers instead of using synthetic harness fillers. Factories do not inject pending choices or execute setup moves.

**Final acceptance is not complete.** Construction validation is not a historical replay of the starting zones/counters. Browser evidence samples several flows; it does not cover every case or every perspective. Opening recordings with audio and a muted/reduced-motion comparison are now captured. Remaining interaction recordings are open. The matrix must not be read as 37 polished or fully accepted interactions.

## Automated checks

Run focused simulator checks from `apps/multi-game-simulator` with `vp test run <source paths>`. Run adapter checks from `packages/alpha-clash/alpha-clash-server-adapter` with `vp test run --configLoader runner`.

| Scope | Latest result |
|---|---|
| Native coverage, including all 56 construction audits, native lethal/deck-out and Ambush lifecycle, the nested Counter chain, native cost availability and combat target/obstructor boundaries and local prevention splits and shared non-clash player declarations | **30 passed** |
| Search/retrieve, including zero/one/many candidates | **7 passed**; combined with native coverage: **25 passed, 2 files** |
| Native coverage plus visual fixture checks after shared non-clash variant | **88 passed, 2 files** |
| Destination | Previous focused run passed; no change in this pass |
| Opening native lifecycle and choreography hook | **6 passed, 2 files** |
| Adapter lifecycle and health payment | **28 passed, 2 files** |
| Whole adapter suite, including explicit native trigger declarations | **52 passed, 11 files** |
| Whole Alpha Clash simulator suite before inspection route alias repair | **256 passed, 9 failed; 31 files** |
| Inspection suites after aliasing the old route to `arena-crowded` and exposing preferences throughout the match | **7 passed, 1 failed**; public pile click still opens the library instead of direct ordered inspection |
| Adapter `tsc --noEmit` | Passed |
| App `tsc --noEmit` | Fails on existing test projection and transitive errors; no diagnostics in changed production files. Not a clean app type gate. |
| Scoped format/lint on 39 changed/new TypeScript files | Format passed; lint reports four pre-existing Arena warnings (unused helper, unbound method, numeric template narrowing). No errors. Final format pass also covers alias/preferences edits. |

The remaining synthetic preview failure expects the old `Decline effect` label. Synthetic component tests remain separate from native fixture coverage. The public-pile inspection failure is a current UI defect, not a missing native card case.

Native checks now exercise required Trugg/Death declarations, Portal open/close, Weapon attach/detach, native mulligan declaration order and private zero/all-card selections. Rooftop Roll and Earthly Barricade resolve a real nested Counter chain. Set is available without play targets. Quick Actions are not advertised as normal primary-phase plays.

## In-app browser evidence

Browser: Codex in-app Chromium, user agent Chrome 155.0.0.0. Local Vite development server at `http://127.0.0.1:5193`. These are local simulator checks, not hosted-match proof.

| Case / path | Observed result | Evidence |
|---|---|---|
| Payment cancel and retry | Cancel left the hand/resources unchanged. Retried through inspection and Pay automatically. Native acceptance moved the source out of hand and engaged three resources. | [Payment at 1366×768](evidence/payment-1366.jpg) |
| Priority and other seat | Hot seat moved to Player 2. Passed Player 2, then Player 1. Morac entered play; its optional search appeared. | [Opponent response](evidence/opponent-response-1366.jpg) |
| Search chain | Used native optional trigger; 18 eligible copies grouped into 7 stacks. Selected Gur at 844×390; deck changed 36→35 and hand 0→1. Morac remained in play; 7/10 resources remained ready. | [1920×1080](evidence/search-picker-1920.jpg), [1366×768](evidence/search-picker-1366.jpg), [844×390](evidence/search-picker-844.jpg), [result](evidence/search-complete-1366.jpg) |
| Single retrieval | Played Weapon’s Depot, paid three resources, passed both seats and accepted its trigger. The picker showed exactly one Heavy Metal. Clicking it committed the fixed Accessory destination: own Oblivion 3→2, accessories 0→1. | [picker](evidence/retrieve-single-picker-1366.jpg), [result](evidence/retrieve-single-result-1366.jpg) |
| Search reset | Reset restored the source to hand, empty Clash Zone and ten ready resources. Initial pre-repair run also confirmed cancel/retry. | Native reset factory plus browser-observed counts; no separate reset capture |
| Keyboard inspection | Enter opened Morac inspection without playing it. Escape closed it. Reduced-motion media emulation retained the inspection controls. | Observed controls; no motion recording |
| Opening mute / reduced motion | Unchecked Sound, checked Reduced motion, then Begin opening reached the eight-card selection screen. Restored both preferences afterward. | [settings](evidence/opening-muted-reduced.jpg), [selection screen](evidence/opening-reduced-complete.jpg) |
| Opening replacement, repaired | Player 1 declared Replace; Player 2 declared Keep; Player 1 selected Captain Maxine Riggins and pressed Replace 1; accepted native replacement completed, then Start game reached Turn 1 Resource Step. Opponent view showed only that seat’s own hand. | [native result](evidence/opening-native-start-1366.jpg); old [rejection](evidence/opening-mulligan-rejected.jpg) retained as historical defect evidence |
| Attacker-specific targets | Sonoro offered engaged Magnate and the opposing Contender, but not ready Sonoro. Cancelled, chose LINN, then selected ready Sonoro; native clash began. | [Sonoro](evidence/attack-sonoro-targets-1366.jpg), [LINN](evidence/attack-linn-targets-1366.jpg) |
| Flight obstruction and full clash | Attacked with Plasmax, passed Counter. Only LINN and Plasmax appeared as candidates; Sonoro was excluded. Chose LINN, passed both buff steps and both before-damage priorities. Native log: LINN takes 4, Plasmax takes 2, LINN defeated. | [1920](evidence/obstruct-flight-1920.jpg), [1366](evidence/obstruct-flight-1366.jpg), [844](evidence/obstruct-flight-844.jpg), [result/log](evidence/obstruct-flight-result-1366.jpg) |
| Torment minimum and resolution | One selected obstructor cannot confirm; two can. Passed both buff steps and both before-damage priorities. Sonoro and LINN moved to Oblivion, with 3 excess damage reducing the Contender to 27. | [one selection](evidence/obstruct-torment-one-1366.jpg), [two selections](evidence/obstruct-torment-two-1366.jpg), [result/log](evidence/obstruct-torment-result-1366.jpg) |
| Native game end | End turn with an empty opposing deck produced Player 1 wins / decked. Sonoro’s unblocked clash reduced the opposing Contender from 1 to −1 and produced contenderDefeated. Both ended through native commands; no post-game Concede remains. Raw reason codes and stale priority/waiting controls remain UI failures. | [failed draw](evidence/finish-deckout-1366.jpg), [lethal](evidence/finish-lethal-1366.jpg) |
| Ambush lifecycle | Opened Portal, Set Gur, ended turn, skipped Player 2’s Resource Step, played Sonoro, paid Gur’s one-black response cost, then passed both native response windows. Gur entered face-up and Sonoro resolved. Opponent saw a card back before response. | [hidden view](evidence/ambush-opponent-hidden-1366.jpg), [cost](evidence/ambush-cost-1366.jpg), [result](evidence/ambush-complete-1366.jpg), [response recording](evidence/ambush-response-audio.mp4), [entry recording](evidence/ambush-entry-audio.mp4) |
| Portal toggle | Opened then closed through the drawer. Ready resources changed 9→7→5; both events appear in the native log. No prominent board Portal state was visible in this sample. | [toggle result](evidence/portal-toggle-1366.jpg) |
| Weapon attach/detach | After reset, selected Death Blades and Clarity through normal controls, then Detach. Native log records both accepted transitions. A prior attempt after spending black resources rejected atomically, but Attach remained enabled: affordability feedback still needs work. | [detach result](evidence/weapon-detach-1366.jpg) |
| Opening motion and audio | Captured the real Begin opening sequence at 1366×768, with sound enabled. Contenders enter, shuffle/deal follows, declaration controls become available. | [recording](evidence/opening-motion-audio.mp4) |
| Opening muted/reduced comparison | Unchecked Sound and checked Reduced motion through the drawer. Captured the same native opening; both declaration controls remain available. | [comparison](evidence/opening-muted-reduced.mp4) |
| Native counter creation | Opened Portal, selected opposing Sonoro, and observed one Scarab Counter. Attached Heavy Metal to Gearwin, accepted Temper, and observed one Temper Counter. Ready resources changed 16→14→13. No counters were seeded. | [Scarab](evidence/counter-scarab-native-1366.jpg), [Temper](evidence/counter-temper-native-1366.jpg) |
| Crowded board | Eight friendly Clash cards, twelve-card hand; Next hand cards changed page 1/2→2/2 and exposed the remaining five cards. | [1366×768 board](evidence/crowded-1366.jpg) |
| Catalog | Search filters case titles/IDs/fixture IDs, links reuse existing board routes, and construction results are separate from engine and UX status. | [catalog](evidence/catalog.jpg) |

The three requested search viewports were checked with a single clean browser viewport override. Earlier captures made with overlapping raw-CDP and browser overrides were invalid and removed. They are not UI-defect evidence. Viewport and reduced-motion overrides were reset after testing.

No physical touchscreen was tested. At 844×390, only three grouped cards are visible at once; the rest require scrolling. Card rules text and small top controls remain hard to read. The scrolling affordance is weak. Desktop/laptop source context and selection controls remain visible. These observations justify `needs-work`, not a complete accessibility pass.

Opening audio was captured from the running app’s Howler master output into a temporary Web Audio stream. The stream did not replace playback or generate game sounds. Normal output measured peak −21.7 dBFS; the muted capture was at the 16-bit analysis floor (−91 dBFS). This confirms a signal in the normal sample and no measurable signal in the muted sample. It does not establish full mix quality or all overlap limits. The capture node was disconnected and its page reference removed afterward.

Video uses timestamped Chromium screencast frames, encoded at 30 FPS. The first frame was aligned to the audio recorder’s start (19 ms normal, 27 ms muted). This is a review recording, not a 60 FPS benchmark. Normal changing frames spanned 5.79 seconds; reduced-motion changing frames spanned 0.69 seconds. Silence after the recorded sequence is trimmed. No microphone or desktop audio was captured.

## Performance sample

Hardware: Apple M5 Pro, 48 GiB RAM. Browser above; Vite development build; 1366×768. A two-second requestAnimationFrame sample around Next hand cards on `arena-crowded` recorded **118 intervals, mean 17.09 ms, p95 18.30 ms, one interval above 33.4 ms**. [Raw sample](evidence/frame-sample.json).

This is approximately 58.5 callbacks/second for the sample, below a strict 60 FPS target. It measures browser callback cadence, not GPU render completion, and includes idle time around one animation. No full frame trace, GPU/driver identification, production-build benchmark, or complex-resolution recording was captured. Performance acceptance remains open. The temporary sampler left no persistent page instrumentation.

## Completion gaps and follow-up

1. Both-replace with zero/all selections now passes in the laptop browser. Complete its keyboard, viewport and audiovisual comparisons; native boundary tests and the earlier single-replacement path also pass.
2. Complete remaining forced-obstructor combinations and multi-target candidate boundaries. Native pair-based attack checks and Flight/Interception/Torment obstruction now pass. Required/nested targets, Portal close, detach and Quick Action timing gaps are repaired and tested.
3. Complete remaining minimum/maximum/chained boundaries and motion/audio acceptance for the now-native shared non-clash case. Local clash prevention now has split/concentrated native checks and laptop browser evidence. Ambush Set/later-turn response now has native and browser coverage; its mute/reduced-motion comparison remains open. Shared clash prevention now has a native case.
4. Prove historical reachability for arranged counters, turn numbers and zone states. Construction alone does not certify them.
5. Exercise each matrix row in the browser for actor/opponent, cancel/retry, keyboard and supported undo. Current screenshots cover a subset.
6. Extend opening recording evidence to the remaining flows with sound, mute and reduced-motion variants. Measure representative production-build sequences against the shared motion/audio specification.
7. Extend reference observation with current combat/priority gameplay where the reference study currently has only historical developer/support material.

The adapter, native fixture catalog and opening lifecycle were repaired. An existing native target collector is newly exported; no engine rule implementation changed. Gameplay protocol, hosted services, deployment and production visual redesign remain outside scope.

### Combat review findings

The obstruction title previously said WAITING and named Player 1 while Player 2 owed a decision. The adapter now derives readiness from the actual native decision actor, and the board shows CHOOSE OBSTRUCTORS / YOUR CLASH BUFF / BEFORE DAMAGE with the correct priority seat. Before-damage Pass is advertised only to the native actor.

The current obstruction path still requires More → Declare obstructors → Choose card. Its picker uses text buttons instead of large art-based choices. At 844×390, the nested drawer and picker controls are too small for comfortable touch use. These are production UX backlog items, despite correct candidate legality and native completion. Torment now has native and browser proof: one choice leaves Confirm disabled; selecting Sonoro and LINN enables Confirm. Both are defeated at resolution and the defending Contender falls to 27 health. The picker shows only “1/3” and “2/3”, with no visible two-card minimum explanation. Add a concise minimum label without requiring rules text inspection.

### Counter fixture repair

The old `counter-types` route placed all six counter types directly on arbitrary cards. It now starts without counters and uses official native creation paths: Mean-Streak, Newfound Powers → Streak; Infectious Presence → Toxic; Mark of the Hunted → Bounty; Accumulation targeting Ancient Scarab → Collection; Ancient Scarab’s Portal trigger → Scarab; Gearwin’s attachment trigger → Temper. Reset between paths. Five native tests cover all six results. Scarab and Temper have browser evidence; the other four still need browser recordings. The native Scarab effect currently emits the title-case `Scarab` key; the board maps its display case-insensitively. This audit does not establish counter-controller semantics.

The generic visual-fixture check no longer requires every opponent hand to be nonempty. Empty-hand combat and endgame variants are valid; any cards that are present must still project with hidden identities.

### Ambush acceptance

The fixture `ambush-set-response` covers native Set for an Ambush Weapon and a Clash, set-turn response exclusion, hidden identity from the opposing viewer, next-turn Counter-Play response and face-up entry into Clash. The separate Counter-Attack branch excludes Gur’s wrong window and excludes Weaponry Morphing when there is no legal native host. The browser completed Gur’s Set/later-turn response and the underlying Sonoro play. Both the hidden opponent state and face-up result were captured. Response and entry recordings include the app-master audio stream; both measured at the −91 dBFS analysis floor with Sound checked. The follow-up capture audit found shared master volume at 0 while the old local Sound checkbox was checked. These are muted captures, not evidence of missing Ambush cues or sound-quality acceptance. Mute/reduced-motion comparison remains open. No synthetic host was added for the documented Synthoria selector gap.


Ambush recording details: Chromium screencast at 1366×768, 30 FPS output with a two-second final-frame hold. Response: 65 changed frames across 1.734 s; entry: three changed frames across 0.144 s. This is not a frame-rate benchmark. Audio was aligned to screencast timestamps (18.578 s trimmed before response, 15.7 ms before entry). The app used the same verified Howler module as the capture. The temporary audio node was disconnected after each segment. Both output clips have an audio stream but no measurable signal above the 16-bit analysis floor. No replacement SFX were added. [Capture metadata](evidence/ambush-recording-metadata.json).

The response path is functional but relies on More → Ambush → a textual resource select. The observed entry has no sustained travel sequence in the captured changed frames. The public log records response submission, but this sample did not add a separate face-up entry/resolution line. Those are baseline UX findings for the production backlog, not blockers to native engine completion.

### Shared sound control and capture calibration

The board Sound checkbox now reads and updates the shared simulator volume. Muting retains the last audible volume for restoration. Previously the checkbox could be checked while the shared master volume was zero. This explains the silent Ambush recordings; unmuted Ambush capture is still required.

A real card-inspection input was recorded twice through the app's Howler master output, without manually invoking a cue. With shared volume 75 (gain 0.5625), the recording peaks at −19.1 dBFS. At shared volume 0 it stays at the −91 dBFS analysis floor. These samples verify the capture path and mute behavior for inspection only. The original volume 0 and sound pack `signal` were restored. Temporary capture nodes were disconnected.

- [Audible inspection](evidence/inspection-unmuted.wav)
- [Muted inspection](evidence/inspection-muted.wav)
- [Sound control reflects master mute](evidence/sound-master-muted.jpg)

Focused sound-control checks: three tests passed (shared master mute, default enable, previous non-default volume restoration). The changed test file passes lint/type analysis. Arena production analysis retains four existing warnings. The unrelated public-pile inspection test remains a known failure from the full inspection file; it is not included in the three focused passes. `git diff --check` passed.

### Local prevention allocation

`combat-prevention-local` reuses the Counter fixture factory with a named variant. It starts at turn 13 with a ready Plasmax, Magnate and five defender resources including three blue sources. Rooftop Roll creates the barrier through its native response; no prevention modifiers or pending choices are injected. All 56 construction checks pass. Both split (one Magnate/two Plasmax) and concentrated (three Plasmax) native allocations pass; excessive totals reject without mutation. The combined native and visual-fixture run passes 86 tests. Focused lint/type analysis of the four changed fixture/catalog files passes.

Browser at 1366×768: attack → Earthly Barricade on Magnate → Rooftop Roll on Sonoro → native passes → two obstructors → native damage step → split allocation. The final point auto-submitted after a short delay. Public logs showed three prevention points, two damage to Sonoro and Sonoro's defeat; both obstructors remained in play. [Partial draft](evidence/prevention-local-partial-1366.jpg), [full draft](evidence/prevention-local-full-1366.jpg), [result log](evidence/prevention-local-result-log-1366.jpg). This run was muted and is not audio or motion acceptance. Viewport override was reset.

The baseline labels and arrows incorrectly present prevention as outgoing damage. See the revised [allocation specification](interactions.md#allocation) and [annotated six-state design](storyboards.html#allocation). No production UI redesign was added in this fixture pass.

### Shared non-clash prevention and player targets

Added `combat-prevention-non-clash` with official Soul Barrier and Erupting Force. Native responses create the shared barrier before damage; two real recipients require a one-point allocation. A player-selector adapter defect hid Erupting Force: native seat IDs were filtered as if they were card IDs. The resolver now preserves legal public player seats, and the interaction uses existing player entities. Card candidates retain the viewer-safe filter. No protocol change.

Native tests verify player entity identity, invalid friendly/Contender declarations without mutation, empty/excessive prevention rejection, actor-only choice access, and final survival/defeat. The whole adapter suite passes 52 tests; adapter TypeScript passes. Native coverage plus visual fixture checks pass 88 tests. All 56 ledgers pass native construction checks; historical reachability remains a separate audit.

Browser completed Portal → Sonoro → Soul Barrier response/sacrifice → Plasmax attack → Erupting Force/player target/payment → prevention. Keyboard Enter increased, decreased, changed the selected duplicate, and confirmed allocation. This verifies activation of controls, not a complete Tab-order audit. Public logs show one prevented damage, one unprotected defending Sonoro defeated, and the next instruction damaging opposing Sonoro and Plasmax. Both player perspectives occurred through native hot-seat changes. Original mute setting was retained; no audio acceptance is claimed.

Evidence: [player target](evidence/shared-prevention-player-target-1366.jpg), [desktop](evidence/shared-prevention-allocation-1920.jpg), [laptop](evidence/shared-prevention-allocation-1366.jpg), [scaled landscape](evidence/shared-prevention-allocation-844.jpg), [selected draft](evidence/shared-prevention-selected-1366.jpg), [result log](evidence/shared-prevention-result-log-1366.jpg). The 1366×768 modal clips the bottom of its initial candidate rows, while keyboard focus brings controls into view. The 844×390 modal clips nearly all allocation controls. The 1920×1080 capture also shows the layout extending beyond the right/bottom edges; it was taken immediately after the viewport override, so stable-layout recapture is required before classifying that larger-size result. These are captured baseline observations, not responsive acceptance. Duplicate rows have indistinguishable accessible names. Both are UI backlog items; native resolution passed. The viewport override was reset.

### Counter-transfer provenance and recording

Refactored `prompt-number` and `prompt-targets` without new duplicate routes. They begin before Newfound Powers is played; its native entry trigger creates two Streak Counters. Removed unrelated seeded Streak Counters from the remaining prompt boards. The counter variant now uses turn 13 and a blue resource for its printed cost. Focused prompt, native-coverage and visual-fixture checks pass **105 tests across three files**; focused lint/type analysis passes.

Browser at 1366×768 paid and played Newfound Powers, passed responses, verified its two-counter entry log, activated the Contender, confirmed source and destination, entered one and committed the transfer. Native result: one counter on each card and the once-per-turn ability disabled. [Creation](evidence/counter-transfer-created-1366.jpg), [amount](evidence/counter-transfer-amount-1366.jpg), [result](evidence/counter-transfer-result-1366.jpg), [log](evidence/counter-transfer-log-1366.jpg).

[Recording with app audio](evidence/counter-transfer-audio.mp4): 48 changed frames across 1.585 seconds, plus a two-second final-frame hold; encoded at 30 FPS, not a runtime FPS measurement. Audio uses the verified Howler master output with shared volume 75 / gain 0.5625, running AudioContext and visible document. The aligned clip peaks at −8.0 dBFS (mean −34.5 dBFS). No cue was invoked manually and no replacement audio was added. The capture node was disconnected; original mute, browser visibility and viewport were restored. [Metadata](evidence/counter-transfer-recording-metadata.json). Reduced-motion/mute comparison and perceptual mix acceptance remain open.

## Forced obstruction and production build follow-up

The native/visual fixture run passes 94 tests across two files, including all 56 construction audits. War creates its requirement through an attack trigger. Ready Sonoro is automatically added when the defender selects none or selects LINN. Engaged Sonoro is excluded in both cases. No pending requirement is seeded.

The production simulator build passes after restoring existing lockfile dependencies in the linked Gundam and One Piece workspaces. No dependency versions or tracked files in those workspaces changed. The preview uses the generated production build on port 4173. This establishes build availability, not 60 FPS acceptance; measurements remain pending.

Production-browser forced obstruction at 1366×768 reaches AttackerBuff through normal controls after War targets Sonoro. The zero-selection action says “Do not obstruct”, but native tests prove the required ready card is added. Saved before/result screenshots record this UX failure. Other forced variants and motion/audio acceptance remain open.

## Production performance measurement, 2026-10-10

The production preview was verified running from the successful React Router build. Hardware was checked locally: MacBook Pro, Apple M5 Pro, 48 GB RAM. The visible in-app browser reported Chrome 155.0.0.0, ANGLE Metal Renderer Apple M5 Pro, viewport 1366×768 and device pixel ratio 1. No screencast ran during measurement. Temporary requestAnimationFrame and click instrumentation was removed afterward; viewport and browser visibility were restored.

Each row measures callback intervals in the two seconds after the named real UI action. These windows deliberately exclude idle gaps between actions. The combat sample follows the native War fixture through both buff passes, both before-damage passes, and destruction of War and Sonoro. The final board has one card in each Oblivion. The dense-hand sample uses the existing 12-card hand; its historical starting-state review remains open, so it proves layout performance only.

| Production action | Intervals | Mean ms | p95 ms | Maximum ms | Above 33.4 ms |
|---|---:|---:|---:|---:|---:|
| Attacker buff pass | 119 | 16.67 | 18.30 | 18.60 | 0 |
| Defender buff pass | 119 | 16.67 | 18.20 | 18.50 | 0 |
| First before-damage pass | 119 | 16.67 | 18.30 | 18.70 | 0 |
| Final damage and destruction | 113 | 17.55 | 17.90 | 116.70 | 1 |
| Next hand page | 119 | 16.68 | 18.00 | 18.70 | 0 |
| Previous hand page | 119 | 16.67 | 18.00 | 18.50 | 0 |

The final damage window misses the 60 FPS target. The combat observer reported no main-thread long tasks; that does not identify the cause of the 116.7 ms interval. A renderer/GPU trace is needed before assigning ownership. Other samples are near a 60 Hz cadence, but their p95 intervals exceed 16.67 ms. This is a single-run callback-cadence measurement, not GPU completion proof or broad performance acceptance. No production performance fix is included in this audit stage.

Evidence: [summary and conditions](evidence/production-performance-summary.json), [combat timestamps](evidence/production-combat-frame-sample.json), [dense-hand timestamps](evidence/production-crowded-frame-sample.json), [combat result](evidence/production-combat-result-1366.jpg), [dense-hand result](evidence/production-crowded-result-1366.jpg).

## Resource chronology audit

Rule 502.1c permits at most one ordinary placement per own Resource Step; additional resources need card-effect provenance. The current publisher page still links rulebook v8.0 on 2026-10-10. The audit uses the local canonical extraction of that rule and the engine's global turn counter. [Publisher source](https://alphaclashtcg.com/how-to-play).

`resource-payment` previously placed four resources at global turn 3, when either seat could have had at most two ordinary Resource Steps. It now starts at turn 9. The shared arena arrangement, including `arena-crowded`, previously placed six resources at turn 5; it now starts at turn 13. Existing fixture IDs and action paths remain unchanged. These values remove a necessary-condition failure; they do not establish full draw, play, discard, or zone history.

`auditNativeFixtureLegality` now returns `resourceHistoryGaps` separately from `construction`. Its conservative upper bound is ceil(global turn / 2) for either seat. It intentionally does not infer the starting seat or treat extra-resource effects as impossible. An excess produces a visible reason requiring effect provenance, rather than falsely invalidating the deck. Passing this bound is not sufficient for native-fixture acceptance. A regression test confirms that the too-early payment board can have valid construction and a resource-history gap at the same time.

The native/visual fixture suite passes 95 tests across two files. Focused lint passes for all four changed files. Existing production screenshots and timing samples were captured before this turn correction and remain evidence of the earlier baseline; they are not proof of the revised initial state. The production build has not yet been refreshed for this change.

## Catalog-wide resource opportunity correction

The full initial-state audit found 33 further named variants with more resources than their global turn could support through ordinary Resource Steps. Shared factories were corrected explicitly: destination/prevention turn 17, board actions turn 19, simultaneous destruction turn 29, cost routes turn 13 (discount turn 14), optional effects turn 9, search/retrieve turn 21, Clash play turn 7, health payment turn 11, other prompts turn 13 (opponent-active Foretell turn 14). Existing native state, cards, action steps and fixture IDs are preserved. No synthetic resource-producing moves or effects were added.

[Pre-correction audit](evidence/resource-chronology-before.json) records each affected variant and reason. The permanent catalog check requires every arranged initial board to fit the conservative ordinary-resource bound. It does not reject resources created later by real actions, such as Check out my Ramp. This closes the known early-turn/resource mismatch only. Complete legal history, including how cards reached hand/board/Oblivion, remains unproved and is still an acceptance gap. Older screenshots show the previous turn labels.

Post-correction verification: 151 tests pass across eight focused native fixture files, including prompt, cost, destination, search/retrieve, Foretell, simultaneous ordering, catalog construction and resource-opportunity checks. All 56 initial boards pass the conservative resource bound. Focused lint passes for nine changed fixture/test files; `git diff --check` passes. The temporary report test was removed after saving its output.

## Pacing specification detail

Resource deployment, decision priority and turn advancement now have distinct seven-part specifications and six-state annotated SVG diagrams. They define draft versus native commit, actor/opponent visibility, keyboard and drag paths, interruption, reduced motion and per-event audio behavior. The diagrams are target-design artifacts, not mocked native evidence. All 18 SVGs parse successfully and their document anchors match the specification links. Current production compliance and the remaining capture matrix are still separate acceptance work.

## Seat-aware resource history and live Resource Step

The resource bound now uses the native active seat: on an odd global turn the other seat has one fewer ordinary turn. The active seat's current Resource Step is also excluded while still in Expansion. Setup has zero ordinary opportunities. Extra turns, control changes or resource-producing effects still require separate provenance. This is an initial-arrangement audit, not a runtime prohibition.

The stricter check found two remaining early-seat mismatches: `resource-step` had two opposing resources on turn 3, and `arena-trap-counter` had three on turn 5. They now start at turns 5 and 7. Regression cases cover the waiting seat and an uncompleted Resource Step separately from deck construction.

Live development-browser review at 1366×768 confirms the corrected turn-5 state. Clicking Sonoro opens inspection without a resource action in that view. Dragging Sonoro onto the Resource Zone submits the native command: hand 5 → 4, resources 1 → 2 ready, Expansion → Primary. After reset, Skip resource preserves five hand cards and one ready resource while advancing to Primary. Native controls and adapter were used; no browser state was injected.

Evidence: [before](evidence/resource-turn5-before-1366.jpg), [deployed](evidence/resource-turn5-deployed-1366.jpg), [skipped](evidence/resource-turn5-skipped-1366.jpg). The accessibility tree exposes Skip resource as text and Resource step as draggable, so keyboard-equivalent acceptance remains open. Opponent hand stayed represented by backs/counts in this view; this does not replace an explicit opposite-seat inspection. Muted run; no new audio or motion acceptance is claimed.

Seat-aware verification: 105 tests pass across native coverage, visual fixtures and resource-step fixtures. All 56 initial boards pass the stricter bound. Focused audit/resource/test lint and diff whitespace checks pass.

Reference follow-up: added the official Runeterra Round FAQ and an annotated capture of its persistent blocked-position illustration. Documented drag/commit control behavior and visual relationship persistence are separated from our recommendations and Alpha Clash rules. The source is dated 2022; it does not close the contemporary gameplay-video gap.

## Both-replace opening boundary browser proof

At 1366×768, Begin Opening → Player 1 Declare mulligan → Player 2 Declare mulligan → select all eight Player 2 cards → Replace 8 → switch to Player 1 → Replace 0 → Start Game completed through native controls. Player 2 could commit its private selection before Player 1; neither could start while the other selection was unresolved.

The Player 1 candidate list retained its original eight names after the zero-card choice. Player 2's new hand contained Raging Plasmax, three Kheprius, Discarded Mob, two Machina and Magnate, Observing. Both public counts remained hand 8/deck 42. Switching seats exposed only the selected seat's card faces/candidates in the accessibility tree. Start Game appeared for Player 1 only after both selections; native turn 1 reached Expansion/Resource with no extra opening draw.

Evidence: [all eight selected](evidence/opening-both-replace-all-1366.jpg), [zero selected](evidence/opening-both-replace-zero-1366.jpg), [Player 2 result](evidence/opening-both-replace-p2-result-1366.jpg), [turn one](evidence/opening-both-replace-start-1366.jpg). Muted run, no new motion/audio claim. Keyboard and other viewport variants remain open. Player 2's final waiting copy still says “other player's opening decision” although only Start Game remains; improve that wording to distinguish completed hands from an unresolved mulligan.

## Evidence index and catalog review

All 37 catalog cases now have their evidence paths audited on disk. Three prefixed media paths were normalized, and the player-target adapter test now names its owning package. The index currently lists native sources for 36 cases, screenshots for 17, recordings for 4 and measurement data for 2. These are availability counts, not pass rates. The variable-X catalog gap remains without a fabricated native test.

The existing fixture page now separates native sources, browser captures, recordings and measurement data. Missing categories say Not recorded. Per-case limits call out incomplete opening/resource coverage, the production frame stall, and the silent Ambush recording caused by master mute. The filtered resource row was opened in the browser and its categories and limits were verified. [Catalog capture](evidence/catalog-resource-evidence.jpg). Focused metadata/page lint and diff checks pass. No gameplay protocol or engine behavior changed.

## Haven mode browser outcomes

At 1366×768 on the local dev build, playing Haven through More with auto-pay, then passing both native response windows, opens its real mode choice. Health mode changes 26→28 with hand one/deck 40. After a deterministic reload, Draw one card activated with Enter changes hand one→two and deck 40→39, preserving health 26. The actor sees the drawn Sonoro; the public log says Alice draws a card. Both accepted actions remove the prompt.

Captures: [choice](evidence/haven-mode-choice-1366.jpg), [health](evidence/haven-mode-health-1366.jpg), [draw](evidence/haven-mode-draw-1366.jpg). The heading is / Draw one card; mode buttons commit immediately. The detailed specification separates these baseline failures from the proposed draft/Confirm flow. Muted run, normal motion; no timing/audio claim. Enter activation is verified, not full keyboard traversal. Opponent post-draw privacy and the other viewports remain open.

Mode follow-up: added a six-state Haven-specific storyboard and linked the [draw log capture](evidence/haven-mode-draw-log-1366.jpg). Focused catalog lint, evidence-path audit and diff whitespace checks pass. No runtime implementation changed in this increment.

## Haven native boundary and privacy checks

Refactored the existing draw-only assertion into two named mode cases. Both use normal play, response passes and adapter choice submission. They assert health/hand/deck outcomes, an unchanged native state after an invalid option or wrong-player submission, and rejection of repeated submission without a second result. The draw case checks that the actor projection contains the drawn face while opponent and spectator projections contain only a hidden card identity. This is adapter projection proof, not opposite-seat browser proof.

All 18 tests in `prompt-fixtures.test.ts` pass; formatting and whitespace checks pass. Lint does not select this test file under the current configuration. A relative-path `--no-ignore` attempt crashes the type-aware linter while resolving a non-absolute tsconfig path; an absolute-path attempt still selects no files. No test-file lint pass is claimed. The prior mode specification incorrectly described the existing test as reachability-only; that statement is corrected. No production behavior or native fixture arrangement changed.

## Denver optional chain browser proof

At 1366×768 on the local dev fixture, normal play of Denver with auto-pay followed by both native response passes reaches Use/Decline. Decline leaves hand one/deck 40, Denver in Clashground and no follow-up. After reload, Enter on Use draws two (hand three/deck 38) and opens the mandatory discard. Clicking the offered Sonoro immediately sends it to Oblivion, leaves hand two and restores normal actions. The public log records two draws and Sonoro discarded.

Evidence: `denver-optional-choice-1366.jpg`, `denver-optional-decline-1366.jpg`, `denver-discard-choice-1366.jpg`, `denver-discard-result-1366.jpg`. The current discard control commits on selection despite showing a disabled Confirm before selection. This does not satisfy the specified editable draft/Confirm path. Run was muted with normal motion; other viewports, opposite-seat privacy, full keyboard navigation and other optional-family browser branches remain unverified.

## Clarity ordering and partition browser proof

Top-only at 1366×768: native activated ability exposes Sonoro/Magnate/Haven. Keyboard Left twice moves Haven from third to first; Enter on Confirm draws Haven, changes hand two→three/deck 40→39 and disables the used once-per-turn ability. No Bottom lane appears.

Draw-step variant: End Turn from Player 2 then Use reaches the two-card partition. Click/pick plus Place in Bottom for both cards enables Confirm. Cancel changes restores both unplaced, leaving counts unchanged. Retrying all-bottom and confirming draws Haven (the next card), reaches Resource Step and leaves hand three/deck 39. Native tests separately verify full resulting deck order; the browser does not expose that hidden ledger.

Eight captures are linked in the catalog. The all-bottom draft was inspected at 1920×1080, 1366×768 and 844×390. The scaled view clips Confirm below the viewport; desktop shows it. Scroll recovery and physical touch were not tested. This is an acceptance failure, not a completed scaled-layout pass. Muted normal-motion run; no new audio/performance claim. Catalog lint, file-link audit and whitespace checks pass.

## Local native undo controls

Local practice previously had no undo control despite native adapter support. Added Undo and Undo turn to the existing drawer using `engine.dispatch`, with adapter availability and ended/opening/seat-handoff gates. No snapshot injection or gameplay protocol change.

At 1366×768, Portal open changes ready resources nine→seven and enables both controls. Enter on Undo restores nine, returns the action label to Open the Portal and disables both. A subsequent open/close sequence spends four; Undo turn restores nine and logs the accepted undo. Three captures are linked in the recovery catalog. Run was muted; no audio/motion acceptance is claimed. Hosted consent, other viewports and detailed disabled-reason design remain separate. Native regression coverage now also tests turn undo and the card-play barrier after an existing safe checkpoint.

Undo validation: all 37 native coverage tests pass. Focused lint on the practice page/catalog, formatting and whitespace checks pass. The native card-play barrier assertion starts with a real safe checkpoint, so it verifies checkpoint clearing rather than only an initially disabled control.

## Public-zone play and activation

At 1366×768, the board's Your oblivion control opens the actual two-card pile; Thragor inspection shows Card 1 of 2 and Play. Auto-pay spends all nine resources, moves Thragor out of Oblivion and retains hand three. Passing both native response windows produces Clash three/Oblivion one. On reset, Rizlac inspection shows Card 2 of 2 but no activation button. The More menu action returns Rizlac immediately, spending two resources and producing the same zone-count change. The log records activation and put into play; the ability becomes unavailable outside Oblivion.

Four captures are linked in the catalog. The current ordered pile-inspection path works in this browser; the old inspection-suite failure remains historical test evidence, not proof of a current failure in this path. No whole-suite pass is claimed. Both runs were muted. Motion/audio, other viewports and broader source-zone boundaries remain open. Catalog lint, evidence-link audit and diff whitespace checks pass.

## Hand Counter–Play browser proof

On the existing `board-actions` fixture at 1366×768, Player 1 plays Antarctica through inspection. Player 2 activates T-Bone from More; the current label is It does not enter play and the hand inspection lacks an activation button. After both response passes, Use moves T-Bone to Oblivion and returns Antarctica to its owner's hand without entering Clashground. The final response pass restores Player 1 control: hand three, ready resources seven, Clashground empty; Player 2 hand one/Oblivion one. Four captures document inspection, optional decision and both result views.

The native test is refactored into accept/decline variants of the same real board. Decline browser, other viewports, full keyboard traversal and audiovisual acceptance remain open. This was a muted normal-motion run. No synthetic moves or pending choices were added.

T-Bone native follow-up: the first decline assertion incorrectly expected no remaining choice. The native board correctly continues through Antarctica's entry damage, Magnate's defeat and Magnate's optional draw. The test now verifies that source and resolves the draw choice through the adapter. Both focused accept/decline tests pass; the preceding full file run passed 37 other/current cases with the one incomplete decline assertion. Catalog lint, formatting and evidence-path checks pass.

## Catalog/report consistency

The previous static coverage table had 36 rows and omitted the player-target case, although the catalog and detailed audit had 37. It also combined statuses too loosely. The marked table now derives from the existing catalog and includes separate engine, fixture and UX columns plus case-specific evidence links. The evidence index derives from the same metadata and links native test files directly. All 37 IDs and spec anchors are validated; every listed file exists. Missing categories remain explicit.

The maintained report script supports read-only `--check`, preserves authored source-audit prose, and replaces the temporary index generator. Current availability is 36 cases with native test sources, 24 with captures, four with recordings and two with measurements. These counts are not acceptance percentages.

## Clarity confirmation motion/audio comparison

Captured the real top-only Confirm order → native draw segment twice at 1366×768 in visible in-app Chrome 155, local dev build. Both runs used keyboard ordering to put Haven first before capture; Enter on Confirm drew it and left hand three/deck 39 with the ability unavailable. These clips do not cover activation or draft editing.

- [Sound on, normal motion](evidence/clarity-confirm-audio.mp4): 34 captured frames span 1.0069 seconds; final frame held two seconds. App master gain 0.5625. Encoded clip peak −17.8 dBFS, mean −44.7 dBFS.
- [Muted, reduced motion](evidence/clarity-confirm-muted-reduced.mp4): six captured frames span 0.3053 seconds; same two-second hold. App master gain zero; peak/mean at the −91 dBFS analysis floor.
- [Metadata and timestamps](evidence/clarity-recording-metadata.json), [result and restored settings](evidence/clarity-recording-result-1366.jpg).

Audio comes only from the app's Howler master output. A temporary branch feeds MediaRecorder; no microphone, synthetic cue, or engine command was used. Audio is aligned to the first screencast frame with offsets 17.47 ms and 15.90 ms. Video is encoded at 30 FPS, which is not a runtime performance measurement. Frame-span differences include UI transitions; they do not isolate an individual card-flight duration or prove full mix quality.

The first open-ended capture was interrupted when the browser tool reset. Its partial frames were excluded; both accepted clips use bounded four-second capture calls. All capture nodes were disconnected and page references removed. The reduced-motion toggle reset on reload, so it was explicitly re-enabled and observed before the comparison. Sound off, reduced motion off, normal viewport and hidden browser were restored afterward. No permanent instrumentation remains. Full partition-flow audiovisual acceptance, overlap/repetition review and opposite-seat privacy remain open.

## Shadowlight cost routes — native board browser audit

At 1366×768 in the local in-app browser, the turn-13 `prompt-cost-routes` fixture reset to hand three, Clash Zone two and six ready resources. A board card activation opened the real cost tray. Alternative selected the one legal friendly white Shadowlight. Escape and Choose cards had no visible effect. More exposed Cancel; Enter cancelled with all counts unchanged. Retrying and pressing Enter on the payment card returned it to hand and sent Darkness Rising to Standby. Both native response passes completed its entry: hand three, Clash Zone two, six ready resources. The opponent response capture shows the private hand count without its faces.

A separate reset tested Alternative → Normal with Auto-pay enabled. The route change immediately committed and spent two resources. After both passes, hand two/Clash Zone three/resources four. This is an acceptance failure for explicit draft/commit separation, as is the last alternative-payment card auto-submit. Six screenshots are catalogued. No pending state or synthetic commands were injected. Muted normal-motion run; no audio, performance or other-viewport claim. Additional and discount routes retain native-test evidence but still need browser proof.

## Reference research extension

Inspected the official Bazaar Steam listing and its embedded Boulder combat clip. Captured direct-playback frames at 0.20, 1.651079 and 4.327338 seconds; added status/impact annotations and separate recommendations. The clip is currently published but has no build label. It cannot establish current-patch behavior, sound timing or a complete combat sequence. Historical prototype footage remains excluded.

Cost-route follow-up checks: all seven focused native tests pass. Formatting, report generation/read-only consistency check and diff whitespace checks pass. All 37 catalog IDs, evidence paths and specification anchors resolve. These checks do not fill the remaining browser acceptance gaps.

## Required and optional discard costs — browser follow-up

Used the same catalog family and real board controls at 1366×768. Chaotic Unmaking starts at turn 13, hand three/resources six/Oblivion zero. Enter on the board play control opens Additional (required), then the other two hand cards become selectable. The More drawer states Discard 1 as an additional cost and disables Confirm while empty. Enter on Sonoro immediately pays: hand one/resources three/Oblivion one. Two response passes resolve the source into Accessories. This confirms atomic native payment and the same last-choice auto-commit UX gap.

The route tray was also inspected and captured at 1920×1080 and 844×390. Route and Cancel fit at all three sizes; scaled card text remains too small for comfortable reading. No touch interaction or full scaled flow is claimed. The first image was still loading; a fresh preview reported a complete 400-pixel official image and rendered correctly. The accepted route screenshot was replaced with the loaded view. No persistent asset defect was found.

For Enter from Beyond, the turn-14 fixture begins before the attack. Player 2 used Clash → Sonoro → Magnate, Awakened to open native Counter priority. Player 1 chose the Additional discount route and discarded Sonoro with Enter. Payment spent one resource (six→five), moved the discard to Oblivion and left hand one. The opponent response view did not show the remaining private hand face. Two response passes resolved Enter from Beyond to Oblivion, count two; the log shows the attack, Counter and discard. Portal is closed, so this is not proof of its conditional return effect or complete clash resolution.

Eight additional screenshots are linked from the cost-route catalog. Both runs used normal motion with sound off. No engine state, prompt or local resolution was injected. Required-cost keyboard activation and payment work, but full keyboard traversal, manual incomplete payment, the discounted card's normal branch, and audiovisual acceptance remain open. Viewport was restored after capture. This turn changes evidence/specification metadata only; the seven native cost-route tests passed in the preceding turn and no gameplay code changed.

## Health-payment browser defect and adapter repair

At 1366×768, started the real turn-11 Sonoro attack, inspected Player 2's From Life to Death and selected its native target. The amount panel allows zero through four. Four disables Increase and leaves health eight until commit. Cancel leaves health eight/resources five/hand one; retry starts with an empty amount.

The first confirmation exposed a defect: Auto-pay used the unreduced five-resource quote after declaring four health. The native engine rejected the payment atomically. The failure capture remains explicitly pre-fix. The adapter now obtains native `previewResourceCost` quotes for each bounded health amount and exposes them through existing conditional inputs; the matching submitted payment maps to the native command. Shared UI, gameplay rules and protocol schemas are unchanged.

After reload, the same board path accepted four health plus one resource: health four, ready resources four of five, hand zero. Opponent view showed those public changes. Two real response passes moved Sonoro to its owner's Oblivion and the source to banished. Five captures document draft, cancellation, historical rejection, accepted opponent view and resolved board. Muted normal-motion run; no timing/audio or other-size proof.

The focused adapter tests were strengthened from direct dispatch to actual interaction submissions for zero/one/four, with native resource counts and final destinations. The additional regression rejects an unreduced assignment, verifies unchanged state and accepts retry. All ten focused health tests pass. The direct uncached adapter type check also passes. Broader adapter and owning fixture checks are recorded below when complete.

Health repair checks: all 53 adapter tests across 11 files pass; the owning app health-payment case passes (37 unrelated cases skipped). Formatting and evidence/report link checks pass. No hosted flow or deployment was tested.

## Simultaneous trigger ordering — browser proof

Used `simultaneous-effects` before its trigger. End turn from turn 5 creates three native Zephyrion effects at the start of Player 2's turn 6. The tray belongs to Player 1. Keyboard earlier controls move original item 3 to first while the stable Triggered ability numbers retain identity. Cancel changes closes the tray without resolving it; Show choices restores original order 1/2/3. Retrying 3/1/2 and Enter on Confirm produces the public order log, three ready entries and Player 2's draw/Resource Step.

Five captures cover initial/draft/result and all requested tray sizes. The settled 844×390 view contains the footer and arrows, with dense small text; it is not touch-device proof. A transient resize frame was excluded. The collapsed prompt incorrectly calls the effects cards. No audio, timing or reduced-motion claim; sound stayed off. No prompt/state injection occurred. Arrival and sequential-owner browser variants remain open. The normal viewport was restored.

## Two-owner simultaneous arrivals — native browser and adapter proof

At 1366×768, played Alpha Aster from inspection on the turn-29 `simultaneous-both-owners` board. Native payment spends eight of fourteen ready resources. Both response passes create Player 1's three-card arrival batch and Player 2's two-card batch. The first tray contains only Player 1's cards. Keyboard earlier controls place Sonoro first, then The Avenging Guy, then Magnate, Cunning Planner. Confirm switches hot-seat control to Player 2; decks remain 31/47, proving the visible continuation has not advanced yet. Player 2 moves Sonoro above Magnate and confirms. Decks then become 30/46 and one Sonoro enters each Clash Zone through the remaining native effect.

Actual public pile inspectors show Player 1's selected three-card sequence above the older Magnate, Ready to Fight, and Player 2's independent Sonoro/Magnate sequence. Six captures document pre-order, draft, owner handoff, final piles and resumed board. The tray lacks a clear owner handoff label and does not show the fixed older pile; these remain specification gaps. Sound stayed off and viewport was restored. No audiovisual, touch or other-size arrival acceptance is claimed.

Refactored the existing two-owner native test to submit both choices through the adapter. It now verifies inactive-owner waiting, no premature deck change, complete continuation, both selected pile orders and preservation of the prior bottom card. All three ordering tests pass. No duplicate fixture or production UI change was added.

## Reveal in place — native browser audit

At 1366×768, started Sonoro's real attack and used More → Counter with Archaic Shield. Two resources were spent. Both response passes opened Foretell; placed Magnate, Cunning Planner on Top and Sonoro on Bottom through actual controls. Confirm reached the native reveal selection with deck count 43.

The board prompt says to select a highlighted card, but the revealed deck candidate has no visible board representation. More exposes the correct Magnate option, Done, and public reveal log. Enter on Done only stages it. Returning to the board shows Done selected and not yet applied, while the commit button incorrectly says Send to Oblivion. Submitting the selected Done keeps deck count 43; Shield then moves from Accessories to Oblivion. The actual deck inspector displays zero cards and a hidden-identities message afterward. These are two confirmed UX failures with correct native Keep behavior.

Five captures document Foretell, missing candidate, fallback, wrong commit label and restored hidden deck. Current engine projection exposes pending-choice deck candidates to the actor; the other viewer's reveal artwork remains an explicit investigation, not proven by the public log. Muted normal-motion laptop run only; no Send browser, spectator, other-size or audiovisual acceptance. No injected prompt, fabricated move or local resolution. Viewport restored afterward.

## Reveal visibility contract audit

Used the Alpha Clash rules skill and exact canonical v8 rules 703.8a–d. The publisher still links v8; the web tool could not fetch the redirected PDF, so wording came from the local canonical extraction. A temporary focused native probe drove `destination-reveal` through real adapter actions and wrote `reveal-projection-audit.json`. The probe was removed after capture; no product or engine behavior changed.

All three projections hide the deck card before and after Done. During the reveal, only Player 2 receives Magnate's identity; Player 1 and spectator receive null identity despite the public reveal log. This contradicts the all-players reveal requirement for Player 1. Spectator policy needs separate definition. The catalog now marks engine support partial, with a scoped engine visibility proposal in coverage.md. This diagnostic run passed its path checks; it is not a passing public-visibility acceptance test.

## Rebound destination browser audit — 2026-10-10

Reused the local 5193 simulator and native `destination-return` fixture at 1366×768, Hot seat, Auto-pay on, normal motion, muted. Inspected Rebound, selected Play, then inspected ready Sonoro: it opened inspection without becoming a target. Closed inspection and cancelled the action. Hand 4, resources 8/8 and both opposing Clashes remained. Retried and pressed Enter on the sole eligible engaged Magnate. The play committed immediately (hand 3, resources 6/8); captured Player 2's response view, passed Player 2 then Player 1. Result: opponent Clash 1, opponent hand 2, own Oblivion 3. The returned card no longer had an inspectable face in the acting player's board controls.

Saved `return-engaged-target-1366.jpg`, `return-cancel-1366.jpg`, `return-pending-opponent-1366.jpg`, `return-resolved-1366.jpg`. Visually reviewed target and result captures. Auto-commit despite a visible Confirm control is a UX failure against the proposed draft contract. No product change, no new runtime tests; report integrity checks cover metadata. Recipient result perspective, other dimensions, drag, sound and reduced motion are not proved by this pass.

## Ramp resource destination browser audit — 2026-10-10

Used the existing local simulator at 5193, `destination-select`, 1366×768, Hot seat, Auto-pay on, muted and normal motion. Native board path: inspect Check out my Ramp → Play (2) → Player 2 pass → Player 1 pass. The required choice presented Denver, Rebound and Magnate from hand with Resource Zone destination. Enter selected Rebound without committing; the panel stated Not yet applied. Cancel selection cleared only the draft. Selected Denver and pressed Enter on Put into resource zone. Hand changed 3→2, resources 6/8→7/9, source owner's Oblivion 2→3, deck stayed 33. Rebound and Magnate remained in hand.

Saved and reviewed choice/result screenshots; saved the staged Rebound draft as well: `ramp-resource-choice-1366.jpg`, `ramp-resource-draft-1366.jpg`, `ramp-resource-result-1366.jpg`. This confirms a working draft/cancel/confirm path for this variant, not all destination choices. Other sizes, opponent final perspective, drag, reduced motion and audio remain unverified. No product changes were made.

## Death required target and send audit — 2026-10-10

Local native `destination-send`, 1366×768, Hot seat, Auto-pay on, muted/normal motion. Inspected Death: no ability control. More → full Death ability text → Choose card displayed Trugg and two Magnates. Both Magnates had identical visible names with no owner; accessibility distinguished copy 1/2 and copy 2/2 only. Selected copy 2; this immediately activated and opened the friendly-send choice. Closed More, then Enter on Sonoro immediately resolved both native movements. Own Clash 3→2 and Oblivion 2→3; opponent Oblivion 1→0 and Banished 0→1. Hand/resources remained 4 and 8/8. No response pass was needed. The result established that the selected duplicate was the opposing Magnate; its owner was not clear beforehand.

Saved `death-inspect-no-ability-1366.jpg`, `death-declared-target-owner-1366.jpg`, `death-friendly-followup-1366.jpg`, `death-send-banish-result-1366.jpg`; visually reviewed picker and result. Recorded missing inspection action, ownership ambiguity and immediate commits as UX failures. Native tests cover both Death and Trugg; this browser pass covers Death only. Other dimensions, Portal-open targets, audio, reduced motion and drag remain open.

Focused verification after this audit: `vp test run --configLoader runner src/games/alpha-clash/destination-fixtures.test.ts` passed all 14 tests. Catalog generation validated all 37 case references; `git diff --check` passed. These checks do not close the known reveal projection gap or browser/audio limits.

## Trugg banish and recovery browser audit — 2026-10-10

Used existing native `destination-banish` at 5193, 1366×768, Hot seat, Auto-pay on, normal motion/muted. Source inspection showed no ability. More offered You may set a returned Ambush and ready one resource. Its Choose card picker offered only Trugg, Unusual Assistant. Selecting that declared target immediately activated the native ability and opened Choose a Clash to banish from your Oblivion. The second picker offered Trugg and Magnate. Selected Magnate; it remained a draft, and Confirm submitted it. Result: own Oblivion 2→0, Banished 0→1, hand 4→5 with recovered Trugg visible, resources 8/8 and deck 33 unchanged. Board Clashes stayed 3. The used action was absent afterward.

Saved four captures: `trugg-inspect-no-ability-1366.jpg`, `trugg-declared-recovery-1366.jpg`, `trugg-banish-payment-1366.jpg`, `trugg-banish-recovery-result-1366.jpg`; visually reviewed result. Trugg's payment uses explicit confirmation, unlike Death's follow-up. Source inspection and action naming remain UX gaps. No self-banish/failed recovery, Ambush recovery, opponent final view, other viewports or audiovisual acceptance is claimed. Existing 14 destination tests passed in the preceding audit; this pass changed documentation and catalog evidence only.

## Shared literal interaction text repair — 2026-10-10

Traced Trugg's missing main clause to shared `interaction-presentation.ts`, not the adapter/card text. `humanizeInteractionKey` split any key at periods. Restricting fallback to dotted identifiers preserves literal sentences and decimals. Added regression checks in the existing prompt test file, covering multi-sentence instructions, trailing punctuation, decimals, dotted camelCase/snake_case keys and explicit label precedence. `vp test run --configLoader runner src/components/InteractionResolutionPrompt.test.tsx` from simulator-ui passed 56 tests.

Reloaded native `destination-banish` and opened More at 1366×768. Full Trugg and discard-ability conditions now appear in both accessibility and visible text. Saved/reviewed `trugg-complete-ability-label-1366.jpg`. No native command or gameplay semantics changed. Long text still requires better action naming/layout; missing inspection actions remain. Earlier truncated-label images are retained as pre-fix evidence.

## Required-target native boundary checks — 2026-10-10

Extended existing `destination-fixtures.test.ts`, without new fixture factories or pending-choice injection. Death opens Portal through native adapter action, rejects a mixed-owner target pair atomically, retries with both own pile cards, then completes friendly send and checks both banishments plus untouched opposing card. Trugg reaches its banish choice through normal adapter actions and uses the declared recovery target itself as payment; it stays banished, no hand increase occurs, the other pile card remains and no choice is left.

Focused suite passed **16 tests**. Existing route descriptions now name these boundary variants. These tests prove native/adapter outcomes, not browser presentation. Death's Portal-open exactly-two adapter cardinality still needs review against the one-or-two wording; the test does not establish that one should be rejected. No gameplay implementation was changed.

## Activated source reference and board-only Trugg — 2026-10-10

Fixed adapter `activatedAbilityActions` to include `source: entityRef(card.instanceId)`, matching other source actions. Inspection filters existing actions by source; no UI bypass or new gameplay protocol was needed. Native destination suite passed 18 tests, including Death/Trugg source reference and actor isolation.

Reset `destination-banish`, 1366×768, default muted/normal motion, Auto-pay on. Did not open Match actions & log / More. Inspected Trugg and activated its displayed ability. Dedicated target tray identified You · oblivion and offered Trugg, Unusual Assistant. Selecting it committed the declaration. Clicked Your oblivion on the board; the pile exposed legal candidates. Selected Magnate (draft), then Done committed payment. Native result: own Oblivion 0, Banished 1, hand 5 containing recovered Trugg, resources 8/8. Source/pile/result captures saved as `trugg-board-inspection-action-1366.jpg`, `trugg-board-pile-payment-1366.jpg`, `trugg-board-only-result-1366.jpg`. Final board visually reviewed. Generic Done is a misleading commit label; full audiovisual and other-source acceptance remains open.

## Death board-only revalidation — 2026-10-10

Existing native destination-send, 1366×768, Hot seat/Auto-pay on, muted/normal motion. Inspected Death and used its source action. Dedicated target tray displayed artwork in You · oblivion and Opponent · oblivion groups, distinguishing identical Magnates. Cancelled the uncommitted declaration; counts stayed hand 4, resources 8/8, own/opponent Oblivion 2/1, own Clash 3. Retried, Enter-selected opposing Magnate; declaration committed immediately. Enter-selected Sonoro on board; native send/banish completed with own Clash 2, own Oblivion 3, opposing Oblivion 0 and Banished 1. No escape-hatch action or log was used.

Saved/reviewed `death-board-owner-tray-1366.jpg` and `death-board-only-result-1366.jpg`; also saved `death-board-only-followup-1366.jpg`. Source access and duplicate ownership now work in this board path. Remaining UX failures: immediate commit despite Confirm controls and no retained declared-target summary during friendly payment. This documentation/catalog update needs no new runtime tests; the preceding source repair passed 18 native destination tests.

## Rizlac board-only recheck — 2026-10-10

Existing `board-actions`, 1366×768, Hot seat/Auto-pay on, muted/normal motion. Opened Your Oblivion using its board zone, inspected Rizlac, and used the now-visible ability. The full text included pay BB and return from Oblivion. Native activation immediately spent two resources (9/9→7/9), moved Oblivion 2→1 and Clash 2→3. Hand remained 3, deck 32. No More or log interaction was used. Saved `rizlac-board-inspection-action-1366.jpg` and visually reviewed `rizlac-board-only-result-1366.jpg`. This supersedes the earlier escape-hatch run for this happy path only. Other sizes, manual payment, keyboard traversal, replacement-on-leave, sound and motion remain open. No code changes in this pass; metadata and specification corrected.

## T-Bone board-only recheck — 2026-10-10

Reset board-actions, 1366×768, Hot seat/Auto-pay on, muted/normal motion. Used Antarctica inspection → Play; waited for Player 2, inspected T-Bone, used its complete Counter–Play action. Passed Player 1 then Player 2 with board controls. Enter on the dedicated Use button sent T-Bone to Oblivion and returned Antarctica without entry. Player 2 result: hand 1, Oblivion 1; opponent hand 3, Clashground 0, resources 7/9. Final board pass returned Player 1 to Primary, showing Antarctica in hand and the same spent cost. No More/log action was used.

Saved four captures: `tbone-board-inspection-action-1366.jpg`, `tbone-board-optional-1366.jpg`, `tbone-board-only-result-1366.jpg`, `tbone-board-owner-result-1366.jpg`. Visually reviewed responding-seat result. Source-reference repair closes hand-ability inspection access in this path. Decline, other viewports and audiovisual acceptance remain open. Documentation/catalog changes only in this pass; no runtime test rerun needed.

## Reveal destination board-control repair — 2026-10-10

Shared CardDestinationPrompt previously assumed all destination candidates were visible spatially. It now reuses ContextualChoiceControl for off-board option selections, stages native option IDs through the existing draft and labels confirmation of non-card alternatives from their own text. `SharedInteractionPrompt.test.tsx`: 20 tests pass; new regression checks card availability, no premature submit, cancellation, Done confirmation and exact native option submission.

Browser native `destination-reveal`, 1366×768, muted/normal motion: board Clash/Sonoro/Torque → inspect own set Shield → Counter → board Player 1/2 passes → dedicated Foretell Magnate top/Sonoro bottom → Confirm. No More/log used. Reached card-reference/Choose Magnate and Done controls. Staged Magnate without movement, cancelled, selected Done, clicked Confirm: Done. Deck remains 43; Shield Accessory 1→0 and Oblivion 1→2. Captures: `reveal-board-options-fixed-1366.jpg`, `reveal-board-done-fixed-1366.jpg`, `reveal-board-only-done-result-1366.jpg`; final board visually reviewed. Opponent reveal visibility remains an engine gap; this does not fix it. Send path, other sizes and audiovisual acceptance remain open.

## Standalone audiovisual settings — 2026-10-10

Moved the existing Sound and Reduced motion checkboxes from Match actions & log to a Settings popover in the board header. They use the same shared sound volume, remembered audible level and motion state. No gameplay action or new protocol is involved. This allows subsequent recording checks without opening the escape hatch.

Focused existing inspection-control settings tests: **3 pass, 4 unrelated tests skipped**. MantineProvider test mode is used because jsdom has no layout for the popover's detached-reference positioning. Browser verification: opened Settings at 1366×768, enabled Sound and Reduced motion, checked 844×390, restored both off, and closed the popover. Gameplay counts/state stayed unchanged. Saved `board-settings-1366.jpg` and `board-settings-844.jpg`, visually reviewed compact capture. This verifies controls only; no new audiovisual recording or performance measurement is claimed.


## Publication sync — 2026-10-10

Rebased the audit onto `017e8966aa` (origin/main). Preserved the shared presentation settings and the new inspection-arrangement fixture. The board Settings control uses the persisted master volume and synchronizes the presentation audio preference; system reduced motion remains enforced.

Focused validation after sync: adapter 53 tests passed; shared InteractionResolutionPrompt 56 passed; app destination, prompt, visual fixture and shared prompt suites passed. The first app run found a missing inspection-arrangement coverage link and a portrait test that selected a public-pile duplicate instead of the hand card. Both were corrected; native coverage, all inspection controls and resource-step suites then passed (53 tests). Coverage report paths and anchors resolve. The in-app browser opened and closed Settings on the board-actions route without using Match actions.

The full multi-game app type check is not a clean validation gate: it reports errors in other game workspaces and missing One Piece package types. Publication does not complete the audit: the remaining board-only, audio, visibility and acceptance gaps above remain open.


A second sync incorporated `d1a5310832` and PR #4365 before publication. Its opening owner, delayed redraw and Arena HUD are retained. The newly added arena-drop-targets case now uses the complete native card ledger and turn 13, with a legal duplicate count. Final focused reruns: adapter lifecycle 21 passed (the other 34 adapter tests passed in the preceding run); native coverage and inspection controls 47 passed; opening hook, native opening and hand arrangement tests passed in the preceding run. Browser reload after this second sync remained at Loading fixture during the bounded check; final visual revalidation is still open. Earlier screenshots show the earlier baseline.


## Merged-board Rizlac audio proof — 2026-10-10

The existing server completed loading after the bounded publication check; no server restart was needed. On the merged code, used Your Oblivion → Next card → Rizlac's native ability, with auto-pay already enabled. Captured app output directly from a temporary branch on Howler masterGain, then disconnected the branch. No gameplay used Match actions or logs. Normal and muted/reduced runs both moved Rizlac into Clash, engaged two resources (9→7), reduced Oblivion 2→1 and increased Clash 2→3; hand 3 and deck 32 stayed unchanged.

[Normal clip](evidence/rizlac-activation-audio.mp4): 46 captured frames over 2.723s, audio peak −11.3 dBFS and mean −39.6. [Muted/reduced clip](evidence/rizlac-activation-muted-reduced.mp4): 13 frames over 0.682s, master gain zero and peak/mean at the −91 dBFS measurement floor. Both encoded at 30 FPS with timestamp durations; this is not a performance benchmark. [Metadata](evidence/rizlac-recording-metadata.json) records offsets and limits. Source-to-destination movement and cost change are visible; concise ability naming and perceptual mix acceptance remain open.

Capture exposed a merge regression: the literal Settings label overflowed the new round header button. Replaced it with the existing icon library's settings glyph and retained Settings as its accessible name plus a Sound and motion settings tooltip. [Final board](evidence/rizlac-merged-settings-fixed-1366.jpg) verifies the correction. Mute and reduced-motion preferences restored to their initial off/off values.


## T-Bone decline through the merged board — 2026-10-10

At 1366×768, reset board-actions by reloading its deterministic native fixture. Player 1 inspected and played Antarctica (two resources); Player 2 inspected and activated T-Bone. Board passes by Player 1 and Player 2 reached the dedicated optional prompt. Enter on Decline left T-Bone in hand (two cards), no card in its Oblivion, and Antarctica still pending. Player 2 and Player 1 then passed on the board. Antarctica entered and its damage started resolving: both Sonoros left Clash and the native Magnate draw prompt appeared. Enter on Decline completed that chain. Final counts: both Clash Zones zero; Player 1 Clashground one, Oblivion four, hand two, deck 32 and resources 7/9; Player 2 Oblivion one, hand two, deck 47. No Match actions or logs were used.

Evidence: [decision](evidence/tbone-decline-prompt-1366.jpg), [declined response](evidence/tbone-decline-keeps-hand-1366.jpg), [chained draw](evidence/tbone-decline-followup-1366.jpg), [resolved board](evidence/tbone-decline-resolved-1366.jpg). This closes the laptop browser decline branch only. Source-cue review: the prompt omits a repeated source header, but the screenshot outlines Magnate and dims the rest of the board. `choiceAction` supplies Magnate’s exact source instance; Arena uses it for board attention. This is an existing visual source cue, not a confirmed missing-source defect. The native regression now verifies the source identity through this real chain. No sound or motion acceptance is claimed for this muted run.


## Reveal Send branch and source-cue correction — 2026-10-10

Native Counter–Play source regression: two focused cases passed, including exact Magnate source instance and visible identity on the chained draw. The missing text source header is intentional board attention: the existing screenshot shows Magnate outlined while other content is dimmed. Corrected the earlier report accordingly; no adapter repair was needed.

For destination-reveal, used Clash → Sonoro → Torque; Player 2 inspected its face-down Shield and countered, then both board passes. Native Foretell placed Magnate Top/Sonoro Bottom. Selected Magnate in the dedicated destination tray without committing (deck 43). Reviewed the draft at all three required dimensions; committed Send with Enter at 844×390. Native result: deck 42, Oblivion 1→3, Shield Accessory 1→0, hand one unchanged. Pile inspection shows Magnate as card 2 of 3. No Match actions/logs or local choice injection was used.

Compact failure: the 844×390 prompt requires internal scrolling to expose confirmation. Keyboard Tab from Done brings Send into view, but the initial panel shows only part of its choices. Desktop 1920 and laptop 1366 display the complete draft. Captures are linked under ac-reveal; the opponent public-reveal data gap and motion/audio acceptance remain open.


## Death target count boundary — 2026-10-10

Printed identity and browser artwork for Death, Overseer confirm that the Portal-open instruction replaces one target with two. The authored short ability text implied an optional one/two choice; corrected it to the printed effect wording. Native engine and adapter count behavior did not change. Extended the existing same-owner pair case: min/max both two; one target, a repeated target and a mixed-owner pair all reject without state mutation, then the valid pair resolves. All 18 destination tests pass. [Inspection proof](evidence/death-printed-count-label-1366.jpg) shows corrected wording with native artwork.

The Portal-open browser boundary is still unproved. Arena has no direct activatePortal control, and contender inspection only offers the contender's own ability. Did not use the Match action menu. Add a board Portal control before accepting this branch as board-only evidence; the native test remains valid engine/adapter evidence.


## Direct Portal access and Death pair retry — 2026-10-10

Added a board header Portal control driven solely by activatePortal and board.portalOpen. Open/closed use distinct icon shapes, an accessible label, tooltip and pressed state. Native permission and active inspection/draft disable it. One focused component test passes: it submits the existing adapter action once without optimistically changing the displayed state. Browser open → keyboard close → reopen costs two resources each, reflecting native results. No Match actions were used.

Death: one selected target disables confirmation. The dev page reset before the first mixed-owner attempt; discarded that partial run and restarted from visible closed Portal/resources eight. Opened (resources six), activated Death, selected own Trugg plus opponent Magnate, confirmed and saw native rejection with counts unchanged. Removed opponent Magnate, selected own Magnate, confirmed, then Enter on board Sonoro. Final own Clash two/Oblivion one/Banished two, hand four/deck 33/resources six; opposing Oblivion one. Four new captures are linked to Portal and destination cases. Remaining UX gaps: Portal has no explicit two-resource preview, mixed-owner draft is only rejected on submit, and generic error does not state the shared-owner condition.


## Portal static-cost variants — 2026-10-10

On commit 94733f41bd, existing local simulator at port 5193, in-app browser, 1366×768. No Match actions/log, engine injection, or synthetic resolution. Increased-cost route starts with opposing Undiscovered Passageway, nine ready resources and closed Portal. Click open spends three (six ready), Enter closes and spends three (three ready), click reopens and spends three (zero ready). The control disables and exposes the native insufficient-resource reason for cost three. Screenshots: `portal-increased-open-1366.jpg`, `portal-increased-exhausted-1366.jpg`.

Reduced-cost route starts with own Low Earth Orbit, nine ready resources and closed Portal. Enter opens for one (eight ready), click closes for one (seven ready). Screenshots: `portal-reduced-open-1366.jpg`, `portal-reduced-closed-1366.jpg`. Board artwork and resource indicators remain visible. The open Portal text appears beside the contender. The header control has no visible cost preview; screenshots are baseline evidence, not acceptance of the proposed payment UX. No audio, timing, other viewport, waiting-view, or Clashground entry-trigger claim is made from this run.


## Weapon inspection source repair — 2026-10-10

Death Blades inspection initially offered no Attach action. Both attachWeapon adapter branches lacked the source instance used by inspection. Added the native Weapon source to both branches, without protocol or gameplay rule changes. Twelve inspection-control tests pass, including both Weapon types entering target selection without premature submission.

Browser at 1366×768, port 5193, board-actions reset: inspect Death Blades → Attach → board Clarity spends one (9→8). Inspect the Weapon → Detach spends one (8→7). Inspect Heavy Metal → Attach exposes Sonoro and Magnate; Cancel leaves seven resources. Retry → Enter on Sonoro commits, resources 7→6, accessories 2→1, Clash-zone count 2→3. Four captures linked to attach/detach. No Match actions/log used.

UX failure: attached Heavy Metal renders as a separate card beside Magnate, with no clear link to its actual host Sonoro. Host selection commits immediately without a visible payment preview. Drag input, Temper, other viewports, audiovisual quality and waiting-seat visibility remain unverified.


## Attachment specification detail — 2026-10-10

Replaced generic attach/detach entries with seven-part specifications: native starting state, six visual states, click/drag/keyboard and cancel behavior, host/destination/payment communication, timed motion and interruption, sound mixing/deduplication, and evidence-specific acceptance gaps. `attachment-states.svg` is a six-panel symbolic design diagram, explicitly excluded from native fixture evidence. XML parsing and coverage-link validation pass. Production host layout, payment quote, motion and audio remain unimplemented targets; the specification does not assert these already work.


## Temper Use and Decline via board attachment — 2026-10-10

Existing local simulator port 5193, in-app browser at 1366×768, with the attach-source repair. Both runs begin from reset `optional-temper`: four ready resources, two Clash cards, one Accessory. Inspect Heavy Metal → Attach → board Gearwin. Native result: resources three, Clash-zone count three, Accessories zero; dedicated “Temper this Weapon?” prompt appears. Enter on Use adds exactly one visible Temper counter, also shown as “Temper 1” in Heavy Metal inspection. Reset and repeat, then Enter on Decline: no counter is shown and Detach remains available. Both branches leave three resources, hand two and deck 39. No Match actions/log used.

Four new captures cover the prompt, accepted board result, accepted counter inspection and declined inspection. Visual review: Gearwin is correctly highlighted as source, but the affected Heavy Metal remains dim and separated from its host. “This Weapon” therefore lacks a clear recipient cue. Record as baseline UX failure, not a wrong native effect. Other viewports, waiting perspective, motion/audio and frame performance remain open.


## Card-action source coverage — 2026-10-10

Added a regression audit across every native catalog starting board, for both mapped player viewers. Play, Set, Attach and activated-ability actions must carry a source reference to a visible, owned projected card matching the action's native instance. The family assertion prevents an empty/spectator action list from passing silently. The first test attempt used native seats as external actor IDs and correctly failed that assertion; corrected the test to use the engine's seat-to-player mapping. No additional source omissions were found after the attachment repair. Existing native detach and health-payment response chains now explicitly assert their source references as well. This is adapter/fixture evidence, not proof that all these actions are usable in the browser.


## Temper app-output recording — 2026-10-10

`temper-board-audio.mp4` records normal motion at 1366×768: board Gearwin selection attaches Heavy Metal, resource count 4→3, optional Temper appears, Enter on Use produces one counter. Recording starts from the real host-selection draft, reached through Weapon inspection. Sound was enabled through board Settings; master gain was 0.5625. A temporary Howler master-output capture branch recorded app audio only and was disconnected afterward. Mute was restored; reduced motion remained off.

35 delivered screencast frames span 10.986 seconds including static lead-in; the MP4 includes a two-second final hold and is 13.033 seconds, H.264 1366×768 plus AAC. Audio/video start offset is 15.397 ms. Raw audio mean −44.8 dBFS, peak −11.1 dBFS includes lead-in/tail and proves nonzero app output only. Encoding at 30 FPS does not measure rendering performance. Metadata preserves frame timestamps. The file is a reviewable baseline; perceptual mix, event-specific cue alignment, reduced-motion/mute comparison and 60 FPS trace remain required.


## Temper muted/reduced-motion comparison — 2026-10-10

Repeated the same board-only attachment → Use sequence from a reset `optional-temper` at 1366×768. Board Settings confirmed Sound off and Reduced motion on before the action. Temporary app-output capture reported master gain zero; raw audio mean and peak both −91 dBFS (measurement floor). Native result matches normal run: three of four resources ready, Heavy Metal in the resulting Clash layout, one Temper counter. Nine screencast frames span 617.103 ms; the final encoded clip is 2.9 seconds with final hold, 30 FPS encoding, not a measured rendering rate. Audio/video start offset 16.287 ms.

Reviewed captured frames before submission, after payment and at completion. The completed frame retains the counter and does not depend on sound. This is a bounded reduced-motion baseline, not proof of all animation accessibility or professional motion quality. Existing missing host link remains visible. Capture branch was disconnected; Sound remains off and Reduced motion was restored off through Settings. Paired normal and muted files plus settings capture and raw frame timestamps are linked to ac-optional. Perceptual normal-sound review, other viewports and performance trace remain open.


## Temper desktop and compact flow — 2026-10-10

Reset native `optional-temper` independently at 1920×1080 and 844×390. Desktop: inspect Heavy Metal → Attach → Enter on board Gearwin → Use. Compact: the Accessory card has no direct accessibility card control at its scaled size, so use Your accessories → Inspect Heavy Metal → Attach → board Gearwin → Enter on Use. Each run starts with four ready resources and ends with three plus one Temper counter. Seven captures cover host selection, prompts, results and compact inspection. No Match actions/log. Viewport override reset afterward.

Desktop prompt fits at the right edge and leaves both hosts visible. Compact optional prompt also fits and Use is reachable without scrolling. Compact host-selection bar spans most of the board width and obscures the lower host artwork/text; upper host regions remain selectable. The hand overlaps the lower battlefield and artwork text is not legible at board scale. Zone inspection is a functional alternate access path, not evidence of comfortable touch targeting. No physical touch-device test was performed. Missing recipient/host relation persists at both sizes; these screenshots do not establish polished UI acceptance.


## Current opening replacement control repair — 2026-10-10

Revalidated the merged opening implementation through board controls. Enter Begin Opening → Player 1 Take mulligan → automatic seat handoff → Player 2 Keep Hand → handoff to Player 1. Eight native replacement candidates appeared, but no Replace button existed before or after selecting Captain Maxine Riggins. Screenshot `opening-missing-replace-1366.jpg` records the block. The primary button already had a replacement count and redraw handler, but a render condition suppressed it whenever an opening mulligan existed. Removed that contradictory condition.

The restored Replace 1 button submitted through the existing opening choreography and adapter; Enter completed the replacement and exposed Begin Game. Enter then reached turn one Expansion/Resource with both hands eight, decks 42, and no resources deployed. Automatic handoffs showed only each acting seat's hand in the accessibility tree. No Match actions/log used. The replacement may draw the same named card, so unchanged artwork names alone are not asserted as proof of card-instance identity.

24 focused tests pass across opening engine, opening hook and inspection controls. The new component regression uses native declarations before the mulligan view and verifies zero/one selected confirmation invokes choreography with the selected IDs and eight-card hand. Its first attempt omitted Practice's disabled generic workspace during opening; corrected the test wrapper to match production. Separate existing hook tests verify native submission timing. Selected-card art is blank in the captured selection slot, a remaining visual defect; current browser proof does not close all opening viewport/audio gaps.


## Opening keyboard focus artwork repair — 2026-10-10

The ordinary hand focus frame and shared mulligan selection badge both styled `::after`. Focus expanded the badge's dark background to full card size, covering the artwork. Scoped the ordinary hand focus pseudo-element away from `.tcg-card-choice`; mulligan cards retain the normal focus outline and shared small check badge. This is presentation CSS only.

Replayed native declarations (Player 1 Take mulligan, Player 2 Keep) through board controls. Enter on Captain Maxine Riggins now retains visible artwork with a gold focus outline, selection badge and Replace 1 control. Captured the same selected draft at 1366×768, 1920×1080 and settled 844×390. Enter again at 844 deselects, preserves artwork and restores Replace 0. The first immediate resize screenshot was transient; replaced it with the settled compact state. Restored viewport override. Card text remains small at 844 and the concise replacement instructions disappear there; this fix does not establish overall compact legibility or touch acceptance. No gameplay submission was needed for this style check.


## Compact zero replacement through turn one — 2026-10-10

Continued the native declaration flow used to verify selection artwork. At 844×390, Enter on Replace 0 accepted the empty native selection and immediately exposed Begin Game. Enter began turn one Expansion; after opening settlement, Enter on Skip Resource advanced to Primary. Both public hand counts remained eight, decks 42, and resources zero. Three captures record accepted zero-choice review, Resource Step and Primary. No Match actions/log, injected choice, or synthetic move used. Viewport override reset. This covers the zero-selection lower boundary on the current opening UI; it does not replace the remaining all-card/current-recording checks.

Reconciled historical backlog items with later evidence: T-Bone, Trugg and Death source access; Death owner grouping/cardinality; reveal tray access and labels are no longer described as currently missing. Their unresolved presentation and visibility requirements remain explicit.


## Current all-eight replacement boundary — 2026-10-10

Reset at 1920×1080. Enter Begin Opening, Player 1 Take mulligan, automatic handoff, Player 2 Keep Hand, automatic handoff. Selected all eight Player 1 candidates with Enter. Every selected face remained visible with a badge; the native confirmation labelled Replace 8. Enter ran return/reshuffle/redraw and exposed Begin Game with eight cards and deck 42. The resulting visible names included Death, Overseer, Rallying War Club and Detroit, replacing part of the previous named hand. Shared names can recur; this browser check does not assert distinct identities by name alone. Enter Begin Game reached turn-one Expansion/Resource. No Match actions/log. This refreshes maximum-selection proof on the repaired UI; both-replace recordings, motion/sound acceptance and full touch testing remain open.


## Keyboard resource deployment access — 2026-10-10

Current Resource Step exposed drag and Skip but card inspection had no deploy control. Added “Deploy as resource” to inspection only when the existing native deployResource entity-selection candidates include that instance and the action is enabled. It seeds the same shared draft/action as an accepted resource drag; no local move, new rules, protocol field or fabricated source action. Two focused component tests pass: native eligible inspection submits the exact action/input once; an ineligible hand card does not expose the control.

Browser continued the current native opening into turn-one Resource Step at 1366×768. Enter on Captain Maxine Riggins opens inspection; Enter on Deploy as resource moves it through the adapter/engine, hand 8→7, resources 0→1 ready, phase Primary, deck unchanged 42. Captures show inspection and resulting board. No Match actions/log. This proves keyboard access for the actor; other seat, fresh compact flow, rejection and audiovisual acceptance remain separate requirements.

## Second-seat resource deployment after keep/keep opening — 2026-10-10

Reproduced from a fresh native opening through board controls only: Keep both hands, Begin Game, Skip Resource, End Turn, Next hand cards, inspect Sonoro, Deploy as resource. Player 2 drew 8→9 (deck 42→41), then deployed 9→8 with one ready resource and Primary Phase. Player 1 remained hand eight/deck 42/resources zero. Before handoff only opponent counts changed in the first-seat accessibility tree; after handoff only the second-seat hand faces were exposed. This is local hot-seat evidence, not remote-client proof.

Captures: `resource-p2-kept-draw-1280.jpg`, `resource-p2-kept-inspection-1280.jpg`, `resource-p2-kept-result-1280.jpg`, and final layout `resource-p2-kept-result-1366.jpg`. The fresh tab default was 1280×720; only the last image uses the required laptop override. Restored the default viewport after capture. No sound or timing acceptance is inferred.

## Public reveal regression gate — 2026-10-10

Rechecked the current engine reveal branches and projection against rule 703.8. The publisher index still resolves its rulebook link to v8.0; the redirected PDF was unavailable to the web reader, so the exact numbered rules were read from the canonical repository extraction. Public reveal lifetime includes relevant effect continuation and, where applicable, Standby lifetime; private look uses the same lifetime with a restricted audience. A generic projection change that exposes all choice candidates is therefore not a valid fix.

Focused `destination-fixtures.test.ts`: **18 passed, 1 expected fail**. The expected failure is named `known gap: public reveal face must be visible to the non-acting player`; it checks intended public face equality, not current hidden behavior as a success criterion. Existing decline coverage now checks hidden deck identities before and after for both seats and the spectator. No engine fix or new browser acceptance is claimed. This test count must not be reported as 19 accepted reveal cases.

## Private Foretell guard for the reveal repair — 2026-10-10

Refactored the existing native Archaic Shield trigger helper to expose its private Foretell stage before the public reveal. No board or pending choice is injected. The new test follows the same native attack, response, payment and passes, then verifies exactly the two original top cards for the chooser, no deck identities/private choices for the other seat or spectator, and no state change after a duplicate-card partition is rejected.

Focused destination suite: **19 passed, 1 expected fail**. The remaining expected failure is the public face for the non-acting player. The scope audit now records continuation propagation and native reorder invalidation requirements; no engine visibility change is implemented yet. The new automated check is adapter/engine evidence, not browser evidence.

## Suspended public reveal repair — 2026-10-10

The former expected failure now passes as a normal assertion: Archaic Shield's public deck face is present for the non-acting seat during its choice. The actor still owns the choice; private Foretell remains isolated. Destination suite: 20 passed. Engine Archaic Shield plus internal reveal continuation suite: 23 passed. Engine `pnpm exec tsc -p tsconfig.json --noEmit`: passed. New internal synthetic lifetime tests do not count as real-board fixtures.

The engine tracks public reveal references through effect contexts/choices and validates zone/object/reveal versions in projection. Shuffle and native Foretell reorder invalidate references. The test also covers reordering the same card back to the same top position. Browser evidence, other reveal effect branches, instantaneous event data, cost/Standby lifetime, replay/undo and detailed relevance boundaries remain open. Earlier expected-failure results in this chronological report are superseded for this single suspended reveal path.

## Public reveal effect branches — 2026-10-10

Refactored six public reveal logging branches to share native reference capture. Added checks for the private/public `lookTopPick` distinction, hand reveal completion, top-card choice and a multi-card public window across successive selections. Six focused engine suites: **101 passed**. Engine TypeScript: passed. Previous entries that limit capture to `revealCards` describe the earlier repair stage; the current implementation covers all six effect branches. Instant reveal event data, reveal costs, finer relevance/lifetime boundaries and browser presentation remain incomplete.


### Non-actor reveal browser proof — 2026-10-10

At 1366×768, native Sonoro attack → Torque, set Shield inspection → Counter, both board passes, Magnate top/Sonoro bottom, Confirm order reached the public reveal. The new fixture-only view selector can hold Player 1 while Player 2 owns the choice. It changes only the projection/board perspective and disables gameplay from a non-actor view. It does not submit a command, expose the engine state, or use the match-action fallback. A prior attempt opened and immediately closed that drawer to look for viewer settings; no game input was submitted there.

The first non-actor pile inspection showed zero cards because the UI excluded every deck card. The repair removes that blanket exclusion and lets the native projected identity authorize deck inspection. After repair, Opponent's deck showed exactly one card, Magnate, Cunning Planner; Enter opened its official artwork. Player 1 had no choice prompt or enabled gameplay controls. Returning to Active player → Done → Confirm: Done kept deck 43, moved Shield to Oblivion (1→2), and restored zero inspectable deck faces for Player 1. No private hand identity was exposed. [Public pile](evidence/reveal-scope-opponent-deck-1366.jpg), [face inspection](evidence/reveal-scope-opponent-inspect-1366.jpg), [scope cleared](evidence/reveal-scope-opponent-cleared-1366.jpg).

Validation: 19 inspection/arrangement tests passed, including a real native reveal setup through the component boundary. Two existing Practice page utility tests passed; those do not test the new selector. The selector itself was exercised in the browser in both directions, before and after Done. Normal active-player mode and the default viewport were restored. This is local fixture proof, not remote-client or audiovisual proof.

Remaining UX: public reveal needs an automatic deck-anchored cue rather than requiring pile inspection; the Foretell panel incorrectly calls its private cards REVEALED; destination text still says Oblivion for Done; inspection overlays let resource labels draw over the enlarged artwork. The fixture selector needs compact-layout review. Public hand reveals and face-down public reveals have separate inspection-policy checks outstanding.

## Compact viewer and Purging Heat variant — 2026-10-10

At 844×390 the fixture view selector remains clear of the main board buttons. Changing Active player to Player 1 shows the non-actor's private hand and disables gameplay without advancing the state; restored Active player and the default viewport. Captures: `fixture-view-active-844.jpg`, `fixture-view-nonactor-844.jpg`. This checks scaled desktop controls, not physical touch or general mobile legibility.

Added `destination-reveal-hand` to the existing destination factory, using official Purging Heat. The adapter previously omitted its native activation discard. The shared cost-route model now exposes `activationDiscardIds`, filters by printed/native allowed card types, and submits these IDs as part of the native discard payment. This is game-adapter data, not a shared protocol change. Deck construction and resource chronology bound pass. Native resolution and post-discard hiding pass; the real-board browser flow is still pending. Inspection/arrangement focused tests: 20 passed. Adapter TypeScript check passed.

Final focused destination plus cost-route check: **30 passed**. This includes missing/non-hand activation-discard rejection with unchanged native state, required candidate cardinality, accepted payment/reveal/discard, and privacy restoration. These checks do not replace the pending browser run.

## Purging Heat board flow and prompt repair — 2026-10-10

At 1366×768, used Clash → Sonoro → Torque, waited for Player 2, inspected the set card and chose Counter with Purging Heat. Additional (required) initially hid every later shared prompt, leaving only Choose cards. The route panel owns only the route input; the repair restores the shared prompt for subsequent discard and player-target inputs while retaining resource-stage ownership. No Match actions or log controls were used.

Selected Denver as the activation cost, then Opponent in the restored dedicated target dialog. Auto-pay spent one resource (2→1 ready), hand 1→0 and Oblivion 1→2. Both board Pass controls resolved the reveal. The discard tray showed Denver, Check out my Ramp and Rebound. Selected Denver, cancelled the draft, selected it again and pressed Discard card. Opponent hand 4→3 and Oblivion 2→3; own accessory 1→0 and Oblivion 2→3. Opening the opponent hand then showed zero inspectable faces and “The opponent’s hand is hidden.”

Evidence: [native choice](evidence/purging-hand-choice-1366.jpg), [active pile filtering failure](evidence/purging-hand-pile-filter-1366.jpg), [remaining hand hidden](evidence/purging-hand-cleared-1366.jpg). The flow continued through hot reload after the prompt repair; a clean reset replay remains required. Eighteen inspection-control tests pass, including a new regression for the native counter route's discard instruction and cancellation without submission.

Remaining failure: while the native reveal authorizes all four faces, opening Opponent’s hand during the choice enters target mode and filters out Magnate. The earlier component test used a null selectable-ID binding and therefore did not exercise this live filter. That test proves face inspection permission only, not full browser reachability. Separate inspection from target filtering without allowing an illegal discard. No audio, motion recording, other viewport, or full acceptance claim is made by this run.

## Revealed non-target inspection repair and clean replay — 2026-10-10

Zone pile buttons now open inspection mode even during a pending selection. The general Cards & piles picker retains target mode and legal candidate filtering. Authorized faces remain controlled by the native projection; inspecting a non-target does not select or submit it. The regression now uses `useInteractionBoard`, the live candidate/selection binding, and confirms Magnate inspection without a Magnate discard action or submission. All 18 inspection-control tests pass.

Reloaded `destination-reveal-hand` from its original board after both UI repairs. Repeated Sonoro → Torque, set Purging Heat → Counter → Additional. The activation-discard instruction and Cancel action were visible. Cancel preserved hand 1 and resources 2; retry selected Denver and Opponent, spent one resource and moved Denver to own Oblivion. Both board passes reached the native reveal. Opponent's hand pile now showed four faces. Enter on Magnate opened official artwork without changing hand counts or choosing a discard. Closing inspection restored the original three legal candidates. No Match menu or log was opened.

Captured the choice at 1920×1080 and 844×390. At 844 the panel has nested scrolling and starts with confirmation below the visible area. Selected Denver and pressed Enter on Discard card at that size; opponent hand 4→3 and Oblivion 2→3, own accessory 1→0 and Oblivion 2→3. Returned to 1366, opened opponent hand, and verified zero inspectable cards. Restored the viewport default. This is one clean flow with resized states, not three independent complete viewport runs, and does not prove touch behavior.

Evidence: [cost instruction](evidence/purging-activation-cost-fixed-1366.jpg), [all four faces](evidence/purging-hand-all-faces-1366.jpg), [non-target inspection](evidence/purging-hand-magnate-inspect-1366.jpg), [desktop choice](evidence/purging-hand-choice-1920.jpg), [compact choice](evidence/purging-hand-choice-844.jpg), [clean replay privacy](evidence/purging-clean-reset-hidden-1366.jpg). The previous filtered-pile screenshot remains historical failure evidence. Audio and animation recordings, reduced motion and mute for this flow remain open.

## Purging Heat normal/audio and mute/reduced capture — 2026-10-10

Two fresh native fixture runs reached the same result through Clash, attacker/contender selection, set-card inspection, Counter, required discard selection, Opponent target selection, both board passes and Discard card. No Match actions/log controls, synthetic choices or commands were used. Recordings start at the opponent-target confirmation, after the activation-discard draft, and include payment, seat handoff, reveal choice and discard.

- [Normal motion with app audio](evidence/purging-native-audio.mp4): 156 captured change frames, 11.1 s audio; master gain 0.5625, mono-decoded peak −14.26 dBFS and RMS −44.02 dBFS. At 1.5 s the first response handoff has completed; by 3.5 s the final discarded-hand board is visible.
- [Muted and reduced motion](evidence/purging-native-muted-reduced.mp4): 50 captured change frames, 8.22 s audio; master gain zero and decoded samples all zero. Both settings were checked after reset; reduced motion does not persist through reload, so it was enabled again before the recorded run. [Settings](evidence/purging-muted-reduced-settings-1366.jpg), [result](evidence/purging-muted-reduced-result-1366.jpg).
- [Machine-readable capture metrics](evidence/purging-recording-audit.json).

Both results: opponent hand three, opponent Oblivion three, own hand zero, own Oblivion three, own accessory zero, one of two resources ready. The reduced recording retains the short seat-handoff fade; it is not a claim of zero animation. A first muted capture had no video frames because the capture-loop deadline was stale; it was excluded and the fixture was reset for the complete replacement.

Captured only application output through a temporary Howler master-gain stream, with no microphone and no generated/replacement sound. Disconnected the stream, stopped its tracks and removed capture state afterward. Restored Sound off, Reduced motion off and the default viewport. Encoding at 30 FPS is not a rendering performance measurement. Signal measurements prove presence or silence, not perceptual mix quality or cue-by-cue compliance with the proposed UX specification. Public reveal still lacks an automatic hand-anchored face presentation; most choice communication remains textual.

## Ambush board-only response and entry with audio — 2026-10-10

Fresh `ambush-set-response`, 1366×768. Native Portal open spent 8→6 ready resources. Hand inspection offered Set Gur face down; Set reduced hand 3→2 and accessory 0→1. Fixture view Player 2 showed a back, not Gur's face. Restored Active player, End turn, waited for the resource control, Enter Skip resource, inspected hand Sonoro and chose Play Sonoro (1). Player 2 paid 3→2; Player 1's response inspection offered Ambush Gur. No Match actions/log or More control was opened.

With Sound on and master gain 0.5625, Ambush paid 6→5 and made Gur's pending accessory face public to Player 2. Both passes moved Gur to Player 1's Clash zone, accessory 1→0. The original Sonoro remained in Standby; the next two board passes resolved it, leaving two Player 2 Sonoro cards in Clash. Final views were captured for both seats. The response and entry are two distinct recorded transitions.

Evidence: [hidden set card](evidence/ambush-board-only-hidden-1366.jpg), [native inspection action](evidence/ambush-board-inspection-action-1366.jpg), [public pending face](evidence/ambush-board-pending-opponent-1366.jpg), [Gur entry](evidence/ambush-board-entry-owner-1366.jpg), [final opponent](evidence/ambush-board-final-opponent-1366.jpg), [final owner](evidence/ambush-board-final-owner-1366.jpg). [Response audio](evidence/ambush-board-response-audio.mp4): 107 frames, 6.06 s audio, peak −23.12 dBFS. [Entry audio](evidence/ambush-board-entry-audio.mp4): 87 frames, 6.12 s audio, peak −8.61 dBFS. [Capture metrics](evidence/ambush-board-recording-audit.json). The entry clip ends with Gur in play and Sonoro pending; the original Sonoro's final resolution is covered by screenshots, outside that clip.

Temporary app-output audio tap was disconnected and removed after each capture. Restored Sound off, Active player and default viewport; Reduced motion remained off. These replace the earlier escape-hatch/silent recordings as functional board-only and nonzero-audio evidence. Perceived reveal/entry cue synchronization, same-turn browser exclusion, other sizes, mute/reduced comparison, physical touch and renderer performance remain open. No new code was required for this native access path.

## Compact Ambush owner-pile repair and muted/reduced recording — 2026-10-10

Fresh 844×390 run with Sound off and Reduced motion on. Opened Portal, set Gur, then opened Your accessories. The initial pile incorrectly showed zero cards because it excluded all face-down cards. Compact layout supplies no direct card inspection hit target for this small accessory, so this filter blocked the normal board path. Replaced the blanket filter with `canInspectCard`: native-projected owner identities can be inspected, while opponent identities stay absent. Pile labels use the same authorization. No protocol or native legality changed.

Twenty inspection tests pass, including two native Set tests in compact mode: owner pile → Gur inspection without a command; opponent pile → no Gur identity. The same-turn owner inspection has no Ambush action, but this is outside a response window and does not replace the existing focused native same-turn response test. The exact same-turn browser window remains open.

After hot reload of the pile repair, the running native board retained Set and resource state. Owner pile opened Gur. End turn → Skip resource → hand Sonoro inspection → Play Sonoro → owner accessory pile → Gur inspection offered Ambush. Recorded Ambush and all four passes at 844. Final native state matches the earlier normal run: Gur face up in Player 1 Clash, two Sonoro in Player 2 Clash, no accessories, five of eight and two of three resources ready. [Inspection](evidence/ambush-compact-inspection-action-844.jpg), [same-turn inspection](evidence/ambush-same-turn-inspection-844.jpg), [settings](evidence/ambush-muted-reduced-settings-844.jpg), [result](evidence/ambush-muted-reduced-final-844.jpg).

[Muted/reduced compact recording](evidence/ambush-board-muted-reduced-844.mp4): 52 captured change frames, 9.12 s audio, master gain zero and decoded peak/RMS zero. Reduced motion remained checked after the flow. The temporary audio branch was disconnected and removed. Restored Reduced motion off, retained the original mute, reset viewport and Active player. Capture metrics were added to `ambush-board-recording-audit.json`. Normal and comparison clips use different viewport sizes, so they are functional comparisons rather than controlled animation timing measurements.

Remaining: clean post-fix reset, 1920 flow, exact same-turn browser response boundary, perceptual cue review and frame-performance evidence. The compact run is keyboard proof, not physical touch acceptance.

## Clean desktop Ambush same-turn boundary — 2026-10-10

Reloaded the native fixture at 1920×1080 after the owner-pile repair. No hot reload occurred in this flow. Portal open 8→6, Set Gur hand 3→2, then own Sonoro play hand 2→1 and resources 6→5. Player 2 passed; Player 1 received native response priority on turn 21 with Player 2 marked passed. Gur inspection offered only Return to board, with no Ambush action. [Same-turn response unavailable](evidence/ambush-same-turn-response-unavailable-1920.jpg). This is the actual response boundary rather than idle Primary inspection.

Closed inspection, passed and resolved own Sonoro. End turn → Player 2 Skip resource → inspect/play opposing Sonoro. On turn 22 owner accessory pile → Gur inspection offered Ambush. [Next-turn eligible](evidence/ambush-next-turn-eligible-1920.jpg). An early click during the handoff did not submit; the inspection remained open and resources stayed five. After checking the enabled action in the settled state, click paid 5→4 and exposed the public pending face. Four board passes resolved Gur then opposing Sonoro. [Clean final board](evidence/ambush-clean-boundary-final-1920.jpg): both Clash zones contain two cards, no accessories, Player 1 hand one/resources four of eight, Player 2 hand one/resources two of three. The extra Player 1 Sonoro is intentional provenance for the same-turn test.

No Match menu/log or injected gameplay state. Restored default viewport, Active player and original mute. Clean desktop owner-pile access and both eligibility boundaries are now browser-proven. Compact clean reset and perceptual animation/audio review remain open. Handoff clicks that appear actionable before settling require a UI input-pacing review; this run does not assign the cause.

## Clean compact Ambush replay and specification completion — 2026-10-10

Reloaded at 844×390 after the owner-pile repair, without hot reload. Portal open → hand Gur inspection → Set → owner accessory pile → Gur inspection succeeds with native face. [Clean owner inspection](evidence/ambush-clean-owner-pile-844.jpg). Closed inspection; an immediate End turn click was ignored, leaving the same turn and all counts unchanged. After the inspection transition settled, Enter End turn worked. Skip resource → Sonoro inspection/play → owner pile → Gur inspection → Ambush → four board passes completed both native entries. [Clean compact result](evidence/ambush-clean-final-844.jpg): Gur in Player 1 Clash, two Sonoro in Player 2 Clash, no accessories, Player 1 hand two/resources five of eight and Player 2 hand one/resources two of three. Restored default viewport. All input used board, inspection and dedicated controls.

Expanded the Ambush specification into all seven required parts, with exact actor/privacy/commit boundaries, six-state communication, drag/click/keyboard/cancel behavior, separate motion and sound timelines, and acceptance limits. [Annotated views](ambush-states.html) link real captured boards and clearly label proposed marks. Proposed hover/selected cues are design annotations over baselines, not accepted native pending states. Input pacing remains a current failure: early clicks after closing inspection can be ignored while an action appears available. Perceptual audiovisual and performance acceptance remain open.

## Native combat buff board audit — 2026-10-10

Fresh `combat-buffs` at 1366×768. Clash → Sonoro → opposing Magnate Contender; Player 2 Pass reached Obstruct, then Do not obstruct reached attacker buff. Hand inspection → Clash Buff: Shattering Blow → Show choices exposed both owners' Clash cards. Chose You · clash Sonoro. Target click immediately paid 2→1 and hand 1→0 while the tray had displayed Confirm targets. Both response passes resolved the source to Oblivion and reached defender buff.

Defender hand inspection offered the same native action. Target tray correctly disabled opposing Sonoro with “That target already received a Clash Buff this turn (rule 306.5).” Own Sonoro and both Magnates remained legal. Selected own Sonoro, paid 2→1, then both passes resolved it. Before-damage passes completed the unblocked clash: defender Contender health 30→26; each hand zero, resource one of two, Oblivion one. No Match actions/log or injected move. Viewport reset; original mute retained.

Evidence is linked in ac-buff's expanded seven-part spec. Current failures: target selection auto-submits although Confirm is visible; defender buff status says Priority: Player 1 while Player 2 is the decision owner; no persistent source/target modifier relation is evident in this baseline. Owner grouping and native disabled reasons work. This run does not verify end-of-turn expiry, granted Victory ability, obstruction, sound/motion or other sizes. Catalog status changed from not-reviewed to needs-work.

## Buff stats, cancellation and end-of-turn expiry — 2026-10-10

Strengthened the native fixture test that previously asserted only source movement to Oblivion. It now checks both public targets through `projectState`: Sonoro starts 2/2 (printed 2/1 plus Magnate’s passive +0/+1), becomes 4/4 after each Shattering Blow, remains 4/4 after the unblocked clash, and returns to 2/2 after the native End turn command. Defender health becomes 26. The focused test passed; no pending choice or move was injected. This does not test the granted Victory ability.

A fresh board replay reached both buff steps through attack, passes, hand inspection and the dedicated target tray. At the defender step, Cancel action left hand one and both resources ready; retry selected own Sonoro and paid one resource. Both responses resolved. Passed Before damage, held Player 1 perspective, inspected own Sonoro through the Clash pile, then used End turn. Turn 6 drew Player 2 one card (deck 45→44) and readied that seat’s resources. No Match actions/log inputs were used. Sound stayed muted. Restored Active player and the default viewport.

[Before End turn](evidence/buff-expiry-before-end-turn-1366.jpg), [after End turn](evidence/buff-expiry-after-end-turn-1366.jpg), [settled inspection before](evidence/buff-expiry-inspection-before-1366.jpg), [settled inspection after](evidence/buff-expiry-inspection-after-1366.jpg). Current inspection displays printed 2/1 only, with no current 4/4 or 2/2 display, no modifier source, and no expiry indication. The board also lacks a readable current-stat badge. These are failing UX baselines, not screenshot proof of numeric expiry. Native projection assertions provide that proof. Victory follow-up, obstruction variants, remaining sizes/perspectives, audio/motion and performance remain open.

## Buff Victory variant and obstruction board access — 2026-10-10

Refactored `createCombatBuffFixture` into named both-windows and victory variants, preserving the original route. `combat-buffs-victory` adds official Archaic Shield to Player 1’s hand. Its normal Set command creates the accessory before attack; no choice or effect is pre-seeded. Sonoro attacks the opposing Contender, opposing Sonoro obstructs, and only the attacker receives Shattering Blow. Native damage defeats the obstructor while the attacker survives, then the granted Victory ability targets the own set accessory and sends it to Oblivion. Rules 603.1b and 504.2g.1 identify the Victory condition/timing. The native regression submits each action through the adapter and verifies actual candidates and resulting zones. All 64 focused inspection/native tests pass, including catalog construction and resource-bound checks. Historical reachability of the earlier arranged Clash cards remains outside that validator’s proof.

1920 browser initially exposed only Do not obstruct; inspection had no declaration action. Added Choose obstructors beside the existing board actions, activating the existing native declaration and dedicated picker. Regression confirms it starts a draft with cancellation and no submission. Browser selected one Sonoro and explicitly confirmed: [draft](evidence/buff-victory-obstructor-draft-1920.jpg). Buff and response passes completed through hand inspection. After final Before damage pass the obstructor entered Oblivion; the own accessory became a legal Victory target. Active player view stayed on Player 2 with Waiting even after settling. Selecting fixture perspective Player 1 exposed [the native choice](evidence/buff-victory-native-choice-1920.jpg); its highlighted face-down board target resolved on click. This perspective control changes no gameplay state. No Match actions/log inputs.

[Final owner](evidence/buff-victory-final-owner-1920.jpg), [final opponent](evidence/buff-victory-final-opponent-1920.jpg): health 30 both; Player 1 Clash two/accessory zero/Oblivion two/hand zero/resources one of two; Player 2 Clash one/Oblivion one/hand one/resources two of two. Own target is intentional: printed Shattering Blow does not limit Accessory ownership. Sound stayed muted; restored Active player and default viewport. This run includes hot reload of the board-access repair; clean reset and the Active player handoff failure need further work. Other target owners, empty target boundary, granted-ability expiry, audio/motion, reduced/mute and performance remain open.

## Native choice preempts outgoing motion — clean Victory replay, 2026-10-10

A clean reload reproduced the handoff failure after damage. The rendered practice actor was `human` (Player 1), while the presented actor remained `bot` (Player 2). Temporary rendered diagnostic attributes showed handoff held and transient scene motion busy. Counter transfer count was zero. The native pending choice owner was already correct; this was a presentation wait, not an adapter actor error. Diagnostic attributes were removed after investigation.

Practice now lets a pending native decision preempt the outgoing transient-motion wait. Opening beats and the existing seat veil/dwell still apply. Normal transitions without a choice continue to wait for scene motion. This follows the specification’s immediate mandatory-choice focus rule and prevents animation from blocking the legal decision. It does not fabricate or resolve a choice. The original source of the lingering pose ticket needs separate motion-quality analysis.

Reloaded after the repair at 1366×768. Set official Archaic Shield → attack Sonoro → Player 2 Pass → Choose obstructors → select Sonoro → Confirm → inspect/play Shattering Blow → both response passes → skip defender buff → both Before damage passes. Active player automatically switched to Player 1 and exposed [the native Victory choice](evidence/buff-victory-clean-auto-choice-1366.jpg). Clicked its highlighted face-down target and reached [Primary with the final board](evidence/buff-victory-clean-final-1366.jpg): Player 1 accessory zero/Oblivion two; Player 2 Clash one/Oblivion one; both health 30. No hot reload, manual perspective switch or Match actions/log controls in this post-fix run. Sound remained muted. Restored default viewport. Native and inspection tests previously passed (64); the separate practice test scope checks only existing log extraction and is not handoff proof. Browser replay is the handoff proof. Remaining: other native choice handoffs, audio/reduced comparison, motion ticket quality, boundary variants and performance.

## Buff/Victory app-output recordings and annotated states — 2026-10-10

Recorded fresh native `combat-buffs-victory` runs at the same 1366×768 viewport. Set, attack and one Sonoro obstruction use normal UI before capture; each clip starts at attacker buff and includes hand inspection, target choice, native payment, response passes, skip defender buff, Before damage passes, automatic Victory handoff and own accessory target resolution. Both end in Primary with identical zones/counts. No Match actions/log, injected choice or manual perspective switch.

- [Normal audio clip](evidence/buff-victory-native-audio.mp4): 420 captured change frames, master gain 0.5625, decoded audio 11.03 s, peak −15.27 dBFS and RMS −41.59 dBFS. Initial idle capture interval was trimmed, retaining one second before the first UI change. [Final screenshot](evidence/buff-victory-audio-final-1366.jpg).
- [Muted/reduced clip](evidence/buff-victory-native-muted-reduced.mp4): 152 change frames, decoded audio 7.84 s, master gain zero and every decoded sample zero. [Settings](evidence/buff-victory-muted-reduced-settings-1366.jpg), [final screenshot](evidence/buff-victory-muted-reduced-final-1366.jpg). Reduced motion stayed checked through the complete flow. The first muted capture stopped before a settled final frame; it was replaced by a fresh replay with 1.2 s final animation settle while recording.
- [Machine-readable audit](evidence/buff-victory-recording-audit.json). Temporary Howler application-output branch was disconnected, tracks stopped and capture state removed after each recording. No microphone or replacement sound. Timestamp gaps in audio conversion retain silence; this is not an added gameplay cue. Restored original mute, Reduced motion off and default viewport.

Reviewed intermediate and final encoded frames; both final frames show the completed board. The normal pending frame includes a dark seat veil over public Standby. The reduced run retains seat fade, so it is not zero-animation acceptance. Equal viewport and command sequence allow functional comparison; automation pacing differs and total clip durations do not measure individual animation timings. Change-frame count and 30 FPS encoding do not establish renderer performance. Nonzero audio and digital silence prove presence/mute, not perceptual cue quality or precise impact synchronization. Those remain open.

Added [six annotated native board views](buff-states.html), using captured both-windows and Victory variants. Hover/focus and selected-payment marks are explicitly proposals over baseline images; current single-target auto-commit prevents a captured selected draft. The resolving view is after native effect, not a claimed in-flight frame. Browser rendered all six images with nonzero natural widths; [rendered specification](evidence/buff-six-state-spec-render.jpg) reviewed. Effective stats and expiry remain native-projection proof with a documented current UI failure.

## Native mutual defeat and damage specification — 2026-10-10

Reused `combat-buffs` without playing buffs. Three native obstruction tests passed after stronger outcome assertions: zero obstruction damages the Contender by two; one Sonoro obstruction defeats both Sonoro, clears their clash damage and leaves health 30 both. No extra fixture or card definition was added.

Clean 1366 browser: Clash → Sonoro → opposing Contender → Player 2 Pass → Choose obstructors → own Sonoro → Confirm → skip both buff windows → both Before damage passes. Each Clash zone 2→1, each Oblivion 0→1, health unchanged, hands/resources unchanged. Normal no-choice handoff reaches Player 1 Primary automatically. Own Oblivion inspection identifies Sonoro; Player 2 view agrees with both public counts. No Match actions/log inputs or manual perspective change to advance gameplay. Sound on only for the final-pass recording; restored original mute and default viewport.

The 3.16 s [audio clip](evidence/damage-mutual-native-audio.mp4) contains 108 captured change frames, app master gain 0.5625, peak −7.02 dBFS and RMS −32.54 dBFS. Temporary Howler output branch disconnected and removed, tracks stopped; no microphone or replacement sound. Reviewed intermediate and final encoded frames. At 0.45 s [defeated outlines](evidence/damage-mutual-defeat-overlap-1366.jpg) overlap surviving Magnates after Sonoro removal/recentering. Final frame correctly shows one Magnate each and Oblivion one each. This is a UI anchor/timing failure; do not call the Magnates defeated. Current before-damage board also lacks readable effective stats and combat links.

Expanded ac-damage into all seven specification parts, with native owners, input/commit/visibility constraints, parallel batch motion and sound timelines, source-anchor reservation, reduced-motion behavior and concrete acceptance gaps. A six-state annotated sheet separates proposals from real baseline frames. Remaining branches/viewports, mute/reduced comparison, perceptual cue review and renderer performance remain open. Counts/encoding do not prove 60 FPS.

The [six-state damage sheet](damage-states.html) rendered in the existing simulator’s local file-serving route without another server. All six image elements loaded; [rendered evidence](evidence/damage-six-state-spec-render.jpg). Both buff and damage sheets resolve their local references. Targeted tests, formatting and catalog link checks passed. The before-damage defender status still labels generic priority as Player 1 while Player 2 owes Pass; retain decision-owner/priority separation in the shared status backlog.

### Restore: native board Use/Decline and prompt layouts (2026-10-10)

- Three fresh `optional-restore` runs start before attack. Use Clash, select Warcry and Torque, Pass counter, Do not obstruct, Pass both buffs and both Before damage priorities. No Match actions/log or local resolution. Active-player handoff brings the native Restore choice to Player 1 after Torque takes one damage.
- At 1366×768, inspect Oblivion before attack: Sonoro is Card 1 of 2, Fangyin Card 2 of 2. Enter on Use returns to Primary with deck 41, Oblivion one and Fangyin remaining. Hand two, resources four ready and health 26/29 remain. Opponent perspective agrees on public counts. Browser does not inspect the hidden deck ledger.
- Reload restores deck 40, Oblivion two, health 26/30 and no clash/choice. Repeat legal controls; Decline returns to Primary with deck 40, Oblivion two, Sonoro still first, health 26/29. Decline does not undo the accepted damage.
- Third fresh run reaches the choice at 1366, then resizes to 1920×1080 and 844×390. Both controls remain in the captured viewport. At 844, Use through its actual button completes with deck 41/Oblivion one. This is desktop pointer input; no physical touch or fresh 844 full-flow proof.
- Strengthen the existing native Restore test: exact top identity Sonoro, exact deck/Oblivion order and unchanged health in both branches. Restore is a zone return, not healing. The generic prompt Restore 1? lacks source/top-card/destination communication; added a detailed seven-part Restore variant specification and a P1 backlog item.
- Evidence: `restore-native-choice-1366.jpg`, `restore-use-final-1366.jpg`, `restore-use-oblivion-1366.jpg`, `restore-use-opponent-1366.jpg`, `restore-decline-final-1366.jpg`, `restore-decline-oblivion-1366.jpg`, `restore-choice-1920.jpg`, `restore-choice-844.jpg`, `restore-use-final-844.jpg`; catalog includes initial order and decline-prompt captures too.
- Remaining: empty/one-card and larger Restore values, pending opponent view, six annotated states, paired normal/mute/reduced recordings, performance and full keyboard/physical touch acceptance. No hosted proof.

- Boundary follow-up: extend the existing optional family with `optional-restore-empty` and `optional-restore-one`, preserving the original link and official pre-action boards. Native tests cover Use/Decline with exact pile order, unchanged health and no pending choice. The 82 optional-family/catalog tests pass, including actor-only prompts and stale/illegal answer rejection. The separate all-fixture native card-construction gate passes for the added boards. This is valid construction, not complete historical replay provenance.
- Fresh 1366 board runs complete Use for empty and one-card variants. Empty still offers the native choice, then retains deck 42/Oblivion zero. One returns Sonoro: deck 41→42, Oblivion one→zero. Both retain health 26/29 and resume Primary. Captures `restore-empty-choice-1366.jpg`, `restore-empty-use-final-1366.jpg`, `restore-one-choice-1366.jpg`, `restore-one-use-final-1366.jpg`. Empty/one Decline still has native-only proof.
- Exact local v8 rule 704.26c-d confirms deck-bottom return and retained damage. Authored/printed catalog searches establish Warcry Restore 1 and Gearwin's Restore 1 grant; no larger native Restore value was found. Treat larger-value visual coverage as an explicit unreachable catalog example pending official native support, not a fabricated keyword fixture.

### Restore recordings, focus and remaining Decline boundaries (2026-10-10)

- Clean normal and muted/reduced `optional-restore` recordings at 1366×768 include last Before damage Pass, Torque 30→29, automatic choice-owner handoff, Enter on Use and settled Primary (deck 41, Oblivion one, health 26/29). Earlier native board inputs occur before capture. Each uses a fresh reset. The temporary audio branch captures Howler app output only, with no microphone/replacement sound; it is disconnected and tracks stopped afterward. Sound/reduced settings return to their prior off/off values.
- `restore-native-audio.mp4`: 78 change frames, decoded audio 2.898 s, master gain .5625, peak −17.09 dBFS/RMS −43.28. `restore-native-muted-reduced.mp4`: 44 change frames, decoded audio 3.051 s, master gain 0, samples all zero. Audio packet timestamp gaps retain silence. These are signal checks, not perceptual mix or separate Restore cue acceptance. 30 FPS encoding/change frames are not renderer FPS. Automation pacing differs; clip duration cannot establish individual motion timings.
- Reviewed encoded normal transition and both settled outcomes. Normal counts change correctly; a legible Sonoro return flight is not visible. Keep zone-return communication/motion in the P1 backlog. `restore-recording-audit.json` preserves provenance and limits; recorded prompt/final screenshots and settings are indexed.
- New fresh 1366 boundary runs complete Enter on Decline for empty and one-card Oblivion. Empty retains deck 42/Oblivion zero; one retains deck 41/Oblivion one; both retain damage and health 26/29 and resume Primary. This replaces the prior native-only Decline limit. Screens: `restore-empty-decline-final-1366.jpg`, `restore-one-decline-final-1366.jpg`.
- One-card native choice: Player 2's settled perspective shows Waiting and no Use/Decline controls. Return to Active player; inspect Warcry through the board, then Escape. The same optional choice remains. Tab from Decline focuses Use without moving cards; Enter on Decline completes. Screens: `restore-one-pending-opponent-1366.jpg`, `restore-one-source-inspection-1366.jpg`, `restore-one-use-focus-1366.jpg`.
- `restore-states.html` contains six annotated native board views with explicit proposal/capture labels. All six images load; both video sources load metadata. Selected acknowledges a direct final action, not a fabricated card-selection draft. Pending uses the actual opponent waiting view before owner submission; submitted acknowledgement remains proposed. Resolve uses the accepted baseline and specifies the missing legible return path. Captures mix one/two-card variants and do not claim a continuous match. `restore-six-state-spec-render.jpg` records the rendered artifact.

### Wrath boundary audit checkpoint (2026-10-10)

- Extend the existing optional family with no-Dragon and two-Dragon variants. Native tests cover Use/Decline, source engage cost, exact duplicate instance identity, hidden deck identity, defeat and phase-damage cleanup. All variants start before accessory activation and use official native cards.
- Board-control captures cover accessory inspection, optional Use/Decline, private Dragon candidates, non-owner Waiting, completed return/damage, and no-Dragon completion. No Match actions or log controls advance these runs. These captures precede the publication sync and are baseline evidence, not proof of the incoming main UI changes.
- Two-Dragon Cards & piles captures show editable selection and replacement at 1366, with resized picker views at 1920 and 844. Enter on Done at 844 completed the native action unexpectedly; `wrath-two-dragon-after-done-844.jpg` records that result. It does not prove a separate Confirm action. The close/commit cause and click-versus-keyboard behavior still need investigation.
- `wrath-phase-cleanup-1366.jpg` was captured during a perspective transition. Exclude it from aligned-view cleanup acceptance; native cleanup is tested separately. Wrath recordings, six annotated states, full detailed specification, fresh viewport flows and cue/performance checks remain open. Instant public reveal remains an adapter presentation-data gap.

### Publication checks after main sync (2026-10-10)

- Sync baseline: `a9a1afb8c4` (includes incoming payment-focus/card-cue and engine auto-drain changes). Run optional-effect, native-interaction-coverage and visual-fixtures suites: 124 pass, eight fail. Both optional-effect and visual-fixtures files pass. The eight failures concern transient attack/obstruction assertions, Ambush passCounter and War obstruction states.
- Stash all audit changes and repeat the eight failing cases on clean baseline: the same eight fail (35 skipped). These are existing main failures, not introduced by this fixture/spec checkpoint. Keep the failures open for the continued audit; this PR does not repair them or certify all combat coverage.
- Regenerate coverage reports and verify evidence paths/spec anchors. No hosted services or deployment checks.

### Wrath picker-close repair and fresh viewport checks (2026-10-10)

- Reproduce mouse Done on the synced two-Dragon native board: it commits, just like the prior Enter run. Closing hides/remounts SharedInteractionPrompt; its single-target effect sees the existing draft and confirms. This is not a keyboard-only failure.
- Fix automatic target confirmation to respond to a new selection while mounted, not an existing selection at mount. The real native two-Dragon regression selects second, replaces with first, closes with no submission, then explicitly confirms only first. Optional-effect prompt and shared prompt suites: 24 pass.
- Fresh 1366 mouse and 844 keyboard board runs keep deck 40/hand two after Done; explicit Confirm returns one card (41/one), defeats opposing Sonoro and keeps health 26/30. At 844 start through Your accessories pile, then inspect Dragon's Breath. No Match action/log controls.
- Fresh 1920 pre-action activation and editable draft work. Cancel selection clears the UI draft while retaining the mandatory native target choice and paid cost. Both Dragons remain in hand; direct board retry resolves immediately. Direct target submission remains baseline behavior.
- New evidence: wrath-picker-closed-uncommitted-{1366,844,1920}.jpg, wrath-picker-confirmed-{1366,844}.jpg, wrath-source-inspection-1920.jpg, wrath-optional-choice-1920.jpg, wrath-draft-cleared-1920.jpg. Full seven-part Wrath specification and six annotated mixed-run views now exist; public reveal data, recordings/audio/performance and exact-copy labels remain open.

- Artifact visual review found the earlier source capture mid-flight and the old opponent capture inside the handoff veil. Replace those artifact panels with stable fresh 1366 source inspection and Player 2 Waiting captures. Settled opponent health is 30, deck 47; opposing health 26, deck 40. Candidate controls are absent. The six-state document loads all six images; mixed-run/proposal labels remain explicit.

### Wrath paired recordings and initial cadence measurement (2026-10-10)

- Fresh `optional-wrath-two-dragons` resets, 1366×768, start capture in source inspection. Normal and muted/reduced flows use native Engage → Use → Choose cards → Cards & piles → second Fangyin → Enter Done → Enter Confirm. The recorded draft retains deck 40/hand two; accepted result is 41/one, opponent Clash zero/Oblivion one, health 26/30. No Match actions/log or local gameplay mutation.
- `wrath-native-audio.mp4`: 126 change frames, 3.462 s decoded audio, master gain .5625, peak −13.20 dBFS/RMS −36.22. `wrath-native-muted-reduced.mp4`: 101 frames, 3.525 s decoded audio, gain zero, all decoded samples zero. Capture only branches app Howler output, with no microphone/replacement sound. Packet timestamp gaps retain silence. Temporary branch is disconnected, tracks stopped, global probe absent; Sound/reduced settings return to prior off/off.
- Encoded frames reviewed at normal 1.7/1.9/2.1 s and muted 1.7/2.3 s. Picker draft is explicit. Damage/phase badge and defeat outcome are visible, but a legible public reveal and hand-to-deck-bottom flight are not established. Mute/reduced retains the same outcome. These samples do not establish individual sound-cue timing or full perceptual mix. Recordings include accepted Use only, not Decline/no-Dragon or opponent reveal.
- Separate fresh normal-motion run without screencast/audio recording samples requestAnimationFrame cadence for the first four seconds of the same native path and settling: 227 intervals, mean 17.62 ms, median 16.7 ms, p95 17.2 ms, max 116.3 ms; four intervals >20 ms, three >33.34 ms. Long tasks 74/126/64 ms. Environment: Chrome 155 IAB, visible document, MacBook Pro Mac17,8, Apple M5 Pro/18 CPU cores, 48 GB RAM, Apple M5 Pro GPU.
- `wrath-frame-cadence-audit.json` saves raw timings and hardware/browser. This is scheduling evidence from one dev-build run, not GPU-presented FPS, production or crowded-board certification. The long tasks contradict smooth 60 FPS acceptance for this run; profile their cause before acceptance. Temporary frame/long-task probes are removed. Encoding/change-frame count does not measure renderer performance.
- `wrath-recording-audit.json` records audio provenance/limits; normal/muted draft/final screenshots and settings are indexed. Six-state document embeds both recordings. No hosted proof.

- Fresh browser phase cleanup: before End turn the surviving friendly Sonoro has phase-damage badge one. End turn clears it; the fixture bot then takes its legal turn and starts a new clash, stopping at the human obstruction decision. Same Player 1 orientation and health 26/30; no damage from that new clash is resolved. `wrath-phase-damage-before-end-1366.jpg` and `wrath-phase-cleanup-stable-1366.jpg` replace the old perspective-transition capture as cleanup evidence.

### Void chain, native boundaries and private draw audit (2026-10-10)

- Trace The Absence's authored trigger and Breach the Void; local v8 704.34c requires the whole parent banish effect to finish before Void triggers. Replace the old single hand-count check/direct pass loop with three native adapter branch tests and exact deck slices, banished identity, no early mandatory draw, hidden opponent hand identities and health assertions.
- Add named no-Void-top Warcry and full printed-health (25) variants through the same native pre-action factory. Eight focused start/Void/construction checks pass. Full optional/catalog run has 98 pass and one newly added closed-Portal test failure: it tried End turn before resolving The Absence's Portal target trigger. Repair the test to resolve that real target through native submission; focused repaired case passes. This was a test-driver omission, not a UI/engine repair.
- Fresh 1366 base board runs use End turn. First Decline keeps deck 40/hand two/Banished zero. Use then Decline commits Breach to Banished and still draws the mandatory Void card: 38/three/one. Use twice gives 37/four/one. All health 24/30. Parent draw is still pending at 39/two/one; inspect Breach via Banished pile and close without answering. Keyboard focus Use and Enter Decline work.
- Fresh settled Player 2 view while owner choice is pending shows Waiting without submission controls. After both draws, opponent Banished inspection exposes Breach; opponent-hand inspection has zero cards and The opponent’s hand is hidden. Native projection tests independently verify exact drawn instances hidden.
- Editing the fixture factory triggered HMR reset during one result capture. Repeat the full two-Use flow on the reset board and overwrite its result evidence only after verifying 37/four/one. Do not treat the reset screenshot as outcome proof.
- Fresh 1920 no-Void-top run: banish Warcry, Decline parent draw, native 39/two/one, public Warcry inspection. Fresh 844 full-health run: initial 25/25, both prompts usable by Enter, Use then Decline reaches 38/three/one, health unchanged. Base Portal-close boundary at 1366 pays its native activation, resolves The Absence target on the board, then End turn yields no banish/draw prompt and retains 40/two/zero.
- After each chain the normal fixture bot acts and starts a new clash, stopping at human obstruction. Its unrelated resource/card actions are not Void effects. No Match action/log control advances any browser run. Source/queue readability is needs-work; generic Draw a card? omits the still-mandatory Void context. Seven-part specification and six annotated mixed-run states now exist. Recordings/audio/performance, empty/depleted deck, paid/multiple Void triggers and full viewport/physical touch acceptance remain open.

- Final optional-effect fixture suite: 27 pass after the Portal-trigger driver repair. The earlier visual-fixture/catalog suite passes 72 tests with the new variants. All six Void artifact images load and the rendered annotations are reviewed. `void-six-state-spec-render.jpg` records the artifact. Coverage-path/anchor verification passes; this does not certify full interaction completion.

### Void empty and last-card native checkpoint (2026-10-10)

- Add empty-deck and last-card variants to the existing optional-effect family. Both use complete 50-card official ledgers and start before End turn. The arranged late-game ledger is construction-validated; a historical replay to that exact board is not proved.
- Five focused native checks pass: empty deck suppresses The Absence's banish choice; declining the last-card banish keeps the card; accepting it ends the game by deck-out after either answer to the parent draw. Both viewer projections show game over with no legal actions. The all-fixture ledger gate passes.
- These two variants have no completed browser capture or motion/audio acceptance yet. Keep that gap open; their inclusion in the catalog is not browser proof.
- Publication check: optional-effect fixtures (32 tests), optional/shared prompt suites (24 tests) pass. The native coverage suite has the eight existing combat failures already reproduced on clean main in the preceding checkpoint, plus a missing catalog mapping for the two new variants. Add their mappings and repeat the focused catalog check. No engine behavior is changed in this checkpoint.

- Repeated catalog traceability and all native card-ledger gates after adding the mappings: two pass, 41 skipped. Generated report check and whitespace check pass.

### Void depletion browser proof, result-perspective repair and paired media (2026-10-10)

- Fresh 1366 empty-deck board: End turn uses the normal control; no optional prompt appears. Player 1 deck zero, hand two, Banished zero remain. The bot later draws/resources/starts a clash; these unrelated actions are not Void effects.
- Fresh 1366 last-card board: End turn → Use leaves deck zero, hand two, Banished one and the parent Draw a card? choice. Enter Decline then causes native deck-out, health 24/30 unchanged. First Decline at 1920 preserves deck one and skips the chain. Both Use by Enter at 844 cause deck-out as native tests predict. No Match actions/log use. Physical touch and complete branch-by-viewport matrix remain unproved.
- Settled Player 2 terminal view wrongly said You lose despite being the native winner. Repair Practice.page.tsx result color/text to compare winnerId with presentedActor, preserving named self-play results. HMR resets the board; repeat the entire native chain. Settled Player 2 now says You win and Player 1 says You lose. Capture before/after separately. Banner is readable at 844 but still exposes raw decked and retains disabled Waiting.
- Fresh base recordings at 1366: End turn → Use → Enter Decline; mandatory Void draws after the parent, result 38/three/one, health 24/30. Normal: 72 change frames, 2.564 s decoded audio, gain .5625, peak −15.36 dBFS/RMS −37.31. Muted/reduced: 19 change frames, 2.435 s decoded audio, gain zero, all decoded samples zero. App Howler output only, no microphone or replacement audio. Branch disconnected, tracks stopped, global probe absent. Sound and reduced motion restored off/off.
- Initial mute/reduced attempt applied settings before reload. Reload reset Reduced motion, and capture gain was one. Reject that attempt; repeat after resetting first and applying settings afterward. Only the verified gain-zero, Reduced motion checked run is encoded/indexed.
- Review normal 0.65 s and muted 1.1 s frames: generic parent prompt and later outcome are visible, but no source-linked queued Void context is shown. Change-frame count/30 FPS encoding is not renderer performance. Clips exclude first Decline/both Use, exhaustion and opponent perspective. Perceptual cue timing, full animation and GPU-presented performance acceptance remain open.

- Final focused depletion and catalog/card-ledger gates: six pass, 69 skipped. Reports are current and whitespace checks pass. Artifact loads all 12 images and both videos; rendered initial annotations are reviewed. Default viewport restored.

### Opening public readiness, authoritative confirmation and standalone audio (2026-10-10)

- Native projection already supplies public mulligan.resolved. Carry it through local board and live parser as openingHandsReady, without private selected IDs. Waiting after completion now says both hands are ready and the starting seat must begin. HANDS READY remains visible at 844 where detail is hidden. Static opening review exposes the fixture view selector; non-acting view remains disabled for gameplay.
- Native hot-seat run uncovered Returning 2 cards before submission: useArenaOpening dispatched at the reshuffle timer. Move native submission to Replace confirmation. First accepted selection with unresolved other seat stays on review and old hand remains stationary. Only final accepted resolution starts replacement deal. Timers now change presentation only; cancelled/WebGL-failed presentation cannot undo an accepted command. Outgoing return/shuffle snapshot is absent and remains an explicit production gap.
- Hook-signature HMR caused a React hook-order error during editing; reload and repeat from a fresh native initializer. The initially saved error image is overwritten only after the successful native repeat. Do not treat the hot-reload exception as final fixture behavior. Native hot-seat first two-card selection keeps Captain Maxine/Lord Krung while waiting; second two-card selection resolves both. Both-ready waiting and start captures at 1366; compact heading and Enter start/resource deployment at 844; both-Keep readiness at 1920 and 1366. Final resource result is settled, hand seven/deck42/one ready resource.
- Mute attempts on the opening route failed by mouse and keyboard. Source confirms no SimulatorSettingsProvider or SimulatorAudioProvider on that standalone route; fallback setter is a no-op. Add existing providers. Route contract probe verifies volume zero/75 reaches audio; it contains no cards and does not count as native coverage.
- Initial whole-opening recording stopped at a locator's short wait before hand review; discard partial capture. Bounded live-button polling records the full sequence. A second pre-provider normal recording is also excluded from current mute proof. Only post-provider repeats are encoded/indexed.
- Fresh 1366 normal/audio and mute/reduced: Enter Begin opening → Take mulligan (bot Keep) → select Captain Maxine and Lord Krung → Enter Replace2 → accepted deal → Enter Begin game → Enter Skip resource. Both end turn-one Primary with both hands eight/decks42/health30. Normal 447 change frames, 11.497 s decoded audio, gain .5625, peak −12.40 dBFS/RMS −38.91. Muted/reduced 56 frames, 3.864 s audio, gain zero and all samples zero. Temporary Howler branch only; no microphone/replacement audio, tracks stopped/branch disconnected/global probe absent. Sound/reduced restored off/off.
- Review normal 5.7/6.4/7.2/8.0 s: available hand, selection frame/count and accepted incoming deal are visible; six retained faces stay. No accepted outgoing return/shuffle is claimed. Reduced duration and change-frame counts are not renderer FPS or cue-quality proof. Recordings do not cover both-replace, zero/all or opponent perspective.
- Opening native/hook/UI focused run: 15 pass,20 skipped. Route-provider and hook/UI follow-up:10 pass,20 skipped. The first readiness test attempt failed because the test helper did not return view; obtain it from the real engine, then both readiness boundaries pass. Full final focused suites recorded below. No hosted validation.

- Full four-suite attempt:35 pass,one obstruction test fails because its test driver submits passClashStep after the adapter has already reached Obstruct. Replace that obsolete pass with a strict native Obstruct assertion; do not inject or advance game state. This is separate from opening behavior and retains the board-control assertion. Repeat the full focused suite after that driver repair.
- Opening artifact loads all10 images and both videos (ready4); rendered annotations reviewed and captured. Normal5.7 s is the available replacement stage, not the initial deal. Default viewport restored.

- Final repeated four-suite run:36 pass. Report/path/anchor and whitespace checks pass. Local evidence only; full audit remains active.

### Native combat automatic-progression and forced-unable browser checkpoint (2026-10-10)

- Previous publication turn is progress:62 files committed and PR4377 merged, checkout synced to c667314d1a. No completion claim for the full goal.
- Recheck eight previously baseline-confirmed failures. Diagnostic native state output confirms drainEmptyResponseWindows consumes empty response/buff windows, so expired clash snapshots are absent. Remove temporary diagnostics. Replace transient assertions with selected-target/defender zones, ready state, unchanged non-targets and exact health; retain native candidate/minimum/required-ID checks and add invalid Flight/Torment rejection with unchanged authoritative state. Remove only Ambush's obsolete passCounter, assert own play resolved and set Gur remains hidden on its set turn, then test later response normally. Exact eight:8 pass/35 skipped. Full native coverage:43 pass.
- Fresh1366 forced-unable bot run uses Clash/War/Magnate/triggered Sonoro, then real bot selects LINN. Pile inspection verifies LINN in opposing Oblivion; Sonoro remains engaged, War and LINN defeated, health30/30. Fresh hot-seat run sets only control mode in Match then closes it; all gameplay uses board controls. Enter Do not obstruct yields no defeats, Sonoro still engaged, health30/27; both settled seat views captured. No actions/log escape-hatch gameplay or result inference.
- 844 and1920 captures resize that final P1 result. First844 capture raced the renderer resize and showed partial canvas; overwrite after settled DOM/layout and visual inspection. Compact result health is readable, but artwork rules/stats require inspection; no physical touch or fresh compact action proof. Desktop settled status shows no loading artwork. Default viewport restored.
- Defender decision status still says Player1 has priority while Player2 chooses obstructors; long War trigger similarly lacks a clear decision-owner relation. Required-target source/link/engaged reason remain production UX gaps. No media/audio/performance proof added this checkpoint. Full goal remains active.

### Forced-unable paired recording and native annotations (2026-10-10)

- Previous goal turn is progress: eight stale combat cases repaired, full native coverage43 pass, browser engaged/no-companion and bot-companion boundaries captured. Current work retains those native assertions and adds media evidence.
- Two fresh1366 hot-seat runs: Clash → War → Magnate → real War trigger targets engaged Sonoro → Enter Do not obstruct. All commands use board controls; Match only sets Hot seat beforehand. Normal and muted/reduced settle in Primary at health30/27, Clash1/3, Oblivion0/0, decks44/41. Screenshot checkpoints are taken inside the same recorded native flow; no choices or moves injected.
- Normal164 change frames,4.632s capture,4.601s decoded app audio, gain.5625, peak−16.33dBFS/RMS−41.52dBFS. Muted/reduced72 frames,4.179s capture,4.114s decoded audio, gain0, all samples zero. Preserve packet-gap silence and align recorded audio to first video frame; encoded30FPS is not renderer FPS. Howler app-output capture only, no microphone/replacement sound. Cleanup disconnects branch, stops tracks and removes probe; browser confirms probe undefined. Restore sound/reduced off/off and default viewport.
- Inspect normal frames1.3/2.0/2.7/3.1s: long target prompt, accepted trigger with attacker Waiting, settled defender control, then native health27. No clear impact/delta sequence follows the native pass. Input pacing differs between clips; timing is not a token-duration measurement. Reduced prompt mount lags one screenshot; reject/remove that pending image only, retaining the real target-control wait and completed recording. No gameplay command is retried or fabricated.
- New obstruct-states.html contains six annotated normal native states plus defender choice and paired videos. Resolving/result boundary is explicitly labelled missing impact presentation. All seven images and both videos load (ready4); initial rendered annotations reviewed and captured. Media/cue/performance and other native branch acceptance remain open; full goal active.

### Public decision owner and live priority mapping repair (2026-10-10)

- Previous goal turn is progress: paired obstruction recordings, decoded digital mute and annotated native artifact added. Those recordings predate this owner-copy repair; retain them as explicitly labelled baseline.
- Native adapter already knows War target choice owner and Obstruct owner; board mapping dropped it. Add only public decisionSeat to game-owned viewer projection, no private selection data or generic gameplay protocol change. Preserve type at getViewerState and remove Practice's ProjectedState cast. HUD shows next decision separately from response priority/active turn; YOUR CHOICE precedes generic response copy. Live parser also dropped responseWindow; parse native openFor/passedPlayers, reject malformed seat history and preserve old absent fields.
- New native test covers War choice ownerP1/response priorityP2, opponent has zero private choices, spectator sees public owner, then Obstruct ownerP2/active turnP1. Initial focused native check1 pass/43 skipped. HUD/player-control test adds actual adapter projection and malformed pass-history checks. First attempt passed fixture arguments in the wrong helper slots; repair to setup(0, fixture, options), repeat full focused scope. Final native/HUD/inspection3 suites76 pass. Adapter suite22 pass. Uncached adapter tsc --noEmit passes; no full-platform or hosted validation.
- Fresh1366 ?mode=self board: Clash → War → Magnate shows YOUR CHOICE, Your decision and Player2 priority. Trigger Sonoro → settled P2Obstruct shows Your priority/Your decision; Enter pass preserves native result30/27. No Match panel opened. Fresh844 pointer attempt hits a prompt overlapping War and leaves attacker unselected; following target locator times out because there is no target stage. Inspect actual board and hit rectangle, capture failure, then use native Enter controls to select attacker/target/trigger and pass. Final30/27 and no defeats. This is keyboard proof plus recorded pointer failure, not pointer success. Default viewport restored.
- Required-source links, long trigger text, crowded layout, remaining chains/seat views, media after owner repair and perceptual/FPS acceptance stay open. Full goal remains active.

### Merged-layout compact obstruction and announcement follow-up (2026-10-10)

- Previous turn is progress: all changes committed, PR4379 merged and checkout synced to0db45e3140. This pass verifies the combined layout through the existing5193 simulator. No Match/actions/log panel used; hot-seat selected with the supported mode=self route.
- Fresh844×390 pointer flow: Start Clash → War → Cancel action → Start Clash → War → Magnate → native trigger Sonoro → defender Choose obstructors → LINN → Confirm obstruction. Both health30; War and LINN leave Clash, one card enters each Oblivion; Sonoro remains engaged and Plasmax remains. Compact footer leaves attacker, target and defender candidates clickable. Captures: forced-merged-trigger/companion-selected/companion-result-844.
- After selecting Player2 fixture view, wait for the renderer to settle before capture. Pointer inspection of Your Oblivion instead opens End-phase help: record as an unresolved hit-target collision. Close help and use native keyboard Enter on the pile; LINN and Card1of1 appear. This is inspection fallback proof, not direct pile pointer acceptance. Cards & piles was also opened/closed without submitting a game action.
- The merged turn console had a correct priority/decision aria-label but its live text still said You have priority during the opponent response window. Use the same authoritative status in its live text. Add a native integration assertion for opponent priority/your decision and absence of the contradictory sentence. All25 inspection/control tests pass.
- Fresh1366×768 pointer run repeats War→Magnate→Sonoro→No obstruction. Corrected live text and accessible label agree; defender health27, no defeats, native Primary result. Captures forced-merged-trigger-1366 and forced-merged-pass-result-1366. No new audio/animation-performance claim; previous clips remain historical. Default viewport restored. Full audit remains active.

### Compact pile pointer repair (2026-10-10)

- Previous turn is progress: merged-layout native pointer branches and corrected live priority announcement. Current measurements show own deck/Oblivion hit rectangles at y309–333 and phase buttons at y274–332. Phase controls therefore intercepted the pile centers.
- Add32px compact separation between phase track and action row. First retest still fails: DOM hit stack identifies the transparent console section/action container. Make the live-console wrapper pointer-transparent; explicitly retain pointer input on phase/action buttons and suppress those buttons during card inspection. Phase buttons now end at y300, before piles start at309. No engine or action mapping change.
- Fresh844 native War→Magnate→Sonoro→LINN obstruction creates both piles at health30/30. Pointer opens War in Player1 and LINN in Player2, Card1of1. Initial capture across stylesheet refresh lacked the inspector; reopen through the board, wait for the actual War dialog, and replace that image. Deck41 pointer opens a private-deck dialog with zero visible identities. Phase End help still opens without advancing turn.
- Same settled native board: direct LINN pile inspection at1366 and1920 succeeds. These are resized inspection checks, not fresh gameplay runs at each dimension. Six captures indexed; compact board spacing visually reviewed. No physical touch/60FPS/audio claim. Default viewport restored.

### Instant reveal output boundary audit (2026-10-10)

- Previous turn is progress: compact pile hit targets repaired and native both-view pointer evidence captured. Current source audit traces instant reveal loss from revealCard effect context through CommandResult and adapter automatic passes. A final-state diff cannot supply the accepted temporary face.
- Added instant-reveal-proposal.md with exact owner boundaries, transactional snapshot requirements, audience/lifetime rules, versioned deduplication, compound/drained command ordering, quote/rejection isolation, reconnect/undo/replay semantics, proposed motion/audio sequence, and native acceptance matrix. No gameplay protocol or engine behavior changed. This is an explicit implementation gap, not accepted reveal coverage.
- Wrath native regression now checks the final hidden deck face through the real adapter for actor, opponent and spectator, instead of treating prose log content as reveal proof. It preserves existing selected-card/bottom/damage assertions.
- Focused Wrath privacy regression:1 pass/31 skipped. The37-case evidence/spec path check and whitespace check pass. No runtime or audiovisual completion claim for the proposed event contract.

### Purging Heat after the merged turn-console layout (2026-10-10)

- Previous turn is progress: instant-reveal proposal and all-view Wrath hidden-deck regression. Source review confirms the earlier hand-inspection repair already exists, including a live selection binding test; do not duplicate it. Update the stale backlog after fresh browser proof.
- Fresh1366 native fixture, mode=self: Start Clash → Sonoro → Torque → defender set-card inspection → Counter with Purging Heat → required additional route → Denver cost → opponent target. Last target selection commits through native auto-payment and drains empty windows; a follow-up Confirm targets locator therefore finds no control. Inspect actual resulting state instead of retrying: hand0, one resource spent, cost Denver in Oblivion, revealed-hand choice active.
- Opponent hand pile shows all four authorized faces. Magnate opens for inspection and has no legal discard control. Closing inspection returns directly to the choice tray; a second library-close locator finds no modal, so read state before continuing. Stage Denver: hand remains4 and text says Not yet applied. Cancel selection, resize844, reopen public hand: all four still inspectable.
- At844 use Choose Denver → Discard card by pointer. Hand4→3, both Oblivion counts3, source Trap no longer in Accessories, both health30, defender Obstruct active. Opponent hand pile then reports zero inspectable faces and explicitly says hidden. Six captures indexed; compact public/hidden images visually reviewed. No Match/actions/log controls used. No engine or UI behavior changed in this pass.
- This is fresh1366 payment with resized844 inspection/discard, not full fresh844 setup/payment or new audiovisual evidence. Existing normal/mute clips predate this merged layout. Default viewport restored.

### Hearthstone reference and audio acceptance extension (2026-10-10)

- Previous turn is progress: Purging Heat merged-layout public/hidden hand evidence and stale backlog correction. Current primary-source review reopens Blizzard's2018 VFX article and2023 sound-team interview. Historical dates remain explicit.
- Official Magnetic GIF inspected in the in-app browser. Save three actual rendered frames: enlarged source beside host, separate2/2 bodies, combined4/4 body. Add numbered reference-board annotations. No GIF timing, audio or current-build inference; no reference asset copied into product code.
- Add an explicit audio review record and gates for accepted beats, onset uncertainty, dense overlap, repetition, cancellation, privacy, mute/reduced and human listening. Existing waveform measurements remain mute/output evidence only. This completes missing reference annotations for Hearthstone, not the full cross-game study or perceptual audio acceptance.

### Accepted outgoing opening snapshot (2026-10-10)

- Previous turn is progress: Hearthstone reference annotations and explicit audio acceptance gates. Current opening code confirms native submission precedes motion, but skipped return/shuffle because it had no outgoing authorized card snapshot.
- Add a presentation-only hand snapshot captured from the caller's viewer projection, with exact hand-ID membership and single-owner validation. Hold it only after successful resolved mulligan; rejection, unresolved first selection and zero replacement retain the review. The arena uses it only for return/reshuffle and only for the matching viewer. Other perspective never renders this private batch. Redraw uses current native cards; completion/cancel releases the snapshot. No native card/state or protocol mutation, and timers still submit no commands.
- Native hook test now supplies the real projected opening hand, verifies native resolution before Return, detached outgoing snapshot, six retained cards and unchanged command count across timers. Presentation-boundary check rejects mixed zones/membership and verifies wrong-view and post-return stages use the current board unchanged. Two suites6 pass. These checks do not certify deferred first-seat two-player choreography.
- Fresh1366 opening browser: Begin opening → Take mulligan → Captain Maxine/Lord Krung → Replace2. Capture during accepted Return shows the two original outgoing faces and six stationary retained cards; final native hand has Lord Krung/Warcry replacements, both hands8/decks42/health30 and Begin game. Existing official card art only. Native deal animation initially exceeds one browser locator wait; observe the live hand instead of restarting.
- Evidence opening-accepted-return-snapshot-1366 and opening-accepted-snapshot-final-1366. No new audio/sequence recording yet; physical touch, reduced motion, interruption, both-replace/delayed-first-seat and full viewport acceptance remain open. Earlier clips predate this repair.
- Final native opening/hook/snapshot scope:12 tests pass across3 suites. Report paths/anchors and whitespace checks pass. Default browser viewport restored.


### Delayed opening batch publication checkpoint (2026-10-10)

- Store an accepted first-seat hand snapshot until the engine resolves both mulligans. Start its presentation once when the matching viewer returns; clear consumed or cancelled batches. The snapshot stays in presentation memory and no timer submits a native command.
- Native hook regression: both players declare mulligan; Player 1 replaces two cards, Player 2 replaces one. The second player’s batch plays first; returning to Player 1 plays its original authorized batch once. Repeated perspective changes do not replay either batch. Four native submissions total; presentation leaves authoritative state unchanged.
- Publication checkpoint interrupts the browser pass after the first mulligan declaration. No completed two-player browser or new audio evidence is claimed. Existing single-actor snapshot captures remain valid for their recorded scope.
