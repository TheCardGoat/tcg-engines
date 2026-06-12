import { createDraggable, createDroppable, DragDropProvider } from "@dnd-kit/svelte";
import { getContext, hasContext, setContext } from "svelte";
import type { ComponentProps } from "svelte";

import {
  useLorcanaGameContext,
  useLorcanaSidebarPresenter,
} from "@/features/simulator/context/game-context.svelte.js";
import {
  dispatchDropIntent,
  type DropIntent,
  type DraggedCardKind,
  type SupportedDropZone,
  type LocationDropIntent,
  type OwnCharacterDropIntent,
} from "@/features/simulator/context/simulator-dnd-dispatch.js";
import { isScryDragSourceId } from "@/features/simulator/board/scry-overlay.js";
import {
  getTurnSide,
  type LorcanaCardSnapshot,
  type LorcanaPlayerSide,
  type LorcanaZoneId,
} from "@/features/simulator/model/contracts.js";

const SIMULATOR_DND_CONTEXT_KEY = Symbol.for("lorcana.simulator-dnd");
const MISSING_PROVIDER_ERROR = "getDragDropManager was called outside of a DragDropProvider";

export type DragDropState = "none" | "preview" | "valid" | "invalid";

type AttachHandler = (node: HTMLElement) => void | (() => void);
type DragProviderProps = ComponentProps<typeof DragDropProvider>;

interface OptionalDraggableInput {
  card?: LorcanaCardSnapshot | null;
  disabled?: boolean;
}

interface OptionalDroppableInput {
  player: LorcanaPlayerSide;
  zone: SupportedDropZone;
  disabled?: boolean;
}

interface OptionalDraggableInstance {
  attach: AttachHandler;
  attachHandle: AttachHandler;
}

interface OptionalDroppableInstance {
  attach: AttachHandler;
}

interface DropIntentProbeElement {
  dataset: {
    playerSide?: string;
    zoneId?: string;
    cardId?: string;
    loreDropTarget?: string;
    locationClusterRole?: string;
    locationDropTarget?: string;
  };
  closest: (selector: string) => DropIntentProbeElement | null;
}
type DropIntentProbe = Element | DropIntentProbeElement;

function getProbeDataset(
  element: DropIntentProbe | null,
): DropIntentProbeElement["dataset"] | undefined {
  if (!element || !("dataset" in element)) {
    return undefined;
  }

  return element.dataset;
}

export interface LorcanaSimulatorDndContextValue {
  draggedCardId: string | null;
  isDraggingHandCard: boolean;
  isDraggingPlayCard: boolean;
  isDraggingQuestCard: boolean;
  isChallengeDragActive: boolean;
  isMoveToLocationDragActive: boolean;
  isShiftDragActive: boolean;
  isSingDragActive: boolean;
  createOptionalDraggable: (input: OptionalDraggableInput) => OptionalDraggableInstance;
  createOptionalDroppable: (input: OptionalDroppableInput) => OptionalDroppableInstance;
  getZoneDropState: (zoneId: LorcanaZoneId, playerSide: LorcanaPlayerSide) => DragDropState;
  getLoreDropState: (playerSide: LorcanaPlayerSide) => DragDropState;
  getLocationDropState: (locationCardId: string) => DragDropState;
  getOwnCharacterDropState: (cardId: string) => DragDropState;
  handleDragStart: NonNullable<DragProviderProps["onDragStart"]>;
  handleDragMove: NonNullable<DragProviderProps["onDragMove"]>;
  handleDragEnd: NonNullable<DragProviderProps["onDragEnd"]>;
}

function noopAttach(): void {}

function createNoopDraggable(): OptionalDraggableInstance {
  return {
    attach: noopAttach,
    attachHandle: noopAttach,
  };
}

function createNoopDroppable(): OptionalDroppableInstance {
  return {
    attach: noopAttach,
  };
}

function isMissingProviderError(error: Error): boolean {
  return error.message.includes(MISSING_PROVIDER_ERROR);
}

function areDropIntentsEqual(left: DropIntent | null, right: DropIntent | null): boolean {
  if (left === right) {
    return true;
  }

  if (!left || !right || left.kind !== right.kind) {
    return false;
  }

  if (left.kind === "zone" && right.kind === "zone") {
    return left.playerSide === right.playerSide && left.zoneId === right.zoneId;
  }

  if (left.kind === "lore" && right.kind === "lore") {
    return left.playerSide === right.playerSide;
  }

  if (left.kind === "play-card" && right.kind === "play-card") {
    return left.targetCardId === right.targetCardId && left.playerSide === right.playerSide;
  }

  if (left.kind === "location" && right.kind === "location") {
    return left.targetCardId === right.targetCardId && left.playerSide === right.playerSide;
  }

  if (left.kind === "own-character" && right.kind === "own-character") {
    return left.targetCardId === right.targetCardId && left.playerSide === right.playerSide;
  }

  return false;
}

export function canDragHandCard(args: {
  card: LorcanaCardSnapshot;
  playableCardIds: string[];
  ownerSide: LorcanaPlayerSide | null;
  turnSide: LorcanaPlayerSide | null;
}): boolean {
  const { card, playableCardIds, ownerSide, turnSide } = args;
  if (
    (card.zoneId !== "hand" && card.zoneId !== "limbo") ||
    !ownerSide ||
    card.ownerSide !== ownerSide ||
    turnSide !== ownerSide
  ) {
    return false;
  }

  return playableCardIds.includes(card.cardId);
}

export function canDragPlayCardAsQuest(args: {
  card: LorcanaCardSnapshot;
  ownerSide: LorcanaPlayerSide | null;
  turnSide: LorcanaPlayerSide | null;
  questableCardIds: string[];
}): boolean {
  const { card, ownerSide, turnSide, questableCardIds } = args;
  if (
    card.zoneId !== "play" ||
    !ownerSide ||
    card.ownerSide !== ownerSide ||
    turnSide !== ownerSide
  ) {
    return false;
  }
  return questableCardIds.includes(card.cardId);
}

export function canDragPlayCardAsChallenge(args: {
  card: LorcanaCardSnapshot;
  ownerSide: LorcanaPlayerSide | null;
  turnSide: LorcanaPlayerSide | null;
  challengeReadyCardIds: string[];
}): boolean {
  const { card, ownerSide, turnSide, challengeReadyCardIds } = args;
  if (
    card.zoneId !== "play" ||
    !ownerSide ||
    card.ownerSide !== ownerSide ||
    turnSide !== ownerSide
  ) {
    return false;
  }
  return challengeReadyCardIds.includes(card.cardId);
}

export function canDragHandCardAsShift(args: {
  card: LorcanaCardSnapshot;
  ownerSide: LorcanaPlayerSide | null;
  turnSide: LorcanaPlayerSide | null;
  shiftableCardIds: string[];
}): boolean {
  const { card, ownerSide, turnSide, shiftableCardIds } = args;
  if (
    (card.zoneId !== "hand" && card.zoneId !== "limbo") ||
    !ownerSide ||
    card.ownerSide !== ownerSide ||
    turnSide !== ownerSide
  ) {
    return false;
  }
  return shiftableCardIds.includes(card.cardId);
}

export function canDragHandCardAsSing(args: {
  card: LorcanaCardSnapshot;
  ownerSide: LorcanaPlayerSide | null;
  turnSide: LorcanaPlayerSide | null;
  singableCardIds: string[];
}): boolean {
  const { card, ownerSide, turnSide, singableCardIds } = args;
  if (
    (card.zoneId !== "hand" && card.zoneId !== "limbo") ||
    !ownerSide ||
    card.ownerSide !== ownerSide ||
    turnSide !== ownerSide
  ) {
    return false;
  }
  return singableCardIds.includes(card.cardId);
}

export function canDragPlayCardAsMoveToLocation(args: {
  card: LorcanaCardSnapshot;
  ownerSide: LorcanaPlayerSide | null;
  turnSide: LorcanaPlayerSide | null;
  moveToLocationCardIds: string[];
}): boolean {
  const { card, ownerSide, turnSide, moveToLocationCardIds } = args;
  if (
    card.zoneId !== "play" ||
    !ownerSide ||
    card.ownerSide !== ownerSide ||
    turnSide !== ownerSide
  ) {
    return false;
  }
  return moveToLocationCardIds.includes(card.cardId);
}

export function createZoneDropZoneId(
  zoneId: SupportedDropZone,
  playerSide: LorcanaPlayerSide,
): string {
  return `sim-drop:zone:${playerSide}:${zoneId}`;
}

export function createLoreDropZoneId(playerSide: LorcanaPlayerSide): string {
  return `sim-drop:lore:${playerSide}`;
}

export function resolveDropIntentFromTargetId(
  targetId: string | number | null | undefined,
): DropIntent | null {
  if (typeof targetId !== "string") {
    return null;
  }

  const [prefix, kind, playerSide, value] = targetId.split(":");
  if (prefix !== "sim-drop" || (playerSide !== "playerOne" && playerSide !== "playerTwo")) {
    return null;
  }

  if (kind === "zone" && (value === "play" || value === "inkwell" || value === "hand")) {
    return {
      kind: "zone",
      playerSide,
      zoneId: value,
    };
  }

  if (kind === "lore") {
    return { kind: "lore", playerSide };
  }

  return null;
}

export function resolveDropIntentFromElements(args: {
  elements: DropIntentProbe[];
  ownerSide: LorcanaPlayerSide | null;
  isDraggingPlayCard?: boolean;
  isMoveToLocationDragActive?: boolean;
  isShiftDragActive?: boolean;
  isSingDragActive?: boolean;
}): DropIntent | null {
  const {
    elements,
    ownerSide,
    isDraggingPlayCard = false,
    isMoveToLocationDragActive = false,
    isShiftDragActive = false,
    isSingDragActive = false,
  } = args;

  for (const element of elements) {
    if (isDraggingPlayCard) {
      // Move-to-location: rail drop target area or the location card itself
      if (isMoveToLocationDragActive) {
        // Rail area first (wider drop surface)
        const railElement = element.closest("[data-location-drop-target][data-player-side]");
        const railDataset = getProbeDataset(railElement);
        const railCardId = railDataset?.locationDropTarget;
        const railSide = railDataset?.playerSide;
        if (
          railCardId &&
          (railSide === "playerOne" || railSide === "playerTwo") &&
          railSide === ownerSide
        ) {
          return { kind: "location", targetCardId: railCardId, playerSide: railSide };
        }

        // Fall back to the location card slot itself
        const locationElement = element.closest(
          "[data-location-cluster-role='location'][data-card-id][data-player-side]",
        );
        const locationDataset = getProbeDataset(locationElement);
        const locCardId = locationDataset?.cardId;
        const locSide = locationDataset?.playerSide;
        if (
          locCardId &&
          (locSide === "playerOne" || locSide === "playerTwo") &&
          locSide === ownerSide
        ) {
          return { kind: "location", targetCardId: locCardId, playerSide: locSide };
        }
      }

      // Check for lore badge drop target (own player only)
      const loreElement = element.closest("[data-lore-drop-target]");
      const loreDataset = getProbeDataset(loreElement);
      if (loreDataset?.loreDropTarget) {
        const loreSide = loreDataset.loreDropTarget;
        if ((loreSide === "playerOne" || loreSide === "playerTwo") && loreSide === ownerSide) {
          return { kind: "lore", playerSide: loreSide };
        }
      }

      // Check for opposing play card drop target (challenge)
      const cardSlotElement = element.closest("[data-card-id][data-zone-id][data-player-side]");
      const cardDataset = getProbeDataset(cardSlotElement);
      const cardId = cardDataset?.cardId;
      const cardZone = cardDataset?.zoneId;
      const cardSide = cardDataset?.playerSide;
      if (
        cardId &&
        cardZone === "play" &&
        (cardSide === "playerOne" || cardSide === "playerTwo") &&
        cardSide !== ownerSide
      ) {
        return { kind: "play-card", targetCardId: cardId, playerSide: cardSide };
      }
    }

    // Own-character target for shift/sing hand drags (own side only, exclude location cards)
    if (isShiftDragActive || isSingDragActive) {
      const charElement = element.closest(
        "[data-card-id][data-zone-id='play'][data-player-side]:not([data-location-cluster-role='location'])",
      );
      const charDataset = getProbeDataset(charElement);
      const charCardId = charDataset?.cardId;
      const charSide = charDataset?.playerSide;
      if (
        charCardId &&
        (charSide === "playerOne" || charSide === "playerTwo") &&
        charSide === ownerSide
      ) {
        return { kind: "own-character", targetCardId: charCardId, playerSide: charSide };
      }
    }

    // Existing zone drop detection
    const zoneElement = element.closest("[data-zone-id][data-player-side]");
    const zoneDataset = getProbeDataset(zoneElement);
    const zoneId = zoneDataset?.zoneId;
    const playerSide = zoneDataset?.playerSide;
    if (
      (zoneId === "play" || zoneId === "inkwell" || zoneId === "hand") &&
      (playerSide === "playerOne" || playerSide === "playerTwo") &&
      playerSide === ownerSide
    ) {
      return {
        kind: "zone",
        playerSide,
        zoneId,
      };
    }
  }

  return null;
}

class LorcanaSimulatorDndController implements LorcanaSimulatorDndContextValue {
  draggedCardId = $state<string | null>(null);
  hoveredDropIntent = $state<DropIntent | null>(null);

  readonly #game = useLorcanaGameContext();
  readonly #sidebar = useLorcanaSidebarPresenter();

  get ownerSide(): LorcanaPlayerSide | null {
    return this.#game.ownerSide();
  }

  get turnSide(): LorcanaPlayerSide | null {
    const board = this.#game.boardSnapshot();
    return board ? getTurnSide(board) : null;
  }

  get playableHandCardIds(): string[] {
    return this.#game.playableHandCardIds();
  }

  get questablePlayCardIds(): string[] {
    return (
      this.#sidebar.moveCategorySummaries
        .find((s) => s.categoryId === "quest")
        ?.sourceCardIds.slice() ?? []
    );
  }

  get moveToLocationPlayCardIds(): string[] {
    return (
      this.#sidebar.moveCategorySummaries
        .find((s) => s.categoryId === "move-to-location")
        ?.sourceCardIds.slice() ?? []
    );
  }

  get challengeReadyPlayCardIds(): string[] {
    return this.#game.challengeReadyCardIds();
  }

  get shiftableHandCardIds(): string[] {
    return (
      this.#sidebar.moveCategorySummaries
        .find((s) => s.categoryId === "shift-card")
        ?.sourceCardIds.slice() ?? []
    );
  }

  get singableHandCardIds(): string[] {
    return (
      this.#sidebar.moveCategorySummaries
        .find((s) => s.categoryId === "sing-card")
        ?.sourceCardIds.slice() ?? []
    );
  }

  get draggedCard(): LorcanaCardSnapshot | null {
    return this.draggedCardId ? (this.#game.cardSnapshotsById()[this.draggedCardId] ?? null) : null;
  }

  get draggedCardKind(): DraggedCardKind | null {
    const card = this.draggedCard;
    if (!card) {
      return null;
    }

    // Shift and sing checked before plain "hand" — more specific intent takes precedence
    if (
      canDragHandCardAsShift({
        card,
        ownerSide: this.ownerSide,
        turnSide: this.turnSide,
        shiftableCardIds: this.shiftableHandCardIds,
      })
    ) {
      return "hand-shift";
    }

    if (
      canDragHandCardAsSing({
        card,
        ownerSide: this.ownerSide,
        turnSide: this.turnSide,
        singableCardIds: this.singableHandCardIds,
      })
    ) {
      return "hand-sing";
    }

    if (
      canDragHandCard({
        card,
        playableCardIds: this.playableHandCardIds,
        ownerSide: this.ownerSide,
        turnSide: this.turnSide,
      })
    ) {
      return "hand";
    }

    // Challenge takes precedence — starts challenge session for target highlighting
    if (
      canDragPlayCardAsChallenge({
        card,
        ownerSide: this.ownerSide,
        turnSide: this.turnSide,
        challengeReadyCardIds: this.challengeReadyPlayCardIds,
      })
    ) {
      return "play-challenge";
    }

    if (
      canDragPlayCardAsMoveToLocation({
        card,
        ownerSide: this.ownerSide,
        turnSide: this.turnSide,
        moveToLocationCardIds: this.moveToLocationPlayCardIds,
      })
    ) {
      return "play-move-to-location";
    }

    if (
      canDragPlayCardAsQuest({
        card,
        ownerSide: this.ownerSide,
        turnSide: this.turnSide,
        questableCardIds: this.questablePlayCardIds,
      })
    ) {
      return "play-quest";
    }

    return null;
  }

  get isDraggingHandCard(): boolean {
    const kind = this.draggedCardKind;
    return kind === "hand" || kind === "hand-shift" || kind === "hand-sing";
  }

  get isShiftDragActive(): boolean {
    return this.draggedCardKind === "hand-shift";
  }

  get isSingDragActive(): boolean {
    return this.draggedCardKind === "hand-sing";
  }

  get isDraggingPlayCard(): boolean {
    const kind = this.draggedCardKind;
    return kind === "play-quest" || kind === "play-challenge" || kind === "play-move-to-location";
  }

  get isDraggingQuestCard(): boolean {
    const card = this.draggedCard;
    if (!card) return false;
    return this.questablePlayCardIds.includes(card.cardId);
  }

  get isChallengeDragActive(): boolean {
    return this.draggedCardKind === "play-challenge";
  }

  get isMoveToLocationDragActive(): boolean {
    return this.draggedCardKind === "play-move-to-location";
  }

  isCardDraggable(card: LorcanaCardSnapshot | null | undefined): boolean {
    if (!card) {
      return false;
    }

    if (
      canDragHandCardAsShift({
        card,
        ownerSide: this.ownerSide,
        turnSide: this.turnSide,
        shiftableCardIds: this.shiftableHandCardIds,
      })
    ) {
      return true;
    }

    if (
      canDragHandCardAsSing({
        card,
        ownerSide: this.ownerSide,
        turnSide: this.turnSide,
        singableCardIds: this.singableHandCardIds,
      })
    ) {
      return true;
    }

    if (
      canDragHandCard({
        card,
        playableCardIds: this.playableHandCardIds,
        ownerSide: this.ownerSide,
        turnSide: this.turnSide,
      })
    ) {
      return true;
    }

    if (
      canDragPlayCardAsChallenge({
        card,
        ownerSide: this.ownerSide,
        turnSide: this.turnSide,
        challengeReadyCardIds: this.challengeReadyPlayCardIds,
      })
    ) {
      return true;
    }

    if (
      canDragPlayCardAsMoveToLocation({
        card,
        ownerSide: this.ownerSide,
        turnSide: this.turnSide,
        moveToLocationCardIds: this.moveToLocationPlayCardIds,
      })
    ) {
      return true;
    }

    if (
      canDragPlayCardAsQuest({
        card,
        ownerSide: this.ownerSide,
        turnSide: this.turnSide,
        questableCardIds: this.questablePlayCardIds,
      })
    ) {
      return true;
    }

    return false;
  }

  getLoreDropState = (playerSide: LorcanaPlayerSide): DragDropState => {
    if (!this.isDraggingQuestCard) return "none";
    if (playerSide !== this.ownerSide) return "none";

    const isHovered =
      this.hoveredDropIntent?.kind === "lore" && this.hoveredDropIntent.playerSide === playerSide;

    return isHovered ? "valid" : "preview";
  };

  getLocationDropState = (locationCardId: string): DragDropState => {
    if (!this.isMoveToLocationDragActive) return "none";
    if (!this.#sidebar.getActionSessionCardState(locationCardId).isSelectable) return "none";

    const isHovered =
      this.hoveredDropIntent?.kind === "location" &&
      this.hoveredDropIntent.targetCardId === locationCardId;

    return isHovered ? "valid" : "preview";
  };

  getOwnCharacterDropState = (cardId: string): DragDropState => {
    if (!this.isShiftDragActive && !this.isSingDragActive) return "none";
    if (!this.#sidebar.getActionSessionCardState(cardId).isSelectable) return "none";

    const isHovered =
      this.hoveredDropIntent?.kind === "own-character" &&
      this.hoveredDropIntent.targetCardId === cardId;

    return isHovered ? "valid" : "preview";
  };

  createOptionalDraggable = (input: OptionalDraggableInput): OptionalDraggableInstance => {
    const card = input.card;
    if (!card) {
      return createNoopDraggable();
    }

    const disabled = input.disabled ?? !this.isCardDraggable(card);

    try {
      const draggable = createDraggable({
        get id() {
          return card.cardId;
        },
        get disabled() {
          return disabled;
        },
      });

      return {
        attach: draggable.attach,
        attachHandle: draggable.attachHandle,
      };
    } catch (error) {
      if (error instanceof Error && isMissingProviderError(error)) {
        return createNoopDraggable();
      }

      throw error;
    }
  };

  createOptionalDroppable = (input: OptionalDroppableInput): OptionalDroppableInstance => {
    try {
      const getDropZoneId = () => createZoneDropZoneId(input.zone, input.player);
      const isDisabled = () => input.disabled ?? this.ownerSide !== input.player;

      const droppable = createDroppable({
        get id() {
          return getDropZoneId();
        },
        get disabled() {
          return isDisabled();
        },
      });

      return {
        attach: droppable.attach,
      };
    } catch (error) {
      if (error instanceof Error && isMissingProviderError(error)) {
        return createNoopDroppable();
      }

      throw error;
    }
  };

  getZoneDropState = (zoneId: LorcanaZoneId, playerSide: LorcanaPlayerSide): DragDropState => {
    if (zoneId !== "play" && zoneId !== "inkwell" && zoneId !== "hand") {
      return "none";
    }

    if (zoneId === "hand") {
      if (!this.draggedCardId || playerSide !== this.ownerSide || this.draggedCardKind !== "hand") {
        return "none";
      }

      const isHovered =
        this.hoveredDropIntent?.kind === "zone" &&
        this.hoveredDropIntent.zoneId === "hand" &&
        this.hoveredDropIntent.playerSide === playerSide;

      return isHovered ? "valid" : "none";
    }

    const hoveredIntent = this.hoveredDropIntent;
    if (
      hoveredIntent?.kind === "zone" &&
      hoveredIntent.zoneId === zoneId &&
      hoveredIntent.playerSide === playerSide
    ) {
      return this.draggedCardId &&
        playerSide === this.ownerSide &&
        this.#game.canDropHandCardIntoZone(this.draggedCardId, zoneId)
        ? "valid"
        : "none";
    }

    const kind = this.draggedCardKind;
    if (
      this.draggedCardId &&
      playerSide === this.ownerSide &&
      (kind === "hand" || kind === "hand-shift" || kind === "hand-sing") &&
      this.#game.canDropHandCardIntoZone(this.draggedCardId, zoneId)
    ) {
      return "preview";
    }

    return "none";
  };

  resolveDropIntentFromPoint(clientX: number, clientY: number): DropIntent | null {
    return resolveDropIntentFromElements({
      elements: document.elementsFromPoint(clientX, clientY),
      ownerSide: this.ownerSide,
      isDraggingPlayCard: this.isDraggingPlayCard,
      isMoveToLocationDragActive: this.isMoveToLocationDragActive,
      isShiftDragActive: this.isShiftDragActive,
      isSingDragActive: this.isSingDragActive,
    });
  }

  resolveDropIntentFromTargetId(targetId: string | number | null | undefined): DropIntent | null {
    return resolveDropIntentFromTargetId(targetId);
  }

  setHoveredDropIntent(dropIntent: DropIntent | null): void {
    if (areDropIntentsEqual(this.hoveredDropIntent, dropIntent)) {
      return;
    }

    this.hoveredDropIntent = dropIntent;
  }

  updateHoveredDropIntent(event: PointerEvent): void {
    this.setHoveredDropIntent(this.resolveDropIntentFromPoint(event.clientX, event.clientY));
  }

  clearDragState(): void {
    const previousKind = this.draggedCardKind;
    this.draggedCardId = null;
    this.setHoveredDropIntent(null);
    if (
      previousKind === "play-challenge" ||
      previousKind === "play-move-to-location" ||
      previousKind === "hand-shift" ||
      previousKind === "hand-sing"
    ) {
      this.#sidebar.cancelActionSelectionSession();
    }
  }

  #questCard(cardId: string): boolean {
    const card = this.#game.cardSnapshotsById()[cardId];
    if (!card) return false;
    const action = this.#sidebar.getCardActionViews(card).find((a) => a.categoryId === "quest");
    return action ? this.#sidebar.handleCardActionClick(action) : false;
  }

  #executeChallengeDrop(targetCardId: string): boolean {
    const targetCard = this.#game.cardSnapshotsById()[targetCardId] ?? null;
    return this.#sidebar.handleActionSessionCardSelection(targetCard);
  }

  #executeMoveToLocationDrop(targetCardId: string): boolean {
    const targetCard = this.#game.cardSnapshotsById()[targetCardId] ?? null;
    return this.#sidebar.handleActionSessionCardSelection(targetCard);
  }

  #executeShiftDrop(targetCardId: string): boolean {
    const targetCard = this.#game.cardSnapshotsById()[targetCardId] ?? null;
    return this.#sidebar.handleActionSessionCardSelection(targetCard);
  }

  #executeSingDrop(targetCardId: string): boolean {
    const targetCard = this.#game.cardSnapshotsById()[targetCardId] ?? null;
    return this.#sidebar.handleActionSessionCardSelection(targetCard);
  }

  handleDrop(cardId: string, dropIntent: DropIntent | null): void {
    dispatchDropIntent({
      cardId,
      dropIntent,
      draggedCardKind: this.draggedCardKind,
      ownerSide: this.ownerSide,
      game: {
        openPlayCardSelection: this.#sidebar.openPlayCardSelection,
        playCard: this.#game.playCard,
        ink: this.#game.ink,
        shouldOpenPlayCardSelectionOnDrop: this.#game.shouldOpenPlayCardSelectionOnDrop,
        canDropHandCardIntoZone: this.#game.canDropHandCardIntoZone,
        questCard: (id) => this.#questCard(id),
        executeChallengeDrop: (targetId) => this.#executeChallengeDrop(targetId),
        executeMoveToLocationDrop: (targetId) => this.#executeMoveToLocationDrop(targetId),
        executeShiftDrop: (targetId) => this.#executeShiftDrop(targetId),
        executeSingDrop: (targetId) => this.#executeSingDrop(targetId),
      },
    });
  }

  handleDragStart: NonNullable<DragProviderProps["onDragStart"]> = (event): void => {
    const rawId = typeof event.operation.source?.id === "string" ? event.operation.source.id : null;
    this.draggedCardId = isScryDragSourceId(rawId) ? null : rawId;
    this.setHoveredDropIntent(null);

    // Start the challenge session at drag-start so valid/invalid target highlights activate
    if (this.isChallengeDragActive && this.draggedCard) {
      const card = this.draggedCard;
      const challengeAction = this.#sidebar
        .getCardActionViews(card)
        .find((a) => a.categoryId === "challenge");
      if (challengeAction) {
        this.#sidebar.handleCardActionClick(challengeAction, { skipConfirmation: true });
      }
    }

    // Start the move-to-location session so valid location targets highlight
    if (this.isMoveToLocationDragActive && this.draggedCard) {
      const card = this.draggedCard;
      const moveAction = this.#sidebar
        .getCardActionViews(card)
        .find((a) => a.categoryId === "move-to-location");
      if (moveAction) {
        this.#sidebar.handleCardActionClick(moveAction, { skipConfirmation: true });
      }
    }

    // Start the shift session so valid shift targets highlight
    if (this.isShiftDragActive && this.draggedCard) {
      const card = this.draggedCard;
      const shiftAction = this.#sidebar
        .getCardActionViews(card)
        .find((a) => a.categoryId === "shift-card");
      if (shiftAction) {
        this.#sidebar.handleCardActionClick(shiftAction, { skipConfirmation: true });
      }
    }

    // Start the sing session so valid singer targets highlight
    if (this.isSingDragActive && this.draggedCard) {
      const card = this.draggedCard;
      const singAction = this.#sidebar
        .getCardActionViews(card)
        .find((a) => a.categoryId === "sing-card");
      if (singAction) {
        this.#sidebar.handleCardActionClick(singAction, { skipConfirmation: true });
      }
    }
  };

  handleDragMove: NonNullable<DragProviderProps["onDragMove"]> = (event): void => {
    if (event.nativeEvent instanceof PointerEvent) {
      this.updateHoveredDropIntent(event.nativeEvent);
      return;
    }

    this.setHoveredDropIntent(this.resolveDropIntentFromTargetId(event.operation.target?.id));
  };

  handleDragEnd: NonNullable<DragProviderProps["onDragEnd"]> = (event): void => {
    if (event.canceled) {
      this.clearDragState();
      return;
    }

    const cardId =
      typeof event.operation.source?.id === "string"
        ? event.operation.source.id
        : this.draggedCardId;
    if (!cardId) {
      this.clearDragState();
      return;
    }

    if (isScryDragSourceId(cardId)) {
      this.clearDragState();
      return;
    }

    const dropIntent =
      event.nativeEvent instanceof PointerEvent
        ? this.resolveDropIntentFromPoint(event.nativeEvent.clientX, event.nativeEvent.clientY)
        : this.resolveDropIntentFromTargetId(event.operation.target?.id);

    // For play-card drags, save the kind before clearDragState cancels the session
    const dragKind = this.draggedCardKind;

    if (
      dragKind === "play-quest" ||
      dragKind === "play-challenge" ||
      dragKind === "play-move-to-location"
    ) {
      // Dispatch first while session is still active, then clean up
      this.handleDrop(cardId, dropIntent);
      this.draggedCardId = null;
      this.setHoveredDropIntent(null);
      if (
        (dragKind === "play-challenge" || dragKind === "play-move-to-location") &&
        this.#sidebar.actionSelectionSession
      ) {
        this.#sidebar.cancelActionSelectionSession();
      }
      return;
    }

    this.handleDrop(cardId, dropIntent);
    this.clearDragState();
  };
}

export function setLorcanaSimulatorDndContext(): LorcanaSimulatorDndContextValue {
  return setContext(SIMULATOR_DND_CONTEXT_KEY, new LorcanaSimulatorDndController());
}

export function useLorcanaSimulatorDndContext(): LorcanaSimulatorDndContextValue {
  if (!hasContext(SIMULATOR_DND_CONTEXT_KEY)) {
    throw new Error("Simulator dnd context not found");
  }

  return getContext<LorcanaSimulatorDndContextValue>(SIMULATOR_DND_CONTEXT_KEY);
}

export function createOptionalDraggable(input: OptionalDraggableInput): OptionalDraggableInstance {
  return useLorcanaSimulatorDndContext().createOptionalDraggable(input);
}

export function createOptionalDroppable(input: OptionalDroppableInput): OptionalDroppableInstance {
  return useLorcanaSimulatorDndContext().createOptionalDroppable(input);
}
