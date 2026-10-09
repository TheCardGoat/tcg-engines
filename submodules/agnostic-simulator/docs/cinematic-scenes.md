# Complete cinematic scenes

A scene composes visual tracks inside the existing `effect` step. The shared
animation driver controls its clock, speed, completion, skip, sync, resize,
reduced motion, and cleanup. Game engines still own every result.

## Track inventory

| Track | Purpose |
| --- | --- |
| `backdrop` | Board environment, grid, sky, mist, embers, and optional host artwork |
| `actor` | Original prop or character; glide, rear, orbit, bounce, rotation |
| `travel` | Counted straight, curved, orbital, or zigzag projectiles with trails and stagger |
| `particles` | Seeded gathering, burst, rise, dust, or snow |
| `area` | Board-sized wave, sweep, or pulse |
| `reaction` | Card lunge, recoil, contact hold, landing, reveal, shake, tuck, snapback |
| `material` | Actual card flash, burn, freeze, stone, dissolve, cracks, heal, shield, glitch |
| `camera` | Temporary board zoom, shake, or sampled pixel filter |
| `die` | Throw, tumble, bounce, shadow, and engine-resolved final face |

The 22 complete scene fixtures cover breath with an articulated original prop,
sonic rings, ordered board wipe, five-projectile volley, orbit and recovery,
four weighted landings, reveal, die throw, materials, strike, cameras, and
snapback. The original 37 fixtures remain available. These are reusable scene
capabilities, not a claim that all 175 competitor registrations were reproduced.
Those registrations include bespoke art and choreography; inaccessible lazy
modules remain unverified.

## Author a plan

```ts
const effect: EffectStepV2 = {
  id: "resolved-impact",
  type: "effect",
  durationMs: 1200,
  showText: false,
  targets: [targetRef],
  scene: {
    board: { kind: "anchor", id: "playfield" },
    tracks: [
      {
        id: "shot", kind: "travel", begin: 0, end: 0.6,
        from: { ref: sourceRef }, to: { ref: targetRef },
        path: "arc", color: "#e0b967", count: 5,
        stagger: 0.2, trail: true, shape: "arrow",
      },
      {
        id: "contact", kind: "material", begin: 0.6, end: 0.85,
        at: targetRef, treatment: "flash", color: "#e0b967",
      },
    ],
  },
};
```

Register `playfield` on the real board surface with `useAnimationNode`. A one-pixel
center anchor is not sufficient. Points are normalized board coordinates or refs
to registered objects. Off-board points can range from -1 to 2 for entrances and
exits. `begin` and `end` are fractions of the explicit effect duration. Track IDs
must be unique, and `end` must be greater than `begin`. Optional easing uses CSS
`linear`, `ease-in`, `ease-out`, or `ease-in-out`.

A scene has at most 64 tracks and 512 visual objects. Travel permits up to 48
projectiles per track; particles permit up to 96. Seeded geometry is repeatable.
A step cannot opt into both `scene` and the legacy `cinematic` style.

Use actual `entityTransfer` and `valueDelta` steps for state changes. A burn does
not remove a card, five arrows do not infer damage, and a die track does not roll
a random result. A delayed exit can use `sourcePresentation: "hold"`; scene
reactions follow that visible transfer copy until it exits. Resolve targets,
values, and artwork permissions before projecting viewer-safe plans.

## Original artwork

Wrap the shared driver in `SceneArtworkContext.Provider`. Its value maps asset
keys to React components with `SceneArtworkProps`: `color` and a finite
`timing` containing `delayMs` and `durationMs`. Actor and backdrop tracks resolve
these keys in the host. The protocol cannot inject URLs or markup. Art can use
original SVG, sprites, or existing host assets. Keep articulation finite and
bound to the supplied timing. The default vector props are original fixtures.

## Lifecycle and geometry

Source and target geometry is captured before the destination state commits.
Scene surfaces and transfer clones follow actual ancestor/viewport scroll deltas.
Camera transforms do not count as scroll. Temporary card animations use browser
keyframes and cancel on cleanup. A transfer portal that mounts later rebinds the
reaction without restarting the scene clock. Missing endpoints omit the affected
visual. Reduced motion and off skip scene playback.

Scene tracks have no independent completion timer or input lock. Keep persistent
statuses, legal-target markers, hover, and clock warnings in their owning UI
components. Game adapters must opt into these scene plans; the bench does not
prove engine-specific adoption.

## Inspect and test

Open `/animation-fixtures` in the existing multi-game simulator service, or follow Animations from the simulator index. Category playback, normal/slow/fast/off, missing targets, Skip, and Reset are available.

Focused tests cover strict data, deterministic paths, exact strike beats,
late-mounted transfer copies, board geometry, scrolling, driver interruption,
and cleanup. Inspect scene frames in the browser as well; a settled counter only
proves that the queue completed.
