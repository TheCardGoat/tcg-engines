import { useCallback } from "react";

import {
  interactionViewSourceCardIds,
  protocolTargetSelection,
  useBoardProjection,
  useGundamGame,
  useInteractionView,
  usePending,
  useViewerId,
} from "../../game/index.ts";
import { HandZone } from "../ui/playerSeat/HandZone.tsx";
import type { GameCardData } from "../ui/types.ts";
import { mapZone, toGameCardData } from "./mappers.ts";
import { dispatchCardAction } from "./cardAction.ts";
import { useDualMode } from "../ui/dual-mode-context.tsx";
import { usePendingEffectSelection } from "../ui/pending-effect-selection-context.tsx";
import { useSubmitError } from "./submit-error-context.tsx";

export function SelfHandZoneContainer() {
  const view = useBoardProjection();
  const viewerId = useViewerId();
  const interactionView = useInteractionView();
  const targetSelection = protocolTargetSelection(interactionView);
  const pending = usePending();
  const { adapter } = useGundamGame();
  const { report } = useSubmitError();
  const dual = useDualMode();
  const pendingEffectSelection = usePendingEffectSelection();

  const hand: GameCardData[] = mapZone(view, "hand", viewerId).map((c) => toGameCardData(view, c));

  const promptTargetIds = targetSelection ? new Set<string>(targetSelection.targetIds) : null;

  const playableIds = promptTargetIds
    ? promptTargetIds
    : interactionViewSourceCardIds(interactionView);

  const canPlay = useCallback(
    (card: GameCardData): boolean => (card.id ? playableIds.has(card.id) : false),
    [playableIds],
  );

  const handWithPlayable: GameCardData[] = hand.map((c) => {
    const p = c.id ? playableIds.has(c.id) : false;
    return p !== c.playable ? { ...c, playable: p } : c;
  });

  const multiSelectedIds: ReadonlySet<string> = targetSelection
    ? pendingEffectSelection.selectedTargetSet
    : pending.state.status === "collecting" && Array.isArray(pending.state.partialInput.cardIds)
      ? new Set(pending.state.partialInput.cardIds as readonly string[])
      : new Set();

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
    if (pending.state.status !== "collecting") return -1;
    const seededId = pending.state.partialInput.cardId as string | undefined;
    if (!seededId) return -1;
    return handWithPlayable.findIndex((c) => c.id === seededId);
  })();

  const onSelect = useCallback(
    (i: number) => {
      const card = handWithPlayable[i];
      if (!card?.id) return;
      dispatchCardAction(
        {
          adapter,
          pending,
          interactionView,
          targetSelection,
          report,
          dual,
          pendingEffectSelection,
        },
        card.id,
      );
    },
    [
      adapter,
      handWithPlayable,
      interactionView,
      pending,
      targetSelection,
      report,
      dual,
      pendingEffectSelection,
    ],
  );

  return (
    <HandZone
      hand={handWithMarks}
      isOpponent={false}
      zoneId={`hand:${viewerId}`}
      selected={selectedIndex}
      onSelect={onSelect}
      canPlay={canPlay}
    />
  );
}
