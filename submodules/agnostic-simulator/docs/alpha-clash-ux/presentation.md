# Shared interaction, motion, and sound specification

Status: target design for later production implementation. Durations below are proposed values, not measurements of reference games. Apply this contract to every entry in [interactions](interactions.md).

## Board and attention

Use the existing board, artwork, materials, Mantine controls, and presentation package. Keep the center free except for spatial decisions and resolving cards. Keep one stable action control beside the active player's edge. A change of priority moves emphasis, not the whole interface. Keep health, resources, and phase visible during choices. Dim unrelated board content to 55% luminance for a choice; do not dim its source or legal targets.

Keep card aspect ratio. Do not stack independent panels over the hand. An inspection view opens beside the inspected card where space permits; it must not cover the active target or confirmation control. At 1366×768, keep 32 CSS-pixel pointer hit areas and at least 14 CSS-pixel instruction text. Main buttons use 40-pixel height. At 844×390 keep the desktop zone order and proportions; inspection can enlarge a card independently of board scale. Record failures if scaled controls become too small. No separate phone layout is specified here.

Visual hierarchy: source outline → eligible target corner marks → selected solid frame and numbered marker → committed result. Color supplements shape. Use a dotted line for a draft relationship and a solid line after engine acceptance. Waiting seats see a quiet source marker and whose decision it is; they do not see another seat's choice contents.

## Input and commit contract

Gameplay acceptance must use board controls, card inspection and dedicated choice surfaces. Match actions & log / More is an escape hatch and must not be used to advance a reviewed game. Missing board access is a UI failure, not permission to route through that panel.

Drag starts only after a 6-pixel movement threshold. Click selects the same action without dragging. Right click or Escape cancels the current uncommitted draft. Outside click must not accidentally submit. Clicking a disabled object opens a short reason only when the adapter can supply that reason safely.

Tab moves among legal controls and board candidates in logical visual order. Enter/Space selects; arrow keys move within trays; Shift+arrow reorders an ordered item; Enter on Confirm submits. Focus returns to the source or next required control after a dialog closes. A required choice can be minimized to inspect the board, but cannot be dismissed as resolved.

Single mandatory targets may commit on a deliberate click only when there are no later inputs and the displayed action makes the commitment clear. Multiple targets, costs, ordering, allocation, and irreversible optional choices have an explicit Confirm/Use control. Selection changes are free before commit. After native acceptance, cancellation never restores paid costs. A zero-value native choice is labeled Skip/Move none, not Undo.

On rejection keep the board at the authoritative state, retain only still-valid draft selections, and put a short reason beside the failed control. On a newer state version invalidate the old request and rebuild candidates. Never replay a stale draft automatically. Do not generate legal candidates in presentation code.

## Motion tokens

| Token | Timeline | Purpose / interruption |
|---|---|---|
| Focus | 100 ms ease-out; return 80 ms | Border and 4-pixel lift. Interrupt immediately on focus exit. |
| Select | 140 ms cubic-bezier(.2,.8,.2,1) | Solid frame/number fades in. No large scale pulse. |
| Tray | 180 ms ease-out; exit 140 ms | 12-pixel rise and opacity. Modal focus begins when mounted. |
| Transfer | 320 ms cubic-bezier(.22,.75,.25,1) | Source → destination arc, maximum 8% board-height lift. Source placeholder remains until landing. |
| Resolve | 120 ms preparation + 220 ms travel + 120 ms settle | Source → target; impact at 340 ms. Damage number starts at impact, lasts 600 ms. |
| Attach | 260 ms ease-out + 100 ms settle | Weapon → host edge. Keep both inspectable. |
| Order | 160 ms ease-out | Neighbor cards shift once when an insertion slot changes. Dragged card stays under pointer. |
| Reject | 100 ms border change + 160 ms return | No screen shake. Error text stays until corrected. |
| Phase | 220 ms ease-out | Active-seat and phase mark change; no full-screen banner. |
| Finish | 400 ms ease-out | Result frame after the final native event; history remains available. |

Normal input feedback must begin within 100 ms. Movement uses stable card IDs and one sequence clock. Several simultaneous effects use a shared batch with at most 60 ms stagger and a 700 ms overall visual budget before the next decision. Do not add a blocking delay per card. Preserve causal order when one event changes the meaning of the next. On resize recompute end anchors without restarting the native action. On tab hide pause decorative clocks; on resume reconcile to current state without replaying old audio.

Reduced motion removes arcs, scale changes, shake, and stagger. Use an 80 ms opacity transition, static source/target marks, and immediate state placement. Keep result numbers and status messages. Animation state is never engine state.

## Sound vocabulary

Use the existing shared audio scheduler/service and cue IDs where they fit. The names below are semantic asset briefs, not new protocol fields. Audit actual sound-pack files before selecting final assets; a CDN URL in code is not proof of an available or licensed asset. The bundled Kenney card placement file has a retained CC0 license.

| Cue | Asset brief | Trigger and mix |
|---|---|---|
| pick | Dry paper lift, 50–90 ms | Select/drag start, −20 dB relative full scale. One per gesture. |
| place | Soft paper/wood contact, 80–140 ms | Transfer landing, −16 dB. At most two simultaneous voices. |
| confirm | Short neutral latch, 100–160 ms | Accepted commit, −16 dB; never on rejected submit. |
| target | Quiet focused tick, 40–70 ms | Selection changes, −22 dB; 80 ms cooldown. No hover loop. |
| ready | Soft rise, 120–180 ms | Priority reaches viewer, −18 dB; once per state transition. |
| impact | Low transient plus short material tail, 120–220 ms | At visual impact, −12 dB. Duck minor cues by 6 dB for 180 ms. |
| reveal | Paper turn with restrained tonal layer, 150–220 ms | Native reveal, −18 dB. Never reveal a hidden action through distinctive sound. |
| decline | Soft release, 80–120 ms | Accepted optional decline, −22 dB. |
| reject | Low neutral tap, 80 ms | Rejected deliberate submit, −24 dB; once per 300 ms. Invalid hover/drop is silent. |
| result | Restrained resolved chord, ≤700 ms | Native result only, −16 dB; once per match result. |

The master mute stops active voices and suppresses future cues. Unlock audio after a user gesture. Use event IDs to deduplicate rerenders/reconnects. Cap total simultaneous voices at six. Never encode essential meaning only in sound. Offer master and SFX controls; no background music is required for this stage.

## Architecture and acceptance

Engine owns legality and result. Adapter owns viewer-safe candidates, costs, labels, and destinations. Shared React/DOM owns accessible control state and focus. R3F owns spatial rendering and hit targets. Shared presentation owns motion and sound primitives. Alpha Clash supplies the visual sequence for its native events.

Acceptance requires stable screenshots at available, selected, pending, and result states; a normal-speed recording with sound for the whole action; reduced-motion and mute checks; both viewer projections; and a frame-time trace with browser, GPU, hardware, viewport, and build mode. Target 60 FPS, with a 16.7 ms frame budget and no repeated >50 ms stalls during the representative sequence. Report measured distributions rather than inferring FPS from screenshots. Hosted behavior is a separate scope.

## Board settings access

Sound and Reduced motion are available from the board header's Settings popover, separate from Match actions & log. These are the existing master-volume and motion preferences, not parallel settings. The controls were moved out of the escape hatch. Close settings returns to the unchanged game. Checked at 1366×768 and 844×390; the compact popover fits without clipping its controls. [Laptop](evidence/board-settings-1366.jpg), [landscape](evidence/board-settings-844.jpg). Preference access does not establish audio timing, motion quality or frame performance.

### Scoped adapter proposal: instant public reveal followed by a hidden destination

Wrath reveals a selected hand card and immediately returns it to deck bottom in one native transaction. `alpha-clash/packages/engine/src/effects.ts` records a versioned public reveal reference in the effect context; the settled hidden deck projection correctly removes its identity. `alpha-clash-server-engine.ts` currently returns `animations: []` and a null animation plan. A settled state diff cannot safely reconstruct the public face and its reveal lifetime.

Proposed owning-engine follow-up: retain structured, ordered presentation facts for accepted native effect instructions (reveal permission, exact card/object/reveal versions, authorized public identity, source/destination and end-of-reveal event). Keep these outside gameplay legality and never synthesize outcomes. The Alpha Clash adapter should filter those facts for each viewer and map them to existing game-agnostic animation primitives when the contract supports the required lifetime. First audit the current animation contract; any missing field requires a separately scoped proposal rather than a protocol change in this fixture stage.

Acceptance for that follow-up: an opponent sees exactly the publicly revealed Fangyin during the authorized reveal, then an anonymous deck-bottom destination; neither unselected hand copy nor hidden deck order is disclosed. Chained choices, spectator/replay views, reconnect, duplicate instance identity, cancellation/rejection and event deduplication need tests. Never parse log-message text for artwork, duration or candidate legality. Presentation queues must not hold authoritative commands or hide the next native decision. Current gap stays explicit in Wrath coverage.

### Opening accepted-state presentation gap

The local choreography previously submitted mulligan on a reshuffle timer, after presenting a return. Confirmation now crosses the real native boundary immediately. The first locked private selection has no state transfer and must stay stationary. Final native resolution changes both hands. The earlier baseline could present incoming cards only. The local opening fixture now captures the final acting viewer’s projected hand before submission and retains it only after native resolution succeeds. Return/shuffle render that immutable snapshot; redraw returns to the current projection. The snapshot is scoped to its viewer and discarded after redraw or cancellation. The local fixture also retains the first accepted selection by viewer until native joint resolution. It plays that viewer’s stored batch once when that view returns. A native hook regression covers both players; browser validation of this delayed first-seat path is still pending. Production versioning and interruption handling remain open.

For production motion, retain each viewer's previous authorized hand projection until an accepted version resolves both selections. Diff only authorized identities; the opponent sees backs and native-permitted counts, never private selected IDs. Build a versioned accepted return/shuffle/deal batch from that transition, cancel on reset, and drive existing game-agnostic transfer primitives. Keep old-source snapshots in presentation memory only; never mutate native cards, inject selections or dispatch from a timer. A rejection produces no return batch. No protocol change is implemented here. Assess adapter event lifetime and both-view privacy before adding this batch.

### Public decision pacing mapping

The Alpha Clash adapter already owns native next-action selection through `getActivePlayerId`/`clashStepSeat`. Its game-owned viewer projection now includes optional `decisionSeat`; no generic interaction schema changes. Private choices remain filtered by native projection. The local board/live parser carries this public seat separately from response priority and active-turn seat. HUD can announce Your decision while another seat has response priority. Outside a response window it uses the adapter's native step owner. Do not reimplement combat ownership or inspect hidden candidates in shared presentation. Historical snapshots without the field retain the existing fallback and are not full ownership evidence.


<a id="audio-review"></a>
## Audio review and acceptance record

This is a proposed production gate, not a claim that existing nonzero-output recordings pass sound design. Hearthstone's [sound-team discussion](https://hearthstone.blizzard.com/en-us/news/23964694) supports distinct action beats and selective mixing. The numeric targets below are simulator design decisions.

For each native recorded sequence, make a cue sheet with accepted state version, source/recipient, visible beat, scheduled cue, measured waveform onset, overlap count, suppression reason, and final board result. Record viewport, browser, hardware, audio settings, reduced-motion setting, build mode and capture offset. Do not use the video encoder's frame rate as a renderer measurement. A human listening pass must check intelligibility on both headphones and ordinary speakers; waveform peak/RMS alone does not prove perceptual quality.

| Review | Required observation | Failure and next action |
| --- | --- | --- |
| Commit versus draft | Pick/target is quiet; accepted confirm is distinguishable. Rejection never produces accepted impact. | Trace the cue to native acceptance, not button click. |
| Source and destination | One contact cue coincides with the visible landing; source and recipient remain clear when muted. | Align to the presentation clock; preserve the accepted source snapshot. |
| Impact synchronization | Target onset within one60Hz frame of visual contact in the synchronized recording; log capture uncertainty. | If uncertainty exceeds16.7ms, report unmeasured rather than pass. |
| Dense resolution | Important damage/result remains audible over simultaneous transfers; minor voices obey the six-voice cap. | Suppress/coalesce lower-priority cues before adding volume. |
| Repeated selection | Same source selected/cleared repeatedly does not cause an accumulating or harsh loop. | Verify gesture deduplication and80ms target cooldown. |
| Cancellation/interruption | Reset, undo, navigation or an obsolete state cancels queued forward cues. | Remove stale event IDs; never replay native commands to restore sound. |
| Privacy | Hidden card identities cannot be distinguished by cue; private inspection is not broadcast. | Filter before scheduling; use generic concealed-card sound. |
| Mute/reduced | Mute stops active sound and yields digital silence; reduced motion retains meaningful timing without flight. | Verify shared preference propagation and live voice cancellation. |

Use the existing paired opening, Wrath, Purging Heat, Void and obstruction clips as baseline candidates. Their digital-silence measurements prove mute only. They lack a completed onset/overlap/listening scorecard and must remain unaccepted for professional mix quality. The next capture should instrument the scheduler in addition to app-output audio, with instrumentation limited to observation. No microphone capture is required.
