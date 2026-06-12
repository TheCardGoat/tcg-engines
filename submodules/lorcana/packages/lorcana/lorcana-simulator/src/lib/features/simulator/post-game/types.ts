import type { LorcanaProjectedBoardView } from "@tcg/lorcana-engine";
import type {
  ExecutableMovePresentationCategoryId,
  LorcanaPlayerSide,
  MoveLogEntrySnapshot,
} from "@/features/simulator/model/contracts.js";
import type { EventLogSegment } from "@/features/simulator/model/event-log-formatting.js";
import type { GameAnalyticsSummary } from "./notes-api.js";

export type PostGameViewerResult = "victory" | "defeat" | "spectator" | "unknown";
export type PostGameSectionId = "overview" | "timeline" | "notes";
export type PostGameActorTone = "self" | "opponent" | "playerOne" | "playerTwo" | "system";
export type PostGameTimelineIconId = ExecutableMovePresentationCategoryId | "system";

export interface PostGameActionCounters {
  cardsPlayed: number;
  inked: number;
  quests: number;
  challengeInitiations: number;
  movesToLocations: number;
  abilityActivations: number;
  effectResolutions: number;
  passes: number;
  concedes: number;
}

export interface PostGamePlayerBoardSummary {
  side: LorcanaPlayerSide;
  lore: number;
  deckCount: number;
  handCount: number;
  discardCount: number;
  inkwellCount: number;
  availableInk: number | null;
  boardCount: number;
  readyCount: number;
  exertedCount: number;
}

export interface PostGameOutcomeSummary {
  winnerSide: LorcanaPlayerSide | null;
  loserSide: LorcanaPlayerSide | null;
  reason: string | null;
  finalTurnNumber: number;
  viewerSide: LorcanaPlayerSide | null;
  viewerResult: PostGameViewerResult;
}

export interface PostGameSpotlightCard {
  id: string;
  cardId: string;
  label: string;
  ownerSide: LorcanaPlayerSide | null;
  value: number;
  detail: string;
}

export interface PostGameSpotlightAbility {
  id: string;
  label: string;
  cardId: string | null;
  cardLabel: string | null;
  ownerSide: LorcanaPlayerSide | null;
  count: number;
}

export interface PostGameHighlight {
  id: string;
  title: string;
  detail: string;
  emphasis?: boolean;
  turnNumber?: number;
  actorSide?: LorcanaPlayerSide | null;
}

export interface PostGameTypedMessageSummary {
  key: string;
  text: string;
}

export interface PostGameForensicEntry {
  id: string;
  turnNumber: number;
  timestamp: number;
  moveId: MoveLogEntrySnapshot["moveId"];
  actorSide: LorcanaPlayerSide | null;
  actorTone: PostGameActorTone;
  moveCategoryId: ExecutableMovePresentationCategoryId;
  moveCategoryLabel: string;
  timelineIconId: PostGameTimelineIconId;
  text: string;
  source: "typed" | "fallback";
  segments: EventLogSegment[];
  typedMessages: PostGameTypedMessageSummary[];
}

export interface PostGameTurnSummary {
  id: string;
  turnNumber: number;
  actorSide: LorcanaPlayerSide | null;
  startedAt: number;
  endedAt: number;
  durationMs: number;
  moveCount: number;
  actions: PostGameForensicEntry[];
}

export interface PostGameSummary {
  board: LorcanaProjectedBoardView;
  outcome: PostGameOutcomeSummary;
  players: Record<LorcanaPlayerSide, PostGamePlayerBoardSummary>;
  countersBySide: Record<LorcanaPlayerSide, PostGameActionCounters>;
  topLoreContributors: PostGameSpotlightCard[];
  mostPlayedCards: PostGameSpotlightCard[];
  mostInvolvedChallengeCards: PostGameSpotlightCard[];
  mostTriggeredAbilities: PostGameSpotlightAbility[];
  highlights: PostGameHighlight[];
  timeline: PostGameForensicEntry[];
  turns: PostGameTurnSummary[];
  totalLogEntries: number;
  /** Full analytics record — present when source is "analytics" (persisted games) */
  analytics?: GameAnalyticsSummary;
}

export interface PostGameNoteState {
  value: string;
  lastSavedValue: string;
  isLoading: boolean;
  isSaving: boolean;
  loaded: boolean;
  error: string | null;
}
