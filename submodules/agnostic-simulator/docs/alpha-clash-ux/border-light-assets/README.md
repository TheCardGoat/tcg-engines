# Border light study

Proposal: use the existing inset light channels to show turn ownership. Keep the
centre arrow and zone outlines for priority. Never outline a card to show turn ownership.

## Assets

- `player-lit.svg`, `player-dim.svg`: near-side channel overlays.
- `opponent-lit.svg`, `opponent-dim.svg`: far-side channel overlays.
- `index.html`: interactive alignment and intensity study using the existing table image.

All four SVGs use the table texture's 1536 × 1024 coordinates. They have a
transparent background and no blur. The dim variant attenuates the baked light
under the traced channels. The lit variant adds a narrow core. These are draft
channel masks, not a replacement table texture. Corner lamps and residual baked
light spill still need an asset pass before production use.

## Implementation plan

1. Finish a neutral table base: remove residual baked illumination only inside
   the lamp housings, keeping the metal and playfield texture intact. Refine the
   masks against this base, including the corner lamps. Lit and dim states must
   use exactly the same geometry and image dimensions.
2. Put the two channel overlays immediately above the table surface. Reuse its
   transform, aspect ratio, and horizontal scale. Use unlit transparent materials,
   normal blending, no bloom, no shadow casting, and no shadow receiving.
3. Crossfade each side between dim and lit in about 200 ms when turn ownership
   changes. Start with a restrained core and no surrounding halo. Reduced motion
   switches states directly. Keep turn lighting steady through response windows.
4. Derive turn ownership from the native active player. Derive priority from
   the native decision owner or response window. A single centre arrow points
   toward that player and their zone outlines brighten. During resolution the
   arrow is dim; turn lighting remains. Remove the separator bars in the final
   design only after this study is accepted.
5. Preserve hand presentation as a separate foreground layer. Do not change
   hand positions, scale, tilt, hover lift, camera, key lights, or shadow settings
   for this feature. Restrict all new cue geometry to the table plane. Audit the
   existing camera-facing half-board shade separately; the previous visual
   preview bypasses it, which changes contrast even though light position is fixed.
6. Verify four turn/priority combinations on a fixed board at desktop and compact
   sizes. Compare resting, hovered, and dragged hands with cues on and off: the
   card silhouette, position, and shadow must remain identical. Also check opening,
   inspection, and reduced-motion states. Then validate actual state transitions
   through native actions; this static asset study is not gameplay proof.

## Current shadow finding

The last cue prototype uses additive textured planes, not shadow-casting lights.
It does not move the directional light. It disables `BoardPriorityShade` in preview
mode and places wide light patches near the hand. Both can change perceived
separation. Keep the new cue limited to lamp channels and compare the hand with
one fixed lighting baseline before deciding whether a separate shadow fix is needed.
