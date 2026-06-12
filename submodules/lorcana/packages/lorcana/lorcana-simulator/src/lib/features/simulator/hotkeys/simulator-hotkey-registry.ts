import { m } from "$lib/i18n/messages.js";
import type {
  AvailableMovesSelectionState,
  ExecutableMovePresentationCategoryId,
  LorcanaCardSnapshot,
} from "@/features/simulator/model/contracts.js";
import {
  assignCardHotkeys,
  HAND_CARD_HOTKEYS,
  OPPONENT_HAND_HOTKEYS,
  OPPONENT_PLAY_HOTKEYS,
  PLAY_CARD_HOTKEYS,
  type SimulatorHotkeyCardZone,
  type SimulatorHotkeyDescriptor,
  type SimulatorHotkeyLayer,
} from "@/features/simulator/hotkeys/hotkey-bindings.js";

interface MoveCategorySummaryLike {
  categoryId: ExecutableMovePresentationCategoryId;
  categoryLabel: string;
}

interface PendingDirectMove {
  id: string;
  label: string;
  categoryId: "pass-turn" | "undo" | "quest-all";
  execute: () => void;
}

interface SimulatorHotkeyRegistryArgs {
  moveCategorySummaries: readonly MoveCategorySummaryLike[];
  selectionState: AvailableMovesSelectionState | null;
  pendingDirectMove: PendingDirectMove | null;
  /**
   * Set when a card has been "armed" — its quick-menu / context menu is open
   * and presenting action choices. While armed, the idle row hotkeys must be
   * suppressed so they don't double-fire alongside the menu's own bindings.
   */
  armedCardId: string | null;
  opponentPlayCards: readonly LorcanaCardSnapshot[];
  ownedPlayCards: readonly LorcanaCardSnapshot[];
  ownedHandCards: readonly LorcanaCardSnapshot[];
  /**
   * Cards in the opponent's hand that are currently selectable (e.g. a "look
   * at opponent's hand and discard one" effect). Empty under normal play; the
   * bottom row only activates when this list is populated.
   */
  opponentHandCards: readonly LorcanaCardSnapshot[];
  canBack: boolean;
  canCancel: boolean;
  canConfirm: boolean;
  openCommandPalette: () => void;
  cancel: () => void;
  back: () => void;
  confirm: () => void;
  runMoveCategory: (categoryId: ExecutableMovePresentationCategoryId) => void;
  inspectCard: (card: LorcanaCardSnapshot) => void;
  selectCard: (cardId: string) => void;
}

function isSelectableCardState(selectionState: AvailableMovesSelectionState | null): boolean {
  if (!selectionState) {
    return false;
  }

  return (
    selectionState.mode === "action" ||
    selectionState.mode === "resolution-target" ||
    selectionState.mode === "resolution-scry"
  );
}

function resolveActiveLayer(
  selectionState: AvailableMovesSelectionState | null,
  armedCardId: string | null,
): SimulatorHotkeyLayer {
  if (isSelectableCardState(selectionState)) {
    return "selecting";
  }
  if (armedCardId) {
    return "action-menu";
  }
  return "idle-browse";
}

export function buildSimulatorHotkeyDescriptors(
  args: SimulatorHotkeyRegistryArgs,
): SimulatorHotkeyDescriptor[] {
  const activeLayer = resolveActiveLayer(args.selectionState, args.armedCardId);

  const descriptors: SimulatorHotkeyDescriptor[] = [
    {
      id: "global-open-command-palette",
      hotkey: "Mod+K",
      label: m["sim.hotkeys.open"]({}),
      kind: "global",
      layer: "global",
      enabled: true,
      execute: args.openCommandPalette,
    },
    {
      id: "global-cancel",
      hotkey: "Escape",
      label: m["sim.actions.cancel"]({}),
      kind: "global",
      layer: "global",
      enabled: args.canCancel || Boolean(args.pendingDirectMove),
      execute: args.cancel,
    },
    {
      id: "global-back",
      hotkey: "Backspace",
      label: m["sim.actions.back"]({}),
      kind: "global",
      layer: "global",
      enabled: args.canBack,
      execute: args.back,
    },
    {
      id: "global-confirm",
      hotkey: "Enter",
      label: args.pendingDirectMove
        ? m["sim.actions.confirmMoveLabel"]({ label: args.pendingDirectMove.label })
        : m["sim.actions.confirm"]({}),
      kind: "global",
      layer: "global",
      enabled: args.canConfirm || Boolean(args.pendingDirectMove),
      execute: args.confirm,
    },
  ];

  const availableCategoryIds = new Set(
    args.moveCategorySummaries.map((summary) => summary.categoryId),
  );
  const passTurnSummary = args.moveCategorySummaries.find(
    (summary) => summary.categoryId === "pass-turn",
  );

  // Pass turn keeps a global binding because passing should always be one keystroke
  // away — there's no zone or selection layer it conflicts with.
  descriptors.push({
    id: "move:pass-turn",
    hotkey: "Space",
    label: passTurnSummary?.categoryLabel ?? m["sim.actions.label.passTurn"]({}),
    kind: "move",
    layer: "global",
    categoryId: "pass-turn",
    enabled: availableCategoryIds.has("pass-turn"),
    execute: () => args.runMoveCategory("pass-turn"),
  });

  const cardSelectionZone =
    activeLayer === "selecting"
      ? getSelectionZone(
          args.selectionState,
          args.opponentPlayCards,
          args.ownedPlayCards,
          args.ownedHandCards,
          args.opponentHandCards,
        )
      : null;

  pushCardDescriptors(descriptors, {
    cards: args.ownedHandCards,
    hotkeys: HAND_CARD_HOTKEYS,
    zone: "your-hand",
    idPrefix: "card:hand",
    activeLayer,
    cardSelectionZone,
    selectCard: args.selectCard,
    inspectCard: args.inspectCard,
  });

  pushCardDescriptors(descriptors, {
    cards: args.ownedPlayCards,
    hotkeys: PLAY_CARD_HOTKEYS,
    zone: "your-play",
    idPrefix: "card:play",
    activeLayer,
    cardSelectionZone,
    selectCard: args.selectCard,
    inspectCard: args.inspectCard,
  });

  pushCardDescriptors(descriptors, {
    cards: args.opponentPlayCards,
    hotkeys: OPPONENT_PLAY_HOTKEYS,
    zone: "opponent-play",
    idPrefix: "card:opponent",
    activeLayer,
    cardSelectionZone,
    selectCard: args.selectCard,
    inspectCard: args.inspectCard,
  });

  // Opponent's hand only gets keys when we actually have selectable cards there
  // (e.g. an effect that lets you peek at the opponent's hand). Otherwise the
  // row stays dark, which matches the strict-visibility rule.
  if (args.opponentHandCards.length > 0) {
    pushCardDescriptors(descriptors, {
      cards: args.opponentHandCards,
      hotkeys: OPPONENT_HAND_HOTKEYS,
      zone: "opponent-hand",
      idPrefix: "card:opponent-hand",
      activeLayer,
      cardSelectionZone,
      selectCard: args.selectCard,
      inspectCard: args.inspectCard,
    });
  }

  return descriptors;
}

interface PushCardDescriptorsArgs {
  cards: readonly LorcanaCardSnapshot[];
  hotkeys: readonly string[];
  zone: SimulatorHotkeyCardZone;
  idPrefix: string;
  activeLayer: SimulatorHotkeyLayer;
  cardSelectionZone: SimulatorHotkeyCardZone | null;
  selectCard: (cardId: string) => void;
  inspectCard: (card: LorcanaCardSnapshot) => void;
}

function pushCardDescriptors(
  descriptors: SimulatorHotkeyDescriptor[],
  args: PushCardDescriptorsArgs,
): void {
  const { activeLayer, cardSelectionZone, zone } = args;
  const layerForZone: SimulatorHotkeyLayer =
    activeLayer === "selecting" ? "selecting" : "idle-browse";

  // Strict layering:
  //  - selecting → only the active selection zone is hot
  //  - action-menu (a card is armed) → all card hotkeys go quiet so the
  //    quick-menu can own 1-9 without double-firing
  //  - idle-browse → every zone's row is hot for inspect/preview
  const enabled =
    activeLayer === "selecting" ? cardSelectionZone === zone : activeLayer === "idle-browse";

  for (const binding of assignCardHotkeys(args.cards, args.hotkeys)) {
    descriptors.push({
      id: `${args.idPrefix}:${binding.card.cardId}`,
      hotkey: binding.hotkey,
      label: binding.card.label,
      kind: "card",
      layer: layerForZone,
      cardId: binding.card.cardId,
      cardZone: zone,
      enabled,
      execute: () =>
        activeLayer === "selecting"
          ? args.selectCard(binding.card.cardId)
          : args.inspectCard(binding.card),
    });
  }
}

function getSelectionZone(
  selectionState: AvailableMovesSelectionState | null,
  opponentPlayCards: readonly LorcanaCardSnapshot[],
  ownedPlayCards: readonly LorcanaCardSnapshot[],
  ownedHandCards: readonly LorcanaCardSnapshot[],
  opponentHandCards: readonly LorcanaCardSnapshot[],
): SimulatorHotkeyCardZone | null {
  if (!selectionState) {
    return null;
  }

  // Walk every selectable card entry and pick the first one that intersects
  // a hotkey-bound zone. The shell slices each zone array to the row length
  // (max 10), so the selection's first entry might point to a card outside
  // those slices — we must keep scanning instead of giving up after one miss
  // or every card hotkey gets disabled.
  const ownedHandIds = new Set(ownedHandCards.map((card) => card.cardId));
  const ownedPlayIds = new Set(ownedPlayCards.map((card) => card.cardId));
  const opponentPlayIds = new Set(opponentPlayCards.map((card) => card.cardId));
  const opponentHandIds = new Set(opponentHandCards.map((card) => card.cardId));

  for (const entry of selectionState.entries) {
    if (entry.kind !== "card" || typeof entry.cardId !== "string" || entry.disabled === true) {
      continue;
    }
    if (ownedHandIds.has(entry.cardId)) return "your-hand";
    if (ownedPlayIds.has(entry.cardId)) return "your-play";
    if (opponentPlayIds.has(entry.cardId)) return "opponent-play";
    if (opponentHandIds.has(entry.cardId)) return "opponent-hand";
  }

  return null;
}
