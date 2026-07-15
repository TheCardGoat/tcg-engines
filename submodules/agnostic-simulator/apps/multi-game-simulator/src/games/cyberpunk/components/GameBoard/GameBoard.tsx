import { useCallback, useMemo, useState, type MouseEvent as ReactMouseEvent } from "react";
import { Modal } from "@mantine/core";
import type {
  SimulatorEntity,
  SimulatorTable,
  SimulatorTargetFilter,
} from "@tcg/simulator-contract";
import { TargetFilterModal } from "@tcg/simulator-ui";
import { BoardContextMenu, type BoardContextMenuAction } from "./BoardContextMenu";
import { DeckZone } from "./DeckZone";
import { EddiesZone } from "./EddiesZone";
import { FieldZone } from "./FieldZone";
import { FixerZone } from "./FixerZone";
import { LegendsZone } from "./LegendsZone";
import { PInfoZone } from "./PInfoZone";
import { TrashZone } from "./TrashZone";
import { useGameState } from "./gameStateContext";
import { useMoveSelectionForSide } from "./MoveSelectionContext";
import { ClockDisplay, PassTurnControl } from "./CenterRow";
import {
  PLAYER_SIDE_TO_ID,
  useBoardMode,
  useEngine,
  type MoveLogEntry,
  type Side,
} from "../../engine";
import { useSideZones } from "../../engine/zoneViews";
import { useLastSoldCardForSide } from "./useLastSoldCard";
import classes from "./GameBoard.module.css";

interface GameBoardProps {
  /**
   * Visual layout flag — when true, renders the top-half (rival) layout
   * (banner top, fixer top, etc.). Independent of which engine `side` the
   * board reads from, so a Take Control flip can keep the rival layout while
   * pointing at the new rival's data.
   */
  opponent?: boolean;
  /**
   * Engine side to project. Defaults to deriving from `opponent` (so legacy
   * callers without seat-flipping behave as before). After Take Control,
   * Board.page.tsx passes the current rival/human side explicitly.
   */
  side?: Side;
  /** Banner state for the BoardContextMenu (banner lives at boardWrap level). */
  bannerState?: {
    minimized: boolean;
    position: "top" | "bottom";
    toggleMinimized: () => void;
    togglePosition: () => void;
  };
  fixerCollapsed?: boolean;
  onToggleFixerCollapsed?: () => void;
}

export function GameBoard({
  opponent = false,
  side: sideProp,
  bannerState,
  fixerCollapsed = false,
  onToggleFixerCollapsed,
}: GameBoardProps) {
  const { activeSide, phase, gameEnded, winnerSide, winReason, advancePhase } = useGameState();
  const side: Side = sideProp ?? (opponent ? "opponent" : "player");
  const isActive = activeSide === side;
  const mode = useBoardMode(side);
  const selectedMove = useMoveSelectionForSide(side);
  const visualMode = mode === "select-action" && selectedMove ? "select-target" : mode;
  const zones = useSideZones(side);
  const { moveLogs, matchState, canUndo, canUndoToTurnStart, dispatch } = useEngine();
  const lastSold = useLastSoldCardForSide(moveLogs, side);
  const peekedLegends = usePeekedLegendsForSide(
    moveLogs,
    side,
    matchState.G.turnMetadata.turnNumber,
  );

  const fieldUnits = zones.field.map((c) => ({
    imageUrl: c.imageUrl,
    name: c.name,
    cardId: c.cardId,
    definitionId: c.definitionId,
    cardType: c.cardType,
    color: c.color,
    tapped: c.spent,
    playedThisTurn: c.playedThisTurn,
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
    gear: c.attachedGear.map((g) => ({
      imageUrl: g.imageUrl,
      name: g.name,
      cardId: g.cardId,
      definitionId: g.definitionId,
      cardType: g.cardType,
      cost: g.cost,
      effectiveCost: g.effectiveCost,
      costEffects: g.costEffects,
      power: g.power,
      effectivePower: g.effectivePower,
      rulesText: g.rulesText,
      classifications: g.classifications,
      keywords: g.keywords,
      effectiveRules: g.effectiveRules,
      activeEffects: g.activeEffects,
      hasSellTag: g.hasSellTag,
    })),
  }));
  const legendCards = zones.legendArea.map((c, index) => ({
    imageUrl: c.imageUrl,
    name: c.name,
    cardId: c.cardId,
    definitionId: c.definitionId,
    cardType: c.cardType,
    color: c.color,
    faceDown: c.faceDown,
    spent: c.spent,
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
    gear: c.attachedGear.map((g) => ({
      imageUrl: g.imageUrl,
      name: g.name,
      cardId: g.cardId,
      definitionId: g.definitionId,
      cardType: g.cardType,
      cost: g.cost,
      effectiveCost: g.effectiveCost,
      costEffects: g.costEffects,
      power: g.power,
      effectivePower: g.effectivePower,
      rulesText: g.rulesText,
      classifications: g.classifications,
      keywords: g.keywords,
      effectiveRules: g.effectiveRules,
      activeEffects: g.activeEffects,
      hasSellTag: g.hasSellTag,
    })),
    peeked: c.faceDown && (peekedLegends.ids.has(c.cardId) || peekedLegends.indexes.has(index)),
  }));
  const readyLegendCount = zones.legendArea.filter((c) => !c.spent).length;
  const availableEddieCount = zones.eddies + readyLegendCount;
  const eddieCardCount = Math.max(zones.eddieCardCount, zones.eddies + zones.spentEddies);
  const totalEddieCount = eddieCardCount + zones.legendArea.length;

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [confirmingConcede, setConfirmingConcede] = useState(false);
  const [trashViewerOpen, setTrashViewerOpen] = useState(false);
  const trashViewerOwnerId = String(PLAYER_SIDE_TO_ID[side]);
  const trashViewerZoneId = opponent ? "opp-trash" : "p-trash";
  const trashViewerFilter = useMemo<SimulatorTargetFilter>(
    () => ({
      kind: "entity",
      entityKind: "card",
      ownerId: trashViewerOwnerId,
      zoneId: trashViewerZoneId,
      includeHidden: true,
    }),
    [trashViewerOwnerId, trashViewerZoneId],
  );
  const trashViewerTable = useMemo<SimulatorTable>(
    () => buildTrashViewerTable(trashViewerOwnerId, trashViewerZoneId, zones.trash),
    [trashViewerOwnerId, trashViewerZoneId, zones.trash],
  );
  const trashViewerEntities = useMemo<SimulatorEntity[]>(
    () =>
      zones.trash.map((card) =>
        trashCardToSimulatorEntity(card, trashViewerOwnerId, trashViewerZoneId),
      ),
    [trashViewerOwnerId, trashViewerZoneId, zones.trash],
  );

  const handleContextMenu = useCallback((ev: ReactMouseEvent<HTMLDivElement>) => {
    // Skip if right-clicking on an interactive child that handles its own menu
    // (cards, buttons, links). Only fire on empty board space.
    const target = ev.target as HTMLElement;
    if (target.closest("button, a, [data-sim-entity-id], [role='menu'], [role='menuitem']")) {
      return;
    }
    ev.preventDefault();
    setContextMenu({ x: ev.clientX, y: ev.clientY });
  }, []);

  const contextMenuActions = useMemo<BoardContextMenuAction[]>(() => {
    return [
      {
        id: "pass-phase",
        label: isActive ? `Pass ${phase} phase` : "Pass phase",
        disabled: !isActive || gameEnded,
        run: () => advancePhase(),
      },
      {
        id: "undo",
        label: "Undo last move",
        disabled: !canUndo,
        run: () => dispatch({ type: "undo" }),
      },
      {
        id: "undo-turn-start",
        label: "Undo to turn start",
        disabled: !canUndoToTurnStart,
        run: () => dispatch({ type: "undoToTurnStart" }),
      },
      ...(bannerState
        ? [
            {
              id: "toggle-banner-position",
              label:
                bannerState.position === "bottom" ? "Move banner to top" : "Move banner to bottom",
              run: () => bannerState.togglePosition(),
            },
            {
              id: "toggle-banner-minimized",
              label: bannerState.minimized ? "Expand banner" : "Minimize banner",
              run: () => bannerState.toggleMinimized(),
            },
          ]
        : []),
      {
        id: "shortcuts",
        label: "Show keyboard shortcuts",
        run: () => {
          // Lightweight placeholder until a proper modal lands.
          alert(
            "Keyboard shortcuts:\n\n" +
              "Right-click empty board — open this menu\n" +
              "Space — advance the phase button\n" +
              "Esc — close menus / cancel selection\n" +
              "Click card — open card actions",
          );
        },
      },
      {
        id: "concede",
        label: "Concede match",
        disabled: gameEnded,
        run: () => setConfirmingConcede(true),
      },
    ];
  }, [
    side,
    isActive,
    phase,
    gameEnded,
    advancePhase,
    canUndo,
    canUndoToTurnStart,
    dispatch,
    bannerState,
  ]);

  const modeClass =
    visualMode === "view"
      ? classes.modeView
      : visualMode === "select-action"
        ? classes.modeSelectAction
        : classes.modeSelectTarget;

  return (
    <div
      className={[
        classes.board,
        classes.boardWithBanner,
        opponent ? classes.opponent : "",
        fixerCollapsed ? classes.fixerCollapsed : "",
        isActive ? classes.active : classes.inactive,
        modeClass,
      ]
        .filter(Boolean)
        .join(" ")}
      data-testid="game-board"
      data-mode={visualMode}
      data-side={side}
      data-game-status={gameEnded ? "ended" : "active"}
      data-active-side={activeSide}
      data-phase={phase}
      data-fixer-collapsed={fixerCollapsed ? "true" : "false"}
      data-winner={
        gameEnded ? (winnerSide ? (winnerSide === side ? "you" : "rival") : "draw") : undefined
      }
      data-end-reason={gameEnded ? (winReason ?? undefined) : undefined}
      onContextMenu={handleContextMenu}
    >
      <FixerZone
        titlePosition={opponent ? "top" : "bottom"}
        dice={zones.fixerArea}
        side={side}
        collapsed={fixerCollapsed}
        onToggleCollapsed={onToggleFixerCollapsed}
      />
      <div className={classes.midCol}>
        <FieldZone units={fieldUnits} opponent={opponent} side={side} />
        <LegendsZone legends={legendCards} opponent={opponent} side={side} />
        <EddiesZone
          count={zones.eddies}
          cards={zones.eddieCards.map((c, i, arr) => ({
            cardId: c.cardId,
            definitionId: c.definitionId,
            spent: c.spent,
            revealed:
              (zones.soldThisTurn && !c.spent && i === arr.length - 1) ||
              c.cardId === lastSold?.cardId,
            imageUrl: c.imageUrl,
            name: c.name,
          }))}
          cardCount={eddieCardCount}
          spentCardCount={zones.spentEddies}
          availableCount={availableEddieCount}
          totalCount={totalEddieCount}
          opponent={opponent}
          side={side}
        />
      </div>
      <div className={classes.stackCol}>
        <PInfoZone opponent={opponent} phase={phase}>
          {opponent ? (
            <div className={classes.statusDock}>
              <ClockDisplay docked />
            </div>
          ) : (
            <div className={classes.actionDock}>
              <PassTurnControl docked />
            </div>
          )}
        </PInfoZone>
        <DeckZone count={zones.deckCount} opponent={opponent} side={side} />
        <TrashZone
          topCard={zones.trashTop ?? undefined}
          cards={zones.trash}
          opponent={opponent}
          side={side}
          count={zones.trashCount}
          onOpen={() => setTrashViewerOpen(true)}
        />
      </div>
      <TargetFilterModal
        opened={trashViewerOpen}
        title={opponent ? "Rival Trash" : "Your Trash"}
        filter={trashViewerFilter}
        table={trashViewerTable}
        entities={trashViewerEntities}
        emptyLabel="Trash is empty"
        classNames={{
          backdrop: classes.trashViewerBackdrop,
          sheet: classes.trashViewerSheet,
          header: classes.trashViewerHeader,
          title: classes.trashViewerTitle,
          subtitle: classes.trashViewerSubtitle,
          body: classes.trashViewerBody,
          closeButton: classes.trashViewerCloseButton,
        }}
        onClose={() => setTrashViewerOpen(false)}
      />
      {contextMenu ? (
        <BoardContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          actions={contextMenuActions}
          onClose={() => setContextMenu(null)}
        />
      ) : null}
      <ConfirmDialog
        opened={confirmingConcede && !gameEnded}
        title="Concede match?"
        body="This concedes the match and cannot be undone."
        cancelLabel="Keep playing"
        confirmLabel="Concede"
        onCancel={() => setConfirmingConcede(false)}
        onConfirm={() => {
          setConfirmingConcede(false);
          dispatch({ type: "concede", as: PLAYER_SIDE_TO_ID[side] });
        }}
      />
    </div>
  );
}

interface ConfirmDialogProps {
  opened: boolean;
  title: string;
  body: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  opened,
  title,
  body,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Modal
      opened={opened}
      onClose={onCancel}
      centered
      size={420}
      padding={0}
      withCloseButton={false}
      overlayProps={{ backgroundOpacity: 0.72, blur: 3 }}
      classNames={{
        content: classes.confirmDialogContent,
        body: classes.confirmDialogBody,
        header: classes.confirmDialogHeader,
      }}
      title={<span className={classes.confirmDialogTitle}>{title}</span>}
    >
      <p className={classes.confirmDialogText}>{body}</p>
      <div className={classes.confirmDialogActions}>
        <button type="button" className={classes.confirmDialogSecondary} onClick={onCancel}>
          {cancelLabel}
        </button>
        <button type="button" className={classes.confirmDialogPrimary} onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

interface TrashViewerCard {
  cardId: string;
  definitionId: string;
  imageUrl: string;
  name: string;
  cardType: string;
  color: string;
  spent: boolean;
  faceDown: boolean;
  cost: number | null;
  effectiveCost: number | null;
  power: number | null;
  effectivePower: number | null;
  classifications: readonly string[];
  keywords: readonly string[];
}

function buildTrashViewerTable(
  ownerId: string,
  zoneId: string,
  cards: readonly TrashViewerCard[],
): SimulatorTable {
  return {
    status: {
      activeSeatId: ownerId,
      phase: "Trash",
      stateVersion: 0,
      turn: 0,
    },
    seats: [
      {
        id: ownerId,
        label: "Owner",
        role: "human",
        perspective: "bottom",
        counters: [],
      },
    ],
    zones: [
      {
        id: zoneId,
        label: "Trash",
        role: "discard",
        ownerId,
        visibility: "public",
        entityIds: cards.map((card) => card.cardId),
        count: cards.length,
        hint: "Cards in trash",
        layoutHint: "grid",
      },
    ],
  };
}

function trashCardToSimulatorEntity(
  card: TrashViewerCard,
  ownerId: string,
  zoneId: string,
): SimulatorEntity {
  const stats = [
    card.effectiveCost !== null
      ? { label: "Cost", value: card.effectiveCost.toString() }
      : card.cost !== null
        ? { label: "Cost", value: card.cost.toString() }
        : null,
    card.effectivePower !== null
      ? { label: "Power", value: card.effectivePower.toString() }
      : card.power !== null
        ? { label: "Power", value: card.power.toString() }
        : null,
  ].filter((stat): stat is { label: string; value: string } => stat !== null);

  return {
    id: card.cardId,
    title: card.name,
    subtitle: card.cardType,
    kind: "card",
    ownerId,
    face: card.faceDown ? "hidden" : "public",
    states: [
      ...(card.spent ? (["rested"] as const) : []),
      ...(card.faceDown ? (["hidden"] as const) : []),
    ],
    stats,
    traits: [...card.classifications, ...card.keywords],
    imageUrl: card.imageUrl,
    frameStyle: { color: card.color },
    dataAttributes: {
      "data-zone-id": zoneId,
      "data-definition-id": card.definitionId,
      "data-card-name": card.name,
      "data-card-type": card.cardType,
      "data-card-color": card.color,
    },
  };
}

function usePeekedLegendsForSide(
  moveLogs: ReadonlyArray<MoveLogEntry>,
  side: Side,
  turnNumber: number,
): { ids: Set<string>; indexes: Set<number> } {
  const ownerId = String(PLAYER_SIDE_TO_ID[side]);
  return useMemo(() => {
    const ids = new Set<string>();
    const indexes = new Set<number>();
    for (const entry of moveLogs) {
      const log = entry.log;
      if (
        log.type !== "action" ||
        log.turnNumber !== turnNumber ||
        log.messageKey !== "trigger.targetResolved" ||
        log.params.sourceCardName !== "Kiroshi Optics" ||
        log.params.targetKind !== "legend" ||
        log.params.targetZone !== "legendArea" ||
        log.params.targetOwnerId !== ownerId ||
        typeof log.params.targetNames !== "string"
      ) {
        continue;
      }
      if (typeof log.params.targetId === "string") {
        ids.add(log.params.targetId);
      }
      if (typeof log.params.targetIndex === "number") {
        indexes.add(log.params.targetIndex);
      }
    }
    return { ids, indexes };
  }, [moveLogs, ownerId, turnNumber]);
}
