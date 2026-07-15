import { getContext, hasContext, setContext } from "svelte";
import type {
  LorcanaCardSnapshot,
  LorcanaPlayerSide,
  LorcanaZoneId,
} from "@/features/simulator/model/contracts.js";

const CARD_INTERACTION_CONTEXT_KEY = Symbol.for("lorcana.card-interaction");

export type CardInteractionSelectionMode = "none" | "single" | "multi";

export interface CardInteractionMeta {
  cardId?: string;
  ownerSide?: LorcanaPlayerSide;
  zoneId?: LorcanaZoneId;
  selectionGroup?: string;
  selectionMode?: CardInteractionSelectionMode;
  selectable?: boolean;
  /** When true, a click that would otherwise open card inspect is ignored (e.g. embedded cards in modals). */
  suppressInspectOnSelect?: boolean;
}

export interface CardHoverPayload {
  card?: LorcanaCardSnapshot;
  event?: MouseEvent;
  meta?: CardInteractionMeta;
}

export interface CardLeavePayload {
  card?: LorcanaCardSnapshot;
  meta?: CardInteractionMeta;
}

export interface CardSelectPayload {
  card?: LorcanaCardSnapshot;
  event?: MouseEvent;
  meta?: CardInteractionMeta;
}

export interface CardInteractionController {
  hoveredCard: LorcanaCardSnapshot | null;
  selectedIds: string[];
  selectionMode: CardInteractionSelectionMode;
  handleHover: (payload: CardHoverPayload) => void;
  handleLeave: (payload: CardLeavePayload) => void;
  handleSelect: (payload: CardSelectPayload) => void;
  handleContextMenu?: (payload: CardSelectPayload) => void;
  openCardInspect: (payload: CardHoverPayload) => void;
  closeCardInspect: () => void;
  openGlobalPreview: (card?: LorcanaCardSnapshot | null) => void;
  closeGlobalPreview: () => void;
  selectInspectedCard: () => void;
}

export function setCardInteractionContext(
  controller: CardInteractionController,
): CardInteractionController {
  return setContext(CARD_INTERACTION_CONTEXT_KEY, controller);
}

export function useCardInteractionContext(): CardInteractionController | null {
  if (!hasContext(CARD_INTERACTION_CONTEXT_KEY)) {
    return null;
  }

  return getContext<CardInteractionController>(CARD_INTERACTION_CONTEXT_KEY);
}
