# Shared cinematic inventory

Open `/animation-fixtures` in the multi-game simulator. The first section is the
shared visual bench. The game sections below it remain engine-mapping fixtures.
Do not count one kind of evidence as the other.

## Inventory

The inventory is organized by behavior. A card name is never a renderer key.
There are 59 runnable recipes in 14 categories. Fourteen optional effect styles
extend the existing 11 semantic step types; they do not add game rules.

| Category      | Recipes                                                              | Shared mechanism                                                                          |
| ------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Movement      | Transfer; draw and reveal; conceal and move; copy; attach underneath | `entityTransfer`, captured endpoints, one portal clone, uniform scale, source suppression |
| Card state    | Rotate; conceal in place; dissolve particles; arrival rings          | `entityStateChange`; `effect.cinematic = dissolve / summon`                               |
| Emphasis      | Local pulse; spotlight; staged source card                           | `emphasize`; viewer-safe `effect.presentation = source-card`                              |
| Targeting     | Default connection; projectile; volley; beam; chain                  | Source and target refs, SVG paths, fixed particle counts                                  |
| Impact        | Radial burst; combat exchange; value loss                            | `burst`; existing `combat` and `valueDelta`                                               |
| Area          | Expanding wave; lateral sweep                                        | `wave / sweep` at an explicit area anchor                                                 |
| Protection    | Shield; tether; aura                                                 | `shield / tether / aura`; bounded temporary overlays                                      |
| Recovery      | Drain; recovery particles; value gain                                | `drain / heal`; `valueDelta`                                                              |
| Announcements | Turn; phase; shuffle; die; coin; selection; comparison; game result  | Existing semantic steps; resolved values come from the game                               |
| Sequences     | Arrival → effect → recovery                                          | One plan with explicit start times and a short `hold`                                     |

The shared style catalog is `packages/simulator-ui/src/animation/cinematic-inventory.ts`.
The runnable plans are `apps/multi-game-simulator/src/components/animation-fixtures/cinematic-recipes.ts`.
Adding a style requires a schema entry, catalog entry, renderer behavior, and a
fixture. Coverage tests reject an inventory that omits a style or semantic step.

## Second competitor audit

On 2026-10-03, the second pass checked all 155 named keyframe declarations from
the previously captured public CSS: 96 Choombattler and 59 Duels. It also checked
the 175 Duels cinematic registrations: 129 targeted, 36 global, and 10 board-wipe.
This pass examined the saved assets from the completed test games; it did not
play another complete match or establish new coverage of all lazy effects.

Sources: [Choombattler test board](https://choombattler.com/board?deck1=00000000-0000-4000-8000-000000000003&deck2=00000000-0000-4000-8000-000000000004&bot=expert),
[Duels test game](https://duels.ink/game/01a1003c-8053-7dda-92e2-8fac655515cf).
The original audit archive contains the public asset URLs, hashes, CSS extracts,
game logs, and screenshots. The second-pass `competitor-crosswalk.json` assigns
every keyframe a category and proposes component categories for every registry
entry. Registry classifications are keyword-assisted hypotheses, not proof of
the implementation inside each lazy module.

### Gaps caught in the second pass

- **Declared does not mean active.** Duels CSS explicitly disables foil showcase
  and some subfilter animations. An animation name alone does not prove playback.
- **Interface feedback is separate.** Forty-nine declarations fall under loading,
  menus, hover/foil, idle decoration, timer warnings, or other component feedback.
  These belong to their UI components, not to the game-event playback queue.
- **Persistent status is separate from a cinematic.** Legal-target marks, a
  blocker marker, an active shield, and clock urgency must remain until state
  changes. Our `shield` and `aura` are temporary event feedback, not status storage.
- **Rich scenes are compositions.** A named scene can contain backdrop, source
  staging, projectile, impact, target response, and exit. The scene name does not
  imply a new primitive. The new scene tracks provide host artwork slots, original articulated vector
  props, board environments, travel, reactions, materials, and camera treatments.
  Each named theme still needs its own art and choreography.
- **Movement variants matter.** Reveal/hide during travel, retained source copies,
  underlays, landing, source suppression, and delayed exit are distinct behaviors.
  The shared transfer driver already owns these contracts. The bench covers the
  main movement variants without replacing that driver.
- **Fallbacks matter.** Missing endpoints, interrupted playback, speed changes,
  reduced motion, and cleanup must be checked with the visual effects.

The 175 lazy-module downloads in the earlier audit returned HTTP 403. Their
registry descriptions remain source-only evidence. We do not claim a complete
execution audit of those modules, exact frame-rate parity, or a recreation of
their branded artwork.

### Why the competitor transitions feel continuous

Both implementations separate the authoritative destination from the moving
visual. They capture source geometry, move an overlay clone, then hand visibility
back to the settled node. Separate wrappers prevent travel, tilt, scale, and flip
from overwriting one another. Ordered beats connect anticipation, travel, impact,
and return; short stagger offsets avoid simultaneous card piles.

The earlier source audit found roughly 250–500 ms Duels card travel and a 485 ms
default strike sequence. Choombattler uses 460 ms travel, a 760 ms landing
treatment, and 380 ms deal-in plus 55 ms stagger. These are different jobs, not
one universal duration. Our generic effects use bounded 600–1000 ms recipes and
the existing speed scale. The composed fixture lasts 2500 ms at normal speed.

## Complete scene tracks

The 22 scene recipes extend the original 37 generic recipes. See
[the scene API](cinematic-scenes.md) for the nine track categories, original
artwork slots, timing, and cleanup contract. Open `/animation-fixtures` in the existing multi-game simulator service. The simulator index links this shared bench.


## Integration contract

```ts
const effect: EffectStepV2 = {
  id: "resolved-effect:1",
  type: "effect",
  cinematic: "projectile",
  source: { kind: "entity", id: sourceId },
  targets: resolvedTargetIds.map((id) => ({ kind: "entity", id })),
  durationMs: 700,
  showText: false,
};
```

Emit the step only after the owning game resolves the action and projects
viewer-safe refs. The renderer does not select legal targets, roll random
results, infer damage, remove cards, or grant protection. Three volley particles
do not mean three damage. Pair visuals with actual transfers/value steps when
the engine reports those changes.

`cinematic` is optional. Existing effect plans retain their current arrows and
custom connection renderers. An opted-in cinematic bypasses only those arrows;
source staging and labels remain shared. Update protocol consumers before an
adapter starts emitting the new optional field to older strict-schema clients.

Connected styles omit visuals when their endpoints cannot be located. Local
styles can target a card or an explicit area anchor. An effect with no target
refs can use the registered board center; an explicitly missing target does not
silently fall back to the board center. Chain order is the supplied target order.

The new SVG layer uses the existing compiled plan. It adds no timers, callbacks,
input locks, infinite loops, network assets, or independent completion gate.
The driver owns finish, skip, sync, resize, speed, reduced-motion, and unmount
cleanup. SVG geometry and bounded particle counts are deterministic. It uses
the shared color tokens with a light mix for contrast on dark boards.

The bench has category and recipe selectors, normal/slow/fast/off speed,
single-recipe and category playback, missing target nodes, skip, and reset.
Its “Settled” counter proves that the queue returned to idle; it does not claim
that screenshots were inspected or that an engine emits the recipe.

## Scope of validation

Automated checks cover every recipe's protocol schema, bounded timing, disabled
motion, all 11 step types, and all 14 styles. Mounted shared-driver tests cover
normal completion of each new style, coexistence with custom game connections,
missing targets, skip, sync, reduced motion, off, and unmount. Existing effect
geometry tests protect captured target positions and staged-card aspect ratio.

Browser evidence and remaining check limits are recorded with the task artifacts.
The generic layer is available to every host using the shared driver. This change
does not enable disabled FAB overlays or change Cyberpunk's deliberate overlay
policy. Engine-specific adoption remains visible in the existing mapping table.
