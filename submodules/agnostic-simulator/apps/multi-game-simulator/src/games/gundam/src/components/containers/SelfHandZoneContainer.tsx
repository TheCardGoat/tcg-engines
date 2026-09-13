import { useCallback } from "react";

import {
  interactionViewSourceCardIds,
  useBoardProjection,
  useInteractionView,
  useViewerId,
} from "../../game/index.ts";
import { useGundamInteractionDraft } from "../../game/interaction-draft.tsx";
import { HandZone } from "../ui/playerSeat/HandZone.tsx";
import type { GameCardData } from "../ui/types.ts";
import { mapZone, toGameCardData } from "./mappers.ts";
import { dispatchCardAction } from "./cardAction.ts";
import { useDualMode } from "../ui/dual-mode-context.tsx";
import { useSimulatorViewportLayout } from "@tcg/simulator-ui";
import { useGundamMatchActions } from "./MobileChromeContainer.tsx";
import { UndoButton } from "../ui/UndoButton.tsx";
import { PriorityActionButton } from "../ui/PriorityActionButton.tsx";

export function SelfHandZoneContainer() {
  const view = useBoardProjection();
  const viewerId = useViewerId();
  const interactionView = useInteractionView();
  const draft = useGundamInteractionDraft();
  const dual = useDualMode();
  const isMobile = useSimulatorViewportLayout() === "mobile";

  const hand: GameCardData[] = mapZone(view, "hand", viewerId).map((c) => toGameCardData(view, c));

  const playableIds = draft.active
    ? draft.boardCandidateIds
    : interactionViewSourceCardIds(interactionView);

  const canPlay = useCallback(
    (card: GameCardData): boolean => (card.id ? playableIds.has(card.id) : false),
    [playableIds],
  );

  const handWithPlayable: GameCardData[] = hand.map((c) => {
    const p = c.id ? playableIds.has(c.id) : false;
    return p !== c.playable ? { ...c, playable: p } : c;
  });

  const multiSelectedIds = draft.selectedIds;

  const handWithMarks: GameCardData[] =
    multiSelectedIds.size > 0
      ? handWithPlayable.map((c) =>
          c.id && multiSelectedIds.has(c.id) ? { ...c, selected: true } : c,
        )
      : handWithPlayable;

  const selectedIndex = (() => {
    // Dual-mode lift takes precedence — if the user has tapped a
    // dual-mode card and is choosing a half, that's the visually
    // selected card even though no engine move has started yet.
    if (dual.pending) {
      const idx = handWithPlayable.findIndex((c) => c.id === dual.pending!.cardId);
      if (idx >= 0) return idx;
    }
    if (!draft.active) return -1;
    const seededId = draft.sourceId;
    if (!seededId) return -1;
    return handWithPlayable.findIndex((c) => c.id === seededId);
  })();

  const onSelect = useCallback(
    (i: number) => {
      const card = handWithPlayable[i];
      if (!card?.id) return;
      dispatchCardAction(
        {
          draft,
          interactionView,
          dual,
        },
        card.id,
      );
    },
    [draft, handWithPlayable, interactionView, dual],
  );

  const handZone = (
    <HandZone
      hand={handWithMarks}
      isOpponent={false}
      zoneId={`hand:${viewerId}`}
      selected={selectedIndex}
      onSelect={draft.boardInteractionEnabled ? onSelect : undefined}
      canPlay={canPlay}
    />
  );

  if (isMobile) return handZone;

  return (
    <div
      className="grid h-full w-full min-w-0 grid-cols-[minmax(0,1fr)_clamp(5rem,8vw,6.5rem)] gap-2"
      data-testid="gundam-desktop-hand-area"
    >
      {handZone}
      <DesktopHandControls />
    </div>
  );
}

function DesktopHandControls() {
  const { onUndo, canUndo } = useGundamMatchActions();
  return (
    <div
      className="grid min-h-0 min-w-0 grid-cols-1 grid-rows-[minmax(0,1fr)_minmax(0,2fr)] gap-1 rounded-lg border border-hud-border bg-hud-deep p-1 [&>button]:min-h-0 [&>button]:min-w-0 [&>button]:whitespace-normal [&>button]:rounded [&>button]:tracking-normal [&>button]:[clip-path:none] [&>button>span]:max-w-full [&>button>span]:text-center"
      data-testid="gundam-desktop-hand-controls"
    >
      <UndoButton
        onUndo={onUndo}
        canUndo={canUndo}
        compact
        className="h-full w-full"
        style={{ fontSize: "0.75rem", letterSpacing: "normal", whiteSpace: "nowrap" }}
      />
      <PriorityActionButton embedded compact />
    </div>
  );
}
