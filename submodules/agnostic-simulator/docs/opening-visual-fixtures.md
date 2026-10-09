# Opening visual fixtures

Routes:
- `/alpha-clash/simulator/tests/opening-preview`
- `/grand-archive/simulator/tests/opening-preview`

Open the simulator fixture index (`/simulator-ui-fixtures`) in the existing multi-game simulator service. It groups opening scenes, card motions, animations, shared UI, and components. The animation inventory (`/animation-fixtures`) also links both opening previews. No separate fixture server is needed.

These are **presentation fixtures**, with fixed cards and a fixed toss result.
They stop at turn one. The opponent keeps its hand. They do not dispatch live
engine actions or model card-specific pre-game exceptions.

Alpha Clash CR v8.0 103.1-8 determines turn order before revealing Contenders,
then applies setup effects, shuffles, draws normally eight, and declares
mulligans in turn order. Each player can replace any selected number once.
The fixture reveals Contenders before the toss/turn-order choice; this sequence
needs separate alignment with 103.1-2. Its selective replacement is a visual
fixture, while the engine command still redraws the whole hand (inspection on
October 8, 2026). Live integration remains separate work.
Source: [official v8.0 rulebook](https://alphaclashtcg.com/s/Alpha_Clash_TCG_Comprehensive-Rulebook-80.pdf).
See the [local source review](../../alpha-clash/.agents/skills/alpha-clash-rules/references/source-review-v8.0.md)
for rule conflicts and follow-ups.

Grand Archive follows [Starting the Game, Standard Games 4–7 and Turn One 1–2](https://rules.gatcg.com/general-rules/general-rules-starting-the-game).
Both Spirits reveal together. Spirit of Fire and Spirit of Wind each draw seven
through On Enter, resolved in turn order. There is no standard mulligan.

The shared `@tcg/simulator-presentation` canvas and card-flight math were extracted from
Cyberpunk, which now imports them too. As in Cyberpunk, Three.js renders the
surface and turn-order coin, while DOM artwork and attached soft shadows preserve readable card faces and
accessible controls. There are no React state updates per animation frame.
One clock drives the opening, with idle demand rendering, staggered draws,
bounded DPR, reduced motion, and sound cues from the shared audio service.
The clock stops in hidden tabs and caps its next delta to prevent catch-up jumps.

Fixture notes show measured frame times during normal motion, excluding the
first 80 ms of each beat. FPS is a local browser observation, not a guarantee
for other GPUs, screen sizes, or a full multiplayer board. Reduced-motion runs
are not performance samples. Check both turn orders, keep/replace, restart,
mute, keyboard selection, and narrow viewports before extending the flow.

## Validation on 2026-10-06

- In-app browser: 1280×720 and 390×844; both turn orders, keep, replace two,
  replace eight, keyboard selection, restart, mute, and reduced motion.
- Alpha Clash, two-card replacement: 499 measured frames, average 60.0 FPS,
  p95 18.4 ms, zero frames over 20 ms. Grand Archive, opponent first: 422 frames,
  average 60.0 FPS, p95 18.3 ms, zero frames over 20 ms.
- Shared audio trace: 16 cues for the Alpha Clash two-card replacement sequence;
  repeating with mute enabled added no cues.
- 22 tests passed across the opening contracts/controls and existing Cyberpunk
  card-flight/feedback tests. Focused lint and the standalone Vite build passed.
- The full app TypeScript check still reports unrelated Cyberpunk and router
  test errors. It reports no errors in the opening or extracted shared code.

## Motion refinement on 2026-10-06

The opening opts into a shared transfer profile with smoother travel easing,
a squared low-lift envelope, and later face reveals. Cyberpunk retains its
existing default profile. Flights scale with transforms instead of changing
card width and height every frame. Leaders dock in their own stage before the
coin or draw starts. Prompts fade out before timed stages end, and card previews
wait 350 ms so selection remains visible. The coin fades in and out. Detached
flat shadow planes were removed; shadows now turn with the card.

Final local samples: Alpha Clash with two replacements, 606 frames, 60.0 FPS,
p95 18.5 ms; Grand Archive, 522 frames, 60.0 FPS, p95 18.4 ms. Both reported
zero sampled frames above 20 ms and five draw calls. These are local measurements,
not proof of performance on all devices or a match to reference-video timing.
Focused lint and the existing 22 opening/Cyberpunk tests passed again.

## Reusable package

The implementation now lives in `packages/simulator-presentation`. See its
[public API and adoption notes](../packages/simulator-presentation/README.md).
Game folders retain opening rules/configuration and the application wrapper
retains routes. Custom layout and table-render functions do not replace the
shared card motion, selection or sound services.

Grand Archive's main Three board uses the shared scene card, shadow, selection
rim, pose motion and zone renderer. Cyberpunk imports shared transfer math,
canvas, audio and selection tokens. Alpha Clash's main HTML board uses shared
selection tokens. Existing HTML zone widgets remain in `@tcg/simulator-ui`.

After extraction: 79 focused tests passed (46 app integration, 19 audio-attention
and animation-fixture checks, 11 Grand Archive layout, 3 package contracts), both package type checks and focused lint passed,
and the standalone production build succeeded. Alpha Clash replacement and
Grand Archive start-to-main-phase were checked in the in-app browser. Main-board
browser verification was unavailable because the full simulator server was not
running. Live engine opening integration is not part of this package extraction.
