# V2 control artwork

Generated with the built-in image generation tool on 2026-09-29. Transparent PNGs are original tool outputs, copied without raster edits. Text is rendered by the existing live controls; no game values are baked into images. V1 does not consume these assets.

## Files and prompt specification

| File | Prompt specification |
| --- | --- |
| `action-normal-v2.png` | One blank, straight-on cyberpunk action button. Worn charcoal steel, thin exposed bevel, four corner screws, scratched smoked-black inset, restrained cyan indicator at the left. Transparent background, no text or symbols. Match the approved reference control study. |
| `action-hover-v2.png` | Edit the normal button. Preserve its canvas, alpha, silhouette, bolts and scratches. Increase the cyan indicator and its local halo slightly; add restrained cyan highlights on the inner bevel. No new elements. |
| `action-disabled-v2.png` | Edit the normal button with identical registration and materials. Turn the indicator off to neutral grey, remove cyan spill, and mildly mute the metal. Keep the frame visible, no labels. |
| `action-confirm-v2.png` | Edit the normal button with identical registration. Change only its cyan indicator and light spill to muted coral red. No text or symbols. |
| `clock-console-v2.png` | One compact horizontal clock console, 2.5:1, orthographic. Worn dark charcoal steel, fine exposed metal chamfer, screws, recessed smoked-black glass. Wide blank top display and two equal blank bottom displays. No text, numbers, symbols, LEDs or glow. Transparent background, low-profile frame, soft contact shadow. |
| `pile-recess-v2.png` | One empty portrait card well, 0.716 width/height, orthographic. Weathered charcoal gunmetal, thin steel chamfered rim, tiny corner screws, deep scratched black recess. No text, cards, symbols or glow. Transparent background, soft contact shadow. |
| `phase-track-v2.svg` | Native vector rail: charcoal glass, worn steel bevel, screws, subtle grain and three live text segments. No baked labels. |

Source generations: `exec-c391af3f-52df-4896-ab96-e55f4b9ebee9` (normal), `exec-e949cafe-228a-427e-a1eb-f20e17dc1173` (hover), `exec-d75db7f5-6351-42c6-a6a8-c3847fa5fde6` (disabled), `exec-068d4a3a-a139-4b19-86ce-0371e6248e9c` (confirm), `exec-7b4815f2-5265-49b8-8830-9e7f0a43540d` (clock), `exec-9c75ef35-0351-4e66-aa3f-d4c7836f458d` (pile).

## Runtime integration

- The action control uses actual `:hover`, `:disabled`, and `data-confirming-skip-block` states. All four images preload using the same imported URLs as the styles. Confirmation takes precedence over hover. Keyboard focus has a separate cyan outline.
- The action bitmap uses a centered, aspect-preserving crop of its transparent margin. Clock artwork uses `contain`. Pile planes fit their texture aspect ratio.
- Clock values, active clock, priority, turn, overtime and urgency come from the existing ClockDisplay. The active clock is cyan; warning and critical clocks retain amber and coral signals.
- The phase rail and pile wells remain React Three Fiber meshes on the board plane. The accessible action control and clock follow the board's projected DOM plane.
- V2 uses the full existing progress labels, including pending choice labels; button actions and game rules are unchanged.

## Validation

In-app browser at 1280×720 and 844×390: normal, real mouse hover, disabled discard choice, skip-block confirmation and Escape cancellation. The smaller viewport was checked on the discard-choice fixture. Focused integration: `V2 hand cards resolve a discard target choice` checks the disabled prompt label and actual discard selection. Visual changes do not require broad build/lint/type gates under the owning repository instructions.

## WebP delivery revision

Runtime artwork uses six WebP files converted from the generated PNG masters. Runtime files use WebP, encoded with `cwebp -q 88 -alpha_q 100 -m 6`; dimensions and alpha are preserved, without resizing or cropping. V2 imports and preloads use the corresponding `.webp` filenames. The SVG combat rail is unchanged.

## Selectable board surfaces (2026-09-29)

Three alternate surfaces for the V2 board, published to the board-v2 CDN
revision (`public/cyberpunk/simulator/ui/board-v2/v1/` in the assets
repository, PR TheCardGoat/assets#146) and offered by the toolbar **Surface**
picker (`BoardSurfacePicker.tsx`). Each is 2528×1264 — the same 2:1 aspect as
the bundled 1774×887 default with ~4× the pixel count — encoded with
`cwebp -q 88 -m 6`. All are edge-to-edge material studies (no baked border or
vignette), so the scene's mirrored 5×5 tiling consumes them unchanged.

| Preset id | CDN file | Artwork |
| --- | --- | --- |
| `plates` | `surface-plates.webp` | Weathered charcoal gunmetal deck plates: recessed seams, corner screws, scratches, faint rust and teal patina. |
| `tech-mat` | `surface-techmat.webp` | Hex-embossed dark polymer mat with faint cyan circuit traces. |
| `street` | `surface-street.webp` | Rain-slick night-city asphalt with subtle magenta/cyan puddle reflections. |

`boardSurface.ts` owns the preset table, the `tcg:cyberpunk:board-surface:v1`
localStorage key and the preload gate: the picker warms the CDN texture with an
anonymous-CORS image request before committing the selection, so a failed load
never blanks the 3D surface, and unknown stored ids fall back to the bundled
default. The trash/eddies modal follows the selection through the
`--v2-surface-image` custom property set on the board root. Generation notes:
raw generations were 2528×1696 and were center-cropped to 2:1; first-round
candidates `surface-techmat-hi` (`bg-4167aaf0b1`, baked beveled frame) and
`surface-street-hi` (`bg-2befe218d2`, composed street scene with sidewalks,
crosswalk and debris) were rejected — neither survives mirrored tiling.
