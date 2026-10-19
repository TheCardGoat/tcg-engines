# Alpha Clash 3D arena POC

All Alpha Clash practice, live-match, and TestEngine board routes use this React Three Fiber renderer. No renderer query parameter is required. This is a local presentation POC, not a hosted-match or production-performance acceptance result.

## Real opening fixture

`/alpha-clash/simulator/tests/opening-preview` uses this board and the existing local practice controller. It creates a seeded native initial state through `AcTestEngine.fromState`, with validated 50-card specification decks and official Contenders. Both seats start with eight cards and no cards in the play zones. Player 1 is the fixed starting player. Each seat declares keep or mulligan in native order, then players taking a mulligan select zero to eight cards. The practice bot keeps its hand; Hot seat follows the player who owes the next choice. Both selections must be locked before the engine redraws. The same match continues through resource deployment into primary phase. Reset recreates the seeded deal.

The opening sequence uses the same arena Canvas: contender reveal and docking → shuffle and deal → hand review → optional return/shuffle/redraw → automatic hand fan → playable first turn. A player can select cards during the initial review and confirm replacement once; the opening controller submits the native declaration and waits for the legal replacement action. Only an accepted native result starts replacement animation. After both hands are ready and the local animation queue is empty, the starting seat submits the native start action once; no Begin game click is needed. The accepted start moves the eight cards into the live hand fan. Failed commands restore review. The generic interaction draft stays disabled during opening. Background tabs pause the clock; reduced motion follows the simulator setting.

Opening card input and cues share `mulliganCardIds`: every local hand card has the normal `CardCueFrame` border before selection, and the normal selected border after selection. Left-click, Enter, and Space toggle replacement; right-click or Shift+Enter inspects. Do not route opening hand cues to a separate CSS overlay or derive their candidates from generic gameplay actions. A completed hand or an in-flight command must not allow another mulligan. Regression checks must assert both the semantic hit target and scene candidate/selected sets. Browser validation must click the card face and check the visible border before and after selection; a mocked scene cannot prove the border is drawn. Verify that the serving process watches this checkout: a Vite config with `watch.ignored: ["**"]` serves cached transforms even after a browser reload. Use the normal simulator dev server for edit validation.

The fixture fixes the starting player and does not simulate a first-player-choice procedure. Cards without catalog artwork have named placeholders, not concealed-card backs. The standalone opening scene remains a presentation reference; the routed preview is engine-backed.

Opening validation (2026-10-10): 41 focused adapter, native fixture, choreography,
inspection, and practice tests passed, plus the adapter type check. Coverage
includes either starting seat, zero/partial/full-hand selections, private pending
selections, and rejected commands. In-app browser checks at 1280×720 and 1126×800
covered keep against the bot, a two-card redraw against the bot, and both players
mulliganing in Hot seat (one and two cards). All three flows reached turn one's
primary phase with one resource and seven hand cards through a real drag. The
native event log showed declarations before mulligans and no redraw after only
the first private selection. No browser errors were reported. These are local
simulator checks, not hosted-match acceptance.

## Reused constructs

- `@tcg/simulator-presentation/three`: `SceneCard`, `CardSelectionRim`, `useCardPose`, and `useSceneTextures`. The texture loader/cache was extracted from Grand Archive, which now consumes the same implementation. It deduplicates viewer-authorized URLs, aborts removed requests, disposes textures, reports failures, and supports retries.
- Cyberpunk V2's camera/DOM boundary: a perspective camera projects the same physical card positions into keyboard-accessible hit regions. The Alpha Clash layout remains game-owned.
- `InteractionWorkspace`, `useInteractionBoard`, and `useInteractionDraft` retain legal targeting, action submission, and prompts. No rules are implemented in the scene.

The board uses textured Three.js geometry, card depth, directional lighting, contact shadows, and demand rendering. Reduced motion snaps poses. DOM owns semantic input targets, image-backed action buttons, text status, detailed inspection, and shared prompts. Card faces preserve their printed aspect ratio. A failed or lost WebGL context offers a 3D retry without resetting engine state. Portrait orientation hides the canvas and requests landscape; the scene remains mounted.

## Layout

Clash rows use the space between the side zones and shrink only when the row needs it. The hand fan also narrows on smaller desktop viewports to keep the control panels clear. Support cards share compact trays; short landscape viewports show support counts and retain inspection through Cards & piles. Engraved zone borders show spatial boundaries. Hover or keyboard focus reveals zone names. Resource and pile counts use compact icon badges, including accessory counts in short landscape. DOM zone targets use the same camera projection and sit below card targets. Turn ownership and response priority share a compact action area at the lower right. Practice controls and settings are in the Match menu. The decorative table uses a uniform cover scale to fill the viewport; both neutral and turn-light surfaces use the same geometry. This scale never affects cards or zones.

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
- Hand cards support native drag-to-play, hover/selection motion, and sound. These local checks do not establish a complete combat-effects or production-performance acceptance result.
- Remote card art needs CORS access. Failure keeps a labelled fallback; Retry artwork retries failed textures.
- Prompts retain the existing drawer workflow. Asset-backed action shortcuts submit only advertised actions through the shared draft.

## Native allocation

`/alpha-clash/simulator/tests/prompt-barrage` starts Machina, Unstoppable Force's
Barrage through `AcTestEngine`. The production `AlphaClashServerEngine` resolves
all fixture choices. `BoardAllocation` edits the shared draft and is board-native:
there is no panel or modal. The resolving card is staged at the shared
resolution-focus pose (`resolutionFocusPose`, right-center) as a lifted DOM
card with a "Resolving" tag and a cyan edge; its board spot is veiled and the
scene's clash accent is muted there so nothing reads as clickable. The glassy
pill under the staged card carries the pool ("÷6 · N left", draggable), reset,
decline, and a confirm ring that lights when the division is complete. Gold
tethers with arrowheads and a slow flow animation run edge-to-edge from the
staged card to every allocated target (dashed preview while hovering a legal
target; static under reduced motion). Each other legal Clash card is itself the
control: click it to allocate 1 (hover shows a +1 chip), click the red badge to
remove 1, and drag from the pool chip for Arena-style assignment. The division
submits itself once the last point is placed (a short grace shows the completed
state; a rejected submission offers a retry chip). Submitting fires the shared
deal-damage motion: gold bolts fly from the staged card to every damaged target
with trails, impact rings, floating "−N" amounts, and the combat.hit cue, and
the hot-seat pass waits for it to finish. Amounts render as
damage-counter badges on the cards; saturated targets dim; the remaining total,
the resolving card's name, and notices are announced through a visually hidden
live region. When the active seat passes (hot-seat), the page veils the table
and announces "Seat passes to …" with the turn caption before the board
re-projects, waiting for counter flights to drain first. While the allocation prompt is active the scene's candidate
highlight rims are suppressed — gold rings are the only target affordance — and
contender clash accents render as soft under-glow pads with a neutral card edge,
keeping state distinct from affordance. Amount changes use the shared
`counter.land` cue; the board's Sound setting mutes it. Reduced motion removes
drop animation; the design uses transitions only, so it stays motion-free. When
the 3D scene cannot report card anchors (WebGL unavailable), the shared prompt
serves the allocation instead; no anchors means no board surface.

The protocol's optional `allowEmpty` and `maxRecipients` fields preserve Barrage's
optional subset selection. Candidate `min: 0` permits omission; positive integer
amounts give each selected target at least one damage. See official Alpha Clash
v8.0 rules 601.1d and 704.3 in the owning rules skill. Native division currently
covers Barrage and damage prevention; native counter transfer is a count choice,
so there is no counter-division fixture.

Validation: native adapter tests cover full/split allocation, decline, invalid
amounts, excess recipients, unknown targets, opponent access, and retry without
state mutation. Component tests cover target clicks, badge removal, recipient
limits, reset, rejection/retry, mouse drag cancellation, invalid drops, legal
drops, keyboard allocation/removal, and resize persistence. These tests do not
prove touch behavior, audible playback, or hosted transport.

Integration: carry the shared protocol and draft-validation changes with the
board and adapter. This change is based on `9fafe2b855`; it needs no other agent's
branch. Browser acceptance remains required before publication.

## Allocation QA checklist

Use `/alpha-clash/simulator/tests/prompt-barrage`. Reload the page for a fresh
native fixture before each independent case. No renderer query parameter is needed.

1. Check the initial prompt: the source card carries a "÷6 · 6 left" pill with
   reset, decline, and a disabled confirm; three Clash cards show gold rings and
   "Max 6" chips. Confirm allocation stays disabled; opponent hand and deck
   identities stay hidden.
2. Click a highlighted Clash card (a "+1" chip appears on hover). Its damage
   badge shows 1 and the pill reads 5 left. Click the badge to remove it again.
   Drop a drag from the pool chip onto a card to allocate; drop on the table: no
   change. Press Escape during a drag: the drag stops and the draft stays
   unchanged.
3. Assign one to each of two cards. A third recipient must be blocked (dimmed).
   Removing a badge frees the slot. Repeat through Match → match actions and
   Cards & targets.
4. Use Reset allocation: all badges clear and all six damage remain. Assign 1 and
   5, 3 and 3, or all 6 to one card. The confirm ring turns gold and Confirm
   allocation enables only when all six are assigned. Extra additions and
   negative amounts must be blocked.
5. Confirm. The native prompt closes. The selected cards show the assigned
   damage or leave play if defeated. Check the game log in Match for the result.
   A draft must not change card damage before confirmation.
6. Reload, assign some damage, then select Decline effect. The prompt closes
   without Barrage damage. Reset clears the draft; decline resolves the optional
   effect. These are separate actions.
7. Test keyboard focus and Enter/Space on amount, reset, decline, and confirm
   controls. Test a real touch device in landscape. Use Match to mute Sound and
   enable Reduced motion; repeat a drag. Muting suppresses the amount cue, and
   reduced motion removes drop animation while preserving the final state.
8. Check a wide desktop, short landscape viewport, and portrait viewport. All
   amounts and buttons must be readable and usable; portrait shows the rotation
   instruction. Resize during a draft: assigned amounts must persist.

Agent QA on October 8, 2026 found and fixed a recipient-limit gap in direct
card selection and the match actions drawer. Shared prompt confirmation uses the
same allocation validator as native submission.

Agent browser QA on October 9, 2026 (headless Chromium with SwiftShader WebGL
against this fixture) verified: initial state, plus/minus buttons, two-recipient
limit, six-damage cap, reset, mouse drag assignment, Escape cancel, illegal
drop, confirm resolve, decline, keyboard Enter/Space, draft persistence across
resize, short-landscape layout, and the drawer Sound/Reduced-motion settings.
The same session found and fixed two defects: the prompt title repeated
"(divide N damage)" after the engine prompt already said it, and a WebGL-less
browser rendered the board panel with zero drop targets because the 3D scene
never reports anchors; the board surface now requires scene anchors and the
shared prompt serves allocation otherwise.

Known issue: resolving the allocation remounts the R3F canvas and logs one
`TypeError: Cannot read properties of null (reading 'addEventListener')` from
R3F's own connect path. The board recovers immediately and all flows continue;
the remount is triggered by the pre-existing resolution pipeline (this branch
does not touch Scene or Canvas lifecycle), so it needs a separate root-cause
pass. Still unverified: real touch gestures, audible playback, reduced-motion
visuals on hardware, and hosted transport.

## Board UX pass — October 10, 2026

The review found strong board artwork but weak information hierarchy: a full-width
utility toolbar, detached turn text, ambiguous priority diamonds, text-only piles,
and low-contrast legal actions. The implementation keeps the rendered board and
uses these documented game-design precedents:

- [MTG Arena gameplay controls](https://magic.wizards.com/en/news/mtg-arena/mtg-arena-state-game-january-2021-01-21): direct card movement, responsive hand presentation, and inspectable zones.
- [Runeterra initiative redesign](https://playruneterra.com/en-us/news/open-beta-patch-notes/): consolidate initiative beside the action control rather than repeat competing indicators.
- [Runeterra UX notes](https://playruneterra.com/en-us/news/patch-0-9-0-notes): state changes should be readable without delaying player input.

The board now has an icon utility pair, a priority medallion with native phase and
Clash step, distinct pile symbols, resource readiness marks, and engraved field
boundaries. Legal hand cards have a cyan rim; target selection and selected cards
keep separate cues. A drag reveals only its advertised destination. The target
changes to gold with a check mark when ready to accept the card. Invalid drops
return the card and show a visible notice in desktop and compact layouts.

Two input defects were repaired: draggable cards did not forward hover/focus to
the scene, and the accessory destination existed without a reachable draggable
accessory card. An empty candidate set also incorrectly dimmed the whole hand.
All play, cost, target, and response decisions still use the native interaction
view and shared draft.

Short landscape uses a compact status, Clash icon beside the main action, and
Auto-pay in the Match menu. Resource skipping is a keyboard-accessible button.
Portrait keeps the established landscape guard.

Local in-app browser checks used the existing checkout server at port 5194:
Clash drag, native payment and response resolution, resource deployment, invalid
drop, keyboard drag and Escape cancel, accessory payment staging/cancel, hand
paging, compact settings, and portrait recovery. Viewports: 1280×720, 844×390,
390×844, and 1126×800. The original port 5193 belongs to another checkout.
Focused component tests cover priority ownership and hand hover/focus. These are
local simulator checks; real touch hardware, hosted matches, and production
performance remain outside this pass. The app-wide TypeScript check exceeded its
4 GB heap before diagnostics; focused lint and browser compilation are the
available static checks.

The label follow-up keeps the priority medallion, phase icons, pile symbols, and
counts visible. Turn details appear briefly on a native state change and can be
reopened by hover, keyboard focus, or click/tap. Escape and an outside click
dismiss the details. The Clash control uses its icon; Auto-pay is in Match at
every viewport size. Hovering a card no longer reveals a redundant zone caption.

Drop targets follow Cyberpunk Board V2's `DropAreas.module.css` pattern: light on
the table, corner brackets, and a short action plus explanation. Cyan indicates
the legal destination; gold and a check mark indicate the active drop target.
Only the dragged card's native-legal destination appears. Narrow zones use an
adjacent instruction so the caption remains readable. No target or explanation
remains after the drag ends or is cancelled.

`/alpha-clash/simulator/tests/arena-drop-targets` starts before a native play with
Clash, Accessory, and Clashground cards in hand. Use `resource-step` to review
resource deployment. In-app browser checks covered all four target designs,
native Clash payment, resource deployment, keyboard cancellation, turn-detail
opening/dismissal, and the Match setting at 1280×720, 1126×800, and 844×390.
The same pass fixed a shared drag retry issue: grabbing the same card during its
cancelled return animation now starts a fresh drag and restores its legal target.
A regression test covers that timing, and a rapid browser retry reached native
payment. Twenty-one focused component and drag tests passed. Card-image requests
returned 404s during that review, so those screenshots used named placeholders.
Card art loaded in the later hand-layer review below. Asset publication and real
touch hardware remain unverified.

## Screen-aligned hands and decision layers

The perspective table is the lower layer. Both hands use screen-pixel fan slots
mapped onto camera-facing planes in the same Canvas. They keep their aspect
ratio and screen size when the board camera changes. The local fan sits partly
below the bottom edge and lifts into view on hover or keyboard focus. The larger
opponent fan sits partly above the top edge and is offset to the right. Native
hit regions follow the cards, retain the resting edge during a lift, and stop
at the viewport edge so keyboard focus cannot scroll the table.

Normal controls sit above the table. Native pending decisions add a dimming
layer with clear windows around legal card targets and the effect source.
Decision controls and staged source cards stay above that layer. The dimming
clears on cancel or native resolution. The declaration preview no longer repeats
the instruction already shown by the shared prompt. Engine actions and hidden
information remain unchanged.

Clash, Contender, and Clashground cards share one base field height and the same
5:7 ratio. Clash rows still shrink when crowded; resource and accessory trays
retain their compact layout.

Local in-app browser checks at 1280×720, 1126×800, and 844×390 covered fan layout,
12-card hand paging, keyboard focus, inspection, pointer and keyboard drag, native payment, and
Denver's optional draw/discard effect. Opening reveal, deal, and hand review also
rendered correctly. Twenty-two focused layout and component
tests passed. Focused lint has no errors and retains three existing warnings in
the arena component. The opening declaration failure found during this pass was
repaired in the adapter and opening controls; see the opening validation above.
These checks do not establish hosted-match or physical-touch acceptance.

### Stable board camera

`CameraRig` accepts only the viewport and compact layout. `camera-layout.ts` fits a fixed arena envelope with a fixed eight-card hand reserve. Opening beats, hand counts, hover, selection, and support-rail allocation cannot refit the camera. `SceneAnchors` separately projects changing card and zone targets through that camera. Keep new game-state inputs out of camera fitting; animate cards instead. The frame cover scale is decorative and uniform, and changes only after resize.

Validation: `camera-layout.test.ts` checks viewport coverage and repeatable fitting; `OpeningMotion.test.tsx` checks stationary cards during replacement. In local practice, compare contender bounds before mulligan, after automatic start, and after resource deployment, then resize and check the board again.
