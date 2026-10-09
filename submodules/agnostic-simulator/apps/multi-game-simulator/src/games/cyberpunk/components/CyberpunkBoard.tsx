import { DropDispatchBridge, SelectionReset } from "./GameBoard/BoardInputController";
import { useEffect, useRef, useState } from "react";
import { logHandDebug, summarizeHandState } from "../engine/live/handVisibilityDiagnostics";
import { useMediaQuery } from "@mantine/hooks";
import { useSimulatorAuth } from "../../../simulator/providers";
import type { SimulatorRendererProps } from "@tcg/simulator-contract";
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
} from "./GameBoard";
import { OpponentDisconnectOverlay } from "./GameBoard/OpponentDisconnectOverlay";
import { useGameClock } from "./GameBoard/useGameClock";
import { rivalTimeoutExpired } from "./GameBoard/rivalTimeout";
import { CyberpunkInteractionPanel } from "./CyberpunkInteractionPanel";
import { useCyberpunkBoardRuntime } from "./BoardRuntimeContext";
import { DebugPanelProvider } from "./DebugPanel";
import {
  otherSide,
  useEngine,
  useUserConfig,
  useCyberpunkVisualSelection,
  useSideZones,
  handContainsHiddenIdentities,
  type Side,
} from "../engine";
import classes from "./CyberpunkBoard.module.css";
import { useTemporaryRevealedHandCardIds } from "./GameBoard/temporaryHandReveals";
import { CyberpunkCardContextController } from "./CardContext/CyberpunkCardContextController";
import { BoardCorrectionStrip } from "./GameBoard/BoardCorrectionStrip";
import { cyberpunkPlaymatSeatStyle, useCyberpunkFixturePlaymatId } from "../playmats";
import { resolveCyberpunkSeatVisuals, type CyberpunkSeatVisuals } from "../seatVisuals";
import { CardBackProvider } from "./GameBoard/CardImage";
import { PLAYER_SIDE_TO_ID } from "../engine";
import { CyberpunkZoneAnchor } from "../animation/CyberpunkZoneAnchor";

const CYBERPUNK_MOBILE_BREAKPOINT_PX = 767;

export function CyberpunkBoard({ fixture, onSubmitInteraction }: SimulatorRendererProps) {
  const { humanSide } = useEngine();
  const { fieldCardSize } = useUserConfig();
  const visual = useCyberpunkVisualSelection();
  const auth = useSimulatorAuth();
  const boardRuntime = useCyberpunkBoardRuntime();
  const rivalSide = otherSide(humanSide);
  const fixturePlaymatId = useCyberpunkFixturePlaymatId(true);
  const seatVisuals: Record<Side, CyberpunkSeatVisuals> = {
    player: resolveCyberpunkSeatVisuals({
      side: "player",
      humanSide,
      identity: boardRuntime.playerIdentities?.player,
      liveMatch: Boolean(boardRuntime.liveMatchSidebar),
      localPlayerId: boardRuntime.liveMatchSidebar?.localPlayerId,
      localVisual: visual,
      localSubscriptionTier: auth.subscriptionTier,
      fixturePlaymatId,
    }),
    opponent: resolveCyberpunkSeatVisuals({
      side: "opponent",
      humanSide,
      identity: boardRuntime.playerIdentities?.opponent,
      liveMatch: Boolean(boardRuntime.liveMatchSidebar),
      localPlayerId: boardRuntime.liveMatchSidebar?.localPlayerId,
      localVisual: visual,
      localSubscriptionTier: auth.subscriptionTier,
      fixturePlaymatId,
    }),
  };
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
    <CardBackProvider
      urls={{ player: seatVisuals.player.cardBackUrl, opponent: seatVisuals.opponent.cardBackUrl }}
    >
      <div className={classes.root} data-field-card-size={fieldCardSize}>
        <CyberpunkZoneAnchor
          zoneId="opp-removedFromGame"
          ownerId={String(PLAYER_SIDE_TO_ID[rivalSide])}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 72,
            height: 100,
            opacity: 0,
            pointerEvents: "none",
          }}
        />
        <CyberpunkZoneAnchor
          zoneId="p-removedFromGame"
          ownerId={String(PLAYER_SIDE_TO_ID[humanSide])}
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: 72,
            height: 100,
            opacity: 0,
            pointerEvents: "none",
          }}
        />
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
                        seatVisuals={seatVisuals}
                      />
                    ) : (
                      <DesktopBoard
                        humanSide={humanSide}
                        rivalSide={rivalSide}
                        fixture={fixture}
                        onSubmitInteraction={onSubmitInteraction}
                        seatVisuals={seatVisuals}
                      />
                    )}
                  </CyberpunkCardContextController>
                </DragDropProvider>
              </MoveSelectionProvider>
            </AttackSelectionProvider>
          </GameStateProvider>
        </DebugPanelProvider>
      </div>
    </CardBackProvider>
  );
}

interface DesktopBoardProps {
  humanSide: Side;
  rivalSide: Side;
  fixture: SimulatorRendererProps["fixture"];
  onSubmitInteraction: SimulatorRendererProps["onSubmitInteraction"];
  seatVisuals: Record<Side, CyberpunkSeatVisuals>;
}

function DesktopBoard({
  humanSide,
  rivalSide,
  fixture,
  onSubmitInteraction,
  seatVisuals,
}: DesktopBoardProps) {
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
  const clock = useGameClock();
  const promptResetKey = promptIdentityKey(prompts[humanSide], interactionViews[humanSide]);
  const isRivalTimeoutExpired = rivalTimeoutExpired({
    humanSide,
    rivalSide,
    playerConnections: boardRuntime.playerConnections,
    onClaimRivalDrop: boardRuntime.onClaimRivalDrop,
    gameEnded: matchState.G.gameEnded,
    rivalSeconds: clock[rivalSide].seconds,
  });
  const humanPlaymat = seatVisuals[humanSide].playmat;
  const rivalPlaymat = seatVisuals[rivalSide].playmat;

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
          data-playmat-id={rivalPlaymat.id}
          data-playmat-src={rivalPlaymat.src ?? ""}
          style={cyberpunkPlaymatSeatStyle(rivalPlaymat.src)}
        >
          {rivalPlaymat.src ? (
            <div className={`${classes.playmat} ${classes.playmatMirrored}`} aria-hidden="true" />
          ) : null}
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
            timeoutExpired={isRivalTimeoutExpired}
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
          data-playmat-id={humanPlaymat.id}
          data-playmat-src={humanPlaymat.src ?? ""}
          style={cyberpunkPlaymatSeatStyle(humanPlaymat.src)}
        >
          {humanPlaymat.src ? <div className={classes.playmat} aria-hidden="true" /> : null}
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
  const { matchState } = useEngine();
  const faceDown = handContainsHiddenIdentities(zones.hand);
  useEffect(() => {
    if (matchState.G.gamePhase !== "setup") return;
    logHandDebug("rendered-hand", {
      renderedSide: side,
      faceDown,
      state: summarizeHandState(matchState),
      renderedHandCount: zones.hand.length,
      hiddenIdentityCount: zones.hand.filter((card) => card.identityHidden).length,
      physicalFaceDownCount: zones.hand.filter((card) => card.faceDown).length,
      knownCostCount: zones.hand.filter((card) => card.cost !== null).length,
    });
  }, [side, faceDown, zones.hand, matchState]);
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
