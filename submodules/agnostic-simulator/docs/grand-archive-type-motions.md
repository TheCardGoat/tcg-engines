# Grand Archive motion fixtures

Application routes:

- `/grand-archive/simulator/tests/card-motions`: all nine card types.
- `/grand-archive/simulator/tests/play-preview`: drag, play, target and resolve.
- `/grand-archive/simulator/tests/opening-preview`: existing opening fixture.

Use these routes in the existing multi-game simulator service. All three previews are linked from the simulator index; the animation inventory also links them. No separate fixture server is needed.

## Rules and scope

Checked against the official [card types](https://rules.gatcg.com/general-rules/general-rules-card-types)
and [resolution rules](https://rules.gatcg.com/game-mechanics/game-mechanics-playing-cards/playing-cards-resolution)
on October 6, 2026. Card details come from the checked-in Grand Archive catalog.

| Type      | Sequence                                                     |
| --------- | ------------------------------------------------------------ |
| Champion  | Material deck, Effects Stack, champion lineage               |
| Ally      | Hand, Effects Stack, awake on the field                      |
| Action    | Hand, Effects Stack, resolve, graveyard                      |
| Attack    | Rest champion, Effects Stack, Intent, graveyard after combat |
| Item      | Hand, Effects Stack, field                                   |
| Weapon    | Material deck, Effects Stack, field                          |
| Domain    | Hand, Effects Stack, field                                   |
| Phantasia | Hand, Effects Stack, link to a valid weapon                  |
| Boon      | Bestow face up in Pantheon; no Effects Stack transfer        |

These are visual fixtures. Costs, legal timing and required choices are assumed
satisfied. Printed triggers are omitted and identified in the gallery. The Boon
uses a labelled schematic face and applies only to the Pantheon format.

The interactive scene demonstrates Hasty Messenger, Training Sword and Fireball.
Fireball is a fast Action. With the displayed level-zero Spirit, it deals one
damage to the selected unit, then moves to the graveyard. Target selection is
locked during play. The stack hold illustrates a response window; it does not
run an opponent or a rules engine.

## Shared components

Alpha Clash and Grand Archive now configure the same `MotionGallery` component.
The gallery and interactive scenes use the existing shared R3F canvas and clock,
DOM card motion, card faces, shadows, selection tokens, pointer handoff, resolution
effect and audio service. Game-owned files supply cards, poses and phase order.
Card faces remain DOM images driven by R3F; the resolution effect uses WebGL.

Movement and landing sounds use actual launch and landing callbacks. Impact
sound uses the resolution callback. Invalid drops return to origin. Keyboard
play, keyboard target selection, mute and reduced motion are supported.

## Validation

- 40 focused tests passed across eight files, including Grand Archive sequence
  contracts and existing Alpha Clash, audio and opening tests.
- Shared package type check, changed-file type-aware lint and standalone build passed.
- Browser: nine-type playlist, both Fireball targets, Ally drag from the right
  side, Weapon materialization, stationary release, invalid drop and return,
  keyboard target/play, muted reduced motion, 1280x720 and 800x600 views.
- Alpha Clash gallery replay still completes through the shared component.
- Local normal-motion samples: gallery 60.0 FPS / p95 18.6 ms; play scenes
  60.0–60.2 FPS / p95 18.4 ms. These samples do not guarantee all frames stay
  below 16.7 ms or establish performance on other devices.
- Captured browser video includes the actual SFX. Videos are encoded at 30 FPS;
  the GIF is a silent 10 FPS preview. Build retains an existing large-chunk warning.

This validation is local. A merged PR and a successful staging deployment are
required before using the application routes remotely.
