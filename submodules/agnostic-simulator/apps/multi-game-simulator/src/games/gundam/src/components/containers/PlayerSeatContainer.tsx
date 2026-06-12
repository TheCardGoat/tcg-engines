import { useCallback } from "react";

import {
  asMoveName,
  protocolTargetSelection,
  useBoardProjection,
  useGundamGame,
  useInteractionView,
  usePending,
  useViewerId,
} from "../../game/index.ts";
import { deriveClockView } from "@tcg/gundam-engine";
import { PlayerSeat } from "../ui/playerSeat/PlayerSeat.tsx";
import type { SeatSide } from "../ui/playerSeat/PlayerSeat.tsx";
import type { PlayerInfo } from "../ui/types.ts";
import { dispatchCardAction } from "./cardAction.ts";
import {
  countActiveResources,
  mapZone,
  resolveOpponentId,
  toGameCardData,
  zoneCount,
} from "./mappers.ts";
import { SelfHandZoneContainer } from "./SelfHandZoneContainer.tsx";
import { OpponentHandZoneContainer } from "./OpponentHandZoneContainer.tsx";
import { usePendingEffectSelection } from "../ui/pending-effect-selection-context.tsx";
import { useSubmitError } from "./submit-error-context.tsx";
import { useClockNow } from "../../game/use-clock-now.ts";
import { TimedOutPlayerOverlay } from "../ui/TimedOutPlayerOverlay.tsx";

export interface PlayerSeatContainerProps {
  readonly side: SeatSide;
}

export function PlayerSeatContainer({ side }: PlayerSeatContainerProps) {
  const view = useBoardProjection();
  const viewerId = useViewerId();
  const pending = usePending();
  const interactionView = useInteractionView();
  const targetSelection = protocolTargetSelection(interactionView);
  const { adapter } = useGundamGame();
  const { report } = useSubmitError();
  const pendingEffectSelection = usePendingEffectSelection();

  const opponentId = resolveOpponentId(view, viewerId) ?? viewerId;
  const playerId = side === "top" ? opponentId : viewerId;
  const isOpponent = side === "top";

  // Fold paired pilots into their host unit so the play zone renders one
  // visual slot per fielded mech (with the pilot peeking out below it),
  // matching the official Gundam digital UI. Standalone pilot entries are
  // filtered out of `play` — they live on the unit's `pairedPilot` field.
  const rawPlay = mapZone(view, "battleArea", playerId).map((c) => toGameCardData(view, c));
  const pilotAssignments =
    (view.G as { pilotAssignments?: Record<string, string> }).pilotAssignments ?? {};
  const pairedPilotIds = new Set(Object.values(pilotAssignments));
  const playIndex = new Map(rawPlay.map((c) => [c.id ?? "", c]));
  const play = rawPlay
    .filter((c) => !(c.id && pairedPilotIds.has(c.id)))
    .map((c) => {
      const pilotId = c.id ? pilotAssignments[c.id] : undefined;
      const pairedPilot = pilotId ? playIndex.get(pilotId) : undefined;
      return pairedPilot ? { ...c, pairedPilot } : c;
    });
  const resourceArea = mapZone(view, "resourceArea", playerId).map((c) => toGameCardData(view, c));
  const base = mapZone(view, "baseSection", playerId).map((c) => toGameCardData(view, c));
  const shields = mapZone(view, "shieldArea", playerId).map((c) => toGameCardData(view, c));
  const discard = mapZone(view, "trash", playerId).map((c) => toGameCardData(view, c));
  const availableResources = countActiveResources(view, playerId);

  const player: PlayerInfo = {
    name: playerId,
    clock: "\u2014",
    colors: [],
    deck: zoneCount(view, "deck", playerId),
    discard: zoneCount(view, "trash", playerId),
    shields: zoneCount(view, "shieldArea", playerId),
  };

  const isViewer = String(playerId) === String(viewerId);
  const isTurn = String(view.status.activePlayer ?? "") === String(playerId);
  const clockNow = useClockNow();
  const opponentClockSnapshot = isOpponent ? view.timerView.players?.[playerId] : undefined;
  const opponentClockView = opponentClockSnapshot
    ? deriveClockView(opponentClockSnapshot, clockNow)
    : null;

  const collectingStep = pending.state.status === "collecting" ? pending.state.steps[0] : null;

  const highlightCardIds: readonly string[] = targetSelection
    ? [...targetSelection.targetIds]
    : collectingStep?.kind === "selectTarget"
      ? [...collectingStep.candidateIds]
      : [];

  const selectedCardIds = targetSelection
    ? pendingEffectSelection.selectedTargetIds
    : pending.state.status === "collecting"
      ? [
          pending.state.partialInput.attackerId as string | undefined,
          pending.state.partialInput.blockerId as string | undefined,
          pending.state.partialInput.pilotId as string | undefined,
          pending.state.partialInput.unitId as string | undefined,
          pending.state.partialInput.cardId as string | undefined,
        ].filter((id): id is string => Boolean(id))
      : [];

  const handZone = isOpponent ? <OpponentHandZoneContainer /> : <SelfHandZoneContainer />;

  // Card clicks on a battle-area unit dispatch the same priority-1/2/3
  // chain that hand cards use: resolve a server-driven target, feed a
  // pending selectTarget step, or start a new pending move (most often
  // `enterBattle`). Wired on both seats so opponent units accept clicks
  // when they're legal targets — the dispatcher no-ops if priority 3
  // would have nothing to start (no move accepts that cardId).
  const onPlayCardClick = useCallback(
    (cardId: string) => {
      dispatchCardAction(
        { adapter, pending, interactionView, targetSelection, report, pendingEffectSelection },
        cardId,
      );
    },
    [adapter, pending, interactionView, targetSelection, report, pendingEffectSelection],
  );

  const onSkipOpponent = useCallback(() => {
    report(adapter.submit(asMoveName("skipOpponentTurn"), {}));
  }, [adapter, report]);

  const onDropOpponent = useCallback(() => {
    report(adapter.submit(asMoveName("dropOpponent"), {}));
  }, [adapter, report]);

  return (
    <PlayerSeat
      side={side}
      player={player}
      play={play}
      resourceArea={resourceArea}
      base={base}
      shields={shields}
      discard={discard}
      availableResources={availableResources}
      isViewer={isViewer}
      isTurn={isTurn}
      selectedCardIds={selectedCardIds}
      highlightCardIds={highlightCardIds}
      onPlayCardClick={onPlayCardClick}
      timeoutOverlay={
        opponentClockView ? (
          <TimedOutPlayerOverlay
            canSkip={opponentClockView.canSkipOpponent}
            canDrop={opponentClockView.canDropOpponent}
            onSkip={onSkipOpponent}
            onDrop={onDropOpponent}
          />
        ) : undefined
      }
    >
      {handZone}
    </PlayerSeat>
  );
}
