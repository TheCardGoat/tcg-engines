# Resource step: iteration 02

Open `/alpha-clash/simulator/tests/resource-step`. The old inventory link redirects here.
Like opening-preview, arena, arena-crowded and arena-clash, this fixture mounts
AlphaClashPracticePage and the full AlphaClashArena3D. It supplies only the starting
engine state. Drag controls now belong to the real board and use its existing
interaction draft, inspection, Match drawer, card poses and sound service. It submits `deployResource` or `passResource` through the native
interaction protocol. The adapter supplies card candidates; native submission validates each action.
Isolated command dry runs are used only in fixture tests.

## Human QA

1. Drag Sonoro to the highlighted Resource Zone. It must move once, show its
   artwork inverted, stay ready, and advance to Primary Phase. More drops are locked.
2. Reset. Try Ultimate Power Armor (Rivaled) and Cadavros (a Bound copy is already
   resourced). Both must return to hand without changing the phase or resource count.
3. Drop a card outside your Resource Zone. No game state may change.
4. Reset. Drag the Resource step marker to Skip resource. The hand and resources
   must stay unchanged; the phase advances.
5. Focus a card with Tab. Space picks it up; arrow keys move it; Space drops it.
   Escape returns it to its original hand slot.
   Right-click inspects; Escape returns. Opening Match or Cards & piles locks board drag.
6. Use Match to set sound or reduced motion, then deploy or skip. Check cue volume and timing. Repeat with
   reduced motion. Check desktop and short landscape layouts.

Rules: 408.1–4, 502.1c, 704.19c, 704.25d in the official Comprehensive Rulebook v8.0.
The fixture includes deliberate rule-edge cards, not a tournament deck.

## Evidence and limits

Native model checks cover legal deployment, Rivaled and Bound rejection,
skip, repeated-action locks and resource orientation. Browser checks exercise the
real board instead of a separate resource page. Browser QA covers actual pointer drags, invalid
destinations, keyboard submission, inspection, and an 844×390 landscape viewport.
Sound quality and motion feel require human QA. This does not prove hosted matches.

## Iteration order

Opening selection stays click-based. Review this resource fixture before starting
Clash deployment. Continue with Clashground replacement; accessories and face-down
sets; Actions, Empowerments and Omens; response plays and abilities; attachment
and Portal; attack and obstruction; buffs and pass/end-turn; concede. Each gets
native legality checks, a deterministic fixture, browser QA, then human review.
Effect-specific choices remain owned by the separate choice-fixture work.

## Shared implementation

Alpha Clash uses the same PointerDragDropSurface, PointerDraggable, PointerDroppable
and drag-motion store as Cyberpunk. The old choice-token overlay is no longer used
for board cards. Choice trays remain separate from board motion.

Cyberpunk's existing mesh projection and velocity sway now live in
simulator-presentation's useSceneCardDrag. Both scenes call it; the original
Cyberpunk copy was removed. tabletopFanSlot contains the existing Cyberpunk fan
calculation, with each game supplying its span, tilt and overlap.

The dragged mesh remains the only card visual. Invalid drops return through the
shared motion store. Accepted resource drops keep that mesh and let useCardPose
move it from the release position to the authoritative resource pose.

## Resource placement refinement

Hand-to-resource placement uses the shared pose transition for 360 ms, starting
at the released mesh. It has no inspection arc; movement leads the turn to the
inverted resource orientation. Reduced motion places the card immediately.

The landing cue uses the unmodified Kenney Casino Audio `card-place-2.ogg`
from assets PR #153. It is preloaded and played once after placement, through
the existing sound service. Inspecting a resource does not replay the cue.
The sound file and upstream CC0 licence are bundled for reliable delivery.
