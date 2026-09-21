import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import type { SimulatorRendererProps } from "@tcg/simulator-contract";
import type { DropDisposition } from "@tcg/simulator-ui";
import type { EngineInteractionView } from "@tcg/protocol";
import type { ChoicePrompt, PlayerPrompt } from "@tcg/cyberpunk-engine";

import {
  AttackSelectionProvider,
  CenterRow,
  CombatArrowOverlay,
  DragDropProvider,
  GameBoard,
  GameStateProvider,
  HandZone,
  MobileBoard,
  MoveSelectionProvider,
  useAttackSelection,
  useDragDrop,
  useMoveSelection,
} from "./GameBoard";
import { OpponentDisconnectOverlay } from "./GameBoard/OpponentDisconnectOverlay";
import { useGameClock } from "./GameBoard/useGameClock";
import { CyberpunkInteractionPanel } from "./CyberpunkInteractionPanel";
import { useCyberpunkBoardRuntime } from "./BoardRuntimeContext";
import { DebugPanelProvider } from "./DebugPanel";
import {
  interactionActionIsAvailable,
  interactionViewHasAttacker,
  mapDropToAction,
  otherSide,
  PLAYER_SIDE_TO_ID,
  useEngine,
  useEngineInteractionView,
  useEngineOptional,
  useUserConfig,
  useSideZones,
  handContainsPrivateCards,
  type CardDropEvent,
  type Side,
} from "../engine";
import { connectionUiStatus } from "../engine/live/playerConnectionState";
import classes from "./CyberpunkBoard.module.css";
import { useTemporaryRevealedHandCardIds } from "./GameBoard/temporaryHandReveals";
import { CyberpunkCardContextController } from "./CardContext/CyberpunkCardContextController";
import { BoardCorrectionStrip } from "./GameBoard/BoardCorrectionStrip";
import { usePaymentSelection } from "./PaymentSelection/PaymentSelectionContext";

const CYBERPUNK_MOBILE_BREAKPOINT_PX = 767;

export function CyberpunkBoard({ fixture, onSubmitInteraction }: SimulatorRendererProps) {
  const { humanSide } = useEngine();
  const { fieldCardSize } = useUserConfig();
  const boardRuntime = useCyberpunkBoardRuntime();
  const rivalSide = otherSide(humanSide);
  const [clientReady, setClientReady] = useState(false);
  const isNarrow = useMediaQuery(`(max-width: ${CYBERPUNK_MOBILE_BREAKPOINT_PX}px)`);
  const isShortCoarseViewport = useMediaQuery("(pointer: coarse) and (max-height: 520px)");
  useEffect(() => {
    setClientReady(true);
  }, []);
  const forceMobile =
    clientReady &&
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("mobile");
  const mobile =
    clientReady && (forceMobile || Boolean(isNarrow) || Boolean(isShortCoarseViewport));

  return (
    <div className={classes.root} data-field-card-size={fieldCardSize}>
      <DebugPanelProvider>
        <GameStateProvider>
          <AttackSelectionProvider>
            <MoveSelectionProvider>
              <DragDropProvider>
                <CyberpunkCardContextController fixture={fixture}>
                  <BoardCorrectionStrip />
                  <DropDispatchBridge />
                  <SelectionReset side={humanSide} />
                  {mobile ? (
                    <MobileBoard
                      playerIdentities={boardRuntime.playerIdentities}
                      playerConnections={boardRuntime.playerConnections}
                      connectionDiagnostic={boardRuntime.connectionDiagnostic}
                      onClaimRivalDrop={boardRuntime.onClaimRivalDrop}
                      liveMatchSidebar={boardRuntime.liveMatchSidebar}
                    />
                  ) : (
                    <DesktopBoard
                      humanSide={humanSide}
                      rivalSide={rivalSide}
                      fixture={fixture}
                      onSubmitInteraction={onSubmitInteraction}
                    />
                  )}
                </CyberpunkCardContextController>
              </DragDropProvider>
            </MoveSelectionProvider>
          </AttackSelectionProvider>
        </GameStateProvider>
      </DebugPanelProvider>
    </div>
  );
}

interface DesktopBoardProps {
  humanSide: Side;
  rivalSide: Side;
  fixture: SimulatorRendererProps["fixture"];
  onSubmitInteraction: SimulatorRendererProps["onSubmitInteraction"];
}

function DesktopBoard({ humanSide, rivalSide, fixture, onSubmitInteraction }: DesktopBoardProps) {
  const boardRuntime = useCyberpunkBoardRuntime();
  const boardWrapRef = useRef<HTMLDivElement | null>(null);
  const [fixerCollapsed, setFixerCollapsed] = useState(false);
  const [promptPlacement, setPromptPlacement] = useState<"player" | "rival">("player");
  const toggleFixerCollapsed = () => setFixerCollapsed((v) => !v);
  const togglePromptPlacement = () =>
    setPromptPlacement((placement) => (placement === "player" ? "rival" : "player"));
  const rivalZones = useSideZones(rivalSide);
  const rivalRevealedHandCardIds = useTemporaryRevealedHandCardIds(
    rivalSide,
    rivalZones.hand.map((card) => card.cardId),
  );
  const { interactionViews, matchState, activeSide, prioritySide, prompts } = useEngine();
  const clock = useGameClock(prioritySide, { paused: matchState.G.gameEnded });
  const promptResetKey = promptIdentityKey(prompts[humanSide], interactionViews[humanSide]);
  const selfConnectionStatus = connectionUiStatus(boardRuntime.playerConnections?.[humanSide]);
  const rivalConnectionStatus = connectionUiStatus(boardRuntime.playerConnections?.[rivalSide]);
  const rivalTimeoutExpired = Boolean(
    boardRuntime.onClaimRivalDrop &&
    !matchState.G.gameEnded &&
    selfConnectionStatus === "connected" &&
    rivalConnectionStatus === "connected" &&
    clock[rivalSide].seconds <= 0,
  );

  useEffect(() => {
    setPromptPlacement("player");
  }, [promptResetKey]);

  return (
    <div className={classes.boardWrap} ref={boardWrapRef} data-sim-board data-testid="board-wrap">
      <div className={classes.boardShell}>
        <div
          className={classes.opponentSide}
          data-side={rivalSide}
          data-priority={prioritySide === rivalSide ? "true" : "false"}
          data-turn={activeSide === rivalSide ? "true" : "false"}
        >
          {prioritySide === rivalSide && !matchState.G.gameEnded ? (
            <div
              className={classes.priorityCue}
              data-testid="priority-cue-opponent"
              aria-hidden="true"
            />
          ) : null}
          <GameBoard
            opponent
            side={rivalSide}
            fixerCollapsed={fixerCollapsed}
            onToggleFixerCollapsed={toggleFixerCollapsed}
          />
          <OpponentDisconnectOverlay
            variant="opponent"
            connection={boardRuntime.playerConnections?.[rivalSide]}
            onClaimDrop={boardRuntime.onClaimRivalDrop}
            claimAvailable={Boolean(boardRuntime.onClaimRivalDrop)}
            timeoutExpired={rivalTimeoutExpired}
            dropEligibility={boardRuntime.dropEligibility}
          />
        </div>
        <div className={classes.centerWrapper}>
          <CenterRow gigsOnly spaciousGigs />
        </div>
        <div
          className={classes.playerSide}
          data-side={humanSide}
          data-priority={prioritySide === humanSide ? "true" : "false"}
          data-turn={activeSide === humanSide ? "true" : "false"}
        >
          {prioritySide === humanSide && !matchState.G.gameEnded ? (
            <div
              className={classes.priorityCue}
              data-testid="priority-cue-player"
              aria-hidden="true"
            />
          ) : null}
          <GameBoard
            side={humanSide}
            fixerCollapsed={fixerCollapsed}
            onToggleFixerCollapsed={toggleFixerCollapsed}
          />
        </div>
      </div>
      <CombatArrowOverlay containerRef={boardWrapRef} />
      <div className={classes.handTop} data-testid="opponent-hand-overlay">
        <HandZone
          opponent
          faceDown
          cards={rivalZones.hand.map((c) => ({
            imageUrl: c.imageUrl,
            name: c.name,
            cardId: c.cardId,
            definitionId: c.definitionId,
            cardType: c.cardType,
            color: c.color,
            effectiveRules: c.effectiveRules,
            rulesText: c.rulesText,
            classifications: c.classifications,
            keywords: c.keywords,
            hasSellTag: c.hasSellTag,
            cost: c.cost,
            effectiveCost: c.effectiveCost,
            costEffects: c.costEffects,
            power: c.power,
            effectivePower: c.effectivePower,
            activeEffects: c.activeEffects,
            temporaryRevealed: rivalRevealedHandCardIds.has(c.cardId),
          }))}
          cardCount={rivalZones.hand.length}
          side={rivalSide}
        />
      </div>
      <div className={classes.handBottom} data-testid="player-hand-dock">
        <HumanHand side={humanSide} />
      </div>
      {/*
        Player action panel re-homed from the former dedicated right-hand shell
        column into a floating overlay anchored just above the self hand. The
        shared InteractionPanel (with aria-label="Interaction panel" and the
        interaction-card/submit testids) stays mounted inside
        CyberpunkInteractionPanel's test-only wrapper so the test harness —
        which forces a 1440px desktop width — can still drive actions. Desktop
        board only; the mobile board owns interactions below the shell breakpoint.
      */}
      <div
        className={classes.actionPanelFloating}
        data-prompt-placement={promptPlacement}
        data-testid="desktop-action-panel-floating"
      >
        <CyberpunkInteractionPanel
          fixture={fixture}
          onSubmitInteraction={onSubmitInteraction}
          promptPlacement={promptPlacement}
          onTogglePromptPlacement={togglePromptPlacement}
        />
      </div>
    </div>
  );
}

function promptIdentityKey(prompt: PlayerPrompt, interactionView: EngineInteractionView): string {
  const requestId = currentTargetPromptRequestId(interactionView);
  if (requestId) {
    return `request:${requestId}`;
  }
  return `native:${prompt.status}:${choiceIdentityKey(prompt.choice)}`;
}

function currentTargetPromptRequestId(interactionView: EngineInteractionView): string | null {
  const targetAction = interactionView.actions.find(
    (action) =>
      action.enabled &&
      (action.id === "resolveEffectTarget" ||
        action.id === "resolveDiscardFromHand" ||
        action.id === "resolveCardToMove" ||
        action.id === "resolveCardToPlay" ||
        action.id === "resolveCardTypeChoice" ||
        action.id === "resolveStealGigs" ||
        action.id === "gainGig"),
  );
  return targetAction?.requestId ?? null;
}

function choiceIdentityKey(choice: ChoicePrompt | null): string {
  if (!choice) {
    return "none";
  }
  switch (choice.type) {
    case "chooseTarget":
      return [
        choice.type,
        choice.chooserId,
        choice.payload.type,
        choice.payload.source?.cardId ?? "no-source",
        choice.payload.targetKind ?? "target",
        choice.payload.eligibleIds?.join(",") ?? "no-eligible",
      ].join(":");
    case "chooseCardToMove":
      return [
        choice.type,
        choice.chooserId,
        choice.payload.source?.cardId ?? "no-source",
        choice.payload.destination ?? "no-destination",
        choice.payload.cardIds.join(","),
      ].join(":");
    case "chooseCardToPlay":
      return [choice.type, choice.chooserId, choice.payload.cardIds.join(",")].join(":");
    case "chooseCardType":
      return [choice.type, choice.chooserId, choice.payload.source?.cardId ?? "no-source"].join(
        ":",
      );
    case "chooseGigsToSteal":
      return [
        choice.type,
        choice.chooserId,
        choice.payload.attackerId,
        choice.payload.eligibleDice.map((die) => die.dieId).join(","),
      ].join(":");
    case "gainGig":
      return [choice.type, choice.chooserId, choice.payload.allowedDieIds.join(",")].join(":");
    case "chooseTrigger":
      return [
        choice.type,
        choice.chooserId,
        choice.payload.options.map((option) => option.triggerId).join(","),
      ].join(":");
    case "chooseEffect":
      return [
        choice.type,
        choice.chooserId,
        choice.payload.options.map((option) => option.id).join(","),
      ].join(":");
    case "revealDestination":
      return [
        choice.type,
        choice.chooserId,
        choice.payload.source?.cardId ?? "no-source",
        choice.payload.revealedCardIds.join(","),
      ].join(":");
    case "scry":
      return [
        choice.type,
        choice.chooserId,
        choice.payload.source?.cardId ?? "no-source",
        choice.payload.revealedCardIds.join(","),
      ].join(":");
    case "preventGigSteal":
      return [
        choice.type,
        choice.chooserId,
        choice.payload.attackerId,
        choice.payload.stealEntries.map((entry) => entry.dieId).join(","),
      ].join(":");
    case "redirectDefeat":
      return [
        choice.type,
        choice.chooserId,
        choice.payload.protectedCardId,
        choice.payload.replacementCardId,
      ].join(":");
    case "chooseSacrificialGear":
      return [
        choice.type,
        choice.chooserId,
        choice.payload.hostId,
        choice.payload.gearIds.join(","),
      ].join(":");
    case "chooseFirstPlayer":
      return [choice.type, choice.chooserId].join(":");
    default:
      return choice satisfies never;
  }
}

function HumanHand({ side }: { side: Side }) {
  const zones = useSideZones(side);
  const { viewerCanSeePrivateHand } = useCyberpunkBoardRuntime();
  const faceDown = viewerCanSeePrivateHand === false && handContainsPrivateCards(zones.hand);
  return (
    <HandZone
      faceDown={faceDown}
      cards={zones.hand.map((c) => ({
        imageUrl: c.imageUrl,
        name: c.name,
        cardId: c.cardId,
        definitionId: c.definitionId,
        cardType: c.cardType,
        color: c.color,
        effectiveRules: c.effectiveRules,
        rulesText: c.rulesText,
        classifications: c.classifications,
        keywords: c.keywords,
        hasSellTag: c.hasSellTag,
        cost: c.cost,
        effectiveCost: c.effectiveCost,
        costEffects: c.costEffects,
        power: c.power,
        effectivePower: c.effectivePower,
        activeEffects: c.activeEffects,
        temporaryRevealed: c.revealed === true,
      }))}
      side={side}
      availableEddies={zones.eddies}
    />
  );
}

function DropDispatchBridge() {
  const { registerCardDropHandler, programTargets, gearTargets } = useDragDrop();
  const engine = useEngineOptional();
  const { dispatchCostedAction } = usePaymentSelection();
  const moveSelection = useMoveSelection();
  const humanSide = engine?.humanSide ?? "player";
  const humanZones = useSideZones(humanSide);
  const humanInteractionView = useEngineInteractionView(humanSide);

  const engineRef = useRef(engine);
  const zonesRef = useRef(humanZones);
  const interactionViewRef = useRef(humanInteractionView);
  const sideRef = useRef<Side>(humanSide);
  const selectionRef = useRef(moveSelection);
  // The drop handler effect does not depend on the gate, so read it through a
  // ref — a captured dispatchCostedAction would go stale on arm/mode changes.
  const costedDispatchRef = useRef(dispatchCostedAction);
  const targetsRef = useRef({ programTargets, gearTargets });
  targetsRef.current = { programTargets, gearTargets };

  engineRef.current = engine;
  zonesRef.current = humanZones;
  interactionViewRef.current = humanInteractionView;
  sideRef.current = humanSide;
  selectionRef.current = moveSelection;
  costedDispatchRef.current = dispatchCostedAction;

  useEffect(() => {
    const handle = (event: CardDropEvent): DropDisposition => {
      const e = engineRef.current;
      if (!e || !event.source.cardId) {
        return { kind: "rejected" };
      }
      const ctx = {
        humanSide: sideRef.current,
        humanZones: zonesRef.current,
        interactionView: interactionViewRef.current,
      };
      const sourceCard = ctx.humanZones.hand.find((c) => c.cardId === event.source.cardId);
      if (
        sourceCard?.cardType === "program" &&
        event.source.zone === "p-hand" &&
        event.target.type === "card" &&
        event.target.cardId
      ) {
        if (targetsRef.current.programTargets.has(event.target.cardId)) {
          const as = PLAYER_SIDE_TO_ID[ctx.humanSide];
          const targetId = event.target.cardId;
          const accepted = costedDispatchRef.current(
            { type: "playCard", cardId: event.source.cardId, as },
            (result) => {
              if (result.success)
                e.dispatch({ type: "resolveEffectTarget", targetIds: [targetId], as });
            },
          );
          if (accepted) selectionRef.current.clearSelection();
          return { kind: accepted ? "accepted" : "rejected" };
        }
      }
      if (
        event.source.zone === "p-hand" &&
        event.target.type === "zone" &&
        event.target.zone === "p-field"
      ) {
        if (sourceCard?.cardType === "gear" && targetsRef.current.gearTargets.size > 0) {
          selectionRef.current.setSelection({
            side: ctx.humanSide,
            moveId: "playCard",
            sourceCardId: event.source.cardId,
            sourceCardType: sourceCard.cardType,
          });
          return { kind: "accepted" };
        }
        if (sourceCard?.cardType === "program" && targetsRef.current.programTargets.size > 0) {
          selectionRef.current.setSelection({
            side: ctx.humanSide,
            moveId: "playCard",
            sourceCardId: event.source.cardId,
            sourceCardType: sourceCard.cardType,
          });
          return { kind: "accepted" };
        }
      }
      const action = mapDropToAction(event, ctx);
      if (!action) {
        return { kind: "rejected" };
      }
      if (action.type === "playCard" || action.type === "callLegend" || action.type === "goSolo") {
        const accepted = costedDispatchRef.current(action);
        if (accepted) selectionRef.current.clearSelection();
        return { kind: accepted ? "accepted" : "rejected" };
      }
      const result = e.dispatch(action);
      if (result.success) selectionRef.current.clearSelection();
      return { kind: result.success ? "accepted" : "rejected" };
    };
    registerCardDropHandler(handle);
    return () => registerCardDropHandler(null);
  }, [registerCardDropHandler]);

  return null;
}

function SelectionReset({ side }: { side: Side }) {
  const interactionView = useEngineInteractionView(side);
  const { selection, clearSelection } = useMoveSelection();
  const attackSelection = useAttackSelection();

  useEffect(() => {
    if (!selection || selection.side !== side) {
      return;
    }
    if (interactionView.status !== "ready") {
      clearSelection();
      return;
    }
    const stillAvailable = interactionActionIsAvailable(interactionView, selection.moveId);
    if (!stillAvailable) {
      clearSelection();
    }
  }, [clearSelection, interactionView, selection, side]);

  useEffect(() => {
    const pending = attackSelection.selection;
    if (!pending || pending.side !== side) {
      return;
    }
    if (interactionView.status !== "ready") {
      attackSelection.clearSelection();
      return;
    }
    const attackerStillAvailable = interactionViewHasAttacker(interactionView, pending.attackerId);
    if (!attackerStillAvailable) {
      attackSelection.clearSelection();
    }
  }, [attackSelection, interactionView, side]);

  return null;
}
