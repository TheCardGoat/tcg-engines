# Cyberpunk simulator motion inventory

This inventory separates authoritative game-action motion from persistent UI feedback. The Three
integration owns the former; the latter remains CSS because it describes interactive state rather
than movement of game objects.

## Authoritative action motion

| Motion                        | Engine source              | Protocol step                    | Previous renderer                     | Current motion                                                  |
| ----------------------------- | -------------------------- | -------------------------------- | ------------------------------------- | --------------------------------------------------------------- |
| Card play and zone move       | `cardMove`                 | `entityTransfer`                 | Motion DOM portal                     | Physical lift, arc, continuous size change, settle, shadow      |
| Draw and enter                | `cardEnter`                | `entityTransfer`                 | Motion DOM portal                     | Same physical grammar, one 800 ms card movement at a time       |
| Defeat, sell, discard, detach | `cardExit`                 | `entityTransfer`                 | Motion DOM portal and legacy sell CSS | Same physical grammar to the resolved destination               |
| Gear attach                   | `cardAttach`               | `entityTransfer`                 | Motion DOM portal                     | Lift and settle onto the host card                              |
| Reveal into a zone            | `cardReveal`               | `entityTransfer`                 | Motion DOM portal flip                | Three-timed travel with a synchronized two-sided card face      |
| Gig gain, return, and steal   | `gigMove`                  | `entityTransfer`                 | Motion DOM portal                     | Physical die lift and settle using the card-transition clock    |
| Call Legend flip              | `legendReveal`             | `entityStateChange(face)`        | Motion DOM portal                     | Lift, smooth 3D flip, and settle                                |
| Spend and ready               | `entityStateChange`        | `entityStateChange(orientation)` | Native CSS rotation                   | 550 ms lifted quaternion-style turn, parallel with payment/draw |
| Eddie and Gig value change    | `resourceFloat`            | `valueDelta`                     | Motion DOM text                       | Floating value label without a ring                             |
| Turn handoff                  | `phaseChange(turn)`        | `phaseChange`                    | Motion DOM banner                     | Three sweep with synchronized phase label                       |
| Ability and choice activation | `actionEmphasis`           | `emphasize(pulse)`               | None                                  | Visible pulse at the source card or zone                        |
| Effect targeting              | `effectTarget`             | `effect`                         | None                                  | Source-to-target cue without explanatory text                   |
| Attack and blocker choice     | `combat`, `combatRedirect` | `combat`                         | Pending combat line                   | Attack line and blocker redirect cue                            |
| Deck shuffle                  | `randomization`            | `randomization(shuffle)`         | None                                  | Deck motion                                                     |
| Top-deck placement            | `actionEmphasis`           | `emphasize(pulse)`               | None                                  | Deck pulse                                                      |

`cardLand` and `gameResult` are not emitted as separate plan steps. Card movement already covers
the landing beat; the match result has its own UI. The pending combat line remains visible while a
player chooses a target, then the animation plan shows the committed attack or redirect.

## Signature card-effect FX (`CyberpunkCardEffectFxLayer`)

A dedicated overlay classifies compiled plans (`effect-fx.ts`) and plays cinematic, sound-backed
moments on top of the motion above. Classification is pure and channel-driven — no zone inference:

| FX moment   | Detection channel                                                            | Visual                                                        | Sound (WebAudio synth)    |
| ----------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------- |
| Defeat      | `entityTransfer` with the `card.destroy` cue (adapter stamps `exitReason: "defeated"` exits) | Red rim flicker, glitch slices, shard scatter, "DEFEATED" tag | Crunchy pitch collapse + shatter noise + data scatter |
| Cannot attack | `emphasize` with negative tone (engine emits it for `ruleGranted: cantAttack`, label "CAN'T ATTACK") | Corner target brackets, scan sweep, stamped label | Servo clamp + rejected double beep |
| Go Solo     | `entityTransfer` from a `legendArea` zone to `field` for a legend            | Light pillar, impact ring, sparks, "GO SOLO" tag              | Power-up riser + slam + sparkle |
| Board wipe  | ≥2 simultaneous defeats overlapping a negative `effect` step's targets       | Full-frame flash + expanding shockwave from the source card, vignette, "ADAM SMASHER · TOTAL DEFEAT" caption, board shake | Charge riser then sub-drop detonation |

Wipe attribution names the source card when its canonical id starts with `adam-smasher`; other
mass defeats get the generic "FIELD SWEPT" treatment. Combat mutual kills share the defeats but
never the negative effect beat, so ordinary fights never trigger the spectacle. Per-unit defeat
sounds are suppressed for wiped units (the detonation covers them); the generic `card.destroy`
cue is filtered from the shared scheduler (`omitCyberpunkOwnedAudioCues`) so the default blip and
the FX synth never double up. All synth sounds respect the simulator sound-volume setting, are
skipped entirely in unsupported environments (SSR/jsdom), and every visual has a
`prefers-reduced-motion` fallback.

## Persistent interaction and status feedback

These animations remain attached to DOM controls and status surfaces. Replacing them with a WebGL
scene would weaken focus, layout, or accessibility behavior without making game-object motion more
physical.

- Legal drop-zone pulses on deck, field, trash, Eddies, fixer, and Gig choices.
- Priority and pass-ready cues.
- Pending combat line flow and rival-target scan.
- Connection, reconnect, clock-warning, and loading indicators.
- Prompt progress dots, modal entry, and mobile field-scroll hints.
- Hover previews and inspector/result-panel entry.

## Renderer constraints

Card art is served from `cdn.tcg.online` without an `Access-Control-Allow-Origin` response header.
Browsers may display it in `<img>` elements but must reject uploading it into WebGL textures. The
Three layers therefore render depth effects and shadows in WebGL while a synchronized
two-sided DOM face carries the artwork. Both use the same wall clock and pose calculation.

## Reference validation

The [Choombattler Three validation report](../../../../../../docs/choombattler-three-validation.md)
records the live reference observations, simulator browser checks, sound timing, repairs, and remaining limits.
