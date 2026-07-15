import type {
  CardInstanceId,
  EngineActiveEffectProjection,
  EnginePendingEffectProjection,
  PlayerId,
} from "#core";
import type { ClockSnapshot } from "../core/runtime/clock-view";
import type { ResolutionSelectionContext } from "./resolution-selection";

// Not present here means not having that keyword modified, and should use the value present in the CardDefinition
export type ProjectedKeywordValues = Record<string, number | undefined>;

// Required version of all derived card properties — single source of truth
export type LorcanaCardDerived = {
  cardType: "character" | "action" | "item" | "location";
  exerted: boolean;
  drying: boolean;
  damage: number;
  canBePutInInkwell: boolean;
  hasSupport: boolean;
  hasReckless: boolean;
  hasRush: boolean;
  hasEvasive: boolean;
  hasQuestRestriction: boolean;
  classifications: string[];
  fullName: string;
  keywords: string[];
  keywordValues: ProjectedKeywordValues;
  temporaryAbilities: Record<string, number>;
  temporaryAbilityStarts: Record<string, number>;
  temporaryRestrictions: Record<string, number>;
  temporaryRestrictionStarts: Record<string, number>;
  strength: number;
  willpower: number;
  lore: number;
  moveCost: number;
  playCost: number;
  shiftInkCost?: number;
  shiftPlayCost?: number;
  grantedAbilityTextEntries: Array<{
    title: string;
    description?: string;
    sourceId?: string;
    sourceDefinitionId?: string;
  }>;
  keywordGrantSources: Array<{
    keyword: string;
    sourceId: string;
    sourceDefinitionId?: string;
  }>;
  statModifierSources: Array<{
    stat: string;
    amount: number;
    sourceId: string;
    sourceDefinitionId?: string;
  }>;
};

// Network-optimized projection: undefined = use definition default, saves bandwidth
export type ProjectedLorcanaCardDerived = Partial<LorcanaCardDerived>;

export type LorcanaBoardZoneId = "deck" | "hand" | "play" | "inkwell" | "discard" | "limbo";

export type LorcanaProjectedCard = {
  id: CardInstanceId | string;
  ownerId: PlayerId;
  controllerId?: PlayerId;
  zone: LorcanaBoardZoneId;
  zoneIndex?: number;
  hidden?: boolean;
  definitionId?: string;
  atLocationId?: CardInstanceId;
  cardsUnder?: CardInstanceId[];
  stackParentId?: CardInstanceId;
  playedViaShift?: boolean;
  /** Face state of this card (relevant for limbo/inkwell cards visible to all players) */
  publicFaceState?: "faceUp" | "faceDown";
} & ProjectedLorcanaCardDerived;

export type LorcanaProjectedCardId = CardInstanceId | string;

export type LorcanaProjectedPlayerBoard = {
  lore: number;
  canAddCardToInkwell: boolean;
  handCount: number;
  deckCount: number;
  deckTop?: LorcanaProjectedCardId;
  deckBottom?: LorcanaProjectedCardId;
  hand: LorcanaProjectedCardId[];
  play: LorcanaProjectedCardId[];
  inkwell: LorcanaProjectedCardId[];
  discard: LorcanaProjectedCardId[];
  /** Limbo card IDs that have active play-from-under permissions this turn */
  playableFromUnderCardIds?: LorcanaProjectedCardId[];
};

export type LorcanaProjectedTimerView = {
  serverTimestamp: number;
  players?: Record<string, ClockSnapshot>;
};

export type LorcanaProjectedPendingEffect = EnginePendingEffectProjection & {
  abilityIndex?: number;
  selectionContext?: ResolutionSelectionContext;
};

export type LorcanaProjectedBagEffect = {
  id: string;
  type: string;
  controllerId: PlayerId;
  chooserId: PlayerId;
  sourceId?: string;
  abilityIndex?: number;
  payload: unknown;
  selectionContext?: ResolutionSelectionContext;
};

export type LorcanaProjectedPendingChoice = {
  type: string;
  playerID: PlayerId;
  requestID: string;
};

export type LorcanaProjectedBoardView = {
  gameID: string;
  matchID: string;
  stateID: number;
  playerOrder: PlayerId[];
  turnPlayer: PlayerId | null;
  priorityPlayer: PlayerId | null;
  turnNumber: number;
  phase?: string;
  gameSegment?: string;
  step?: string | null;
  openingTurnPlayer?: PlayerId | null;
  pendingMulligan: PlayerId[];
  choosingFirstPlayer?: PlayerId | null;
  status: "playing" | "finished";
  winner: PlayerId | string | null;
  reason: string | null;
  timerView: LorcanaProjectedTimerView;
  players: Record<string, LorcanaProjectedPlayerBoard>;
  cards: Record<string, LorcanaProjectedCard>;
  activeEffects: EngineActiveEffectProjection[];
  pendingEffects: LorcanaProjectedPendingEffect[];
  pendingChoice?: LorcanaProjectedPendingChoice;
  bagEffects: LorcanaProjectedBagEffect[];
  playerEffectSourceIds?: Record<string, string[]>;
  temporaryPlayerRestrictions?: Record<string, Record<string, number>>;
};
