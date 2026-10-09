# Grand Archive React Three Fiber board

Projection-only Three.js table and physical cards, hosted by React Three Fiber.
Responsive wide and portrait compositions serve desktop and mobile. React DOM owns all readable
HUD text, dialogs, prompts, keyboard controls, and overflow inspection.

```tsx
import { GrandArchiveBoard } from "./board-renderer";

<GrandArchiveBoard
  projection={viewerSafeProjection}
  assets={resolvedAssets}
  events={{ onCardPick: selectEntity, onCardHover: inspectEntity }}
  reducedMotion={prefersReducedMotion}
  onAssetStatus={setTextureStatus}
  onLayout={setCardScreenPositions}
/>;
```

The host must have a real height. `onLayout` supplies card centers and sizes as
percentages of that host after fitting its camera. Card IDs must be stable,
viewer-authorized entity identities. Count-only concealed slots use anonymous
IDs supplied by the adapter integration; no hidden identity enters this package.
`faceDown` rejects face URLs even if a caller supplies one accidentally.

`selectedCardId`, candidates and target links express local intent or the
caller's authoritative combat projection. `feedbackCardIds` comes from confirmed
viewer events. The renderer determines no legal action or outcome. Changes to
`resetKey` immediately establish a reconnect/replay/undo baseline. Pose movement
is short and interruptible; reduced motion snaps directly to final poses.

The texture cache belongs to the mounted Canvas, deduplicates CDN requests,
disposes removed face textures and all resources on unmount, and ignores late
responses. Loading/error states are reported to the DOM. Increment
`assetRetryKey` to retry failed requests. Cards use each public image’s aspect ratio without stretching. The Cambria
artwork composes illustrated borders, a resource/action rail, and corner scenery
as independent scene layers. Raised card frames, centered champions, opposing
field rows, and fanned hands preserve the Hearthstone-style visual direction.
DOM counters follow the resulting screen positions.

The renderer uses demand frames, unlit readable card art, and no physics or
post-processing. `onMetrics` reports active frame intervals and renderer resource
counts for browser validation. Idle frames report zero instead of pretending
the demand renderer is running continuously at 60 FPS.
