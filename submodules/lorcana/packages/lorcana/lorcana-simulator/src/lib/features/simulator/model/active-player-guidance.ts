import type { NamedCardSearchEntry } from "../panels/named-card-search.js";
import type { LorcanaCardSnapshot, ResolutionAmountSelectionState } from "./contracts.js";

export type GuidanceMode = "default" | "pregame" | "challenge";
export type GuidanceAnchor = "top" | "bottom";
export type GuidancePosition = GuidanceAnchor;

export interface GuidanceAction {
  id: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  emphasis?: boolean;
}

export interface NamedCardSearchState {
  query: string;
  results: NamedCardSearchEntry[];
  oninput: (query: string) => void;
  onselect: (cardName: string, displayLabel: string) => void;
}

export interface GuidanceInlineReference {
  label: string;
  card: LorcanaCardSnapshot | null;
  prefix?: string;
  suffix?: string;
}

export interface GuidanceTargetSlot {
  id: string;
  label: string;
  detail: string;
  active: boolean;
  selected: boolean;
}

export interface ActivePlayerGuidanceItem {
  id: string;
  message: string;
  abilityDescription?: string;
  inlineReference?: GuidanceInlineReference;
  targetSlots?: GuidanceTargetSlot[];
  amountSelection?: ResolutionAmountSelectionState | null;
  actions: GuidanceAction[];
  mode: GuidanceMode;
  order: number;
  namedCardSearch?: NamedCardSearchState;
}

export interface ActivePlayerGuidanceOverlayInput {
  id: string;
  message: string;
  inlineReference?: GuidanceInlineReference;
  actions?: GuidanceAction[];
  mode?: GuidanceMode;
}

export interface ActivePlayerGuidanceController {
  upsert: (item: ActivePlayerGuidanceOverlayInput) => void;
  remove: (id: string) => void;
  setSecondLayerCategory: (categoryLabel: string | null) => void;
}
