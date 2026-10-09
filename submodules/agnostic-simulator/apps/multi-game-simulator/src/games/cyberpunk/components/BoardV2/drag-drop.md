# Card drag and drop

## Cause and ownership

The old overlay hid a DOM card while V2 still drew its Three mesh. This made
one card appear twice. V2 also had a second action dispatcher that did not retain
a Program's target through payment and remote confirmation.

Use one input controller and one drag session for both board versions:

- `PointerDragDropSurface` owns mouse, touch and keyboard activation, motion,
  release and cancel. Read the source rectangle after DndContext measures it;
  the drag-start event can have a null rectangle.
- `drag-motion` owns the transient offset and the dragging, pending and returning
  phases. Pointer updates do not replace the React snapshot.
- V1 draws one DOM visual and hides its source. V2 moves the existing mesh in
  `useFrame`, using camera projection to preserve the grab offset. Its DOM input
  node stays mounted for keyboard access and drop measurement, but is invisible.
  Upright DOM Legends use the DOM visual in both versions.
- `BoardInputController` owns action routing, payment and Program target intent.
  Engine projections remain the source of legal actions and target candidates.
- A committed animation consumes the release rectangle from the animation node
  registry once. A rejected drop or cancelled payment returns the same visual.

Keep rendering separate where DOM and Three require different operations. Keep
legality, payment, selection and action dispatch shared. Do not add another
scene drag sensor, native HTML drag image or scene action dispatcher.

This follows React Three Fiber's guidance to update fast motion by refs inside
`useFrame`, reuse vectors and avoid React state updates for every pointer move:
[Performance pitfalls](https://r3f.docs.pmnd.rs/advanced/pitfalls).

## Drop targets

- Friendly field: play a hand card. A Gear dropped onto open field starts the
  existing attachment chooser. A face-up payable GO SOLO Legend uses GO SOLO.
- Friendly resource button: sell only when the engine allows `sellCard`.
  Street Cred and Gig counters are not sell targets.
- Individual friendly Unit or face-up Legend: attach Gear only to a legal host.
- Individual Unit or Legend: retain a Program target intent through payment and
  server confirmation. Apply it only if the resulting engine choice permits
  that target and selects at most one card. Otherwise keep the normal chooser.
- Pointer collision uses the pointer position and ranks individual cards before
  enclosing zones. Keyboard collision uses rectangle intersection.
- A card target only outranks its enclosing zone when the drop can actually
  resolve against it (Gear only over a legal host, hand plays only over zones
  their shape accepts); anything else falls through to the zone, so releasing
  "onto the field" never silently dies while the zone cue is showing.
- A released play whose window closed mid-drag (animation gate, combat or
  choice prompt, pending remote move) parks the card at the release point and
  dispatches when the view is ready again. It times out (~10s) or flies back
  if the play turned permanently illegal.

## Regression checks

Run `GameBoard/DragDropContext.test.tsx` against both actual board versions.
It covers play, sell rejection/acceptance, Gear hosts, GO SOLO, manual payment,
Program target validation, cancellation and delayed remote target choices.
Keep a V2-root assertion so a router mismatch cannot silently test V1 twice.

Shared UI tests cover motion snapshots, cancelled return, source measurement,
no external overlay and one-time animation handoff. The WebGL scene is mocked
in integration tests, so also use the real browser for visible drag proof.

Browser checks for this change: one moving mesh with an empty source slot;
normal Unit play; rejected sale; Floor It sale (7 to 8 resources); Mantis Blades
onto Meredith Stout (5 to 7 power, one resource paid); Floor It onto Corpo
Security through manual payment (12 to 11 power, Program in Trash).

The V2 mesh projection and velocity sway are shared through simulator-presentation's
useSceneCardDrag, also used by Alpha Clash. Hand geometry uses tabletopFanSlot.
Game-specific input intent, rules and board placement remain local.
