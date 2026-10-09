# Choombattler motion and sound validation

Validated on 2026-10-08 in the Codex in-app browser. Only the simulator was started:

```sh
cd submodules/agnostic-simulator/apps/multi-game-simulator
pnpm exec vp dev --host 127.0.0.1 --port 5193
```

## Reference

The live [Choombattler board](https://choombattler.com/board?deck1=92d2fa95-4463-4dd2-8d10-71cd88a54e9e&deck2=ce51deaa-b683-4a82-b73e-f226d9fe6fb7&bot=expert)
was exercised through a Gig roll, a card sale, and a unit play. The observed
CSS asset was `https://choombattler.com/assets/index-CwG0RxT2.css`.

- Flight: 460 ms, lift, enlargement, curved travel, and a face flip where required.
- Landing: 760 ms CSS default, anticipation lift, impact, brief squash, and settle. Shadow and dust make contact clear; live styles can override the default duration.
- Shuffle: 430 ms. Observed audio assets include paper slides, draw/flip, chips, dice, punch, blocker, and explosion sounds. Asset loading alone does not prove playback.
- Sale and unit play started WebAudio sources with a running audio context. Observed source lengths were 336 ms and 4.89 s. Source length includes possible tails and is not the duration of visible motion.

These observations define the motion grammar. The simulator uses its existing sound packs and synth effects. This validation does not establish identical sound recordings or exact visual parity.

## Repairs

1. Removed a second frame loop in the Three card state-change layer. One loop updates each card, and unmount cancels it.
2. Made moving die text scale with its wrapper (`45cqi`) and fixed the D6 outline. The browser measured a 19.95 px number on a 44.33 px moving die. Die faces now use the card face-switch marker.
3. Added contact audio for card plays and hand-to-host Gear attachment. Travel starts at launch; contact uses the compiled landing clock. Plain transfers contact at 90%; the unit-entry profile below contacts at 79%. The audio-only hold does not extend playback.
4. Kept scheduled sound feedback when reduced motion or animation speed `off` settles the shared queue. Queued cues use an instant clock after old timers are cancelled. The deterministic test harness stays silent.

## Browser checks

Routes used `?ui=v2&audioDebug=1&animationDebug=1&ai=off`. The renderer marker reported `three`. Movement checks used the existing **Slow** speed setting; reduced-motion checks used browser media emulation.

| Fixture                       | Public action and visible result                                            | Evidence                                                                                      |
| ----------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `openingMain`                 | Play Swordwise Huscle; payment and field update; flight settles             | 23 frames with moving clones; zero clones after completion                                    |
| `legendCallEquippedSelfPay`   | Call hidden Legend; payment 1/1 to 0/1; Gear becomes visible                | 48 frames with state-change clones; zero clones after completion                              |
| `progTheHeistFreePlay`        | Play program, choose Mantis Blades, play for free, choose Secondhand Bombus | Program flight, four discard cues, and attached Gear with +2 power                            |
| `stealGigTest`                | Attack Rival, pass reaction from rival seat, select D4 showing 4            | Readable die in flight; rival Gigs 3 to 2, friendly Gigs 4 to 5; zero clones after completion |
| `openingMain`, reduced motion | Play Swordwise Huscle                                                       | No moving clones; payment, travel, and contact cues play; Pass is available                   |

The initial unit and program checks scheduled contact at 356 ms. The browser started the contact source about 357 ms and 359 ms after scheduling, respectively. Unit entry now uses the longer profile below. These are running-context source measurements, not a calibrated listening test of the final speaker mix.

Screenshots cover 1304×817, 800×600, and 390×844. No horizontal document overflow was observed. Phone controls and text are very small because the board scales down; mobile usability needs a separate layout pass.

Evidence is saved under `artifacts/choombattler-three-validation/` at the repository root:

- `reference-play.jpg`, `reference-audit.json`
- `three-unit-final.jpg`, `unit-final-audit.json`
- `three-legend-flip.jpg`, `legend-audit.json`
- `three-program-flight.jpg`, `program-audit.json`, `three-gear-flight.jpg`
- `three-gig-flight.jpg`, `gig-audit.json`
- `reduced-fixed-audit.json`, `three-800x600.jpg`, `three-mobile.jpg`

Probes sampled DOM poses and WebAudio starts. UI actions changed fixture state. Temporary probes and media/viewport overrides were removed after validation.

## Checks and limits

- 33 focused Cyberpunk motion, FX classification, audio scheduler, and sound-service tests passed.
- 9 shared animation tests passed, including reduced motion, speed `off`, queued sound preservation, test-harness silence, and transition locks.
- Simulator presentation and simulator UI type checks passed. Changed source files passed formatting and lint checks.

This is local simulator evidence. It does not cover every card effect, each sound pack, every browser/device, sustained 60 FPS, or hosted matches. Transfers use synchronized DOM faces with Three depth/shadows; the board can use loaded Three textures. No platform stack or deployment was required.

## Unit-entry follow-up

The field hid a card's DOM image whenever its artwork URL was cached, even while the corresponding Three mesh was excluded by the active plan. A second copy of Swordwise Huscle therefore disappeared after its transfer copy ended and before the rest of playback finished. Mesh readiness now also requires that the card is not excluded. The DOM image bridges that interval.

Unit entry now preserves the unrotated hand dimensions and fan angle, moves above the destination, rises slightly, drops at 79%, compresses at 86%, and settles at 100%. Its base duration is 760 ms; normal, slow, and fast compile to 532, 836, and 266 ms. Target prompts and the action button wait for settle. The profile belongs to Cyberpunk; shared endpoint capture only adds an optional planar source pose.

Drag cleanup also used the old presentation state and cleared the release position before the animation bridge queued the move. It now checks the committed state and retains the release pose for capture. Instant playback clears it immediately.

- Duplicate Swordwise Huscle: 107 sampled frames, 49 with a transfer copy, 19 with the visible DOM fallback, and zero hidden gaps. Contact played about 663 ms after scheduling, against a 660 ms compiled contact beat at Slow speed.
- Angled Mox Inciters: the takeoff copy retains the hand angle. Neither the prompt nor the action button was present in its 49 captured motion frames. The prompt appeared after the copy finished, and Select Minotaur resolved the ability.
- Dragged Mox Inciters: the first copy was at the released field position (left about 828 px), rather than the original hand position (left about 499 px). Captured 48 motion frames.
- 70 focused tests passed: unit choreography, contact timing, prompt lifecycle, source pose and drag capture, existing Board V2 interactions, and drag/drop behavior. Simulator UI typecheck passed. Full app typecheck remains blocked by errors in unrelated fixture, engine, and Alpha Clash files; no errors were reported in the changed files.

Follow-up evidence is in `artifacts/choombattler-three-validation/unit-transition/`: `duplicate-handoff-fixed.json`, `angled-entry-prompt-fixed.json`, `drag-release-fixed.json`, and `landing-fixed.jpg`. The desktop checks used a fixed 1304×817 viewport. Temporary probes and overrides were removed after validation.


## Smooth landing follow-up

The entry had three visible size/position changes after contact: a 5% compression,
a recovery to full size, and the delayed DOM-to-Three handoff. The baseline frame
probe also showed the new card's mesh becoming ready after the flight had ended.

Contact now fixes the card's position, size, and rotation. The flight face and its
shadow fade into the field mesh over the remaining entry time. Board V2 keeps
moving meshes mounted but hidden, so their textures load and upload during flight.
The shared `useAnimatedEntityIds` hook releases visual ownership at each step's
handoff, rather than waiting for the entire plan and reflow. Cyberpunk supplies
the unit contact beat; other transfers and state changes use their own end time.
Late-mounted unit flights preserve their source pose while keeping contact and
the fade aligned to the shared clock. Target prompts still wait until entry ends.

Browser proof at 1280×720: 145 sampled Mox Inciters frames; the nine fade frames
had zero change in x, y, width, or height. The field mesh was ready before the
fade. Select Minotaur resolved the PLAY effect. A second Swordwise Huscle with
cached artwork had 49 flight frames and zero hidden gaps. The same unit play was
also checked at 900×600.

Evidence: `artifacts/choombattler-three-validation/unit-landing/` contains
`before.json`, `after.json`, `duplicate-copy.json`, `unit-landing-fixed.mp4`, and
`unit-landing-final.png`. The video preserves the browser frame timestamps.
26 focused tests pass; shared UI types pass. The full app type check still reports
errors in unchanged fixture and engine files, with no diagnostics in changed
source files. This is local simulator proof.
