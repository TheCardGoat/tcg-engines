# Cyberpunk V2 POC

Open an existing Cyberpunk simulator or match route with `?ui=v2` (or `&ui=v2`).
V1 remains the default. Its board and styles are unchanged. **Return to V1** removes
only the UI query parameter and keeps the engine provider mounted. V2 loads lazily
and has its own error boundary.

## Rendering and ownership

- React Three Fiber owns the perspective camera, textured table, physical hand
  and field card sleeves, Unit Gear stacks, deck/Trash stacks, and lit reserve dice.
- Both Legend areas use an upright DOM card layer outside the camera projection.
  Their existing card controls keep inspection and selection available.
- Shared lighting, contact shadows, a 7-degree camera tilt and one projection matrix position the scene and DOM
  input plane together. Cards retain the source image aspect ratio.
- Existing accessible React controls own clicks, keyboard input, drag/drop,
  prompts, payment, card inspection, and semantic animation registration.
- HUD and menu surfaces use industrial artwork and metal frames. Active Gig dice
  use the matching authored die assets. Utility tools remain in the match panel.
- All screen sizes use one landscape 1600 × 900 coordinate space, scaled to fit. There is no portrait rearrangement. Overflow
  hands and Legend areas have explicit page controls; field rows never page — they overlap-tighten (leftmost on top, hover
  lifts a Unit) so every Unit stays visible.
- The engine and adapter supply identities, costs, power, legal actions, targets,
  resources, priority, and hidden information. No rules are implemented here.
- Rendering is on demand, with DPR capped at 1.5. Reduced-motion settings remain
  available through the existing simulator controls.

## V1 to V2 map

| V1 surface                                          | V2 surface / input owner                                                           | Evidence                                                          |
| --------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Hand and field cards                                | Scene cards + existing `Card` controls                                             | Landscape browser render                                          |
| Legend cards                                        | Upright DOM cards + existing `Card` controls                                       | Landscape browser render; Jackie menu check                       |
| Hidden identities, facedown Legends                 | Flat hand/Legend backs, projected field backs, and hidden Card metadata            | Browser render                                                    |
| Spent Units and attached Gear                       | Rotated mesh + physical Gear behind Unit; original Gear inspection/selection       | Populated combat fixture                                          |
| Play, costs, targets                                | Existing card menu + payment/choice providers                                      | Real Mox play/target browser check and integration test           |
| Unit and rival attacks                              | Existing card actions, rival identity drop target, combat arrows                   | Jackie rival attack: 8 → 14 power, rival priority                 |
| Gigs / Fixer choices                                | Existing `CenterRow` / `FixerZone` actions, authored active and reserve dice | Populated landscape render                                        |
| Eddies and Sell                                     | Resource HUD drop target + existing resource cards in overlay                      | Resource overlay opens and shows 13/13                            |
| Deck and reveals                                    | Flat stack + existing `DeckZone` reveal controls                               | Populated render; reveal flow not separately exercised            |
| Trash                                               | Flat top card + card viewer                                                    | Browser opened Hanako in Trash                                    |
| Pass / priority / clock                             | Existing `PassTurnControl` and `ClockDisplay`                                      | Attack priority and waiting state verified                        |
| Choice, payment, setup prompts                      | Existing interaction panel and modals                                              | Target prompt verified; full setup/manual-payment suite not rerun |
| Logs, chat, settings, undo, correction, match tools | Existing match panel, collapsed initially; explicit phone button                   | Same shared shell; phone button verified                          |
| Disconnect, completion                              | Existing disconnect overlay and shared end-game modal                              | Wired; not exercised in a hosted match                            |
| Return to V1                                        | Route option only, no engine remount                                               | Integration test retains played Mox and `ai=off`                  |

## Validation

Focused tests:

```sh
vp test run --configLoader runner src/games/cyberpunk/components/BoardV2 src/games/cyberpunk/pages/BoardShared.error-boundary.test.tsx
```

Four tests pass: real play/target and V1 state preservation, bounded texture cache
revalidation, permanent texture failure reporting, and existing board failure
containment. jsdom replaces only the WebGL scene; browser checks cover rendering.

The in-app browser was checked at 1440 × 900 and 390 × 844. All 18 main card
textures in `retailCombatGigBench` loaded with normal browser caching. The loader
revalidates an old non-CORS cached image once, keeps CORS enforced, and propagates
failure. A visible message reports unavailable artwork; DOM card controls remain
usable. Context loss provides the V1 return path.

Whole-app TypeScript checking is currently blocked by errors outside these changed
files (other game workspaces and linked/generated types). It is not a passing
whole-workspace gate. No Docker-backed hosted multiplayer session was run; the
Docker daemon was unavailable. This remains an opt-in POC, not a production rollout.

## Asset provenance

Industrial surface, rails, housings, and die SVGs were reused from the user-owned
prototype at `/Users/wazar/projects/good-looking-board`, commit `cdafb29`,
`public/themes/cp-industrial-v1`. See that prototype's `sources.json` and `README.md`
for its generation and source record. Public card art and fonts still use the
existing catalog/CDN URLs. The supplied target image is a design reference; it is
not used as a flattened board background.

## Landscape presentation pass

The landscape-only requirement supersedes the earlier portrait validation above.
Field spacing includes rotated silhouettes and the vertical space needed for Gear.
The hand stays above the lower rail. Dice and pile positions are shared between
Three.js and the DOM input plane. Reserve labels can shrink within their slots
without overflowing when all six dice are present.

Cards and stacks now use the scene lighting; reserve dice have visible face edges.
The board surface has a matte glaze, idle outlines are restrained, and the Pass
control and resource HUD use authored vector metal plates. Current power remains
engine-owned, with a quieter badge. Card artwork and its printed names are retained;
there are no additional card-name labels.

This pass changes presentation only. Validate it in the in-app browser; do not run
non-visual gates for these changes. The original full card preview and controls
remain in use, and V1 is unchanged.

Visual proof for this pass: populated board at 1440 × 900, opening board at
1280 × 720 with all six reserve dice, and the same landscape layout scaled into
844 × 390. Inspected spent-card separation, Gear clearance, hand lift, full-card
preview, HUD labels, and artwork loading. Fresh opening fixture console reported
no errors. Non-visual gates were intentionally not run for this visual-only pass.

## Board split and action housing

The combat-step strip is embedded in the turn-and-clock console. It reuses
the existing Attack/React/Fight-or-Steal state mapping; there is no separate
scene rail above the action button.
The accessible progress button uses the complete textured WebP skins
`action-normal-v2.webp`, `action-hover-v2.webp`, `action-disabled-v2.webp`, and
`action-confirm-v2.webp`; it no longer composes the old SVG face and housing.
`PassTurnControl` supplies the live action label, pending-choice label and input.
The combat-step strip appears inside the console only during combat. `clock-console-v2.webp` surrounds the live clock readouts; the deck
and trash use aspect-preserving `pile-recess-v2.webp` meshes at the outer edges.
The perimeter rails and corners remain removed so the table stays continuous.

The approved control artwork is in assets PR #143 at
`public/cyberpunk/simulator/board-v2/`. The separate
`public/cyberpunk/simulator/ui/board-v2/v1/action-face.svg` and
`action-housing.svg` from assets PR #142 are the older prototype, not these
textured controls. Keep the current local WebP references until their new CDN
URLs have been verified; do not substitute the older SVG paths.
See `assets/control-assets.md` for the asset list and prompts.

The field seam sits at 44% of the table height. The rival field is above it;
the player field, Legends, and hand use the larger lower area. Drop zones move
with the cards. Identity is printed directly on the table. The clock remains
on the left, separate from the lower-right Fixer dice and identity.
V1 and game rules remain unchanged.

## Hand presentation

Field rows use a straight baseline and stable slots. Spent field cards tilt 7°,
receive a 16% dark face overlay, and show a SPENT badge. Their DOM controls share
the same tilt; only hands use the fan layout. Legend-area rotation is unchanged.

Card faces and pile tops use hardware-supported anisotropic filtering with
trilinear mipmaps. The scene renders at up to 2× pixel density; the former 1.5×
cap undersampled Retina displays and softened card artwork during compositing.
Source artwork and its aspect ratio remain unchanged.

The battlefield stays horizontally centered and biased upward. The local fan meets
the lower edge, with a 24-unit hover lift. Hand sleeves remain parallel with
four units between cards; the hovered sleeve rises above the whole fan. Passive
DOM outlines are suppressed for ready hand meshes so they cannot show through
the overlapping 3D faces. The weathered surface is retained.

The hand now passes each card's absolute zone index to the shared card control.
This enables its normal drag source and preserves point-and-click actions on
later pages. The live interaction view lights playable sleeves, and the shared
card overlay shows reduced costs. Choice prompts can select hand cards, including
mandatory discards. Cards stay inside the lower board edge. A page holds twelve
cards on desktop or eight below 900 px; the next page keeps the original card
indices. The `unitOctantRetail`, `chooseDiscardFromHand`, and `handFanOverflow`
fixtures cover these states.

## Viewport structure

`viewport.ts` fits the 1600 × 900 gameplay coordinate system to the available
width and height and caps desktop magnification at 1.25. The Canvas fills the
game viewport. The camera and field input plane share the same projection;
resizing cannot independently stretch the input plane. Scenery extends beyond
the gameplay bounds with mirrored texture repeats and a peripheral shade.

Short landscape viewports reduce toolbar height, respect safe-area insets, and
enlarge instrument lettering relative to the cards. Coarse-pointer portrait
viewports show a rotation notice and hide the board from view and focus. Tall
desktop windows extend the scenery. Independent flat edge anchors keep the hand
at bottom center and resource, Legend, Fixer and pile groups near their corners.
The field moves upward independently; its drop targets share the same offset.
The action button anchors to the bottom-right with player information directly above.
The right edge stacks deck/Trash, Fixer, identity, and action with clear gaps.
Both seat edges use a 24-unit inset; hands and fields remain centered.
The turn-and-combat console stays at the left midpoint.

Browser validation: populated board at 2560 × 1080, 900 × 1200 and 844 × 390;
resource drawer opened at compact size; touch emulation at 390 × 844 showed the
rotation notice and restored the board after landscape rotation. This is a
responsive foundation, not real-device mobile acceptance: dense dice touch
targets and a full crowded-game interaction pass still need dedicated review.

Direct attack arrows in V2 target the visible defending Gig row, including its empty state, and re-measure after camera projection changes. Hidden V1 player-info anchors are not used by V2.

## Layer contract

The Three.js perspective camera renders only the table and field cards with their
attached Gear. The projected DOM layer contains those cards and field drop targets.
Hands, Legends (with their gear controls), resources, Gigs, Fixer, piles, identity,
clock and pass controls live in a separate flat overlay. Its uniform scale and
edge anchors come from the viewport size, never from the perspective camera.
Outer edges use a 24-unit inset. Legend and Fixer racks use 8-unit gaps, and
related control groups use 12-unit gaps at the authored
1600 × 900 size. Prompts and the unified header remain in screen space.
Hand drags use the shared viewport drag visual; field drags remain in the scene.

Both seats use fixed 80-unit Legend cards, including when one rack contains spent
Legends. Deck/Trash groups are 160 × 112 units on both sides. Fixer dice retain
40-unit slots instead of stretching to fill the rail. The player label shares
the deck row; the Fixer sits 28 units below it, allowing room for its label.
