import { useCallback, useEffect, useMemo } from "react";
import { pilotSatisfiesUnitLinkCondition } from "@tcg/gundam-engine";
import type { Card } from "@tcg/gundam-types";

import {
  asMoveName,
  useBoardProjection,
  useGundamControlState,
  useGundamGame,
  useInteractionView,
  useViewerId,
} from "../../game/index.ts";
import { useGundamInteractionDraft } from "../../game/interaction-draft.tsx";
import { PlayerSeat } from "../ui/playerSeat/PlayerSeat.tsx";
import type { SeatSide } from "../ui/playerSeat/PlayerSeat.tsx";
import { dispatchCardAction } from "./cardAction.ts";
import { resolveOpponentId } from "./mappers.ts";
import { SelfHandZoneContainer } from "./SelfHandZoneContainer.tsx";
import { OpponentHandZoneContainer } from "./OpponentHandZoneContainer.tsx";
import { useSubmitError } from "./submit-error-context.tsx";
import { legalAttackTargetIds } from "../attack-interactions.ts";
import { projectDirectAttackPresentation } from "./direct-attack-presentation.ts";
import {
  type GundamAttackUnitDragSource,
  useGundamDragCommands,
} from "../ui/playerSeat/gundam-drag-drop-context.tsx";
import { OpponentTimeoutOverlayContainer } from "./OpponentTimeoutOverlayContainer.tsx";
import { usePlayerSeatProjection } from "./player-seat-projection.ts";

export interface PlayerSeatContainerProps {
  readonly side: SeatSide;
}

type PilotDropRoute =
  | {
      readonly moveName: ReturnType<typeof asMoveName>;
      readonly sourceInputId: "pilotId";
      readonly targetIds: readonly string[];
    }
  | {
      readonly moveName: ReturnType<typeof asMoveName>;
      readonly sourceInputId: "cardId";
      readonly targetIds: readonly string[];
    };

export function PlayerSeatContainer({ side }: PlayerSeatContainerProps) {
  const view = useBoardProjection();
  const viewerId = useViewerId();
  const controlState = useGundamControlState();
  const draft = useGundamInteractionDraft();
  const interactionView = useInteractionView();
  const { adapter } = useGundamGame();
  const { report } = useSubmitError();
  const { registerAttackDropHandler, registerPilotDropHandler } = useGundamDragCommands();

  const opponentId = resolveOpponentId(view, viewerId) ?? viewerId;
  const playerId = side === "top" ? opponentId : viewerId;
  const isOpponent = side === "top";

  const {
    player,
    play,
    resourceArea,
    base,
    shields,
    discard,
    removalArea,
    availableResources,
    handCount,
  } = usePlayerSeatProjection(view, playerId);

  const isViewer = String(playerId) === String(viewerId);
  const playerSide = isViewer ? "self" : "opponent";
  const isTurn = controlState.turnOwner === playerSide;
  const isPriority =
    controlState.kind === "interactive" && controlState.priorityHolder === playerSide;
  const opponentClockSnapshot = isOpponent ? view.timerView.players?.[playerId] : undefined;

  const directAttackPresentation = useMemo(
    () => projectDirectAttackPresentation(view, String(opponentId)),
    [opponentId, view],
  );
  const attackDragSources = useMemo(() => {
    const sources = new Map<string, GundamAttackUnitDragSource>();
    if (!isViewer || draft.active) return sources;
    for (const card of play) {
      if (!card.id) continue;
      const legalTargetIds = legalAttackTargetIds(adapter, interactionView, card.id);
      if (legalTargetIds.length === 0) continue;
      sources.set(card.id, {
        type: "attack-unit",
        cardId: card.id,
        card: {
          name: card.name,
          img: card.img,
          cardType: card.cardType,
          cost: card.cost,
        },
        legalTargetIds,
        directTargetLabel: `Attack player · ${directAttackPresentation.actionDetail.replace(/\.$/, "")}`,
      });
    }
    return sources;
  }, [
    adapter,
    directAttackPresentation.actionDetail,
    interactionView,
    isViewer,
    draft.active,
    play,
  ]);
  const pilotDropRoutes = useMemo(() => {
    const routes = new Map<string, PilotDropRoute>();
    if (!isViewer || draft.active) return routes;
    const moveRoutes = [
      { moveName: asMoveName("assignPilot"), sourceInputId: "pilotId" },
      { moveName: asMoveName("playCommandAsPilot"), sourceInputId: "cardId" },
    ] as const;

    for (const route of moveRoutes) {
      const action = interactionView.actions.find(
        (candidate) => candidate.id === route.moveName && candidate.enabled,
      );
      const sourceInput = action?.inputs.find(
        (input) => input.kind === "entity-selection" && input.role === "source",
      );
      if (sourceInput?.kind !== "entity-selection") continue;

      for (const candidate of sourceInput.candidates) {
        if (!candidate.enabled) continue;
        const cardId = candidate.entity.instanceId;
        const partialInput = route.sourceInputId === "pilotId" ? { pilotId: cardId } : { cardId };
        const targetStep = adapter
          .describeMove(route.moveName, partialInput)
          .find((step) => step.kind === "selectTarget" && step.role === "unit");
        if (targetStep?.kind === "selectTarget" && targetStep.candidateIds.length > 0) {
          routes.set(cardId, { ...route, targetIds: targetStep.candidateIds });
        }
      }
    }
    return routes;
  }, [adapter, draft.active, interactionView.actions, isViewer]);
  const pilotDropTargetIds = useMemo(
    () => new Map([...pilotDropRoutes].map(([cardId, route]) => [cardId, route.targetIds])),
    [pilotDropRoutes],
  );
  const pilotLinkTargetIds = useMemo(() => {
    const definitions = new Map<string, Card>();
    for (const zone of Object.values(view.zones.zones)) {
      for (const card of zone.cards) {
        if (card.definition) definitions.set(card.instanceId, card.definition as Card);
      }
    }

    const linkTargets = new Map<string, readonly string[]>();
    for (const [pilotId, targetIds] of pilotDropTargetIds) {
      const pilot = definitions.get(pilotId);
      if (!pilot) continue;
      const matchingUnitIds = targetIds.filter((unitId) =>
        pilotSatisfiesUnitLinkCondition(pilot, definitions.get(unitId)),
      );
      if (matchingUnitIds.length > 0) linkTargets.set(pilotId, matchingUnitIds);
    }
    return linkTargets;
  }, [pilotDropTargetIds, view.zones.zones]);
  useEffect(() => {
    if (!isViewer) return;
    return registerAttackDropHandler((attackerId, targetId) => {
      draft.begin("enterBattle", { attackerId: [attackerId], target: [targetId] });
    });
  }, [draft, isViewer, registerAttackDropHandler]);
  useEffect(() => {
    if (!isViewer) return;
    return registerPilotDropHandler((pilotId, unitId) => {
      const route = pilotDropRoutes.get(pilotId);
      if (!route?.targetIds.includes(unitId)) return false;
      draft.begin(route.moveName, { [route.sourceInputId]: [pilotId], unitId: [unitId] });
      return true;
    });
  }, [draft, isViewer, pilotDropRoutes, registerPilotDropHandler]);

  const highlightCardIds = [...draft.boardCandidateIds];
  const selectedCardIds = [...draft.selectedIds];

  const handZone = isOpponent ? <OpponentHandZoneContainer /> : <SelfHandZoneContainer />;

  // Card clicks on a battle-area unit dispatch the same priority-1/2/3
  // chain that hand cards use: resolve a server-driven target, feed a
  // pending selectTarget step, or start a new pending move (most often
  // `enterBattle`). Wired on both seats so opponent units accept clicks
  // when they're legal targets — the dispatcher no-ops if priority 3
  // would have nothing to start (no move accepts that cardId).
  const onPlayCardClick = useCallback(
    (cardId: string) => {
      dispatchCardAction({ draft, interactionView }, cardId);
    },
    [draft, interactionView],
  );
  // A battle-area drop is an explicit choice of the Command mode for a
  // dual-mode Command. It must not enter the click-only mode picker.
  const onHandCardDrop = useCallback(
    (cardId: string) => {
      const commandAction = interactionView.actions.find(
        (action) => action.id === "playCommand" && action.enabled,
      );
      const sourceInput = commandAction?.inputs.find(
        (input) =>
          input.kind === "entity-selection" &&
          input.role === "source" &&
          input.candidates.some(
            (candidate) => candidate.enabled && candidate.entity.instanceId === cardId,
          ),
      );
      if (sourceInput?.kind === "entity-selection") {
        draft.begin("playCommand", { [sourceInput.id]: [cardId] });
        return;
      }
      onPlayCardClick(cardId);
    },
    [draft, interactionView.actions, onPlayCardClick],
  );

  // A Shield choice is always a single concealed card. Submit it immediately
  // once its pip is clicked: this avoids a second confirmation and makes the
  // visible positional choice the complete player action.
  const onShieldCardClick = useCallback(
    (cardId: string) => {
      if (
        draft.input?.kind === "entity-selection" &&
        draft.input.min === 1 &&
        draft.input.max === 1 &&
        draft.candidateIds.has(cardId)
      ) {
        draft.toggleEntity(draft.input.id, cardId);
        return;
      }
      onPlayCardClick(cardId);
    },
    [draft, onPlayCardClick],
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
      removalArea={removalArea}
      availableResources={availableResources}
      handCount={handCount}
      isViewer={isViewer}
      isTurn={isTurn}
      isPriority={isPriority}
      selectedCardIds={selectedCardIds}
      highlightCardIds={highlightCardIds}
      onPlayCardClick={draft.boardInteractionEnabled ? onPlayCardClick : undefined}
      onShieldCardClick={draft.boardInteractionEnabled ? onShieldCardClick : undefined}
      onResourceCardClick={draft.boardInteractionEnabled ? onPlayCardClick : undefined}
      onHandCardDrop={isViewer && draft.boardInteractionEnabled ? onHandCardDrop : undefined}
      pilotDropTargetIds={isViewer ? pilotDropTargetIds : undefined}
      pilotLinkTargetIds={isViewer ? pilotLinkTargetIds : undefined}
      attackDragSources={attackDragSources}
      timeoutOverlay={
        opponentClockSnapshot ? (
          <OpponentTimeoutOverlayContainer
            snapshot={opponentClockSnapshot}
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
