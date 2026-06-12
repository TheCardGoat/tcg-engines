import { getContext, hasContext, setContext } from "svelte";
import { m } from "$lib/i18n/messages.js";

import {
  useLorcanaGameContext,
  useLorcanaSidebarPresenter,
  type PrimaryClickAction,
} from "@/features/simulator/context/game-context.svelte.js";
import type { LorcanaCardSnapshot } from "@/features/simulator/model/contracts.js";
import {
  setCardInteractionContext,
  type CardInteractionController,
  type CardInteractionMeta,
  type CardInteractionSelectionMode,
  type CardSelectPayload,
} from "@/features/simulator/context/card-interaction-context.svelte.js";
import { SimulatorLayoutModeObserver } from "@/features/simulator/model/layout-mode.svelte.js";
import { IsTouchInteraction } from "$lib/hooks/is-touch-interaction.svelte.js";

const SIMULATOR_CARD_CONTEXT_KEY = Symbol.for("lorcana.simulator-card");

interface PreviewPosition {
  x: number;
  y: number;
}

export interface SimulatorCardContextValue extends CardInteractionController {
  inspectedCard: LorcanaCardSnapshot | null;
  inspectedMeta: CardInteractionMeta | null;
  isInspectOpen: boolean;
  isGlobalPreviewOpen: boolean;
  canSelectCard: (card: LorcanaCardSnapshot | null, meta?: CardInteractionMeta) => boolean;
  canSelectInspectedCard: boolean;
  previewCard: LorcanaCardSnapshot | null;
  previewPosition: PreviewPosition;
  setExternalPreviewCard: (card: LorcanaCardSnapshot | null) => void;
  setPreviewPosition: (position: PreviewPosition) => void;
}

interface SimulatorCardContextOptions {
  onMulliganSelectionChange?: () => void;
}

class SimulatorCardController implements SimulatorCardContextValue {
  hoveredCard = $state<LorcanaCardSnapshot | null>(null);
  externalPreviewCard = $state<LorcanaCardSnapshot | null>(null);
  inspectedCard = $state<LorcanaCardSnapshot | null>(null);
  inspectedMeta = $state<CardInteractionMeta | null>(null);
  pinnedPreviewCard = $state<LorcanaCardSnapshot | null>(null);
  selectedIds = $state<string[]>([]);
  selectionMode = $state<CardInteractionSelectionMode>("single");
  previewPosition = $state<PreviewPosition>({ x: 0, y: 0 });
  #delayedHoveredCard = $state<LorcanaCardSnapshot | null>(null);
  #hoverTimer: ReturnType<typeof setTimeout> | null = null;
  readonly #game = useLorcanaGameContext();
  readonly #sidebar = useLorcanaSidebarPresenter();
  readonly #options: SimulatorCardContextOptions;
  readonly #layout = new SimulatorLayoutModeObserver();
  readonly #isTouchInteraction = new IsTouchInteraction();

  constructor(options: SimulatorCardContextOptions = {}) {
    this.#options = options;

    $effect(() => {
      if (this.#sidebar.actionSelectionSession) {
        this.closeCardInspect();
      }
    });
  }

  get previewCard(): LorcanaCardSnapshot | null {
    return this.externalPreviewCard ?? this.pinnedPreviewCard ?? this.#delayedHoveredCard;
  }

  get isInspectOpen(): boolean {
    return this.inspectedCard !== null;
  }

  get isGlobalPreviewOpen(): boolean {
    return this.pinnedPreviewCard !== null;
  }

  get canSelectInspectedCard(): boolean {
    return this.canSelectCard(this.inspectedCard, this.inspectedMeta ?? undefined);
  }

  get shouldUseTouchInspect(): boolean {
    return this.#layout.current !== "desktop";
  }

  handleHover = ({
    card,
    meta,
  }: {
    card?: LorcanaCardSnapshot;
    meta?: CardInteractionMeta;
  }): void => {
    this.hoveredCard = card ?? null;
    this.selectionMode = this.resolveSelectionMode(card, meta);
    this.syncSelectedIds(this.selectionMode);

    if (this.#hoverTimer !== null) {
      clearTimeout(this.#hoverTimer);
      this.#hoverTimer = null;
    }

    const hoverCard = card ?? null;
    const mode = this.#sidebar.cardPreviewMode;

    if (this.shouldUseTouchInspect || this.#isTouchInteraction.current || mode === "disabled") {
      this.#delayedHoveredCard = null;
    } else if (mode === "immediate") {
      this.#delayedHoveredCard = hoverCard;
    } else {
      if (hoverCard) {
        this.#hoverTimer = setTimeout(() => {
          this.#delayedHoveredCard = hoverCard;
          this.#hoverTimer = null;
        }, 5000);
      } else {
        this.#delayedHoveredCard = null;
      }
    }
  };

  handleLeave = (): void => {
    this.hoveredCard = null;
    if (this.#hoverTimer !== null) {
      clearTimeout(this.#hoverTimer);
      this.#hoverTimer = null;
    }
    this.#delayedHoveredCard = null;
  };

  handleSelect = ({
    card,
    meta,
  }: {
    card?: LorcanaCardSnapshot;
    meta?: CardInteractionMeta;
  }): void => {
    if (!card) {
      return;
    }

    if (this.#sidebar.handleAvailableMovesSelectionCard(card.cardId)) {
      this.selectionMode = "single";
      this.syncSelectedIds("single");
      return;
    }

    if (!this.canSelectCard(card, meta)) {
      if (meta?.suppressInspectOnSelect) {
        return;
      }
      this.openCardInspect({ card, meta });
      return;
    }

    const mode = this.resolveSelectionMode(card, meta);
    this.selectionMode = mode;

    if (mode === "multi") {
      this.toggleMultiSelection(card);
      this.syncSelectedIds("multi");
      return;
    }

    this.handleSingleSelection(card);
    this.syncSelectedIds("single");
  };

  setPreviewPosition = (position: PreviewPosition): void => {
    this.previewPosition = position;
  };

  setExternalPreviewCard = (card: LorcanaCardSnapshot | null): void => {
    this.externalPreviewCard = card;
  };

  openCardInspect = ({
    card,
    meta,
  }: {
    card?: LorcanaCardSnapshot;
    meta?: CardInteractionMeta;
  }): void => {
    this.inspectedCard = card ?? null;
    this.inspectedMeta = meta ?? null;
  };

  closeCardInspect = (): void => {
    this.inspectedCard = null;
    this.inspectedMeta = null;
  };

  openGlobalPreview = (card?: LorcanaCardSnapshot | null): void => {
    this.pinnedPreviewCard = card ?? this.inspectedCard;
  };

  closeGlobalPreview = (): void => {
    this.pinnedPreviewCard = null;
  };

  selectInspectedCard = (): void => {
    if (!this.inspectedCard) {
      return;
    }

    this.handleSelect({
      card: this.inspectedCard,
      meta: this.inspectedMeta ?? undefined,
    });
    this.closeCardInspect();
  };

  canSelectCard(card: LorcanaCardSnapshot | null, meta?: CardInteractionMeta): boolean {
    if (!card) {
      return false;
    }

    if (meta?.selectable === true) {
      return meta.selectionMode !== "none";
    }

    if (this.#sidebar.isCardSelectableForActionSession(card)) {
      return true;
    }

    if (
      this.#sidebar.resolutionSelectionSession &&
      this.#sidebar.getActionSessionCardState(card.cardId).isSelectable
    ) {
      return true;
    }

    const ownerSide = this.#game.ownerSide();

    if (
      this.#game.pregamePhase() === "mulligan" &&
      this.#game.canActInPregame() &&
      ownerSide &&
      card.zoneId === "hand" &&
      card.ownerSide === ownerSide
    ) {
      return true;
    }

    return false;
  }

  resolveSelectionMode(
    card?: LorcanaCardSnapshot,
    meta?: CardInteractionMeta,
  ): CardInteractionSelectionMode {
    if (meta?.selectionMode) {
      return meta.selectionMode;
    }

    if (
      card &&
      this.#game.pregamePhase() === "mulligan" &&
      this.#game.canActInPregame() &&
      this.#game.ownerSide() === card.ownerSide &&
      card.zoneId === "hand"
    ) {
      return "multi";
    }

    return "single";
  }

  syncSelectedIds(mode: CardInteractionSelectionMode): void {
    this.selectedIds =
      mode === "multi"
        ? [...this.#game.selectedMulliganCardIds()]
        : [...this.#sidebar.selectedActionSessionCardIds];
  }

  toggleMultiSelection(card: LorcanaCardSnapshot): void {
    const selectedCardIds = this.#game.selectedMulliganCardIds();
    const isSelected = selectedCardIds.includes(card.cardId);
    const nextSelectedCardIds = isSelected
      ? selectedCardIds.filter((cardId) => cardId !== card.cardId)
      : [...selectedCardIds, card.cardId];

    this.#options.onMulliganSelectionChange?.();
    this.#game.setSelectedMulliganCardIds(nextSelectedCardIds);
    this.#game.setPendingError(null);
    this.#game.setStatusMessage(
      nextSelectedCardIds.length > 0
        ? m["sim.status.mulliganSelectionCount"]({ count: nextSelectedCardIds.length })
        : m["sim.status.mulliganSelectionNone"]({}),
    );
  }
  handleSingleSelection(card: LorcanaCardSnapshot): void {
    const pregamePhase = this.#game.pregamePhase();
    const canActInPregame = this.#game.canActInPregame();
    const ownerSide = this.#game.ownerSide();

    if (
      pregamePhase === "mulligan" &&
      canActInPregame &&
      ownerSide &&
      card.zoneId === "hand" &&
      card.ownerSide === ownerSide
    ) {
      this.toggleMultiSelection(card);
      return;
    }
  }

  #triggerClickAction(card: LorcanaCardSnapshot, action: PrimaryClickAction): void {
    if (action === "none") return;
    const matchingAction = this.#sidebar
      .getCardActionViews(card)
      .find((a) => a.categoryId === action && a.enabled);
    if (matchingAction) {
      this.#sidebar.handleCardActionClick(matchingAction);
    }
  }

  handleContextMenu = ({ card, meta }: CardSelectPayload): void => {
    if (!card) return;
    if (meta?.selectable === true || this.#sidebar.isCardSelectableForActionSession(card)) {
      return;
    }

    const ownerSide = this.#game.ownerSide();
    if (
      this.#game.pregamePhase() === "mulligan" &&
      this.#game.canActInPregame() &&
      ownerSide &&
      card.zoneId === "hand" &&
      card.ownerSide === ownerSide
    ) {
      return;
    }

    if (!ownerSide || card.zoneId !== "play" || card.ownerSide !== ownerSide) return;

    const itemAbilityAction = this.#sidebar.getSingleClickItemAbilityAction(card);
    if (itemAbilityAction) {
      this.#sidebar.handleCardActionClick(itemAbilityAction);
      return;
    }

    this.#triggerClickAction(card, this.#sidebar.primaryClickAction);
  };
}

export function setSimulatorCardContext(
  options: SimulatorCardContextOptions = {},
): SimulatorCardContextValue {
  const controller = new SimulatorCardController(options);
  setCardInteractionContext(controller);
  return setContext(SIMULATOR_CARD_CONTEXT_KEY, controller);
}

export function useSimulatorCardContext(): SimulatorCardContextValue {
  if (!hasContext(SIMULATOR_CARD_CONTEXT_KEY)) {
    throw new Error("Simulator card context not found");
  }

  return getContext<SimulatorCardContextValue>(SIMULATOR_CARD_CONTEXT_KEY);
}

export function maybeUseSimulatorCardContext(): SimulatorCardContextValue | null {
  if (!hasContext(SIMULATOR_CARD_CONTEXT_KEY)) {
    return null;
  }

  return getContext<SimulatorCardContextValue>(SIMULATOR_CARD_CONTEXT_KEY);
}
