# Shared card focus layers

`@tcg/simulator-ui` owns the HTML layer contract used above a Three.js board:

| Layer | Purpose |
| --- | --- |
| Board | Cards and targets on the table |
| Motion | Moving card copies during a transfer |
| Focus | Card previews, inspection, and cards pending resolution |

`CardPresentationPlane` provides a pointer-transparent host. Its portal option
escapes the board's CSS stacking context and copies the board bounds into screen
coordinates. Resize and scroll update these bounds. It does not run a frame loop.

`CardInspectionDialog` reuses Mantine's modal and the focus layer. Alpha Clash's
Three.js arena, Cyberpunk's inspector, and the shared `CardDetailSheet` use it.
`CardInspector` and Cyberpunk's hover preview use the same layer value.

`PendingResolutionCards` reuses `ResolvingEntityStage`. It displays the current
viewer-authorized entity, retains plan-referenced anchors for card flights, and
removes the last visible card after one exit fade. A newer card cancels an older
exit. Game adapters still select the source, order the queue, and exclude cards
that already have a public board representation. Game rules do not move into UI.

Cyberpunk's desktop and mobile boards use this shared lifetime. Board V2 supplies
the elevated style and two side rails: your source controller uses the left;
the rival controller uses the right. This mapping is relative to the viewer,
independent of the active turn or the player selecting a target. Retained anchors
and the exit fade keep each card's side. The card's center follows the
projected gap between the two field rows. Its size follows the board scale so it
stays within the side rail. The shared stage accepts CSS variables for position
and width; it does not encode Cyberpunk's layout.

The existing component catalog includes the elevated stage and its active and
hidden controls. No separate catalog or renderer was added.

Local checks: Alpha Clash card inspection; Floor It play, preview, target
selection, draw, exit fade, and anchor cleanup; focused shared and Cyberpunk tests.
The shared UI type check passes. The app-wide type check has unrelated existing
fixture and engine errors. These checks do not prove hosted matches or deployment.
