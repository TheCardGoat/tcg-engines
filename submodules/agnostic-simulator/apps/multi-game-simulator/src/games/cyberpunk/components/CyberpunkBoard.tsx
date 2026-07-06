import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import type { SimulatorRendererProps } from "@tcg/simulator-contract";

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
import { CyberpunkInteractionPanel } from "./CyberpunkInteractionPanel";
import { DebugPanelProvider } from "./DebugPanel";
import {
  getGearAttachTargets,
  getProgramSpatialTargets,
  interactionActionIsAvailable,
  interactionViewHasAttacker,
  mapDropToAction,
  otherSide,
  PLAYER_SIDE_TO_ID,
  useEngine,
  useEngineInteractionView,
  useEngineOptional,
  useSideZones,
  type CardDropEvent,
  type Side,
} from "../engine";
import classes from "./CyberpunkBoard.module.css";

export function CyberpunkBoard({ fixture, onSubmitInteraction }: SimulatorRendererProps) {
  const { humanSide } = useEngine();
  const rivalSide = otherSide(humanSide);
  const isNarrow = useMediaQuery("(max-width: 768px)");
  const forceMobile =
    typeof window !== "undefined" && new URLSearchParams(window.location.search).has("mobile");
  const mobile = forceMobile || Boolean(isNarrow);

  return (
    <div className={classes.root}>
      <DebugPanelProvider>
        <GameStateProvider>
          <AttackSelectionProvider>
            <MoveSelectionProvider>
              <DragDropProvider>
                <DropDispatchBridge />
                <SelectionReset side={humanSide} />
                {mobile ? (
                  <MobileBoard />
                ) : (
                  <DesktopBoard
                    humanSide={humanSide}
                    rivalSide={rivalSide}
                    fixture={fixture}
                    onSubmitInteraction={onSubmitInteraction}
                  />
                )}
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
  const boardWrapRef = useRef<HTMLDivElement | null>(null);
  const [fixerCollapsed, setFixerCollapsed] = useState(false);
  const toggleFixerCollapsed = () => setFixerCollapsed((v) => !v);
  const rivalZones = useSideZones(rivalSide);
  const { prioritySide } = useEngine();

  return (
    <div className={classes.boardWrap} ref={boardWrapRef} data-sim-board data-testid="board-wrap">
      <div className={classes.boardShell}>
        <div
          className={classes.opponentSide}
          data-side={rivalSide}
          data-priority={prioritySide === rivalSide ? "true" : "false"}
        >
          <GameBoard
            opponent
            side={rivalSide}
            fixerCollapsed={fixerCollapsed}
            onToggleFixerCollapsed={toggleFixerCollapsed}
          />
        </div>
        <div className={classes.centerWrapper}>
          <CenterRow gigsOnly spaciousGigs />
        </div>
        <div
          className={classes.playerSide}
          data-side={humanSide}
          data-priority={prioritySide === humanSide ? "true" : "false"}
        >
          <GameBoard
            side={humanSide}
            fixerCollapsed={fixerCollapsed}
            onToggleFixerCollapsed={toggleFixerCollapsed}
          />
        </div>
      </div>
      <CombatArrowOverlay containerRef={boardWrapRef} />
      <div className={classes.handTop}>
        <HandZone faceDown cardCount={rivalZones.hand.length} side={rivalSide} />
      </div>
      <div className={classes.handBottom}>
        <HumanHand side={humanSide} />
      </div>
      {/*
        Player action panel re-homed from the dedicated right-hand MobileShell
        column into a floating overlay anchored just above the self hand. The
        shared InteractionPanel (with aria-label="Interaction panel" and the
        interaction-card/submit testids) stays mounted inside
        CyberpunkInteractionPanel's test-only wrapper so the test harness —
        which forces a 1440px desktop width — can still drive actions. Desktop
        board only; the mobile tabbed shell still owns interactions < 768px.
      */}
      <div className={classes.actionPanelFloating}>
        <CyberpunkInteractionPanel fixture={fixture} onSubmitInteraction={onSubmitInteraction} />
      </div>
    </div>
  );
}

function HumanHand({ side }: { side: Side }) {
  const zones = useSideZones(side);
  return (
    <HandZone
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
      }))}
      side={side}
      availableEddies={zones.eddies}
    />
  );
}

function DropDispatchBridge() {
  const { registerCardDropHandler } = useDragDrop();
  const engine = useEngineOptional();
  const moveSelection = useMoveSelection();
  const humanSide = engine?.humanSide ?? "player";
  const humanZones = useSideZones(humanSide);
  const humanInteractionView = useEngineInteractionView(humanSide);

  const engineRef = useRef(engine);
  const zonesRef = useRef(humanZones);
  const interactionViewRef = useRef(humanInteractionView);
  const sideRef = useRef<Side>(humanSide);
  const selectionRef = useRef(moveSelection);

  engineRef.current = engine;
  zonesRef.current = humanZones;
  interactionViewRef.current = humanInteractionView;
  sideRef.current = humanSide;
  selectionRef.current = moveSelection;

  useEffect(() => {
    const handle = (event: CardDropEvent) => {
      const e = engineRef.current;
      if (!e || !event.source.cardId) {
        return;
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
        const programTargets = getProgramSpatialTargets(
          {
            matchState: e.matchState,
            side: ctx.humanSide,
            interactionView: ctx.interactionView,
          },
          event.source.cardId,
        );
        if (programTargets.includes(event.target.cardId)) {
          const as = PLAYER_SIDE_TO_ID[ctx.humanSide];
          const result = e.dispatch({ type: "playCard", cardId: event.source.cardId, as });
          if (result.success) {
            e.dispatch({
              type: "resolveEffectTarget",
              targetIds: [event.target.cardId],
              as,
            });
          }
          selectionRef.current.clearSelection();
          return;
        }
      }
      if (
        event.source.zone === "p-hand" &&
        event.target.type === "zone" &&
        event.target.zone === "p-field"
      ) {
        const attachTargets = getGearAttachTargets(ctx, event.source.cardId, sourceCard?.cardType);
        if (sourceCard?.cardType === "gear" && attachTargets.length > 0) {
          selectionRef.current.setSelection({
            side: ctx.humanSide,
            moveId: "playCard",
            sourceCardId: event.source.cardId,
            sourceCardType: sourceCard.cardType,
          });
          return;
        }
        const programTargets = getProgramSpatialTargets(
          {
            matchState: e.matchState,
            side: ctx.humanSide,
            interactionView: ctx.interactionView,
          },
          event.source.cardId,
        );
        if (sourceCard?.cardType === "program" && programTargets.length > 0) {
          selectionRef.current.setSelection({
            side: ctx.humanSide,
            moveId: "playCard",
            sourceCardId: event.source.cardId,
            sourceCardType: sourceCard.cardType,
          });
          return;
        }
      }
      const action = mapDropToAction(event, ctx);
      if (!action) {
        return;
      }
      e.dispatch(action);
      selectionRef.current.clearSelection();
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
