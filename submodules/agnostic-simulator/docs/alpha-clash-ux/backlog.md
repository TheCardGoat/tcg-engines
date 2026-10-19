# Ordered implementation backlog

Production UI work is a later stage. Each item must retain native action, hidden-information, and reduced-motion checks. Do not fix game rules in presentation.

| Priority | Owner | Work and acceptance | Cases |
|---|---|---|---|
| P0 | Alpha Clash engine projection | Complete instant-event presentation, Standby costs and remaining lifetime boundaries after the suspended reveal scope repair across effect branches. Validate both-player browser presentation. Do not infer public identities from log text. See [confirmed gap](coverage.md#reveal-visibility-gap). | reveal |
| P0 | Fixture authors | Complete historical reachability review of arranged turn/counter/zone states. Catalog ledgers pass native construction; preserve that gate and validate added variants. Add replay provenance for sensitive cases. | all midgame |
| P0 | Alpha Clash adapter | Extend native availability reasons from bounded Portal/attachment/ability checks to multi-input cost combinations. Keep rejection atomic. | attach, detach, portal, abilities |
| P0 | Alpha Clash adapter | Expose required-defender presentation and complete remaining native restriction specimens. Ready/engaged forced-obstructor combinations now pass native tests. Pair-specific attack candidates, Flight/Interception and Torment now have native validation. | attack, obstruct |
| P1 | Fixture authors | Complete remaining per-perspective/boundary browser coverage and motion/audio evidence for shared non-clash prevention. Local clash prevention, one-candidate search/retrieve, Ambush and lethal/deck-out now have native cases. Keep no-native-X as a catalog gap. | allocation, search, retrieve, set, finish |
| P1 | Shared presentation + Alpha Clash view | Improve search/retrieve scrolling cues and small control legibility. Keep all controls reachable and preserve card ratio. Verify 1920×1080, 1366×768, and 844×390 after resize and fresh load. | search, retrieve |
| P1 | Shared presentation | Establish source/target/destination marks, focus and selected shapes, input draft/commit separation, and explicit cancel semantics. | play, payment, targets, destinations |
| P1 | Shared presentation | Implement the shared motion timeline, authoritative transition queue, interruption and reduced-motion rules. Do not delay unrelated legal input. | all |
| P1 | Shared audio | Implement semantic pick/place/confirm/impact/reject cues, priority and concurrency caps, deduplication, mute, and hidden-information-safe sounds. Record audio evidence. | all |
| P1 | Alpha Clash view | Make priority and combat links clear; reduce long raw trigger text to a short intent plus inspection access. Keep full accessible context. | priority, optional, attack, obstruct, buff |
| P2 | Shared presentation | Unify number, order, partition and allocation controls with keyboard paths and in-place outcome previews. | number, ordering, partition, allocation |
| P2 | Alpha Clash view | Separate fixture setup log noise from the tested action; keep public history safe and navigable. | logs, recovery |
| P2 | QA | Record all case paths with audio, mute and reduced-motion variants; measure animation frame times on named hardware in a production build. | all |

Completed in this stage: opening declaration routing and accepted-state choreography; required/nested target inputs; Set independent of play targets; Portal closing; Weapon detachment; repeated selector unification. Native tests pass for these cases; full visual acceptance is still required.

Completion gate: no reachable case without a legal native fixture, full seven-part specification, actor/opponent evidence, and disposition of each UX failure. This report does not waive that gate.

- Obstruction minimum: show “Choose at least 2” for Torment, beside the selected count. Current 1/3 count gives no reason for disabled Confirm. Keep Do not obstruct as a separate legal path. Evidence: `obstruct-torment-one-1366.jpg`.

- Endgame: replace raw `decked` / `contenderDefeated` reason codes with short player-facing results. Remove priority and Waiting controls after completion. Keep the final board and public log inspectable, with stable seat orientation. See `finish-deckout-1366.jpg` and `finish-lethal-1366.jpg`.

- Ambush presentation: make an eligible set card an accessible board response source. Show accepted reveal, pending response and final entry as separate states. The earlier path required More; a fresh board-only inspection response and separate paid/pending/entry recordings now work at 1366. Keep the pending source and entry visually distinct. Review deduplicated reveal/entry sound cues against the new nonzero-output response and entry captures; a compact muted/reduced comparison now completes the full native flow with digital silence. Clean post-fix reset, 1920 and cue-quality acceptance remain open. The old checkbox was checked while shared master volume was 0; the control now uses shared volume. The silent clips do not prove missing cues. Evidence: `ambush-response-audio.mp4`, `ambush-entry-audio.mp4`.

- P1 allocation semantics: distinguish prevention from damage. Current local-prevention UI labels points as damage and draws outgoing arrows from the protected card. Use incoming source links and shield marks, and require explicit confirmation before committing the last point. Native resolution is correct. Evidence: `prevention-local-full-1366.jpg` and `prevention-local-result-log-1366.jpg`.

- P1 player targets: make player status plates selectable for native player entities. Replace the incorrect “choose exactly 1 card” description with the entity kind. Keep the working labelled Opponent picker as an accessible fallback.
- P1 scaled allocation dialog: at 844×390, the shared-prevention dialog clips its controls. Reduce repeated headings, preserve a usable scroll area and pin Confirm without hiding candidate rows. Duplicate-card controls also need position labels and a board highlight link. Evidence: `shared-prevention-allocation-844.jpg`.

- P1 forced obstruction: replace misleading “Do not obstruct” when a ready native-required defender will be added. Show the required card and source before confirmation; distinguish fixed and voluntary shields. Keep engaged requirements excluded. Evidence: `obstruct-forced-before-1366.jpg`.

- P1 rendering performance: trace the production damage/destruction transition. The native War/Sonoro clash recorded one 116.7 ms callback interval at 1366×768 on Apple M5 Pro/Chrome 155. No long task was reported. Keep the cause unassigned until a renderer/GPU trace separates state projection, upload, rendering and presentation delays. See `production-performance-summary.json`.

- P1 resource input: supply the specified click and keyboard deployment path. In the corrected turn-5 board, card click opens inspection without a deployment action; drag succeeds. The accessibility tree exposes Skip resource as text, which needs a keyboard/semantic-control review. Evidence: `resource-turn5-deployed-1366.jpg`, `resource-turn5-skipped-1366.jpg`.

- P2 opening status: after both replacement selections resolve, the waiting seat should say the starting player is ready to start. Current “other player’s opening decision” copy suggests another mulligan choice is pending. Evidence: `opening-both-replace-p2-result-1366.jpg`.

- P1 mode choices: preserve the source artwork, use a clear effect heading and icon/amount tiles, and separate draft selection from Confirm. Haven currently displays / Draw one card and commits on the option button. Keep required-choice cancellation and private draw visibility explicit. Evidence: `haven-mode-choice-1366.jpg`.

- P1 optional follow-up selection: Denver's mandatory discard commits on the first card click despite presenting Confirm. Use one consistent draft/change/confirm model, and distinguish an accepted optional draw from its required follow-up. Evidence: `denver-discard-choice-1366.jpg`.

- P1 partition footer: keep Confirm visible at 844×390. The all-bottom draft clips its commit control below the viewport. Bound the card area and reserve a fixed footer without changing the desktop board model. Evidence: `clarity-partition-all-bottom-844.jpg`.

- P2 recovery explanation: local Undo/Undo turn now use native availability. Add concise disabled reasons and associate undone log entries with their undo event; do not hide history or replay prior audiovisual effects. Verify stale draft and queued-motion invalidation. Evidence: `undo-portal-restored-1366.jpg`.

- P1 public-zone ability discovery: expose Rizlac's legal return ability in its inspection, with source name, two-black cost and destination. The normal More fallback works, but its clipped If you do label hides this context. Preserve the distinction between native play and activated return. Evidence: `oblivion-rizlac-inspect-1366.jpg`.

- **Hand ability discovery — access repaired:** T-Bone now exposes its native Counter–Play ability in inspection. Board-only Use and Decline are verified at 1366, including the mandatory continuation. Remaining work: concise action naming, pending-source relation, both viewpoints, other sizes and audiovisual acceptance. See `tbone-decline-prompt-1366.jpg` and validation.

- P1 cost-route commit: changing Alternative to Normal with Auto-pay immediately spends two resources and plays Shadowlight; selecting its alternative payment also auto-commits. Keep route/payment selection as a draft and require an explicit consequence-labelled Confirm. Expose Cancel beside board payment selection; Escape currently leaves that selection active and cancellation is hidden in More. Evidence: `cost-alternative-target-1366.jpg`, `cost-normal-result-1366.jpg`, `cost-alternative-cancel-1366.jpg`.

- P1 health-payment clarity: show remaining health and resource cost beside the amount. Distinguish the accepted health cost from attack damage, and label Confirm with the full consequence when Auto-pay will submit. The adapter now quotes the reduced native cost correctly; the prior five-resource overpayment rejection is fixed. Evidence: `health-four-draft-1366.jpg`, `health-four-paid-opponent-1366.jpg`.

- P2 ordering identity: retain stable trigger numbers and link each tile to its board source on focus. Change the collapsed generic cards summary to effects or arrivals as appropriate. Keep decision owner separate from active turn. Evidence: `simultaneous-effects-draft-1366.jpg`, `simultaneous-effects-result-log-1366.jpg`.

- P2 arrival context: identify the current ordering owner during hot-seat handoff and show the existing pile as a fixed group below new arrivals. Current trays use the same Your Oblivion heading for both owners and omit the old-pile context, although native order and continuation are correct. Evidence: `arrivals-player2-handoff-1366.jpg`, `arrivals-player1-final-pile-1366.jpg`.

- **Reveal choice access — repaired; visibility still open:** The native destination tray exposes Done/Send options and consequence-labelled confirmation. Board-only Send was staged at all three viewports and completed at 844; Done preserves deck count. Remaining: deck-anchor presentation, compact scrolling, and the P0 non-actor public-reveal projection gap. Earlier missing-candidate/wrong-label captures are historical failures, not the current tray.

- P1 destination commit clarity: Rebound's target click/Enter immediately submits with Auto-pay while its panel presents a separate Confirm choice. Keep one explicit draft/commit contract and show the target owner's destination before submission. Preserve ready-card inspection without target selection. Evidence: `return-engaged-target-1366.jpg`, `return-pending-opponent-1366.jpg`.

- **Death target access and ownership — repaired; commit clarity open:** The owner-grouped pile picker and source inspection now expose native Death declarations. Board-only Portal-open same-owner pair and mixed-owner rejection pass at 1366. Improve the generic rejection reason and prevent mixed-owner drafts earlier when adapter data permits; retain target context into friendly-send. See `death-portal-mixed-owner-rejected-1366.jpg`.

- **Trugg inspection access — repaired; naming open:** The native source action now appears in inspection with untruncated text. Board-only recovery reaches native banish payment. Keep explicit payment confirmation and replace long conditional wording with a concise intent plus full inspection context. Earlier More-only discovery is historical.

- Resolved literal-label truncation: shared translation fallback now preserves full instructions containing periods. Native Trugg label verified at 1366×768; 56 focused prompt tests pass. Earlier truncation findings for Trugg and other multi-sentence actions refer to pre-fix captures. Concise named actions and inspection discovery remain open. Evidence: `trugg-complete-ability-label-1366.jpg`.

- **Death cardinality review — resolved:** Printed text requires exactly two when Portal is open. The authored label now matches it. Native tests reject one, duplicate and mixed-owner selections atomically; the browser verifies disabled one-target confirmation, mixed-owner retry and valid same-owner completion. No one-or-two option is required.

- P0 board reachability gate: expose legal gameplay actions through board/card inspection and dedicated choices. Do not validate by using Match actions & log / More. Existing escape-hatch runs are diagnostic only; prioritize Death/Trugg, Rizlac, T-Bone and reveal access, then rerun their full native board flows.

- Resolved activated-source linkage: adapter now supplies each activated action's source card, enabling the existing inspection controls. Trugg's happy path revalidated through board-only controls at 1366×768. Other sources still need board-only rechecks.
- P1 pile commit label: Trugg's board Oblivion picker uses Done to commit the banish payment. Show Banish selected card (and recovery consequence) rather than a generic close-like label. Evidence: `trugg-board-pile-payment-1366.jpg`.

- Death board-only recheck: source inspection and dedicated owner-grouped target tray now verified after source-reference repair. Duplicate-owner ambiguity belongs to the excluded escape hatch, not this tray. Retain work on explicit commit and declared-target context through the friendly-send step. Evidence: `death-board-owner-tray-1366.jpg`, `death-board-only-followup-1366.jpg`.

- Rizlac source discovery revalidated: board Oblivion → card inspection now exposes and completes the native BB return after the source-reference repair. Retain concise action naming and audiovisual work; earlier missing-control/fallback evidence is historical. Evidence: `rizlac-board-inspection-action-1366.jpg`, `rizlac-board-only-result-1366.jpg`.

- T-Bone board access revalidated after source-reference repair: hand inspection → native response → board passes → optional Use completes without More; both result seats captured. Earlier missing-action finding is pre-fix. Keep concise action naming, persistent response relation and decline/audio checks open. Evidence: `tbone-board-inspection-action-1366.jpg`, `tbone-board-owner-result-1366.jpg`.

- Reveal actor reachability repaired: off-board native card options are now offered in the dedicated destination prompt; Done has Confirm: Done instead of Send to Oblivion. Board-only Keep/cancel/retry verified at 1366×768; 20 shared prompt tests pass. Still open: public visibility scope, destination heading for Keep, deck-anchored presentation, Send browser branch and audiovisual proof.


### Board access: Portal activation (confirmed after merged Arena)

Direct control implemented and verified on destination-send: native open/closed toggles and Death two-target reject/retry complete without the match menu. Remaining: preview the native two-resource payment, explain unavailable reasons, and verify other sizes/audio. Keep this distinct from a contender ability and do not fabricate a card source. The destination picker must explain its same-owner constraint before confirmation and name that constraint on native rejection.

- **Weapon host readability:** Attach now appears in board inspection through native source references. Heavy Metal attached to Sonoro renders beside Magnate with no clear host link. Use a host-edge placement or persistent tether; preserve Weapon inspection and show the native payment before commit. `weapon-clash-attached-1366.jpg` is the failing baseline. Verify both perspectives, crowded hosts, detach, reduced motion and sound.

- **Temper recipient cue:** The board-only prompt highlights Gearwin, but dims Heavy Metal while asking “Temper this Weapon?”. Preserve trigger-source emphasis and also mark/link the affected Weapon with an accessible name. Verify Use adds the counter and Decline retains the paid attachment. Baseline: `temper-board-prompt-1366.jpg`.

- **Compact host-choice obstruction:** At 844×390 the attachment prompt bar covers lower host artwork and stats. Retain board target access and readable instructions without a full-width overlapping band. Accessory inspection currently needs the zone control because the tiny card has no direct accessibility hit target. Preserve that fallback; validate target size on touch hardware later. Baseline: `temper-host-draft-844.jpg`.

- **Opening selection artwork — repaired:** Scoped the hand focus pseudo-element away from the shared selection badge. Keyboard selection now preserves artwork at 1366, 1920 and 844; deselection also remains visible. Fixed captures: `opening-selected-art-fixed-*.jpg`. Continue compact text/touch and audiovisual acceptance separately.

- Reveal follow-up after native/public-pile repair: add automatic deck-anchored reveal presentation, correct private Foretell’s REVEALED heading, and prevent resource counters from drawing over enlarged artwork. Player 1 can inspect the authorized face through the deck pile and sees it disappear after Done at 1366; this is functional access, not final UX acceptance. Review the new fixture-only viewer control at compact sizes.

### Revealed hand inspection during an active choice — repaired locally

Purging Heat hand filtering — repaired and revalidated after the layout merge: the zone pile shows all four public faces; Magnate is inspectable but not a discard candidate. The component regression includes live selection binding. Fresh1366 board payment/reveal and resized844 pointer discard restore the hidden three-card hand. `purging-hand-pile-filter-1366.jpg` is a historical failure; current proof uses `purging-public-hand-all-four-*.jpg` and `purging-hand-hidden-after-844.jpg`. Full fresh compact payment, touch, automatic reveal emphasis and perceptual audio acceptance remain open.

The zone-pile inspection repair is now covered with the live selection binding and a clean browser replay. Four faces are inspectable, while only three native discard candidates remain selectable. Compact tray nested scrolling and hidden confirmation remain open; see the latest validation entry.

- **Compact owner set-card pile — repaired:** authorized face-down owner cards now remain inspectable in the zone pile; opponents receive no identity. Native component tests pass for both seats. The 844 browser continues to legal next-turn Ambush and full resolution with mute/reduced motion. Repeat from clean reset after the repair; current compact run included hot reload.

- Ambush same-turn boundary verified from a clean 1920 reset: own Sonoro supplies a real turn-21 response window with no Gur response; turn-22 opposing Sonoro enables it. Both native plays and Gur resolve through board passes. Keep compact clean-reset and audiovisual quality checks open. Early handoff action clicks can leave an inspection open with no submission; review input pacing and disabled-state timing.

- Ambush compact clean-reset gate passed after the owner-pile fix. The immediate action after inspection close can still be ignored; align visible enabled state with submission readiness and retain an accessible busy reason. Seven-part Ambush spec and six annotated views now define the later presentation work.

### Effective stats and modifier expiry — buff baseline

P1: show current attack/defense in board and card inspection, with printed values secondary. Bind these values to the native projection. In `combat-buffs`, both Sonoro targets are 2/2 before payment, 4/4 after Shattering Blow and 2/2 after End turn; inspection shows only printed 2/1 throughout. Add a source-linked modifier and end-of-turn expiry marker, preserve the passive defense after expiry, and expose accessible numeric labels. Use the existing native fixture and before/after screenshots as acceptance cases. This is a presentation failure; do not change native stats to match printed artwork.

- Obstruction reachability repaired locally: Choose obstructors now starts the native board picker; 1920 selection/Confirm and Victory follow-up completed. Require a clean post-fix replay.
- P0 fixture actor handoff: after buffed obstruction damage, Active player remained on Player 2/Waiting while Player 1 owned the Victory choice. Manual Player 1 perspective exposes and resolves it. Reproduce `combat-buffs-victory`; align presentation with the native decision owner and retain priority separately. Do not require perspective switching to proceed.

- Victory actor handoff repaired locally: pending native decisions preempt the outgoing-motion wait. A clean 1366 Active player replay automatically presents Player 1 and completes the target without a manual seat switch. Retain tests of other choices, reduced motion and normal no-choice handoffs. Investigate the lingering pose ticket separately; do not let it block a legal decision.

- Buff/Victory normal and muted/reduced recordings now complete from fresh native boards at matched 1366 sizes, including automatic choice handoff. Six annotated views define current failures and proposed marks. Retain perceptual cue synchronization/mix review, exact effect timing, other sizes/boundaries and renderer performance; captured frame counts are not FPS proof.

- P1 defeat anchor reservation: mutual Sonoro defeat recenters surviving Magnates under the red DEFEATED outlines. Freeze prior authorized source anchors/artwork for departing ghosts, and defer survivor recentering until those ghosts release their slots. Preserve parallel native batch resolution and immediate next-choice focus. Baseline: `damage-mutual-defeat-overlap-1366.jpg` at 0.45 s of the audio clip. Never label a surviving card as defeated.

- P1 Restore context: show the source Warcry, current top Oblivion artwork and a deck-bottom destination preview beside Use/Decline. Restore is a card return, so use zone-placement motion/sound rather than healing feedback. Keep the already accepted clash damage distinct. Current prompt only says Restore 1?. Native Use/Decline and resized 1920/844 controls work; audiovisual and empty/short-pile acceptance remain open. See [Restore specification](interactions.md#restore).
- Restore evidence follow-up: normal/muted-reduced recordings now prove Use completion and app audio/silence; review does not show a legible Sonoro return journey. Preserve its prior authorized pile artwork/anchor for the proposed return and mark deck bottom. Empty/one Decline, source inspection/Escape and non-owner waiting now have board proof. Separate return cue/mix, submitted acknowledgement and performance remain open. See `restore-states.html` and `restore-recording-audit.json`.

- P1 Wrath: unify direct-board and picker confirmation; retain paid Engage/source context, exact-copy position labels and a legible deck-bottom route. Picker close now preserves its draft. Public instant-reveal presentation data has a [scoped engine/adapter proposal](instant-reveal-proposal.md); implementation and transport review remain open; never recover hidden artwork from log text. See interactions.md#wrath and wrath-states.html. Sound/motion and performance acceptance remain open.

- P1 animation performance: profile long tasks in the fresh Wrath dev flow before 60 FPS acceptance. First cadence sample on M5 Pro/Chrome 155 has 74/126/64 ms long tasks and a 116.3 ms frame interval. Scheduling is a proxy; repeat with GPU-presented frame evidence and crowded states. See wrath-frame-cadence-audit.json.

- P1 Void chain context: identify The Absence as the optional draw source and show Breach’s queued mandatory draw after public banish. Decline must not imply cancel-all. Preserve top-deck secrecy and private draws; assess adapter source/queued-trigger presentation data before adding the UI. See interactions.md#void and void-states.html.

- Result perspective repaired: terminal winner/loss text and color now follow the displayed seat. Last-card Void board proves Player 2 win and Player 1 loss at 1366; landscape keyboard reaches the same result at 844. Keep the existing raw-reason/Waiting cleanup, result audio and full viewport acceptance work open. Evidence: void-last-card-gameover-opponent-fixed-1366.jpg and void-last-card-gameover-owner-fixed-1366.jpg.
- Void baseline media now exists for Use banish → Decline parent draw, both normal/audio and muted/reduced. Empty-deck and last-card boundaries are board-proved. Keep paid/multiple-trigger cases, individual cue synchronization, renderer performance and historical late-game provenance open. See void-recording-audit.json; availability is not polished UX acceptance.

- Opening readiness repaired: public native resolved flag reaches the board; starting-seat action and waiting-seat copy differ. Compact HANDS READY persists when detailed copy is hidden. Static opening fixtures expose the existing view selector for owner/non-owner evidence without gameplay rights.
- Opening timing repaired: Replace submits at confirmation; pending first selection has no return or redraw motion. Timers cannot dispatch native choices. Accepted outgoing snapshots now support return/shuffle/deal for the final actor and retain the first actor’s batch until that view returns. Native tests cover both seats; delayed first-seat browser proof, production versioning, and interruption acceptance are still required. Do not move newly dealt faces as outgoing cards.
- Opening mute repaired: the standalone route now has real simulator settings/audio providers. Fresh normal/audio and mute/reduced recordings prove the same native outcome and digital silence. Keep perceptual cue mixing, all-branch recordings and renderer performance open.

- **Forced-unable decision clarity (2026-10-10):** Fresh1366 War trigger/engaged Sonoro run reaches real defender control and native pass outcome30/27. Distinguish decision owner from priority holder; current CHOOSE OBSTRUCTORS names Player1 priority while Player2 must choose. Explain the engaged target's inability with source inspection and shape/link, without marking it selectable. Evidence: `forced-unable-defender-choice-1366.jpg`. Native automatic-progression coverage now43 pass; this does not approve current presentation.

- **Forced-obstruction impact continuity:** Recorded engaged/no-companion pass at1366 changes health30→27 without a clear source-linked impact/delta. Preserve accepted source/recipient versions and anchor memory across hot-seat handoff; drive the shared Resolve/impact cues from authoritative presentation events. Do not replay commands or delay unrelated choices. Normal and muted/reduced recordings exist; perceptual timing, voice limits and60FPS acceptance remain open. `obstruct-states.html` distinguishes the captured resolving boundary from the target effect.

- **Public pacing repaired locally:** Adapter/public board now carries decision seat separately from active turn and response priority. Native/HUD/live-parser checks and fresh1366 pointer/844 keyboard War→Obstruct evidence pass. Prior clips retain old owner text. Remaining: full both-view chains, stable spatial links and all-dimension media.
- **Compact attack pointer repaired:** Table-only prompts now sit below card candidates. Fresh844 pointer input on the merged layout completes attack cancel/retry, trigger target and explicit LINN obstruction. `forced-merged-companion-selected-844.jpg` and result/Oblivion captures prove this branch. Hand/resource prompts and physical touch still need separate acceptance.
- **Compact pile/phase collision — repaired locally:** At844, clicking Your Oblivion opens End-phase help because their hit targets overlap. Keyboard Enter on the pile opens the correct LINN inspection. Later repair adds32px between compact phase/actions and passes clicks through empty console space. Native pointer inspection now opens both War/LINN piles at844; hidden deck policy and phase help still work. LINN inspection also passes1366/1920. Physical touch and other crowded zone arrangements remain open.
