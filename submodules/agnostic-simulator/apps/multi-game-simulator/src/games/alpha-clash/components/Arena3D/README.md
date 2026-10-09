# Alpha Clash 3D arena POC

All Alpha Clash practice, live-match, and TestEngine board routes use this React Three Fiber renderer. No renderer query parameter is required. This is a local presentation POC, not a hosted-match or production-performance acceptance result.

## Real opening fixture

`/alpha-clash/simulator/tests/opening-preview` uses this board and the existing local practice controller. It creates a seeded native initial state through `AcTestEngine.fromState`, with validated 50-card specification decks and official Contenders. Both seats start with eight cards and no cards in the play zones. Player 1 is the fixed starting player. Setup seat controls allow each player's hand and one engine-supported full-hand mulligan to be checked before starting. The same match continues through resource deployment into primary phase. Reset recreates the seeded deal.

The opening sequence runs inside the same arena Canvas: Begin opening → contender reveal and docking → shuffle and staggered deal → hand review → optional full-hand return/shuffle/redraw → Keep & begin → settled hand and playable first turn. It reuses the preview's game-owned beats and shared flight sampler, timing, and sound service. The native engine supplies every card; mulligan dispatch occurs after the return animation, and startGame dispatch occurs before settling into the live board. Failed commands restore hand review. Background tabs pause the clock. Reduced motion follows the OS preference or the Match drawer setting.

The engine does not yet implement selective mulligans or a first-player-choice procedure; this fixture does not simulate those steps in UI state. Cards without catalog artwork have named placeholders, not concealed-card backs. The standalone opening scene remains a presentation reference; the routed preview is engine-backed.

## Reused constructs

- `@tcg/simulator-presentation/three`: `SceneCard`, `CardSelectionRim`, `useCardPose`, and `useSceneTextures`. The texture loader/cache was extracted from Grand Archive, which now consumes the same implementation. It deduplicates viewer-authorized URLs, aborts removed requests, disposes textures, reports failures, and supports retries.
- Cyberpunk V2's camera/DOM boundary: a perspective camera projects the same physical card positions into keyboard-accessible hit regions. The Alpha Clash layout remains game-owned.
- `InteractionWorkspace`, `useInteractionBoard`, and `useInteractionDraft` retain legal targeting, action submission, and prompts. No rules are implemented in the scene.

The board uses textured Three.js geometry, card depth, directional lighting, contact shadows, and demand rendering. Reduced motion snaps poses. DOM owns semantic input targets, image-backed action buttons, text status, detailed inspection, and shared prompts. Card faces preserve their printed aspect ratio. A failed or lost WebGL context offers a 3D retry without resetting engine state. Portrait orientation unmounts the canvas and requests landscape.

## Layout

Clash rows use the space between the side zones and shrink only when the row needs it. The hand fan also narrows on smaller desktop viewports to keep the control panels clear. Support cards share compact trays; short landscape viewports show support counts and retain inspection through Cards & piles. Occupied zones have no permanent name. Empty zones show a faint name; hover or keyboard focus reveals the zone name and public count. Resource and pile counts use compact icon controls, and clicking a zone opens its filtered card browser. Escape dismisses a tooltip. DOM zone targets use the same camera projection and sit below card targets. The turn panel also follows the camera projection. The table texture keeps its original 3:2 aspect ratio.

The camera near plane is 100 world units. All content is much farther away; this preserves depth precision between the shared card face and backing planes and prevents flicker on small cards.

## Assets

Generated with the built-in image generation tool, then resized and encoded with `cwebp -q 85`. Button and medallion alpha is retained. These are original POC decorations; real card faces still come from the card catalog.

Canonical content: sibling assets repository, `public/alpha-clash/simulator/arena-poc-v1/`. This folder contains identical bundled copies so local development and builds do not depend on unpublished CDN URLs. No assets were uploaded or deployed.

| File                    | Purpose                       | Width | Bytes  |
| ----------------------- | ----------------------------- | ----- | ------ |
| `assets/table.webp`     | 3D table diffuse map          | 1536  | 310776 |
| `assets/action.webp`    | Blank action-button face      | 768   | 20148  |
| `assets/card-back.webp` | Anonymous backs and resources | 256   | 29884  |
| `assets/health.webp`    | Transparent health medallion  | 256   | 16110  |

Generated text is deliberately absent from props: labels and health values stay dynamic. Final prompts and source image IDs are in `assets/prompts.json`.

## POC limits

- Hand overflow uses seven-card pages; large clash rows fit the available lane.
- Compact layouts expose support zones through Cards & piles.
- This POC has hover/selection pose motion, but does not add drag-to-play, audio, or a full combat-effects sequence.
- Remote card art needs CORS access. Failure keeps a labelled fallback; Retry artwork retries failed textures.
- Prompts retain the existing drawer workflow. Asset-backed action shortcuts submit only advertised actions through the shared draft.
