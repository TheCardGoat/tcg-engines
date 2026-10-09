# Card resolution research and implementation

Reviewed October 6, 2026, before replacing the Alpha Clash fixture's dashed arrow.
This is a design comparison, not a claim that every effect in these games follows
one pattern. Timings below are our choices, not measurements of those games.

| Reference | Evidence reviewed | Decision for our presentation |
| --- | --- | --- |
| [Hearthstone: The Art Behind THE SCIENCE](https://hearthstone.blizzard.com/en-gb/news/22552047/developer-insights-the-art-behind-the-science) | Blizzard's Magnetic design notes and embedded animated example. The team explicitly replaced small attach-point arrows with larger, simpler connections. The article distinguishes routine effects from major moments. | Remove the diagram arrow. Use a readable source, restrained travel effect, and distinct impact. Reserve large effects for large events. |
| [MTG Arena: implementing Battles](https://magic.wizards.com/en/news/mtg-arena/we-put-battles-on-mtg-arena-what-was-that-like) | Wizards' account of targeting, stack presentation, ownership clarity, card highlights, and VFX placement. | Preserve the identity and position of the pending card; align highlights and impacts with the actual card bounds. This is an inference from the design account, not a frame-by-frame Arena timing study. |
| [Runeterra spell types](https://support.riotgames.com/en-us/legends-of-runeterra/gameplay/types-of-spell-cards-and-how-they-work) and [UX guidance](https://playruneterra.com/en-us/news/patch-0-9-0-notes) | Riot separates response-capable Fast/Slow spells from immediate effects. Its UX notes call for shorter animations and fewer blocks on player input. | Keep response information separate from the resolution effect. A production adapter must wait for engine priority; the fixture's fixed Standby duration is only a demo. |
| [The Bazaar, Tempo's Steam page](https://store.steampowered.com/app/1617400/The_Bazaar/) | Inspected frames from the embedded combat montage (`bc52733e6a6a40ac1ded7ec3a0268073.mp4`). It shows short item-to-target trails, flashes, result numbers, status overlays, and some large effects. | Reuse the brief impact/result-number idea. Do not copy its automatic combat pacing into a game with response windows. |

## Implemented treatment

- Pending: source and selected target share the existing gold selection treatment.
  Hover or keyboard focus on the source reveals a faint connection. No arrowheads,
  dashed tracks, or continuously moving particles.
- Resolve: 140 ms anticipation, then a 300 ms tapered light trail. The source
  remains readable in Standby.
- Impact: one R3F callback synchronizes sound and the fixture's result display.
  Damage uses a small damped recoil and a brief result number. Removal uses a
  short flash and a fade during the move to Oblivion. This is not a destruction
  or exile rules implementation.
- Reduced motion: no travelling trail, expanding ring, sparks, recoil, or card
  fade. A quiet target pulse and result still communicate resolution.

`@tcg/simulator-presentation/resolution` owns the shader and impact callback;
`resolution-motion` owns the reaction envelope. `DomCardMotion` composes visual
reactions without changing its underlying transfer pose or replaying landing
cues. The game adapter supplies the legal source, target, and effect kind.

The effect uses one shader pass with eight bounded spark samples, no textures,
postprocessing, or per-frame React state. The canvas measures untransformed
element sizes so a CSS-scaled board does not scale the rendering surface twice.
Its actual material uniforms are updated through the material ref; updating a
detached initialization object did not update the rendered shader in browser QA.

## Validation

Normal damage and removal, alternate target, left/right drops, target inspection,
800×700 and 1280×720 layouts, reduced motion, and audio were exercised in-browser.
Recorded desktop runs averaged about 60 FPS; p95 frame times were 18.4–18.5 ms.
This is local evidence, not a guarantee of a 16.7 ms budget on every frame/device.
The counter includes all sampled visible-frame deltas, including long frames.

34 focused audio, motion, and opening tests passed. Type/lint/build checks are
run in the owning workspaces. The video is a 30 FPS browser capture with actual
application audio; its audio gain is raised for review. These remain presentation
fixtures, not live multiplayer engine integration.
