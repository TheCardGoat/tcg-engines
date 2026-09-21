# Cyberpunk simulator motion inventory

This inventory separates authoritative game-action motion from persistent UI feedback. The Three
integration owns the former; the latter remains CSS because it describes interactive state rather
than movement of game objects.

## Authoritative action motion

| Motion                        | Engine source       | Protocol step                    | Previous renderer                     | Three integration                                               |
| ----------------------------- | ------------------- | -------------------------------- | ------------------------------------- | --------------------------------------------------------------- |
| Card play and zone move       | `cardMove`          | `entityTransfer`                 | Motion DOM portal                     | Physical lift, arc, scale punch, settle, shadow, landing halo   |
| Draw and enter                | `cardEnter`         | `entityTransfer`                 | Motion DOM portal                     | Same physical grammar with stagger preserved                    |
| Defeat, sell, discard, detach | `cardExit`          | `entityTransfer`                 | Motion DOM portal and legacy sell CSS | Same physical grammar to the resolved destination               |
| Gear attach                   | `cardAttach`        | `entityTransfer`                 | Motion DOM portal                     | Lift and settle onto the host card                              |
| Reveal into a zone            | `cardReveal`        | `entityTransfer`                 | Motion DOM portal flip                | Three-timed travel with a synchronized two-sided card face      |
| Gig gain, return, and steal   | `gigMove`           | `entityTransfer`                 | Motion DOM portal                     | Physical die lift and settle using the card-transition clock    |
| Call Legend flip              | `legendReveal`      | `entityStateChange(face)`        | Motion DOM portal                     | Lift, smooth 3D flip, and settle                                |
| Spend and ready               | `entityStateChange` | `entityStateChange(orientation)` | Native CSS rotation                   | 550 ms lifted quaternion-style turn, parallel with payment/draw |
| Eddie and Gig value change    | `resourceFloat`     | `valueDelta`                     | Motion DOM text                       | Three ring pulse with synchronized floating value label         |
| Turn handoff                  | `phaseChange(turn)` | `phaseChange`                    | Motion DOM banner                     | Three sweep with synchronized phase label                       |

The engine also defines `cardLand`, `effectTarget`, `combat`, `combatRedirect`, `randomization`, and
`gameResult`, but the current builder/adapter deliberately does not emit those film steps. They are
not active simulator motions today. Combat targeting visible during a pending attack is interaction
feedback rather than playback from an animation plan.

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
Three layers therefore render depth effects, shadows, and landing halos in WebGL while a synchronized
two-sided DOM face carries the artwork. Both use the same wall clock and pose calculation.
