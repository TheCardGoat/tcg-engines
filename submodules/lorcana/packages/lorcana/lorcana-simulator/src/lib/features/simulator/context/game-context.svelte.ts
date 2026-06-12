import { getContext, hasContext, onDestroy, onMount, setContext, untrack } from "svelte";
import { getLocale, locales, setLocale } from "$lib/paraglide/runtime.js";
import { m } from "$lib/i18n/messages.js";
import { searchCardsByName } from "@tcg/lorcana-cards/data";
import {
  updateUserSettings,
  updateUserVisualSettings,
} from "@/features/settings/user-settings-api.js";
import type {
  AvailableMove,
  CardInstanceId,
  ChallengePreviewResult,
  EnginePacketUpdate,
  LorcanaCardDefinition,
  MoveOptionSelectableCost,
  MoveOptionSelectableCostKind,
  PlayCardDisabledReason,
  ProtocolError,
  ResolutionSelectionContext,
  ResolutionSelectionDestinationRule,
  ResolutionSelectionRevealedCard,
  TargetResolutionSelectionContext,
} from "@tcg/lorcana-engine";
import type {
  CardInput,
  LorcanaCardTarget,
  LorcanaEngineBase,
  LorcanaProjectedBoardView,
} from "@tcg/lorcana-engine";
import type { SelectorScope } from "@tcg/lorcana-types";

import {
  type AvailableMovesSelectionEntry,
  type AvailableMovesSelectionState,
  type CardActionView,
  type ExecutableMovePresentationCategoryId,
  getActiveSide,
  getAvailableInkForSide,
  getOwnerIdForSide as getOwnerIdForSideFromBoard,
  getSideForOwnerId,
  getTurnSide,
  getZoneCardIds,
  getZoneCardCount,
  isZoneMasked as isBoardZoneMasked,
  type ExecutableMoveEntry,
  type LorcanaCardSnapshot,
  type LorcanaPlayerSide,
  type LorcanaPlayerSummary,
  type MoveCategorySummary,
  type ResolutionActionView,
  type LorcanaSimulatorLocale,
  type LorcanaSimulatorReadModel,
  type LorcanaSimulatorMoveId,
  type LorcanaSimulatorMoveParams,
  type LorcanaTableSeat,
  type LorcanaZoneId,
  type MoveLogEntrySnapshot,
  type PendingResolutionMoveEntry,
  type ResolutionAmountSelectionState,
  type SimulatorMoveError,
} from "@/features/simulator/model/contracts.js";
import {
  buildCardActionViews,
  getCardActionSourceCardId,
  getCardActionTargetCardId,
} from "@/features/simulator/model/card-action-presenter.js";
import {
  type CardSnapshotMap,
  buildCardSnapshotMap,
  getCardsForZone,
  mergeSupplementalScryCardSnapshots,
} from "@/features/simulator/model/board-utils.js";
import {
  getBagEffectPayloadMeta,
  getPendingEffectPayloadMeta,
  getResolutionEffectInstanceReferences,
  type EffectInstanceReferenceMeta,
} from "@/features/simulator/model/pending-effect-payload.js";
import {
  buildSlottedTargetsFromSelection,
  getResolutionTargetPromptMessage,
  isSupportedResolutionTargetEffectType,
  type SupportedResolutionTargetEffectType,
} from "@/features/simulator/model/resolution-target-prompt.js";
import { SLOTTED_TARGET_SLOT_KEYS, analyzeResolutionRequirements } from "@tcg/lorcana-engine";
import {
  buildResolutionCopyBundle,
  buildScryOverlayHeaderHeading,
  getResolutionInteractionStatusMessage,
} from "@/features/simulator/model/resolution-copy.js";
import {
  canAssignCardToScryDestination,
  getScryDestinationConstraintSummary,
  getScryZoneLabel,
  isScryDestinationManuallyOrdered,
} from "@/features/simulator/model/scry-destinations.js";
import { buildResolutionActionViews } from "@/features/simulator/model/resolution-actions.js";
import {
  areExecutableMovesEqual,
  areMoveCategorySummariesEqual,
  areOrderedStringArraysEqual,
  arePendingResolutionMovesEqual,
  areStringRecordsEqual,
  buildChallengeReadyCardIds,
  buildChallengeState,
  buildExecutableMoves,
  buildMoveCategorySummaries,
  buildPendingResolutionMoves,
  buildPlayableHandCardIds,
  canValidateInk,
  expandCardActionCategoryMoves,
  expandCardMoves,
  expandCategoryMoves,
  getPlayerSummary as getDerivedPlayerSummary,
} from "@/features/simulator/model/derived-state.js";
import {
  buildPendingMoveError,
  dispatchSimulatorMove,
} from "@/features/simulator/model/move-dispatch.js";
import {
  getLorcanaPlayerVisualSettings,
  type LorcanaPlayerSettingsMap,
  type LorcanaPlayerVisualSettings,
  type LorcanaResolvedPlayerVisualSettings,
} from "@/features/simulator/model/player-visual-settings.js";
import type { PlayerMatchMetadata } from "@/features/simulator/model/player-match-metadata.js";
import { LorcanaBoardPresenter } from "@/features/simulator/presenters/board-presenter.svelte.js";
import type {
  ActivePlayerGuidanceController,
  ActivePlayerGuidanceItem,
  GuidanceAction,
  GuidanceInlineReference,
  GuidancePosition,
  GuidanceTargetSlot,
  NamedCardSearchState,
} from "@/features/simulator/model/active-player-guidance.js";
import { buildResolutionAmountSelectionState } from "@/features/simulator/model/resolution-amount-selection.js";
import {
  buildPlayerInteractionView,
  type PlayerInteractionView,
  type PromptSlot,
} from "@tcg/lorcana-interaction";
import type { PlayerId } from "@tcg/lorcana-types";
import type {
  BoardAnchorSnapshot,
  BoardAnchorRect,
  BoardLocalRect,
  ResolvedBoardMoveAnimation,
  SimulatorDebugAnimationPlayer,
  SimulatorDebugAnimationRequest,
} from "@/features/simulator/animations/board-move-animations.js";
import {
  BOARD_CENTER_ANCHOR_ID,
  VARIANT_DURATION_MS,
  createCardAnchorId,
  createInkwellEntryAnchorId,
  createSeatHandAnchorId,
  createZoneAnchorId,
  deriveQueuedBoardMoveAnimationsFromPacket,
  getAnimationSpeedMultiplier,
} from "@/features/simulator/animations/board-move-animations.js";
import {
  createLoreBadgeAnchorId,
  deriveQueuedQuestAnimationsFromPacket,
  type ResolvedQuestAnimation,
} from "@/features/simulator/animations/quest-animations.js";
import {
  deriveQueuedChallengeAnimationsFromPacket,
  type ResolvedChallengeAnimation,
} from "@/features/simulator/animations/challenge-animations.js";
import {
  deriveResolvedActionAnimationsFromPacket,
  type ResolvedActionAnimation,
  type ResolvedActionAnimationTarget,
} from "@/features/simulator/animations/action-animations.js";
import {
  deriveQueuedOverlayAnnouncementsFromPacket,
  type ResolvedOverlayAnnouncement,
} from "@/features/simulator/animations/overlay-announcement-animations.js";
import {
  deriveCardEffectDamageResult,
  deriveQueuedCardEffectAnimationsFromPacket,
  type ResolvedCardEffectAnimation,
  type ResolvedCardEffectDamageTarget,
} from "@/features/simulator/animations/card-effect-animations.js";
import {
  deriveQueuedPlayerEffectAnimationsFromPacket,
  type QueuedPlayerEffectAnimation,
} from "@/features/simulator/animations/player-effect-animations.js";
import {
  AnimationOrchestrator,
  type BoardAnimationPlaceholder,
} from "@/features/simulator/animations/animation-orchestrator.svelte.js";
import {
  getMoveCategoryId,
  getMoveCategoryLabel,
} from "@/features/simulator/model/move-presentation.js";
import {
  initSoundService,
  setSoundVolume as setSoundServiceVolume,
  disposeSoundService,
  playSound,
  boardMoveVariantToSoundId,
  cardEffectKindToSoundId,
  overlayKindToSoundId,
} from "@/features/simulator/animations/sound-service.js";
import { trackEvent } from "$lib/analytics/analytics.js";

const LORCANA_GAME_CONTEXT_KEY = Symbol.for("lorcana.game");
const LORCANA_SIDEBAR_PRESENTER_CONTEXT_KEY = Symbol.for("lorcana.sidebar-presenter");
const RAW_LOG_REGISTRY_STORAGE_KEY = "lorcana.simulator.rawLogRegistryJson";

export type {
  CardPreviewMode,
  CardInfoMode,
  PrimaryClickAction,
  AnimationSpeed,
  HotkeyMode,
  SupportedLocale,
} from "@/features/settings/player-settings-store.svelte.js";

import type {
  CardPreviewMode,
  CardInfoMode,
  PrimaryClickAction,
  AnimationSpeed,
  HotkeyMode,
  SupportedLocale,
} from "@/features/settings/player-settings-store.svelte.js";

import {
  PlayerSettingsStore,
  type ServerGameplaySettings,
} from "@/features/settings/player-settings-store.svelte.js";
import { getLogger } from "@logtape/logtape";

const sidebarLogger = getLogger(["tcg", "simulator", "sidebar-presenter"]);

export const ANIMATION_SPEED_MS: Record<AnimationSpeed, number> = {
  off: 0,
  fast: 250,
  normal: 500,
  slow: 750,
};

// Challenge animations include a result panel that requires more time to read.
// These durations are longer than the base ANIMATION_SPEED_MS values.
export const CHALLENGE_ANIMATION_DURATION_MS: Record<AnimationSpeed, number> = {
  off: 0,
  fast: 900,
  normal: 1250,
  slow: 1600,
};

export const ACTION_ANIMATION_DURATION_MS: Record<AnimationSpeed, number> = {
  off: 0,
  fast: 900,
  normal: 1250,
  slow: 1600,
};

export const QUEST_ROTATION_DURATION_MS: Record<AnimationSpeed, number> = {
  off: 0,
  fast: 125,
  normal: 200,
  slow: 300,
};

const SECOND_LAYER_GUIDANCE_ID = "available-moves-second-layer";

type BoardAnimationBatch = ResolvedBoardMoveAnimation[];

export type PregamePhase = "chooseFirstPlayer" | "mulligan";

export interface ExecuteMoveOptions {
  clearChallengeMode?: boolean;
  clearSelection?: boolean;
  status?: string;
}

export interface PendingEffectsPopoverItem {
  id: string;
  kind: "bag" | "pending";
  title: string;
  secondaryTitle?: string;
  summaryTitle?: string;
  subtitle: string;
  detail: string;
  badge: string;
  card: LorcanaCardSnapshot | null;
  instanceReferences?: PendingEffectCardReferenceView[];
  isActive?: boolean;
  isLocalPlayer?: boolean;
  canResolve?: boolean;
  canAccept?: boolean;
  canReject?: boolean;
  disabledReason?: string;
  statusMessage?: string;
  primaryActionLabel?: string;
  onResolve?: () => void;
  onPrimaryAction?: () => void;
  onAccept?: () => void;
  onReject?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  inlineActions?: GuidanceAction[];
  namedCardSearch?: NamedCardSearchState;
}

export interface PendingEffectCardReferenceView {
  id: string;
  label: string;
  cardId: string;
  card: LorcanaCardSnapshot | null;
}

export interface LorcanaGameContextValue {
  boardSnapshot: () => LorcanaProjectedBoardView | null;
  cardSnapshotsById: () => CardSnapshotMap;
  /** Reactive view of the active engine prompt for the local viewer; `null` when no prompt or pre-game. */
  readonly interactionView: PlayerInteractionView | null;
  resolveCardSnapshot: (cardId: string) => LorcanaCardSnapshot | null;
  resolveStaticCardSnapshot: (cardId: string) => LorcanaCardSnapshot | null;
  /**
   * Resolves a card instance id to its display name via the immutable static
   * resources. Unlike `resolveCardSnapshot`, this never reflects live board
   * state — historical log entries always render the correct card name.
   */
  resolveCardName: (cardId: string) => string | null;
  /**
   * Returns whether the card definition is inkable. Used by event-log
   * formatting to inject the inkable indicator next to ink moves without
   * needing the live board projection.
   */
  resolveCardInkable: (cardId: string) => boolean | null;
  resolvePlayerName: (playerId: string) => string | null;
  isPlayerMobile: (playerId: string) => boolean;
  getPlayerMmr: (playerId: string) => number | undefined;
  getPlayerBracketId: (playerId: string) => string | undefined;
  getPlayerSubscriptionTier: (playerId: string) => string | undefined;
  getPlayerSummary: (side: LorcanaPlayerSide) => LorcanaPlayerSummary | null;
  executableMoves: () => ExecutableMoveEntry[];
  moveCategorySummaries: () => MoveCategorySummary[];
  moveCategoryCount: () => number;
  expandCardMoves: (cardId: string) => ExecutableMoveEntry[];
  expandCardActionCategoryMoves: (
    cardId: string,
    categoryId: ExecutableMovePresentationCategoryId,
  ) => ExecutableMoveEntry[];
  expandCategoryMoves: (categoryId: ExecutableMovePresentationCategoryId) => ExecutableMoveEntry[];
  /**
   * Per-category disabled-reason accessors. Each returns the structured
   * engine reason for why a given CTA can't be triggered, or `null` if it
   * can (or doesn't apply — e.g. shift on a non-shift card). The UI maps
   * the reason to a localized tooltip via `formatPlayCardDisabledReason`.
   */
  getStandardPlayDisabledReason: (cardId: string) => PlayCardDisabledReason | null;
  getShiftPlayDisabledReason: (cardId: string) => PlayCardDisabledReason | null;
  getSingPlayDisabledReason: (cardId: string) => PlayCardDisabledReason | null;
  getInkActionDisabledReason: (cardId: string) => string | null;
  challengeReadyCardIds: () => string[];
  moveLogEntries: () => MoveLogEntrySnapshot[];
  pendingResolutionMoves: () => PendingResolutionMoveEntry[];
  playableHandCardIds: () => string[];
  validChallengeTargetIds: () => string[];
  invalidChallengeTargetReasons: () => Record<string, string>;
  ownerSide: () => LorcanaPlayerSide | null;
  pregameActiveSide: () => LorcanaPlayerSide | null;
  pregamePhase: () => PregamePhase | null;
  canActInPregame: () => boolean;
  statusMessage: () => string;
  selectedCardId: () => string | null;
  selectedMulliganCardIds: () => string[];
  pendingErrorReason: () => string | null;
  pendingMoveError: () => SimulatorMoveError | null;
  pendingResolutionAutoOpenStateId: () => number | null;
  isOptimisticMovePending: () => boolean;
  challengeSourceCardId: () => string | null;
  challengeMode: () => boolean;
  animations: () => ResolvedBoardMoveAnimation[];
  questAnimations: () => ResolvedQuestAnimation[];
  challengeAnimations: () => ResolvedChallengeAnimation[];
  actionAnimations: () => ResolvedActionAnimation[];
  overlayAnnouncements: () => ResolvedOverlayAnnouncement[];
  cardEffectAnimations: () => ResolvedCardEffectAnimation[];
  activePlayerEffectTargets: () => ReadonlySet<LorcanaPlayerSide>;
  boardAnimationPlaceholders: () => BoardAnimationPlaceholder[];
  inFlightCardIds: () => ReadonlySet<string>;
  animationSpeed: () => AnimationSpeed;
  setAnimationSpeed: (speed: AnimationSpeed) => void;
  soundVolume: () => number;
  setSoundVolume: (volume: number) => void;
  showZoneCounters: () => boolean;
  setShowZoneCounters: (show: boolean) => void;
  previewChallenge: (attackerId: string, defenderId: string) => ChallengePreviewResult | null;
  executeMove: <K extends LorcanaSimulatorMoveId>(
    moveId: K,
    params: LorcanaSimulatorMoveParams[K],
    options?: ExecuteMoveOptions,
  ) => boolean;
  playCard: (cardId: string) => boolean;
  ink: (cardId: string) => boolean;
  canMoveCharacterToLocation: (characterId: string, locationId: string) => boolean;
  canDropHandCardIntoZone: (
    cardId: string,
    zoneId: Extract<LorcanaZoneId, "play" | "inkwell">,
  ) => boolean;
  shouldOpenPlayCardSelectionOnDrop: (cardId: string) => boolean;
  handleBoardAnchorsChange: (anchors: BoardAnchorSnapshot) => void;
  onBoardAnimationFinished: (animationId: string) => void;
  onQuestAnimationFinished: (animationId: string) => void;
  onChallengeAnimationFinished: (animationId: string) => void;
  onActionAnimationFinished: (animationId: string) => void;
  onCardEffectAnimationFinished: (animationId: string) => void;
  onOverlayAnnouncementFinished: (animationId: string) => void;
  getOwnerIdForSide: (side: LorcanaPlayerSide) => string | null;
  getRelativePlayerLabel: (side: LorcanaPlayerSide) => string;
  getPlayerVisualSettings: (side: LorcanaPlayerSide) => LorcanaResolvedPlayerVisualSettings;
  getPlayerVisualSettingsByOwnerId: (
    ownerId: string | null | undefined,
  ) => LorcanaResolvedPlayerVisualSettings;
  getOwnPlayerVisualSettings: () => LorcanaPlayerVisualSettings | undefined;
  setOwnPlayerVisualSettings: (settings: LorcanaPlayerVisualSettings) => void;
  setSelectedCardId: (nextSelectedCardId: string | null) => void;
  setSelectedMulliganCardIds: (nextSelectedMulliganCardIds: string[]) => void;
  setChallengeSourceCardId: (nextChallengeSourceCardId: string | null) => void;
  setPendingError: (nextPendingErrorReason: string | null) => void;
  setStatusMessage: (nextStatusMessage: string) => void;
  handleLocaleChanged: () => void;
  runAnimation: (animation: SimulatorDebugAnimationRequest) => boolean;
  runQuestAnimation: (cardId: string, side: LorcanaPlayerSide, loreGained: number) => boolean;
  runChallengeAnimation: (
    attackerId: string,
    defenderId: string,
    side: LorcanaPlayerSide,
    preview: {
      attackerDamageDealt: number;
      defenderDamageDealt: number;
      defenderKind: "character" | "location";
      attackerWouldBeBanished: boolean;
      defenderWouldBeBanished: boolean;
      attackerDamageIsReduced: boolean;
      defenderDamageIsReduced: boolean;
    },
  ) => boolean;
}

interface DerivedStateSnapshot {
  challengeReadyCardIds: string[];
  moveCategorySummaries: MoveCategorySummary[];
  invalidChallengeTargetReasons: Record<string, string>;
  pendingResolutionMoves: PendingResolutionMoveEntry[];
  playableHandCardIds: string[];
  validChallengeTargetIds: string[];
}

export interface SetLorcanaGameContextOptions {
  engine: LorcanaEngineBase;
  readModel?: SimulatorShellReadModel;
  playerSettings?: LorcanaPlayerSettingsMap;
  playerMetadataMap?: Record<string, PlayerMatchMetadata>;
  debugPerformance?: boolean;
}

type SimulatorShellReadModel = Pick<LorcanaSimulatorReadModel, "getMoveLog"> &
  Partial<Pick<LorcanaSimulatorReadModel, "subscribeStateUpdates">>;

const LORCANA_PREGAME_SEGMENT_ID = "startingAGame";
// Safety buffer for the fallback timeout. Primary completion is now detected
// via WAAPI (.finished promise) in the animation layer. This timeout only fires
// if the WAAPI callback doesn't (e.g., prefers-reduced-motion disables the
// CSS animation, or the element is removed before the animation starts).
const BOARD_ANIMATION_SAFETY_BUFFER_MS = 250;
const DEBUG_ACTION_PREVIEW_DURATION_MS = 1000;
const DEBUG_REACTIVITY_LOGS = false;
const DEBUG_PERFORMANCE_LOGS = false;

function normalizePregamePhase(phase?: string): PregamePhase | null {
  if (phase === "chooseFirstPlayer" || phase === "chooseFirtPlayer") {
    return "chooseFirstPlayer";
  }
  if (phase === "mulligan") {
    return "mulligan";
  }
  return null;
}

function debugLog(scope: string, message: string, payload?: Record<string, unknown>): void {
  if (!DEBUG_REACTIVITY_LOGS) {
    return;
  }

  if (payload) {
    console.log(`[LorcanaGameContext:${scope}] ${message}`, payload);
    return;
  }

  console.log(`[LorcanaGameContext:${scope}] ${message}`);
}

function now(): number {
  return globalThis.performance?.now() ?? Date.now();
}

function stableSerialize(value: unknown): string {
  if (value === undefined) return "undefined";
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((entry) => stableSerialize(entry)).join(",")}]`;

  const entries = Object.entries(value as Record<string, unknown>).sort(([left], [right]) =>
    left.localeCompare(right),
  );
  return `{${entries.map(([key, entry]) => `${JSON.stringify(key)}:${stableSerialize(entry)}`).join(",")}}`;
}

function getPendingEffectReferenceLabel(kind: EffectInstanceReferenceMeta["kind"]): string {
  switch (kind) {
    case "trigger-subject":
      return "That card";
    case "chosen-or-source":
      return "Chosen card";
    case "revealed-first":
    case "revealed-all":
      return "Revealed card";
    case "selected-first":
    case "selected-all":
    case "previous-target":
      return "Selected card";
    case "trigger-source":
      return "Trigger source";
    case "attacker":
      return "Attacker";
    case "defender":
      return "Defender";
    case "singers":
      return "Singer";
    case "self":
    case "source":
    default:
      return "Source card";
  }
}

function buildPendingEffectCardReferenceViews(
  references: EffectInstanceReferenceMeta[],
  cardSnapshotsById: CardSnapshotMap,
): PendingEffectCardReferenceView[] {
  const views: PendingEffectCardReferenceView[] = [];
  const seen = new Set<string>();

  for (const reference of references) {
    for (const cardId of reference.cardIds) {
      const key = `${reference.kind}:${cardId}`;
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);

      const card = cardSnapshotsById[cardId] ?? null;
      if (!card) {
        continue;
      }

      views.push({
        id: key,
        label: getPendingEffectReferenceLabel(reference.kind),
        cardId,
        card,
      });
    }
  }

  return views;
}

function buildPendingEffectSummaryTitle(params: {
  title: string;
  secondaryTitle?: string;
  sourceCardId: string | null;
  instanceReferences: PendingEffectCardReferenceView[];
}): string {
  const primaryReference =
    params.instanceReferences.find((reference) => reference.cardId !== params.sourceCardId) ??
    params.instanceReferences[0];
  const secondaryTitle = params.secondaryTitle?.trim();
  const summaryPrefix = secondaryTitle
    ? `Resolving ${params.title}: ${secondaryTitle}`
    : `Resolving ${params.title}`;
  const targetReference =
    primaryReference && primaryReference.cardId !== params.sourceCardId ? primaryReference : null;
  const targetLabel = targetReference?.card?.label ?? targetReference?.cardId;

  return targetLabel ? `${summaryPrefix} targeting ${targetLabel}.` : `${summaryPrefix}.`;
}

function getPendingEffectSecondaryTitle(params: {
  sourceCard: LorcanaCardSnapshot | null;
  abilityIndex?: number | null;
  availableAbilityMoves: ExecutableMoveEntry[];
}): string | undefined {
  const { sourceCard, abilityIndex, availableAbilityMoves } = params;
  if (!sourceCard || sourceCard.cardType === "action") {
    return undefined;
  }

  if (typeof abilityIndex === "number") {
    const titledEntry = sourceCard.textEntries?.[abilityIndex]?.title?.trim();
    if (titledEntry) {
      return titledEntry;
    }
  }

  const titledEntries =
    sourceCard.textEntries
      ?.map((entry) => entry.title.trim())
      .filter((title) => title.length > 0) ?? [];

  if (titledEntries.length === 1) {
    return titledEntries[0];
  }

  const availableAbilityTitles = availableAbilityMoves
    .map((move) => {
      const abilityIndex = getMoveAbilityIndex(move);
      if (typeof abilityIndex !== "number") {
        return "";
      }

      return sourceCard.textEntries?.[abilityIndex]?.title?.trim() ?? "";
    })
    .filter((title) => title.length > 0);

  return availableAbilityTitles.length === 1 ? availableAbilityTitles[0] : undefined;
}

function getOwnerSideFromEngine(
  engine: LorcanaEngineBase,
  board: LorcanaProjectedBoardView,
): LorcanaPlayerSide | null {
  const clientPlayerId = engine.getClientPlayerId();
  return clientPlayerId ? getSideForOwnerId(board, clientPlayerId) : null;
}

function hasPacketUpdate(nextEngine: LorcanaEngineBase): nextEngine is LorcanaEngineBase & {
  getLastPacketUpdate: () => EnginePacketUpdate | null;
} {
  return (
    typeof (nextEngine as { getLastPacketUpdate?: unknown }).getLastPacketUpdate === "function"
  );
}

function hasMoveLog(
  nextEngine: LorcanaEngineBase,
): nextEngine is LorcanaEngineBase & { getMoveLog: (limit?: number) => MoveLogEntrySnapshot[] } {
  return typeof (nextEngine as { getMoveLog?: unknown }).getMoveLog === "function";
}

function hasReadModelStateSubscription(
  readModel: SimulatorShellReadModel | undefined,
): readModel is SimulatorShellReadModel & Pick<LorcanaSimulatorReadModel, "subscribeStateUpdates"> {
  return typeof readModel?.subscribeStateUpdates === "function";
}

function areMoveLogEntriesEqual(
  left: MoveLogEntrySnapshot[],
  right: MoveLogEntrySnapshot[],
): boolean {
  if (left.length !== right.length) {
    return false;
  }

  for (let index = 0; index < left.length; index += 1) {
    const leftEntry = left[index];
    const rightEntry = right[index];
    if (
      leftEntry.id !== rightEntry.id ||
      leftEntry.timestamp !== rightEntry.timestamp ||
      leftEntry.turnNumber !== rightEntry.turnNumber ||
      leftEntry.moveId !== rightEntry.moveId ||
      leftEntry.actorSide !== rightEntry.actorSide ||
      leftEntry.title !== rightEntry.title ||
      leftEntry.playerId !== rightEntry.playerId ||
      stableSerialize(leftEntry.params) !== stableSerialize(rightEntry.params) ||
      stableSerialize(leftEntry.typedLogEntry) !== stableSerialize(rightEntry.typedLogEntry)
    ) {
      return false;
    }
  }

  return true;
}

export class LorcanaGameContext implements LorcanaGameContextValue {
  #orchestrator = new AnimationOrchestrator({
    queueBoardAnimations: (animations) => this.#queueResolvedBoardAnimations(animations),
    fireQuestAnimations: (animations) => this.#fireQuestAnimations(animations),
    fireChallengeAnimations: (animations) => this.#fireChallengeAnimations(animations),
    fireCardEffectAnimations: (animations) => this.#fireCardEffectAnimations(animations),
    fireOverlayAnnouncements: (animations) => this.#fireOverlayAnnouncements(animations),
    firePlayerEffectAnimations: (animations) => this.#firePlayerEffectAnimations(animations),
  });
  #engine: LorcanaEngineBase | null = null;
  #gameStartTime = Date.now();
  #gameEndTracked = false;
  #gameJoinTracked = false;
  #firstMoveTracked = false;
  #mulliganTracked = false;
  #lastTrackedMoveAt: number | null = null;
  #matchAnalyticsContext: { mode?: string; format?: string; deckId?: string } = {};
  #readModel: SimulatorShellReadModel | undefined = undefined;
  #playerSettings = $state<LorcanaPlayerSettingsMap>({});
  #playerMetadata: Record<string, PlayerMatchMetadata> = {};
  #unsubscribeReadModelStateUpdates: (() => void) | null = null;
  #unsubscribeProtocolErrors: (() => void) | null = null;
  #lastStateID = $state(0);
  #lastVisibleRevision = $state<number | null>(null);
  #boardSnapshot = $state<LorcanaProjectedBoardView | null>(null);
  #cardSnapshotsById = $state<CardSnapshotMap>({});
  #selectedCardId = $state<string | null>(null);
  #selectedMulliganCardIds = $state<string[]>([]);
  #challengeSourceCardId = $state<string | null>(null);
  #pendingErrorReason = $state<string | null>(null);
  #pendingMoveError = $state<SimulatorMoveError | null>(null);
  #statusMessage = $state<string>(m["sim.status.ready"]({}));
  #ownerSide = $state<LorcanaPlayerSide | null>(null);
  #pendingResolutionAutoOpenStateId = $state<number | null>(null);
  // Perf: Lazy move expansion architecture.
  // #moveCategorySummaries is cheap to compute (no getMoveOptions() calls) and drives
  // the category list UI. Full ExecutableMoveEntry[] computation (which calls
  // getMoveOptions() for challenge/ability/location) is deferred to user interaction
  // (category click, card hover, DnD). #derivedStateVersion tracks cache invalidation
  // so lazy consumers know when to recompute.
  #moveCategorySummaries = $state<MoveCategorySummary[]>([]);
  #derivedStateVersion = $state(0);
  #currentAvailableMoves: AvailableMove[] = [];
  #currentLegalMoveIds: readonly string[] = [];
  #cachedExecutableMoves: ExecutableMoveEntry[] = [];
  #cachedExecutableMovesVersion: number = -1;
  #cachedExpandedCategoryMovesStateId: number = -1;
  #cachedExpandedCategoryMoves = new Map<
    ExecutableMovePresentationCategoryId,
    ExecutableMoveEntry[]
  >();
  #cachedExpandedCardMovesStateId: number = -1;
  #cachedExpandedCardMoves = new Map<string, ExecutableMoveEntry[]>();
  #cachedExpandedCardActionCategoryMovesStateId: number = -1;
  #cachedExpandedCardActionCategoryMoves = new Map<string, ExecutableMoveEntry[]>();
  #moveLogEntries = $state<MoveLogEntrySnapshot[]>([]);
  #challengeReadyCardIds = $state<string[]>([]);
  #playableHandCardIds = $state<string[]>([]);
  #validChallengeTargetIds = $state<string[]>([]);
  #invalidChallengeTargetReasons = $state<Record<string, string>>({});
  #pendingResolutionMoves = $state<PendingResolutionMoveEntry[]>([]);
  #boardAnchors = $state<BoardAnchorSnapshot | null>(null);
  #queuedBoardAnimations = $state<BoardAnimationBatch[]>([]);
  #activeBoardAnimations = $state<ResolvedBoardMoveAnimation[]>([]);
  #playedPacketAnimationIds = $state<string[]>([]);
  #activeQuestAnimations = $state<ResolvedQuestAnimation[]>([]);
  #questAnimationTimeouts: ReturnType<typeof setTimeout>[] = [];
  #activeChallengeAnimations = $state<ResolvedChallengeAnimation[]>([]);
  #challengeAnimationTimeouts: ReturnType<typeof setTimeout>[] = [];
  #activeActionAnimations = $state<ResolvedActionAnimation[]>([]);
  #pendingActionAnimationSources = $state<ResolvedActionAnimation[]>([]);
  #actionAnimationTimeouts: ReturnType<typeof setTimeout>[] = [];
  #activeOverlayAnnouncements = $state<ResolvedOverlayAnnouncement[]>([]);
  #overlayAnnouncementTimeouts: ReturnType<typeof setTimeout>[] = [];
  #activeCardEffectAnimations = $state<ResolvedCardEffectAnimation[]>([]);
  #cardEffectAnimationTimeouts: ReturnType<typeof setTimeout>[] = [];
  #activePlayerEffectTargets = $state<Set<LorcanaPlayerSide>>(new Set());
  #playerEffectAnimationTimeouts: ReturnType<typeof setTimeout>[] = [];
  #animationSpeed = $state<AnimationSpeed>("off");
  #soundVolume = $state<number>(50);
  #showZoneCounters = $state(false);
  #snapshotRefreshCallCount = 0;
  #previousMulliganContextKey: string | null = null;
  #boardAnimationTimeout: ReturnType<typeof setTimeout> | null = null;
  #debugPerformance = DEBUG_PERFORMANCE_LOGS;
  #cachedCardSnapshotStateID = -1;
  #cachedCardSnapshotMap: CardSnapshotMap = {};
  #cachedDerivedStateStateID = -1;
  #cachedChallengeStateStateID = -1;
  #cachedChallengeStates = new Map<
    string,
    { invalidReasons: Record<string, string>; validTargetIds: string[] }
  >();

  constructor(
    engine: LorcanaEngineBase,
    readModel?: SimulatorShellReadModel,
    playerSettings: LorcanaPlayerSettingsMap = {},
    playerMetadataMap: Record<string, PlayerMatchMetadata> = {},
    debugPerformance = DEBUG_PERFORMANCE_LOGS,
  ) {
    initSoundService();
    this.#debugPerformance = debugPerformance;
    this.#playerMetadata = playerMetadataMap;
    (globalThis as Record<string, unknown>).__TCG_DEBUG_PERFORMANCE__ = debugPerformance;
    this.syncEngine(engine, readModel, playerSettings);
  }

  get boardSnapshotValue(): LorcanaProjectedBoardView | null {
    return this.#boardSnapshot;
  }

  get pregamePhaseValue(): PregamePhase | null {
    return this.#boardSnapshot?.gameSegment === LORCANA_PREGAME_SEGMENT_ID
      ? normalizePregamePhase(this.#boardSnapshot.phase)
      : null;
  }

  get pregameActiveSideValue(): LorcanaPlayerSide | null {
    return this.#boardSnapshot ? getActiveSide(this.#boardSnapshot) : null;
  }

  get challengeModeValue(): boolean {
    return Boolean(this.#challengeSourceCardId);
  }

  get canActInPregameValue(): boolean {
    return Boolean(
      this.pregamePhaseValue && this.#ownerSide && this.pregameActiveSideValue === this.#ownerSide,
    );
  }

  readonly boardSnapshot = (): LorcanaProjectedBoardView | null => this.#boardSnapshot;
  readonly cardSnapshotsById = (): CardSnapshotMap => this.#cardSnapshotsById;

  /**
   * Renderer-agnostic view derived from the engine's projected board.
   * Single source of truth for what the local viewer can do — overlays,
   * dialogs, and the dispatcher all read from this.
   *
   * Returns `null` during pre-game / matchmaking when there is no board
   * yet. See `docs/player-interaction-rewrite.md` for the contract.
   */
  readonly interactionView = $derived.by((): PlayerInteractionView | null => {
    const snapshot = this.#boardSnapshot;
    if (!snapshot) return null;
    const localOwnerSide = this.#ownerSide;
    const localPlayerId = localOwnerSide ? this.getOwnerIdForSide(localOwnerSide) : null;
    if (!localPlayerId) return null;
    return buildPlayerInteractionView(snapshot, localPlayerId as PlayerId);
  });

  readonly resolvePlayerName = (playerId: string): string | null => {
    return this.#playerMetadata[playerId]?.displayName ?? null;
  };

  readonly isPlayerMobile = (playerId: string): boolean => {
    return this.#playerMetadata[playerId]?.isMobile ?? false;
  };

  readonly getPlayerMmr = (playerId: string): number | undefined => {
    return this.#playerMetadata[playerId]?.mmr;
  };

  readonly getPlayerBracketId = (playerId: string): string | undefined => {
    return this.#playerMetadata[playerId]?.bracketId;
  };

  readonly getPlayerSubscriptionTier = (playerId: string): string | undefined => {
    return this.#playerMetadata[playerId]?.subscriptionTier;
  };
  readonly #resolveStaticDefinition = (cardId: string): LorcanaCardDefinition | null => {
    const engine = this.#engine;
    if (!engine) {
      return null;
    }
    const definitionId = engine.staticResources.instances.get(cardId)?.definitionId ?? cardId;
    return (
      (engine.staticResources.cards.get(definitionId) as LorcanaCardDefinition | undefined) ?? null
    );
  };

  readonly resolveCardName = (cardId: string): string | null => {
    const definition = this.#resolveStaticDefinition(cardId);
    if (!definition) {
      return null;
    }
    return definition.version ? `${definition.name} - ${definition.version}` : definition.name;
  };

  readonly resolveCardInkable = (cardId: string): boolean | null => {
    const definition = this.#resolveStaticDefinition(cardId);
    return definition ? (definition.inkable ?? false) : null;
  };

  readonly resolveStaticCardSnapshot = (cardId: string): LorcanaCardSnapshot | null => {
    const engine = this.#engine;
    if (!engine) {
      return null;
    }

    const definitionId = engine.staticResources.instances.get(cardId)?.definitionId ?? cardId;
    const definition = engine.staticResources.cards.get(definitionId) as
      | LorcanaCardDefinition
      | undefined;
    if (!definition) {
      return null;
    }

    const label = definition.version
      ? `${definition.name} - ${definition.version}`
      : definition.name;

    return {
      cardId,
      definitionId,
      label,
      ownerId: "",
      ownerSide: this.#ownerSide ?? "playerOne",
      zoneId: "deck",
      isMasked: false,
      facePresentation: "faceUp",
      inkType: definition.inkType,
      inkable: definition.inkable,
      cardType: definition.cardType,
      actionSubtype:
        definition.cardType === "action" ? (definition.actionSubtype ?? undefined) : undefined,
      cost: definition.cost,
      playCost: definition.cost,
      loreValue:
        definition.cardType === "character" || definition.cardType === "location"
          ? (definition as { lore?: number }).lore
          : undefined,
      strength: definition.cardType === "character" ? definition.strength : undefined,
      willpower:
        definition.cardType === "character" || definition.cardType === "location"
          ? definition.willpower
          : undefined,
      cardNumber: definition.cardNumber,
      set: definition.set,
      rarity:
        definition.rarity === "common" ||
        definition.rarity === "uncommon" ||
        definition.rarity === "rare" ||
        definition.rarity === "super_rare" ||
        definition.rarity === "legendary" ||
        definition.rarity === "enchanted" ||
        definition.rarity === "iconic" ||
        definition.rarity === "promo"
          ? definition.rarity
          : undefined,
    };
  };

  readonly resolveCardSnapshot = (cardId: string): LorcanaCardSnapshot | null => {
    const snapshot = this.#cardSnapshotsById[cardId] ?? null;
    return snapshot ?? this.resolveStaticCardSnapshot(cardId);
  };
  readonly getPlayerSummary = (side: LorcanaPlayerSide): LorcanaPlayerSummary | null =>
    getDerivedPlayerSummary(side, this.#boardSnapshot, this.#cardSnapshotsById);
  // Perf: Lazy computation — buildExecutableMoves() (which calls getMoveOptions())
  // only runs when a consumer actually reads this getter, not on every state change.
  // The version-based cache ensures we recompute at most once per state change.
  // areExecutableMovesEqual preserves reference identity to avoid unnecessary Svelte rerenders.
  readonly executableMoves = (): ExecutableMoveEntry[] => {
    const version = this.#derivedStateVersion;
    if (this.#cachedExecutableMovesVersion === version) {
      return this.#cachedExecutableMoves;
    }
    const engine = this.#engine;
    if (!engine) {
      return this.#cachedExecutableMoves;
    }
    const newMoves = buildExecutableMoves(
      engine,
      this.#cardSnapshotsById,
      this.#currentAvailableMoves,
      this.#currentLegalMoveIds,
    );
    if (!areExecutableMovesEqual(this.#cachedExecutableMoves, newMoves)) {
      this.#cachedExecutableMoves = newMoves;
    }
    this.#cachedExecutableMovesVersion = version;
    return this.#cachedExecutableMoves;
  };
  readonly moveCategorySummaries = (): MoveCategorySummary[] => this.#moveCategorySummaries;
  readonly moveCategoryCount = (): number => this.#moveCategorySummaries.length;
  readonly expandCardMoves = (cardId: string): ExecutableMoveEntry[] => {
    const engine = this.#engine;
    if (!engine) return [];
    const stateId = this.#boardSnapshot?.stateID ?? -1;
    if (this.#cachedExpandedCardMovesStateId !== stateId) {
      this.#cachedExpandedCardMovesStateId = stateId;
      this.#cachedExpandedCardMoves.clear();
    }

    const cachedMoves = this.#cachedExpandedCardMoves.get(cardId);
    if (cachedMoves) {
      return cachedMoves;
    }

    const moves = expandCardMoves(
      engine,
      this.#cardSnapshotsById,
      this.#currentAvailableMoves,
      this.#currentLegalMoveIds,
      cardId,
    );
    this.#cachedExpandedCardMoves.set(cardId, moves);
    return moves;
  };
  readonly expandCardActionCategoryMoves = (
    cardId: string,
    categoryId: ExecutableMovePresentationCategoryId,
  ): ExecutableMoveEntry[] => {
    const engine = this.#engine;
    if (!engine) return [];
    const stateId = this.#boardSnapshot?.stateID ?? -1;
    if (this.#cachedExpandedCardActionCategoryMovesStateId !== stateId) {
      this.#cachedExpandedCardActionCategoryMovesStateId = stateId;
      this.#cachedExpandedCardActionCategoryMoves.clear();
    }

    const cacheKey = `${cardId}:${categoryId}`;
    const cachedMoves = this.#cachedExpandedCardActionCategoryMoves.get(cacheKey);
    if (cachedMoves) {
      return cachedMoves;
    }

    const moves = expandCardActionCategoryMoves(
      engine,
      this.#cardSnapshotsById,
      this.#currentAvailableMoves,
      this.#currentLegalMoveIds,
      cardId,
      categoryId,
    );
    this.#cachedExpandedCardActionCategoryMoves.set(cacheKey, moves);
    return moves;
  };
  readonly expandCategoryMoves = (
    categoryId: ExecutableMovePresentationCategoryId,
  ): ExecutableMoveEntry[] => {
    const engine = this.#engine;
    if (!engine) return [];
    const stateId = this.#boardSnapshot?.stateID ?? -1;
    if (this.#cachedExpandedCategoryMovesStateId !== stateId) {
      this.#cachedExpandedCategoryMovesStateId = stateId;
      this.#cachedExpandedCategoryMoves.clear();
    }

    const cachedMoves = this.#cachedExpandedCategoryMoves.get(categoryId);
    if (cachedMoves) {
      return cachedMoves;
    }

    const moves = expandCategoryMoves(
      engine,
      this.#cardSnapshotsById,
      this.#currentAvailableMoves,
      this.#currentLegalMoveIds,
      categoryId,
    );
    this.#cachedExpandedCategoryMoves.set(categoryId, moves);
    return moves;
  };
  readonly moveLogEntries = (): MoveLogEntrySnapshot[] => this.#moveLogEntries;
  readonly challengeReadyCardIds = (): string[] => this.#challengeReadyCardIds;
  readonly getStandardPlayDisabledReason = (cardId: string): PlayCardDisabledReason | null =>
    this.#engine?.getStandardPlayDisabledReason(cardId) ?? null;
  readonly getShiftPlayDisabledReason = (cardId: string): PlayCardDisabledReason | null =>
    this.#engine?.getShiftPlayDisabledReason(cardId) ?? null;
  readonly getSingPlayDisabledReason = (cardId: string): PlayCardDisabledReason | null =>
    this.#engine?.getSingPlayDisabledReason(cardId) ?? null;
  readonly getInkActionDisabledReason = (cardId: string): string | null => {
    const card = this.#cardSnapshotsById[cardId];
    if (!card || (card.zoneId !== "hand" && card.zoneId !== "discard")) {
      return null;
    }

    if (card.inkable === false) {
      return "This card does not have the inkwell symbol.";
    }

    const owner = this.#boardSnapshot?.players[card.ownerId];
    const inkedThisTurn = this.#engine?.getState().G.turnMetadata?.inkedThisTurn ?? [];
    if (owner?.canAddCardToInkwell === false && inkedThisTurn.length > 0) {
      return inkedThisTurn.length === 1
        ? "You already inked a card this turn."
        : "You already used all of your ink actions this turn.";
    }

    return null;
  };
  readonly pendingResolutionMoves = (): PendingResolutionMoveEntry[] =>
    this.#pendingResolutionMoves;
  readonly playableHandCardIds = (): string[] => this.#playableHandCardIds;
  readonly validChallengeTargetIds = (): string[] => this.#validChallengeTargetIds;
  readonly invalidChallengeTargetReasons = (): Record<string, string> =>
    this.#invalidChallengeTargetReasons;
  readonly ownerSide = (): LorcanaPlayerSide | null => this.#ownerSide;
  readonly pregameActiveSide = (): LorcanaPlayerSide | null => this.pregameActiveSideValue;
  readonly pregamePhase = (): PregamePhase | null => this.pregamePhaseValue;
  readonly canActInPregame = (): boolean => this.canActInPregameValue;
  readonly statusMessage = (): string => this.#statusMessage;
  readonly selectedCardId = (): string | null => this.#selectedCardId;
  readonly selectedMulliganCardIds = (): string[] => this.#selectedMulliganCardIds;
  readonly pendingErrorReason = (): string | null => this.#pendingErrorReason;
  readonly pendingMoveError = (): SimulatorMoveError | null => this.#pendingMoveError;
  readonly pendingResolutionAutoOpenStateId = (): number | null =>
    this.#pendingResolutionAutoOpenStateId;
  readonly isOptimisticMovePending = (): boolean =>
    this.#engine?.isOptimisticMovePending() ?? false;
  readonly challengeSourceCardId = (): string | null => this.#challengeSourceCardId;
  readonly challengeMode = (): boolean => this.challengeModeValue;
  readonly animations = (): ResolvedBoardMoveAnimation[] => this.#activeBoardAnimations;
  readonly questAnimations = (): ResolvedQuestAnimation[] => this.#activeQuestAnimations;
  readonly challengeAnimations = (): ResolvedChallengeAnimation[] =>
    this.#activeChallengeAnimations;
  readonly actionAnimations = (): ResolvedActionAnimation[] => this.#activeActionAnimations;
  readonly overlayAnnouncements = (): ResolvedOverlayAnnouncement[] =>
    this.#activeOverlayAnnouncements;
  readonly cardEffectAnimations = (): ResolvedCardEffectAnimation[] =>
    this.#activeCardEffectAnimations;
  readonly activePlayerEffectTargets = (): ReadonlySet<LorcanaPlayerSide> =>
    this.#activePlayerEffectTargets;
  readonly boardAnimationPlaceholders = (): BoardAnimationPlaceholder[] =>
    this.#orchestrator.placeholders;
  readonly inFlightCardIds = (): ReadonlySet<string> => this.#orchestrator.inFlightCardIds;
  readonly animationSpeed = (): AnimationSpeed => this.#animationSpeed;
  readonly setAnimationSpeed = (speed: AnimationSpeed): void => {
    this.#animationSpeed = speed;
  };
  readonly soundVolume = (): number => this.#soundVolume;
  readonly setSoundVolume = (volume: number): void => {
    if (!Number.isFinite(volume)) return;
    this.#soundVolume = Math.max(0, Math.min(100, Math.round(volume)));
    setSoundServiceVolume(this.#soundVolume);
  };
  readonly showZoneCounters = (): boolean => this.#showZoneCounters;
  readonly setShowZoneCounters = (show: boolean): void => {
    this.#showZoneCounters = show;
  };
  readonly previewChallenge = (
    attackerId: string,
    defenderId: string,
  ): ChallengePreviewResult | null =>
    this.#engine?.previewChallenge(attackerId as CardInstanceId, defenderId as CardInstanceId) ??
    null;

  syncEngine(
    nextEngine: LorcanaEngineBase,
    nextReadModel: SimulatorShellReadModel | undefined = this.#readModel,
    nextPlayerSettings: LorcanaPlayerSettingsMap = this.#playerSettings,
  ): void {
    if (
      this.#engine !== nextEngine ||
      this.#readModel !== nextReadModel ||
      this.#playerSettings !== nextPlayerSettings
    ) {
      // Only reset analytics latches/timing when the engine instance itself
      // changes (a new match). syncEngine also fires for benign refreshes
      // where only readModel or playerSettings references change — resetting
      // there would re-emit first-action timers and clobber game_end's
      // duration_seconds mid-match.
      const isEngineSwap = this.#engine !== nextEngine;
      this.#engine = nextEngine;
      this.#readModel = nextReadModel;
      this.#playerSettings = nextPlayerSettings;
      this.#subscribeToReadModelStateUpdates();
      this.#subscribeToProtocolErrors();
      this.#clearInteractionState();
      this.#resetBoardAnimations();
      this.#lastStateID = 0;
      this.#lastVisibleRevision = null;
      if (isEngineSwap) {
        this.#resetMatchAnalyticsState();
      }
      this.#refreshSnapshot("engine-change");
      return;
    }

    if (!this.#boardSnapshot) {
      this.#refreshSnapshot("initial-snapshot");
    }
  }

  destroy(): void {
    this.#unsubscribeFromReadModelStateUpdates();
    this.#unsubscribeFromProtocolErrors();
    this.#orchestrator.cancel();
    this.#clearBoardAnimationTimer();
    this.#clearQuestAnimationTimers();
    this.#clearChallengeAnimationTimers();
    this.#clearOverlayAnnouncementTimers();
    this.#clearCardEffectAnimationTimers();
    this.#clearPlayerEffectAnimationTimers();
    disposeSoundService();
  }

  #isGameFinished(): boolean {
    return this.#boardSnapshot?.status === "finished";
  }

  /** Player-facing move IDs that should be tracked (excludes manual/judge and resolution sub-steps). */
  static readonly #TRACKED_MOVE_IDS = new Set([
    "activateAbility",
    "challenge",
    "moveCharacterToLocation",
    "passTurn",
    "playCard",
    "putCardIntoInkwell",
    "quest",
    "questWithAll",
    "sing",
    "singTogether",
    "undo",
  ]);

  #trackMoveAnalytics<K extends LorcanaSimulatorMoveId>(
    moveId: K,
    params: LorcanaSimulatorMoveParams[K],
  ): void {
    const turn = this.#boardSnapshot?.turnNumber ?? 0;
    const now = Date.now();

    if (moveId === "concede") {
      trackEvent("game_concede");
    } else if (moveId === "chooseWhoGoesFirst") {
      const p = params as LorcanaSimulatorMoveParams["chooseWhoGoesFirst"];
      const playerId = this.#engine?.getClientPlayerId();
      trackEvent("game_pregame_first", { chose_first: p.playerId === playerId ? "true" : "false" });
    } else if (moveId === "alterHand") {
      const p = params as LorcanaSimulatorMoveParams["alterHand"];
      trackEvent("game_mulligan", { cards_mulliganed: p.cardsToMulligan.length });
      if (!this.#mulliganTracked) {
        this.#mulliganTracked = true;
        trackEvent("time_to_mulligan", { duration_ms: now - this.#gameStartTime });
      }
    } else if (LorcanaGameContext.#TRACKED_MOVE_IDS.has(moveId)) {
      const cardId = (params as { cardId?: string }).cardId;
      const msSincePrev =
        this.#lastTrackedMoveAt != null ? now - this.#lastTrackedMoveAt : undefined;
      trackEvent("game_move", {
        move_id: moveId,
        turn,
        actor_side: "self",
        ...(cardId ? { card_id: cardId } : {}),
        ...(msSincePrev != null ? { ms_since_prev_move: msSincePrev } : {}),
      });
      this.#lastTrackedMoveAt = now;
      if (!this.#firstMoveTracked) {
        this.#firstMoveTracked = true;
        trackEvent("time_to_first_move", { duration_ms: now - this.#gameStartTime });
      }
    }
  }

  /**
   * Reset per-match analytics latches and timing baselines. Called from
   * syncEngine() when a new engine instance is bound so a rematch in the same
   * page lifecycle gets a fresh game_join / time_to_first_move /
   * time_to_mulligan / game_end cycle.
   */
  #resetMatchAnalyticsState(): void {
    this.#gameJoinTracked = false;
    this.#firstMoveTracked = false;
    this.#mulliganTracked = false;
    this.#gameEndTracked = false;
    this.#lastTrackedMoveAt = null;
    this.#gameStartTime = Date.now();
    // Drop stale mode/format/deckId — setMatchAnalyticsContext merges partial
    // fields, so without an explicit reset a rematch where the caller forgets
    // to repopulate one of these would mislabel game_end with the prior
    // match's metadata.
    this.#matchAnalyticsContext = {};
  }

  /**
   * Provide match-level metadata for analytics enrichment (format, deck, mode).
   * The match page should call this once when a game is bound to the context;
   * absent metadata simply emits without those params (still valid GA4 events).
   */
  readonly setMatchAnalyticsContext = (ctx: {
    mode?: string;
    format?: string;
    deckId?: string;
  }): void => {
    this.#matchAnalyticsContext = { ...this.#matchAnalyticsContext, ...ctx };
  };

  readonly executeMove = <K extends LorcanaSimulatorMoveId>(
    moveId: K,
    params: LorcanaSimulatorMoveParams[K],
    options: ExecuteMoveOptions = {},
  ): boolean => {
    const engine = this.#engine;
    if (!engine || this.#isGameFinished()) {
      return false;
    }

    const playerId = engine.getClientPlayerId();
    if (!playerId) {
      const nextPendingMoveError = buildPendingMoveError(
        moveId,
        params,
        "View not found",
        "VIEW_NOT_FOUND",
      );
      this.#pendingMoveError = nextPendingMoveError;
      this.#pendingErrorReason = nextPendingMoveError.message;
      this.#statusMessage = m["sim.status.actionRejected"]({});
      return false;
    }

    const result = dispatchSimulatorMove(engine, playerId, moveId, params);

    if (!result.success) {
      const nextPendingMoveError = buildPendingMoveError(
        moveId,
        params,
        result.error,
        result.errorCode,
      );
      this.#pendingMoveError = nextPendingMoveError;
      this.#pendingErrorReason = nextPendingMoveError.message;
      this.#statusMessage = m["sim.status.actionRejected"]({});
      return false;
    }

    if (options.clearSelection) {
      this.#selectedCardId = null;
    }
    if (options.clearChallengeMode ?? true) {
      this.#challengeSourceCardId = null;
    }

    this.#pendingErrorReason = null;
    this.#pendingMoveError = null;
    this.#statusMessage = options.status ?? m["sim.status.actionExecuted"]({});
    this.#refreshSnapshot(`execute:${moveId}`);

    // Analytics: track player-facing moves
    this.#trackMoveAnalytics(moveId, params);
    this.#pendingResolutionAutoOpenStateId =
      moveId === "playCard" || moveId === "resolveBag" || moveId === "resolveEffect"
        ? this.#lastStateID
        : null;
    return true;
  };

  readonly playCard = (cardId: string): boolean => {
    const engine = this.#engine;
    if (!engine || this.#isGameFinished()) {
      return false;
    }

    const playerId = engine.getClientPlayerId();
    if (!playerId) {
      const nextPendingMoveError = buildPendingMoveError(
        "playCard",
        { cardId },
        "View not found",
        "VIEW_NOT_FOUND",
      );
      this.#pendingMoveError = nextPendingMoveError;
      this.#pendingErrorReason = nextPendingMoveError.message;
      this.#statusMessage = m["sim.status.actionRejected"]({});
      return false;
    }

    const cardInput = cardId as CardInput;
    const result = engine.playCard(playerId, cardInput, { cost: "standard" });
    if (!result.success) {
      const nextPendingMoveError = buildPendingMoveError(
        "playCard",
        { cardId },
        result.error,
        result.errorCode,
      );
      this.#pendingMoveError = nextPendingMoveError;
      this.#pendingErrorReason = nextPendingMoveError.message;
      this.#statusMessage = m["sim.status.actionRejected"]({});
      return false;
    }

    this.#selectedCardId = null;
    this.#challengeSourceCardId = null;
    this.#pendingErrorReason = null;
    this.#pendingMoveError = null;
    this.#statusMessage = m["sim.actions.label.playCard"]({});
    this.#refreshSnapshot("execute:playCard");
    this.#pendingResolutionAutoOpenStateId = this.#lastStateID;
    return true;
  };

  readonly ink = (cardId: string): boolean => {
    const engine = this.#engine;
    if (!engine || this.#isGameFinished()) {
      return false;
    }

    const playerId = engine.getClientPlayerId();
    if (!playerId) {
      const nextPendingMoveError = buildPendingMoveError(
        "putCardIntoInkwell",
        { cardId },
        "View not found",
        "VIEW_NOT_FOUND",
      );
      this.#pendingMoveError = nextPendingMoveError;
      this.#pendingErrorReason = nextPendingMoveError.message;
      this.#statusMessage = m["sim.status.actionRejected"]({});
      return false;
    }

    const cardInput = cardId as CardInput;
    const result = engine.ink(playerId, cardInput);
    if (!result.success) {
      const nextPendingMoveError = buildPendingMoveError(
        "putCardIntoInkwell",
        { cardId },
        result.error,
        result.errorCode,
      );
      this.#pendingMoveError = nextPendingMoveError;
      this.#pendingErrorReason = nextPendingMoveError.message;
      this.#statusMessage = m["sim.status.actionRejected"]({});
      return false;
    }

    this.#selectedCardId = null;
    this.#challengeSourceCardId = null;
    this.#pendingErrorReason = null;
    this.#pendingMoveError = null;
    this.#statusMessage = m["sim.actions.label.inkCard"]({});
    this.#refreshSnapshot("execute:putCardIntoInkwell");
    this.#pendingResolutionAutoOpenStateId = null;
    return true;
  };

  // Perf: Uses direct engine validation instead of scanning the full executableMoves array.
  // A single validateMove() call is cheaper than triggering lazy buildExecutableMoves().
  readonly canMoveCharacterToLocation = (characterId: string, locationId: string): boolean => {
    const engine = this.#engine;
    if (!engine || this.#isGameFinished()) return false;
    return engine.validateMove("moveCharacterToLocation", {
      args: {
        characterId: characterId as CardInstanceId,
        locationId: locationId as CardInstanceId,
      },
    }).valid;
  };

  readonly canDropHandCardIntoZone = (
    cardId: string,
    zoneId: Extract<LorcanaZoneId, "play" | "inkwell">,
  ): boolean => {
    const engine = this.#engine;
    const ownerSide = this.#ownerSide;
    const card = this.#cardSnapshotsById[cardId];
    if (
      !engine ||
      this.#isGameFinished() ||
      !ownerSide ||
      !card ||
      (card.zoneId !== "hand" && card.zoneId !== "limbo" && card.zoneId !== "discard") ||
      card.ownerSide !== ownerSide
    ) {
      return false;
    }

    if (zoneId === "play") {
      // Only allow dropping to play zone if the card can be played with standard
      // ink cost. Alternative costs (sing, shift) require explicit selection
      // through the action menu, not drag-and-drop.
      const playCardMove = this.#currentAvailableMoves.find((m) => m.moveId === "playCard");
      return playCardMove?.selectableCardIds.includes(cardId as CardInstanceId) ?? false;
    }

    return canValidateInk(engine, cardId);
  };

  readonly shouldOpenPlayCardSelectionOnDrop = (cardId: string): boolean => {
    const card = this.#cardSnapshotsById[cardId];
    if (!card || (card.zoneId !== "hand" && card.zoneId !== "limbo")) {
      return false;
    }

    return this.expandCardActionCategoryMoves(card.cardId, "play-card").length > 1;
  };

  readonly handleBoardAnchorsChange = (nextAnchors: BoardAnchorSnapshot): void => {
    this.#boardAnchors = nextAnchors;
    this.#orchestrator.resolveAnchors(nextAnchors);
  };

  // ── WAAPI completion callbacks ────────────────────────────────────────
  // Called by animation layer components when a CSS animation's .finished
  // promise resolves. The safety timeout in the fire methods acts as a
  // fallback if the callback never fires (e.g., prefers-reduced-motion).

  readonly onBoardAnimationFinished = (animationId: string): void => {
    if (this.#activeBoardAnimations.length === 0) {
      return;
    }

    const completedAnimation = this.#activeBoardAnimations.find(
      (animation) => animation.id === animationId,
    );
    if (!completedAnimation) {
      return;
    }

    const remainingActiveAnimations = this.#activeBoardAnimations.filter(
      (animation) => animation.id !== animationId,
    );
    this.#orchestrator.notifyBoardAnimationCompleted(
      completedAnimation.card.cardId,
      remainingActiveAnimations.map((animation) => animation.card.cardId),
      this.#queuedBoardAnimations.flatMap((batch) =>
        batch.map((animation) => animation.card.cardId),
      ),
    );

    this.#activeBoardAnimations = remainingActiveAnimations;

    if (this.#activeBoardAnimations.length === 0) {
      this.#clearBoardAnimationTimer();
      this.#playNextBoardAnimation();
    }
  };

  readonly onQuestAnimationFinished = (animationId: string): void => {
    this.#activeQuestAnimations = this.#activeQuestAnimations.filter((a) => a.id !== animationId);
  };

  readonly onChallengeAnimationFinished = (animationId: string): void => {
    this.#activeChallengeAnimations = this.#activeChallengeAnimations.filter(
      (a) => a.id !== animationId,
    );
  };

  readonly onActionAnimationFinished = (animationId: string): void => {
    this.#activeActionAnimations = this.#activeActionAnimations.filter((a) => a.id !== animationId);
  };

  readonly onCardEffectAnimationFinished = (animationId: string): void => {
    this.#activeCardEffectAnimations = this.#activeCardEffectAnimations.filter(
      (a) => a.id !== animationId,
    );
  };

  readonly onOverlayAnnouncementFinished = (animationId: string): void => {
    this.#activeOverlayAnnouncements = this.#activeOverlayAnnouncements.filter(
      (a) => a.id !== animationId,
    );
  };

  readonly getOwnerIdForSide = (side: LorcanaPlayerSide): string | null => {
    if (!this.#boardSnapshot) {
      return null;
    }
    return getOwnerIdForSideFromBoard(this.#boardSnapshot, side);
  };

  readonly getRelativePlayerLabel = (side: LorcanaPlayerSide): string => {
    const ownerSide = this.#ownerSide;
    const playerId = this.getOwnerIdForSide(side);
    const displayName = playerId ? (this.#playerMetadata[playerId]?.displayName ?? null) : null;

    if (displayName) {
      return displayName;
    }

    if (!ownerSide) {
      return side === "playerOne"
        ? m["sim.player.side.playerOne"]({})
        : m["sim.player.side.playerTwo"]({});
    }

    const baseLabel = side === ownerSide ? m["sim.player.you"]({}) : m["sim.player.opponent"]({});
    return baseLabel;
  };
  readonly getPlayerVisualSettingsByOwnerId = (
    ownerId: string | null | undefined,
  ): LorcanaResolvedPlayerVisualSettings =>
    getLorcanaPlayerVisualSettings(this.#playerSettings, ownerId);
  readonly getPlayerVisualSettings = (
    side: LorcanaPlayerSide,
  ): LorcanaResolvedPlayerVisualSettings =>
    this.getPlayerVisualSettingsByOwnerId(this.getOwnerIdForSide(side));

  readonly getOwnPlayerVisualSettings = (): LorcanaPlayerVisualSettings | undefined => {
    const side = this.ownerSide();
    if (!side) return undefined;
    const ownerId = this.getOwnerIdForSide(side);
    if (!ownerId) return undefined;
    return this.#playerSettings[ownerId];
  };

  readonly setOwnPlayerVisualSettings = (settings: LorcanaPlayerVisualSettings): void => {
    const side = this.ownerSide();
    if (!side) return;
    const ownerId = this.getOwnerIdForSide(side);
    if (!ownerId) return;

    this.#playerSettings = {
      ...this.#playerSettings,
      [ownerId]: {
        ...this.#playerSettings[ownerId],
        ...settings,
      },
    };
    this.#refreshSnapshot("visual-settings-change");
  };

  readonly setSelectedCardId = (nextSelectedCardId: string | null): void => {
    this.#selectedCardId = nextSelectedCardId;
  };

  readonly setSelectedMulliganCardIds = (nextSelectedMulliganCardIds: string[]): void => {
    this.#selectedMulliganCardIds = nextSelectedMulliganCardIds;
  };

  readonly setChallengeSourceCardId = (nextChallengeSourceCardId: string | null): void => {
    if (this.#challengeSourceCardId === nextChallengeSourceCardId) return;
    this.#challengeSourceCardId = nextChallengeSourceCardId;
    this.#refreshChallengeState();
  };

  readonly setPendingError = (nextPendingErrorReason: string | null): void => {
    this.#pendingErrorReason = nextPendingErrorReason;
    this.#pendingMoveError = null;
  };

  readonly setStatusMessage = (nextStatusMessage: string): void => {
    this.#statusMessage = nextStatusMessage;
  };

  readonly handleLocaleChanged = (): void => {
    this.#rebuildPresentationState("locale-change");
  };

  readonly runAnimation = (animation: SimulatorDebugAnimationRequest): boolean => {
    const resolved = this.#resolveDebugAnimation(animation);
    if (!resolved) {
      debugLog("debug-animations", "Failed to resolve debug animation", {
        animation,
        hasBoardAnchors: this.#boardAnchors !== null,
        knownCardIds: Object.keys(this.#cardSnapshotsById),
      });
      return false;
    }

    this.#queueResolvedBoardAnimations([resolved]);
    return true;
  };

  readonly runQuestAnimation = (
    cardId: string,
    side: LorcanaPlayerSide,
    loreGained: number,
  ): boolean => {
    const sourceAnchorId = createCardAnchorId(side, "play", cardId);
    const destAnchorId = createLoreBadgeAnchorId(side);

    const sourceRect = this.#resolveBoardAnchorLocalRect(sourceAnchorId);
    const destRect = this.#resolveBoardAnchorLocalRect(destAnchorId);

    if (!sourceRect || !destRect) {
      debugLog("debug-animations", "Failed to resolve quest animation anchors", {
        cardId,
        side,
        sourceAnchorId,
        destAnchorId,
        hasSource: sourceRect !== null,
        hasDest: destRect !== null,
        knownAnchors: this.#boardAnchors ? Object.keys(this.#boardAnchors.anchors) : [],
      });
      return false;
    }

    this.#fireQuestAnimations([
      {
        id: `debug-quest:${cardId}:${Date.now()}`,
        cardId,
        loreGained,
        sourceRect,
        destinationRect: destRect,
        durationMs: ANIMATION_SPEED_MS[this.#animationSpeed],
      },
    ]);
    return true;
  };

  readonly runChallengeAnimation = (
    attackerId: string,
    defenderId: string,
    side: LorcanaPlayerSide,
    preview: {
      attackerDamageDealt: number;
      defenderDamageDealt: number;
      defenderKind: "character" | "location";
      attackerWouldBeBanished: boolean;
      defenderWouldBeBanished: boolean;
      attackerDamageIsReduced: boolean;
      defenderDamageIsReduced: boolean;
    },
  ): boolean => {
    const opponentSide: LorcanaPlayerSide = side === "playerOne" ? "playerTwo" : "playerOne";
    const sourceAnchorId = createCardAnchorId(side, "play", attackerId);
    const destAnchorId = createCardAnchorId(opponentSide, "play", defenderId);

    const sourceRect = this.#resolveBoardAnchorLocalRect(sourceAnchorId);
    const destRect = this.#resolveBoardAnchorLocalRect(destAnchorId);

    if (!sourceRect || !destRect) {
      debugLog("debug-animations", "Failed to resolve challenge animation anchors", {
        attackerId,
        defenderId,
        side,
        sourceAnchorId,
        destAnchorId,
        hasSource: sourceRect !== null,
        hasDest: destRect !== null,
        knownAnchors: this.#boardAnchors ? Object.keys(this.#boardAnchors.anchors) : [],
      });
      return false;
    }

    this.#fireChallengeAnimations([
      {
        id: `debug-challenge:${attackerId}:${defenderId}:${Date.now()}`,
        actorSide: side,
        attackerId,
        defenderId,
        sourceRect,
        destinationRect: destRect,
        preview,
        durationMs: CHALLENGE_ANIMATION_DURATION_MS[this.#animationSpeed],
      },
    ]);
    return true;
  };

  #clearInteractionState(status = m["sim.status.ready"]({})): void {
    this.#selectedCardId = null;
    this.#selectedMulliganCardIds = [];
    this.#challengeSourceCardId = null;
    this.#pendingErrorReason = null;
    this.#pendingMoveError = null;
    this.#pendingResolutionAutoOpenStateId = null;
    this.#statusMessage = status;
    this.#challengeReadyCardIds = [];
    this.#moveCategorySummaries = [];
    this.#currentAvailableMoves = [];
    this.#currentLegalMoveIds = [];
    this.#cachedExecutableMoves = [];
    this.#cachedExecutableMovesVersion = -1;
    this.#derivedStateVersion++;
    this.#moveLogEntries = [];
    this.#playableHandCardIds = [];
    this.#pendingResolutionMoves = [];
    this.#validChallengeTargetIds = [];
    this.#invalidChallengeTargetReasons = {};
    this.#previousMulliganContextKey = null;
    this.#cachedCardSnapshotStateID = -1;
    this.#cachedCardSnapshotMap = {};
    this.#cachedDerivedStateStateID = -1;
    this.#cachedChallengeStateStateID = -1;
    this.#cachedChallengeStates.clear();
  }

  #measure<T>(label: string, fn: () => T): T {
    if (!this.#debugPerformance) {
      return fn();
    }

    const start = now();
    try {
      return fn();
    } finally {
      const durationMs = Number((now() - start).toFixed(2));
      console.info(`[simulator][perf] ${label}`, { durationMs });
    }
  }

  #buildCardSnapshots(board: LorcanaProjectedBoardView): CardSnapshotMap {
    if (this.#cachedCardSnapshotStateID === board.stateID) {
      return this.#cachedCardSnapshotMap;
    }

    const snapshots = this.#measure("buildCardSnapshotMap", () => {
      const projectedSnapshots = buildCardSnapshotMap(board, this.#engine!.staticResources);
      return mergeSupplementalScryCardSnapshots({
        board,
        snapshots: projectedSnapshots,
        staticResources: this.#engine!.staticResources,
        authoritativeState: this.#engine!.getState(),
        viewerPlayerId:
          this.#ownerSide && board ? getOwnerIdForSideFromBoard(board, this.#ownerSide) : null,
      });
    });
    this.#cachedCardSnapshotStateID = board.stateID;
    this.#cachedCardSnapshotMap = snapshots;
    return snapshots;
  }

  #refreshChallengeState(): void {
    const engine = this.#engine;
    const board = this.#boardSnapshot;
    if (!engine || !board) {
      this.#validChallengeTargetIds = [];
      this.#invalidChallengeTargetReasons = {};
      this.#cachedChallengeStateStateID = -1;
      this.#cachedChallengeStates.clear();
      return;
    }

    const normalizedChallengeSourceCardId =
      this.#challengeSourceCardId &&
      this.#challengeReadyCardIds.includes(this.#challengeSourceCardId)
        ? this.#challengeSourceCardId
        : null;
    if (this.#challengeSourceCardId !== normalizedChallengeSourceCardId) {
      this.#challengeSourceCardId = normalizedChallengeSourceCardId;
    }

    if (!this.#ownerSide || !normalizedChallengeSourceCardId) {
      this.#validChallengeTargetIds = [];
      this.#invalidChallengeTargetReasons = {};
      if (this.#cachedChallengeStateStateID !== board.stateID) {
        this.#cachedChallengeStateStateID = board.stateID;
        this.#cachedChallengeStates.clear();
      }
      return;
    }

    if (this.#cachedChallengeStateStateID !== board.stateID) {
      this.#cachedChallengeStateStateID = board.stateID;
      this.#cachedChallengeStates.clear();
    }
    let nextChallengeState = this.#cachedChallengeStates.get(normalizedChallengeSourceCardId);
    if (!nextChallengeState) {
      nextChallengeState = this.#measure("buildChallengeState", () =>
        buildChallengeState(
          engine,
          this.#cardSnapshotsById,
          board,
          this.#ownerSide,
          normalizedChallengeSourceCardId,
        ),
      );
      this.#cachedChallengeStates.set(normalizedChallengeSourceCardId, nextChallengeState);
    }

    if (
      !areOrderedStringArraysEqual(this.#validChallengeTargetIds, nextChallengeState.validTargetIds)
    ) {
      this.#validChallengeTargetIds = nextChallengeState.validTargetIds;
    }
    if (
      !areStringRecordsEqual(this.#invalidChallengeTargetReasons, nextChallengeState.invalidReasons)
    ) {
      this.#invalidChallengeTargetReasons = nextChallengeState.invalidReasons;
    }
  }

  #clearBoardAnimationTimer(): void {
    if (this.#boardAnimationTimeout !== null) {
      clearTimeout(this.#boardAnimationTimeout);
      this.#boardAnimationTimeout = null;
    }
  }

  #subscribeToReadModelStateUpdates(): void {
    this.#unsubscribeFromReadModelStateUpdates();

    if (!hasReadModelStateSubscription(this.#readModel)) {
      return;
    }

    this.#unsubscribeReadModelStateUpdates = this.#readModel.subscribeStateUpdates((revision) => {
      this.#refreshSnapshot("read-model-state-update", revision);
    });
  }

  #subscribeToProtocolErrors(): void {
    this.#unsubscribeFromProtocolErrors();

    const engine = this.#engine;
    if (!engine || !("onProtocolError" in engine) || typeof engine.onProtocolError !== "function") {
      return;
    }

    this.#unsubscribeProtocolErrors = engine.onProtocolError((error: ProtocolError) => {
      const message = error.resyncRequired
        ? m["sim.errors.execution.staleState"]({})
        : m["sim.errors.execution.invalidMove"]({});

      this.#pendingMoveError = {
        code: error.code,
        message,
        moveId: "unknown" as LorcanaSimulatorMoveId,
        rawReason: error.message,
      };
      this.#pendingErrorReason = message;
      this.#statusMessage = m["sim.status.actionRejected"]({});
    });
  }

  #unsubscribeFromProtocolErrors(): void {
    if (!this.#unsubscribeProtocolErrors) {
      return;
    }

    try {
      this.#unsubscribeProtocolErrors();
    } catch {
      // Ignore cleanup failures so teardown cannot strand later cleanup work.
    } finally {
      this.#unsubscribeProtocolErrors = null;
    }
  }

  #unsubscribeFromReadModelStateUpdates(): void {
    if (!this.#unsubscribeReadModelStateUpdates) {
      return;
    }

    try {
      this.#unsubscribeReadModelStateUpdates();
    } catch {
      // Ignore cleanup failures so teardown cannot strand later cleanup work.
    } finally {
      this.#unsubscribeReadModelStateUpdates = null;
    }
  }

  #resetBoardAnimations(): void {
    this.#orchestrator.cancel();
    this.#clearBoardAnimationTimer();
    this.#clearQuestAnimationTimers();
    this.#clearChallengeAnimationTimers();
    this.#clearActionAnimationTimers();
    this.#clearOverlayAnnouncementTimers();
    this.#clearCardEffectAnimationTimers();
    this.#clearPlayerEffectAnimationTimers();
    this.#boardAnchors = null;
    this.#queuedBoardAnimations = [];
    this.#activeBoardAnimations = [];
    this.#playedPacketAnimationIds = [];
    this.#activeQuestAnimations = [];
    this.#activeChallengeAnimations = [];
    this.#activeActionAnimations = [];
    this.#pendingActionAnimationSources = [];
    this.#activeOverlayAnnouncements = [];
    this.#activeCardEffectAnimations = [];
    this.#activePlayerEffectTargets = new Set();
  }

  #clearPlayerEffectAnimationTimers(): void {
    for (const timeout of this.#playerEffectAnimationTimeouts) {
      clearTimeout(timeout);
    }
    this.#playerEffectAnimationTimeouts = [];
  }

  #clearQuestAnimationTimers(): void {
    for (const timeout of this.#questAnimationTimeouts) {
      clearTimeout(timeout);
    }
    this.#questAnimationTimeouts = [];
  }

  #clearChallengeAnimationTimers(): void {
    for (const timeout of this.#challengeAnimationTimeouts) {
      clearTimeout(timeout);
    }
    this.#challengeAnimationTimeouts = [];
  }

  #clearActionAnimationTimers(): void {
    for (const timeout of this.#actionAnimationTimeouts) {
      clearTimeout(timeout);
    }
    this.#actionAnimationTimeouts = [];
  }

  #clearOverlayAnnouncementTimers(): void {
    for (const timeout of this.#overlayAnnouncementTimeouts) {
      clearTimeout(timeout);
    }
    this.#overlayAnnouncementTimeouts = [];
  }

  #clearCardEffectAnimationTimers(): void {
    for (const timeout of this.#cardEffectAnimationTimeouts) {
      clearTimeout(timeout);
    }
    this.#cardEffectAnimationTimeouts = [];
  }

  #fireChallengeAnimations(animations: ResolvedChallengeAnimation[]): void {
    if (animations.length === 0) {
      return;
    }

    const STAGGER_MS = 50;

    for (let i = 0; i < animations.length; i++) {
      const animation = animations[i];
      const delay = i * STAGGER_MS;

      if (delay === 0) {
        playSound("challenge");
        playSound("challenge-hit");
        this.#activeChallengeAnimations = [...this.#activeChallengeAnimations, animation];
        const clearId = setTimeout(() => {
          this.#activeChallengeAnimations = this.#activeChallengeAnimations.filter(
            (a) => a.id !== animation.id,
          );
        }, animation.durationMs);
        this.#challengeAnimationTimeouts.push(clearId);
      } else {
        const staggerId = setTimeout(() => {
          this.#activeChallengeAnimations = [...this.#activeChallengeAnimations, animation];
          const clearId = setTimeout(() => {
            this.#activeChallengeAnimations = this.#activeChallengeAnimations.filter(
              (a) => a.id !== animation.id,
            );
          }, animation.durationMs);
          this.#challengeAnimationTimeouts.push(clearId);
        }, delay);
        this.#challengeAnimationTimeouts.push(staggerId);
      }
    }
  }

  #fireActionAnimations(animations: ResolvedActionAnimation[]): void {
    if (animations.length === 0) {
      return;
    }

    const STAGGER_MS = 50;

    for (let i = 0; i < animations.length; i++) {
      const animation = animations[i];
      const delay = i * STAGGER_MS;
      const showAnimation = (): void => {
        this.#activeActionAnimations = [...this.#activeActionAnimations, animation];
        const clearId = setTimeout(() => {
          this.#activeActionAnimations = this.#activeActionAnimations.filter(
            (a) => a.id !== animation.id,
          );
        }, animation.durationMs);
        this.#actionAnimationTimeouts.push(clearId);
      };

      if (delay === 0) {
        showAnimation();
      } else {
        const staggerId = setTimeout(showAnimation, delay);
        this.#actionAnimationTimeouts.push(staggerId);
      }
    }
  }

  #rememberPendingActionAnimationSources(
    animations: ResolvedActionAnimation[],
    nextCardSnapshotsById: CardSnapshotMap,
  ): void {
    const stillPending = this.#pendingActionAnimationSources.filter(
      (animation) => nextCardSnapshotsById[animation.actionCardId]?.zoneId === "limbo",
    );
    const pendingIds = new Set(stillPending.map((animation) => animation.actionCardId));
    const nextPending = animations.filter(
      (animation) =>
        nextCardSnapshotsById[animation.actionCardId]?.zoneId === "limbo" &&
        !pendingIds.has(animation.actionCardId),
    );

    this.#pendingActionAnimationSources = [...stillPending, ...nextPending];
  }

  #derivePendingActionFollowUpAnimations(
    previousCardSnapshotsById: CardSnapshotMap,
    nextCardSnapshotsById: CardSnapshotMap,
    stateId: number,
  ): ResolvedActionAnimation[] {
    if (this.#pendingActionAnimationSources.length === 0) {
      return [];
    }

    const followUps: ResolvedActionAnimation[] = [];
    const retainedSources: ResolvedActionAnimation[] = [];

    for (const source of this.#pendingActionAnimationSources) {
      const previousActionCard = previousCardSnapshotsById[source.actionCardId] ?? null;
      const nextActionCard = nextCardSnapshotsById[source.actionCardId] ?? null;

      if (previousActionCard?.zoneId !== "limbo") {
        continue;
      }

      const targets = this.#deriveActionDamageDeltaTargets(
        source,
        previousCardSnapshotsById,
        nextCardSnapshotsById,
      );

      if (targets.length > 0) {
        followUps.push({
          ...source,
          id: `${source.id}:follow-up:${stateId}`,
          actionCardSourceRect: null,
          targets,
        });
      }

      if (nextActionCard?.zoneId === "limbo") {
        retainedSources.push(source);
      }
    }

    this.#pendingActionAnimationSources = retainedSources;
    return followUps;
  }

  #deriveActionDamageDeltaTargets(
    source: ResolvedActionAnimation,
    previousCardSnapshotsById: CardSnapshotMap,
    nextCardSnapshotsById: CardSnapshotMap,
  ): ResolvedActionAnimationTarget[] {
    const existingTargetIds = new Set(source.targets.map((target) => target.cardId));
    const targets: ResolvedActionAnimationTarget[] = [];

    for (const previousCard of Object.values(previousCardSnapshotsById)) {
      if (
        existingTargetIds.has(previousCard.cardId) ||
        previousCard.zoneId !== "play" ||
        previousCard.cardType !== "character"
      ) {
        continue;
      }

      const nextCard = nextCardSnapshotsById[previousCard.cardId] ?? null;
      if (!nextCard) {
        continue;
      }

      const previousDamage = previousCard.damage ?? 0;
      const nextDamage = nextCard.damage ?? previousDamage;
      if (nextDamage <= previousDamage) {
        continue;
      }

      targets.push({
        cardId: previousCard.cardId,
        wasBanished: nextCard.zoneId !== "play",
        targetRect: this.#resolveBoardAnchorLocalRect(
          createCardAnchorId(previousCard.ownerSide, "play", previousCard.cardId),
        ),
      });
    }

    return targets;
  }

  #deriveSyntheticTriggerDamageAnimations(
    previousSnapshot: LorcanaProjectedBoardView | null,
    nextSnapshot: LorcanaProjectedBoardView,
    previousCardSnapshotsById: CardSnapshotMap,
    nextCardSnapshotsById: CardSnapshotMap,
    stateId: number,
  ): ResolvedCardEffectAnimation[] {
    if (!previousSnapshot || !this.#boardAnchors || previousSnapshot.bagEffects.length === 0) {
      return [];
    }

    const nextBagEffectIds = new Set(nextSnapshot.bagEffects.map((effect) => effect.id));
    const resolvedBagEffects = previousSnapshot.bagEffects.filter(
      (effect) => !nextBagEffectIds.has(effect.id),
    );
    const candidateBagEffects =
      resolvedBagEffects.length > 0 ? resolvedBagEffects : previousSnapshot.bagEffects;
    const sourceIds = Array.from(
      new Set(candidateBagEffects.map((effect) => effect.sourceId).filter(isString)),
    );
    if (sourceIds.length !== 1) {
      return [];
    }

    const sourceId = sourceIds[0];
    const selectedTargetIds = collectBagEffectTargetIds(candidateBagEffects);
    const resolvedBagEffect = candidateBagEffects[0];
    if (!resolvedBagEffect?.sourceId) {
      return [];
    }

    const sourceCard = previousCardSnapshotsById[sourceId] ?? nextCardSnapshotsById[sourceId];
    if (!sourceCard || sourceCard.zoneId !== "play") {
      return [];
    }

    const sourceRect = this.#resolveBoardAnchorLocalRect(
      createCardAnchorId(sourceCard.ownerSide, "play", sourceId),
    );
    if (!sourceRect) {
      return [];
    }

    const damageTargets = this.#deriveResolvedCardEffectDamageTargets(
      previousCardSnapshotsById,
      nextCardSnapshotsById,
      selectedTargetIds,
    ).filter(
      (target) =>
        !this.#activeCardEffectAnimations.some(
          (animation) =>
            animation.cardId === sourceId &&
            animation.damageTargets.some((activeTarget) => activeTarget.cardId === target.cardId),
        ),
    );
    if (damageTargets.length === 0) {
      return [];
    }

    return [
      {
        id: `synthetic:trigger-damage:${stateId}:${sourceId}:${damageTargets
          .map((target) => target.cardId)
          .join("-")}`,
        cardId: sourceId,
        effectKind: "resolve-effect",
        sourceRect,
        damageTargets,
        durationMs: ANIMATION_SPEED_MS[this.#animationSpeed],
      },
    ];
  }

  #deriveResolvedCardEffectDamageTargets(
    previousCardSnapshotsById: CardSnapshotMap,
    nextCardSnapshotsById: CardSnapshotMap,
    selectedTargetIds: ReadonlySet<string>,
  ): ResolvedCardEffectDamageTarget[] {
    const targets: ResolvedCardEffectDamageTarget[] = [];

    for (const previousCard of Object.values(previousCardSnapshotsById)) {
      if (
        (selectedTargetIds.size > 0 && !selectedTargetIds.has(previousCard.cardId)) ||
        previousCard.zoneId !== "play" ||
        (previousCard.cardType !== "character" && previousCard.cardType !== "location")
      ) {
        continue;
      }

      const nextCard = nextCardSnapshotsById[previousCard.cardId] ?? null;
      if (!nextCard) {
        continue;
      }

      const { amount, wasBanished } = deriveCardEffectDamageResult(previousCard, nextCard);
      if (amount <= 0) {
        continue;
      }

      const targetRect = this.#resolveBoardAnchorLocalRect(
        createCardAnchorId(previousCard.ownerSide, "play", previousCard.cardId),
      );
      if (!targetRect) {
        continue;
      }

      targets.push({
        cardId: previousCard.cardId,
        amount,
        wasBanished,
        targetRect,
      });
    }

    return targets;
  }

  #fireQuestAnimations(animations: ResolvedQuestAnimation[]): void {
    if (animations.length === 0) {
      return;
    }

    debugLog("quest-animations", "Firing quest animations", {
      count: animations.length,
    });

    const STAGGER_MS = 50;

    for (let i = 0; i < animations.length; i++) {
      const animation = animations[i];
      const delay = i * STAGGER_MS;

      if (delay === 0) {
        playSound("quest");
        this.#activeQuestAnimations = [...this.#activeQuestAnimations, animation];
        const clearId = setTimeout(() => {
          this.#activeQuestAnimations = this.#activeQuestAnimations.filter(
            (a) => a.id !== animation.id,
          );
        }, animation.durationMs);
        this.#questAnimationTimeouts.push(clearId);
      } else {
        const staggerId = setTimeout(() => {
          this.#activeQuestAnimations = [...this.#activeQuestAnimations, animation];
          const clearId = setTimeout(() => {
            this.#activeQuestAnimations = this.#activeQuestAnimations.filter(
              (a) => a.id !== animation.id,
            );
          }, animation.durationMs);
          this.#questAnimationTimeouts.push(clearId);
        }, delay);
        this.#questAnimationTimeouts.push(staggerId);
      }
    }
  }

  #fireOverlayAnnouncements(animations: ResolvedOverlayAnnouncement[]): void {
    if (animations.length === 0) {
      return;
    }

    for (const animation of animations) {
      playSound(overlayKindToSoundId(animation.kind));
      this.#activeOverlayAnnouncements = [...this.#activeOverlayAnnouncements, animation];
      const clearId = setTimeout(() => {
        this.#activeOverlayAnnouncements = this.#activeOverlayAnnouncements.filter(
          (a) => a.id !== animation.id,
        );
      }, animation.durationMs);
      this.#overlayAnnouncementTimeouts.push(clearId);
    }
  }

  #fireCardEffectAnimations(animations: ResolvedCardEffectAnimation[]): void {
    if (animations.length === 0) {
      return;
    }

    const STAGGER_MS = 50;

    for (let i = 0; i < animations.length; i++) {
      const animation = animations[i];
      const delay = i * STAGGER_MS;

      if (delay === 0) {
        playSound(cardEffectKindToSoundId(animation.effectKind));
        this.#activeCardEffectAnimations = [...this.#activeCardEffectAnimations, animation];
        const clearId = setTimeout(() => {
          this.#activeCardEffectAnimations = this.#activeCardEffectAnimations.filter(
            (a) => a.id !== animation.id,
          );
        }, animation.durationMs);
        this.#cardEffectAnimationTimeouts.push(clearId);
      } else {
        const staggerId = setTimeout(() => {
          this.#activeCardEffectAnimations = [...this.#activeCardEffectAnimations, animation];
          const clearId = setTimeout(() => {
            this.#activeCardEffectAnimations = this.#activeCardEffectAnimations.filter(
              (a) => a.id !== animation.id,
            );
          }, animation.durationMs);
          this.#cardEffectAnimationTimeouts.push(clearId);
        }, delay);
        this.#cardEffectAnimationTimeouts.push(staggerId);
      }
    }
  }

  #firePlayerEffectAnimations(animations: QueuedPlayerEffectAnimation[]): void {
    if (animations.length === 0) {
      return;
    }

    const DURATION_MS = ANIMATION_SPEED_MS[this.#animationSpeed];

    for (const animation of animations) {
      const nextTargets = new Set<LorcanaPlayerSide>(this.#activePlayerEffectTargets);
      for (const side of animation.targetSides) {
        nextTargets.add(side);
      }
      this.#activePlayerEffectTargets = nextTargets;

      const clearId = setTimeout(() => {
        const remaining = new Set<LorcanaPlayerSide>(this.#activePlayerEffectTargets);
        for (const side of animation.targetSides) {
          remaining.delete(side);
        }
        this.#activePlayerEffectTargets = remaining;
      }, DURATION_MS);
      this.#playerEffectAnimationTimeouts.push(clearId);
    }
  }

  #getFilteredPacketUpdate(engine: LorcanaEngineBase): EnginePacketUpdate | null {
    if (!hasPacketUpdate(engine)) {
      return null;
    }

    const packetUpdate = engine.getLastPacketUpdate();
    if (!packetUpdate) {
      return null;
    }

    return {
      ...packetUpdate,
      animations: packetUpdate.animations.filter(
        (animation) => !this.#playedPacketAnimationIds.includes(animation.id),
      ),
    };
  }

  #resolveDebugAnimationSide(player: SimulatorDebugAnimationPlayer): LorcanaPlayerSide | null {
    if (player === "player_one") {
      return "playerOne";
    }
    if (player === "player_two") {
      return "playerTwo";
    }
    return null;
  }

  #toBoardLocalRect(anchorRect: BoardAnchorRect, boardRect: BoardAnchorRect): BoardLocalRect {
    return {
      x: anchorRect.left - boardRect.left,
      y: anchorRect.top - boardRect.top,
      width: anchorRect.width,
      height: anchorRect.height,
      centerX: anchorRect.centerX - boardRect.left,
      centerY: anchorRect.centerY - boardRect.top,
    };
  }

  #resolveBoardAnchorLocalRect(anchorId: string): BoardLocalRect | null {
    if (!this.#boardAnchors) {
      return null;
    }

    const anchorRect = this.#boardAnchors.anchors[anchorId];
    if (!anchorRect) {
      return null;
    }

    return this.#toBoardLocalRect(anchorRect, this.#boardAnchors.boardRect);
  }

  #resolveDebugAnimation(
    animation: SimulatorDebugAnimationRequest,
  ): ResolvedBoardMoveAnimation | null {
    const actorSide = this.#resolveDebugAnimationSide(animation.payload.player);
    if (!actorSide) {
      return null;
    }

    const card = this.#cardSnapshotsById[animation.payload.cardId];
    if (!card) {
      return null;
    }

    const sourceRect = this.#resolveBoardAnchorLocalRect(createSeatHandAnchorId(actorSide));
    const centerRect = this.#resolveBoardAnchorLocalRect(BOARD_CENTER_ANCHOR_ID);

    if (!sourceRect || !centerRect) {
      return null;
    }

    if (animation.kind === "play.action") {
      return {
        actorSide,
        card,
        destinationRect: centerRect,
        destinationZoneId: "discard",
        durationMs: DEBUG_ACTION_PREVIEW_DURATION_MS,
        groupId: animation.id,
        id: animation.id,
        impactAt: "via",
        impactRect: centerRect,
        phase: "cause",
        playback: "serial",
        renderFace: "faceUp",
        sourceRect,
        sourceZoneId: "hand",
        variant: "play-action-preview",
        viaRect: centerRect,
      };
    }

    if (animation.kind === "lorcana.boardMove") {
      const variant = animation.payload.variant ?? "play-character";
      const isAction = variant === "play-action";
      const isInk = variant === "ink-faceDown" || variant === "ink-faceUp";
      const destinationZoneId = isAction ? "discard" : isInk ? "inkwell" : "play";

      let destinationRect: BoardLocalRect;
      if (isAction) {
        destinationRect =
          this.#resolveBoardAnchorLocalRect(createZoneAnchorId(actorSide, "discard")) ?? centerRect;
      } else if (isInk) {
        destinationRect =
          this.#resolveBoardAnchorLocalRect(createInkwellEntryAnchorId(actorSide)) ??
          this.#resolveBoardAnchorLocalRect(createZoneAnchorId(actorSide, "inkwell")) ??
          centerRect;
      } else {
        destinationRect =
          this.#resolveBoardAnchorLocalRect(
            createCardAnchorId(actorSide, "play", animation.payload.cardId),
          ) ??
          this.#resolveBoardAnchorLocalRect(createZoneAnchorId(actorSide, "play")) ??
          centerRect;
      }

      const speedMultiplier = getAnimationSpeedMultiplier(this.#animationSpeed);
      const durationMs = Math.round(VARIANT_DURATION_MS[variant] * speedMultiplier);

      return {
        actorSide,
        card,
        destinationRect,
        destinationZoneId,
        durationMs,
        groupId: animation.id,
        id: animation.id,
        impactAt: isInk ? "destination" : "via",
        impactRect: isInk ? destinationRect : centerRect,
        phase: "cause",
        playback: "serial",
        renderFace: isInk && variant === "ink-faceDown" ? "faceDown" : "faceUp",
        sourceRect,
        sourceZoneId: "hand",
        variant,
        viaRect: isInk ? undefined : centerRect,
      };
    }

    return null;
  }

  #queueResolvedBoardAnimations(animations: ResolvedBoardMoveAnimation[]): void {
    if (animations.length === 0) {
      return;
    }

    const seenIds = new Set([
      ...this.#activeBoardAnimations.map((animation) => animation.id),
      ...this.#queuedBoardAnimations.flatMap((batch) => batch.map((animation) => animation.id)),
    ]);
    const uniqueAnimations = animations.filter((animation) => !seenIds.has(animation.id));
    if (uniqueAnimations.length === 0) {
      debugLog("animations", "Resolved animations were already queued or active", {
        animationIds: animations.map((animation) => animation.id),
      });

      return;
    }

    this.#queuedBoardAnimations = [
      ...this.#queuedBoardAnimations,
      ...this.#createBoardAnimationBatches(uniqueAnimations),
    ];
    this.#playNextBoardAnimation();
  }

  #playNextBoardAnimation(): void {
    if (this.#activeBoardAnimations.length > 0 || this.#queuedBoardAnimations.length === 0) {
      return;
    }

    const [nextBatch, ...remainingBatches] = this.#queuedBoardAnimations;
    this.#queuedBoardAnimations = remainingBatches;
    this.#activeBoardAnimations = nextBatch;
    console.info("[simulator][animations][board][play]", {
      batchSize: nextBatch.length,
      animations: nextBatch.map((animation) => ({
        id: animation.id,
        cardId: animation.card.cardId,
        groupId: animation.groupId,
        playback: animation.playback,
        phase: animation.phase,
        variant: animation.variant,
        durationMs: animation.durationMs,
        sourceRect: animation.sourceRect,
        destinationRect: animation.destinationRect,
      })),
    });
    for (const animation of nextBatch) {
      playSound(boardMoveVariantToSoundId(animation.variant));
    }
    this.#clearBoardAnimationTimer();

    // Safety timeout: fallback if the WAAPI completion callback from the
    // animation layer doesn't fire (e.g., prefers-reduced-motion, element
    // removed before animation starts). The primary path is
    // onBoardAnimationFinished() called by the animation layer.
    this.#boardAnimationTimeout = setTimeout(
      () => {
        this.#boardAnimationTimeout = null;
        const completedBatch = this.#activeBoardAnimations;
        const remainingQueuedCardIds = this.#queuedBoardAnimations.flatMap((batch) =>
          batch.map((animation) => animation.card.cardId),
        );
        this.#activeBoardAnimations = [];
        for (const animation of completedBatch) {
          this.#orchestrator.notifyBoardAnimationCompleted(
            animation.card.cardId,
            [],
            remainingQueuedCardIds,
          );
        }
        this.#playNextBoardAnimation();
      },
      Math.max(...nextBatch.map((animation) => animation.durationMs)) +
        BOARD_ANIMATION_SAFETY_BUFFER_MS,
    );
  }

  #createBoardAnimationBatches(animations: ResolvedBoardMoveAnimation[]): BoardAnimationBatch[] {
    const batches: BoardAnimationBatch[] = [];

    for (const animation of animations) {
      const previousBatch = batches.at(-1);
      const shouldAppendToPreviousBatch =
        previousBatch &&
        previousBatch.length > 0 &&
        animation.playback === "parallel" &&
        previousBatch[0].playback === "parallel" &&
        previousBatch[0].groupId === animation.groupId;

      if (shouldAppendToPreviousBatch) {
        previousBatch.push(animation);
        continue;
      }

      batches.push([animation]);
    }

    return batches;
  }

  #getCurrentDerivedStateSnapshot(): DerivedStateSnapshot {
    return untrack(() => ({
      challengeReadyCardIds: this.#challengeReadyCardIds,
      moveCategorySummaries: this.#moveCategorySummaries,
      pendingResolutionMoves: this.#pendingResolutionMoves,
      playableHandCardIds: this.#playableHandCardIds,
      validChallengeTargetIds: this.#validChallengeTargetIds,
      invalidChallengeTargetReasons: this.#invalidChallengeTargetReasons,
    }));
  }

  #refreshDerivedState(): void {
    const engine = this.#engine;
    if (!engine || !this.#boardSnapshot) {
      this.#moveCategorySummaries = [];
      this.#currentAvailableMoves = [];
      this.#currentLegalMoveIds = [];
      this.#cachedExecutableMoves = [];
      this.#cachedExecutableMovesVersion = -1;
      this.#cachedExpandedCategoryMovesStateId = -1;
      this.#cachedExpandedCategoryMoves.clear();
      this.#cachedExpandedCardMovesStateId = -1;
      this.#cachedExpandedCardMoves.clear();
      this.#cachedExpandedCardActionCategoryMovesStateId = -1;
      this.#cachedExpandedCardActionCategoryMoves.clear();
      this.#derivedStateVersion++;
      this.#challengeReadyCardIds = [];
      this.#pendingResolutionMoves = [];
      this.#playableHandCardIds = [];
      this.#validChallengeTargetIds = [];
      this.#invalidChallengeTargetReasons = {};
      this.#cachedDerivedStateStateID = -1;
      this.#cachedChallengeStateStateID = -1;
      this.#cachedChallengeStates.clear();
      return;
    }

    // Use a composite cache key: the board's projected stateID combined with
    // the engine's confirmed stateID. During optimistic updates the board stateID
    // advances (from the local sandbox) while the engine stateID stays at the
    // previous confirmed value. When the server confirms, the engine stateID
    // catches up. Using both ensures derived state (legal moves, pending effects)
    // is recalculated whenever the engine runtime changes — even when the board
    // stateID happens to match across optimistic and confirmed phases.
    //
    // Note: canUndo is intentionally included in the cache key because the
    // optimistic stateID and the confirmed stateID are equal (both advance
    // together). Without this, a quest→confirm transition would not invalidate
    // the cache, and "undo" would never appear in moveCategorySummaries.
    const boardStateID = this.#boardSnapshot.stateID;
    const canUndoFlag = engine.canUndo?.() ? 1 : 0;
    const stateID = (boardStateID * 100_000 + engine.getStateID()) * 2 + canUndoFlag;
    const activeSide = getActiveSide(this.#boardSnapshot);
    let nextMoveCategorySummaries: MoveCategorySummary[] = [];
    let nextChallengeReadyCardIds: string[] = [];
    let nextPlayableHandCardIds: string[] = [];
    let nextPendingResolutionMoves: PendingResolutionMoveEntry[] = [];
    let legalMoves = this.#currentLegalMoveIds;
    let availableMoves = this.#currentAvailableMoves;

    if (this.#cachedDerivedStateStateID !== stateID) {
      availableMoves = this.#measure("getAvailableMoves", () => engine.getAvailableMoves());
      legalMoves = this.#measure("enumerateMoves", () => engine.getCachedLegalMoveIds());

      // Perf: buildMoveCategorySummaries() is O(n) over AvailableMove[] with no
      // getMoveOptions() calls — much cheaper than the old buildExecutableMoves() which
      // expanded every attacker×defender, card×ability, and character×location pair.
      // Full expansion is deferred to user interaction via expandCategoryMoves/expandCardMoves.
      try {
        nextMoveCategorySummaries = buildMoveCategorySummaries(engine, availableMoves, legalMoves);
      } catch (error) {
        console.error("[simulator][refreshDerivedState][buildMoveCategorySummaries][error]", error);
        throw error;
      }

      try {
        nextChallengeReadyCardIds = buildChallengeReadyCardIds(availableMoves);
      } catch (error) {
        console.error("[simulator][refreshDerivedState][buildChallengeReadyCardIds][error]", error);
        throw error;
      }

      try {
        nextPlayableHandCardIds = buildPlayableHandCardIds(availableMoves);
      } catch (error) {
        console.error("[simulator][refreshDerivedState][buildPlayableHandCardIds][error]", error);
        throw error;
      }

      try {
        nextPendingResolutionMoves = buildPendingResolutionMoves(legalMoves, this.#boardSnapshot);
      } catch (error) {
        console.error(
          "[simulator][refreshDerivedState][buildPendingResolutionMoves][error]",
          error,
        );
        throw error;
      }

      this.#currentAvailableMoves = availableMoves;
      this.#currentLegalMoveIds = legalMoves;
      this.#cachedDerivedStateStateID = stateID;
      this.#derivedStateVersion++;
    } else {
      nextMoveCategorySummaries = this.#moveCategorySummaries;
      nextChallengeReadyCardIds = this.#challengeReadyCardIds;
      nextPlayableHandCardIds = this.#playableHandCardIds;
      nextPendingResolutionMoves = this.#pendingResolutionMoves;
    }
    const mulliganContextKey =
      this.pregamePhaseValue === "mulligan" && this.#ownerSide
        ? `${this.#boardSnapshot.stateID}:${this.#ownerSide}:${getZoneCardIds(this.#boardSnapshot, this.#ownerSide, "hand").join(",")}`
        : null;

    if (this.#previousMulliganContextKey !== mulliganContextKey) {
      this.#previousMulliganContextKey = mulliganContextKey;
      if (this.#selectedMulliganCardIds.length > 0) {
        this.#selectedMulliganCardIds = [];
      }
    }

    const currentDerivedState = this.#getCurrentDerivedStateSnapshot();

    if (
      !areMoveCategorySummariesEqual(
        currentDerivedState.moveCategorySummaries,
        nextMoveCategorySummaries,
      )
    ) {
      this.#moveCategorySummaries = nextMoveCategorySummaries;
    }
    if (
      !areOrderedStringArraysEqual(
        currentDerivedState.challengeReadyCardIds,
        nextChallengeReadyCardIds,
      )
    ) {
      this.#challengeReadyCardIds = nextChallengeReadyCardIds;
    }
    if (
      !areOrderedStringArraysEqual(currentDerivedState.playableHandCardIds, nextPlayableHandCardIds)
    ) {
      this.#playableHandCardIds = nextPlayableHandCardIds;
    }
    if (
      !arePendingResolutionMovesEqual(
        currentDerivedState.pendingResolutionMoves,
        nextPendingResolutionMoves,
      )
    ) {
      this.#pendingResolutionMoves = nextPendingResolutionMoves;
    }
    this.#refreshChallengeState();
  }

  #rebuildPresentationState(source = "unspecified"): void {
    const engine = this.#engine;
    const boardSnapshot = this.#boardSnapshot;
    if (!engine || !boardSnapshot) {
      return;
    }

    debugLog("snapshot", "Rebuild presentation requested", {
      currentStateID: boardSnapshot.stateID,
      lastStateID: this.#lastStateID,
      source,
    });

    const nextCardSnapshotsById = this.#buildCardSnapshots(boardSnapshot);
    const nextMoveLogEntries =
      this.#readModel?.getMoveLog() ?? (hasMoveLog(engine) ? engine.getMoveLog() : []);

    this.#cardSnapshotsById = nextCardSnapshotsById;
    this.#ownerSide = getOwnerSideFromEngine(engine, boardSnapshot);

    if (!areMoveLogEntriesEqual(this.#moveLogEntries, nextMoveLogEntries)) {
      this.#moveLogEntries = nextMoveLogEntries;
    }

    this.#measure("refreshDerivedState", () => this.#refreshDerivedState());
  }

  #refreshSnapshot(source = "unspecified", visibleRevision?: number): void {
    const engine = this.#engine;
    if (!engine) {
      return;
    }

    this.#snapshotRefreshCallCount += 1;

    const currentStateID = engine.getStateID();
    const visibleRevisionChanged =
      typeof visibleRevision === "number" && visibleRevision !== this.#lastVisibleRevision;
    const stateChanged = !this.#boardSnapshot || currentStateID !== this.#lastStateID;
    const shouldRefresh = stateChanged || visibleRevisionChanged;

    debugLog("snapshot", "Refresh requested", {
      call: this.#snapshotRefreshCallCount,
      currentStateID,
      lastStateID: this.#lastStateID,
      visibleRevision,
      lastVisibleRevision: this.#lastVisibleRevision,
      source,
      shouldRefresh,
    });

    if (!shouldRefresh) {
      return;
    }

    const nextBoardSnapshot = this.#measure("engine.getBoard", () => engine.getBoard());
    const previousSnapshot = this.#boardSnapshot;
    const previousAnchorSnapshot = this.#boardAnchors;
    const previousCardSnapshotsById = this.#cardSnapshotsById;
    const nextCardSnapshotsById = this.#measure("getBoard.buildCardSnapshotMap", () =>
      this.#buildCardSnapshots(nextBoardSnapshot),
    );
    const nextMoveLogEntries =
      this.#readModel?.getMoveLog() ?? (hasMoveLog(engine) ? engine.getMoveLog() : []);
    const packetUpdate = this.#getFilteredPacketUpdate(engine);
    const animationsOff = this.#animationSpeed === "off";
    if (animationsOff) {
      this.#orchestrator.cancel();
    }
    const nextQueuedAnimations = animationsOff
      ? []
      : deriveQueuedBoardMoveAnimationsFromPacket(
          previousSnapshot,
          nextBoardSnapshot,
          packetUpdate,
          (cardId) => nextCardSnapshotsById[cardId] ?? null,
          getAnimationSpeedMultiplier(this.#animationSpeed),
        );
    const nextQueuedQuestAnimations = animationsOff
      ? []
      : deriveQueuedQuestAnimationsFromPacket(
          packetUpdate,
          ANIMATION_SPEED_MS[this.#animationSpeed],
        );
    const nextQueuedChallengeAnimations = animationsOff
      ? []
      : deriveQueuedChallengeAnimationsFromPacket(
          packetUpdate,
          CHALLENGE_ANIMATION_DURATION_MS[this.#animationSpeed],
        );
    const nextResolvedActionAnimations = animationsOff
      ? []
      : deriveResolvedActionAnimationsFromPacket(
          packetUpdate,
          ACTION_ANIMATION_DURATION_MS[this.#animationSpeed],
          previousAnchorSnapshot,
          (cardId) =>
            previousCardSnapshotsById[cardId]?.ownerSide ??
            nextCardSnapshotsById[cardId]?.ownerSide ??
            null,
        );
    const nextFollowUpActionAnimations = animationsOff
      ? []
      : this.#derivePendingActionFollowUpAnimations(
          previousCardSnapshotsById,
          nextCardSnapshotsById,
          currentStateID,
        );
    const nextQueuedOverlayAnnouncements = animationsOff
      ? []
      : deriveQueuedOverlayAnnouncementsFromPacket(
          packetUpdate,
          ANIMATION_SPEED_MS[this.#animationSpeed],
        );
    const nextQueuedCardEffectAnimations = animationsOff
      ? []
      : deriveQueuedCardEffectAnimationsFromPacket(
          packetUpdate,
          ANIMATION_SPEED_MS[this.#animationSpeed],
          previousCardSnapshotsById,
          nextCardSnapshotsById,
        );
    const nextSyntheticTriggerDamageAnimations =
      animationsOff ||
      nextQueuedCardEffectAnimations.some((animation) => animation.damageTargets.length > 0)
        ? []
        : this.#deriveSyntheticTriggerDamageAnimations(
            previousSnapshot,
            nextBoardSnapshot,
            previousCardSnapshotsById,
            nextCardSnapshotsById,
            currentStateID,
          ).filter((animation) => !this.#playedPacketAnimationIds.includes(animation.id));
    const nextQueuedPlayerEffectAnimations = animationsOff
      ? []
      : deriveQueuedPlayerEffectAnimationsFromPacket(
          packetUpdate,
          ANIMATION_SPEED_MS[this.#animationSpeed],
        );

    if (nextQueuedQuestAnimations.length > 0) {
      debugLog("quest-animations", "Derived quest animations from packet", {
        count: nextQueuedQuestAnimations.length,
        ids: nextQueuedQuestAnimations.map((a) => a.id),
        cards: nextQueuedQuestAnimations.map((a) => ({
          cardId: a.cardId,
          loreGained: a.loreGained,
        })),
      });
    }

    this.#boardSnapshot = nextBoardSnapshot;
    this.#cardSnapshotsById = nextCardSnapshotsById;
    this.#ownerSide = getOwnerSideFromEngine(engine, nextBoardSnapshot);

    // Mark when the first board snapshot for a match arrives so downstream
    // timing events (time_to_first_move, time_to_mulligan) measure from
    // "game state available to act" instead of context construction time.
    // Note: game_join itself is fired upstream in the route handlers
    // (connect-gateway.ts and match/[gameId]/+page.svelte) on the
    // `game_joined` WS message — don't emit it here or it'd double-count.
    // The latch is reset in #resetMatchAnalyticsState() so rematches
    // re-baseline correctly.
    if (!this.#gameJoinTracked) {
      this.#gameJoinTracked = true;
      this.#gameStartTime = Date.now();
    }

    // Track game end on the first transition to "finished" status
    if (
      nextBoardSnapshot.status === "finished" &&
      previousSnapshot?.status !== "finished" &&
      !this.#gameEndTracked
    ) {
      this.#gameEndTracked = true;
      const playerId = engine.getClientPlayerId();
      const winner = nextBoardSnapshot.winner;
      let result: "win" | "loss" | "draw";
      if (winner == null || !playerId) {
        result = "draw";
      } else {
        result = winner === playerId ? "win" : "loss";
      }
      const ctx = this.#matchAnalyticsContext;
      trackEvent("game_end", {
        result,
        turns: nextBoardSnapshot.turnNumber ?? 0,
        duration_seconds: Math.round((Date.now() - this.#gameStartTime) / 1000),
        mode: ctx.mode ?? "unknown",
        ...(ctx.format ? { format: ctx.format } : {}),
        ...(ctx.deckId ? { deck_id: ctx.deckId } : {}),
      });
    }
    this.#lastStateID = currentStateID;
    this.#lastVisibleRevision =
      typeof visibleRevision === "number" ? visibleRevision : this.#lastVisibleRevision;

    const hasAnyAnimations =
      nextQueuedAnimations.length > 0 ||
      nextQueuedQuestAnimations.length > 0 ||
      nextQueuedChallengeAnimations.length > 0 ||
      nextResolvedActionAnimations.length > 0 ||
      nextFollowUpActionAnimations.length > 0 ||
      nextQueuedCardEffectAnimations.length > 0 ||
      nextSyntheticTriggerDamageAnimations.length > 0 ||
      nextQueuedOverlayAnnouncements.length > 0 ||
      nextQueuedPlayerEffectAnimations.length > 0;

    if (nextResolvedActionAnimations.length > 0) {
      this.#rememberPendingActionAnimationSources(
        nextResolvedActionAnimations,
        nextCardSnapshotsById,
      );
    }

    const nextActionAnimations = [...nextResolvedActionAnimations, ...nextFollowUpActionAnimations];
    if (nextActionAnimations.length > 0) {
      this.#fireActionAnimations(nextActionAnimations);
    }
    if (nextSyntheticTriggerDamageAnimations.length > 0) {
      this.#fireCardEffectAnimations(nextSyntheticTriggerDamageAnimations);
    }

    // Prefer ingesting based on unseen packet animations rather than only on local
    // engine state bumps. In browser-harness / async transport flows the read-model
    // can surface a fresh packet on a refresh where currentStateID is unchanged from
    // this client's perspective, which would otherwise drop valid animations.
    if (hasAnyAnimations) {
      this.#orchestrator.ingest({
        boardMoves: nextQueuedAnimations,
        quests: nextQueuedQuestAnimations,
        challenges: nextQueuedChallengeAnimations,
        cardEffects: nextQueuedCardEffectAnimations,
        overlays: nextQueuedOverlayAnnouncements,
        playerEffects: nextQueuedPlayerEffectAnimations,
        sourceAnchors: previousAnchorSnapshot,
      });
    }

    const allNewAnimationIds = [
      ...nextQueuedAnimations.map((a) => a.id),
      ...nextQueuedQuestAnimations.map((a) => a.id),
      ...nextQueuedChallengeAnimations.map((a) => a.id),
      ...nextResolvedActionAnimations.map((a) => a.id),
      ...nextFollowUpActionAnimations.map((a) => a.id),
      ...nextQueuedOverlayAnnouncements.map((a) => a.id),
      ...nextQueuedCardEffectAnimations.map((a) => a.id),
      ...nextSyntheticTriggerDamageAnimations.map((a) => a.id),
      ...nextQueuedPlayerEffectAnimations.map((a) => a.id),
    ];
    if (allNewAnimationIds.length > 0) {
      this.#playedPacketAnimationIds = [...this.#playedPacketAnimationIds, ...allNewAnimationIds];
    }

    if (!areMoveLogEntriesEqual(this.#moveLogEntries, nextMoveLogEntries)) {
      this.#moveLogEntries = nextMoveLogEntries;
    }

    this.#measure("refreshDerivedState", () => this.#refreshDerivedState());
  }
}

function guidanceActionsEqual(left: GuidanceAction[], right: GuidanceAction[]): boolean {
  return (
    left.length === right.length &&
    left.every((action, index) => {
      const other = right[index];
      return (
        action.id === other?.id &&
        action.label === other?.label &&
        action.disabled === other?.disabled &&
        action.emphasis === other?.emphasis &&
        action.onClick === other?.onClick
      );
    })
  );
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function collectBagEffectTargetIds(
  bagEffects: readonly LorcanaProjectedBoardView["bagEffects"][number][],
): ReadonlySet<string> {
  const targetIds = new Set<string>();

  for (const effect of bagEffects) {
    for (const targetId of effect.selectionContext?.currentSelection.targets ?? []) {
      targetIds.add(targetId);
    }
    collectTargetIdsFromUnknown(effect.payload, targetIds);
  }

  return targetIds;
}

function collectTargetIdsFromUnknown(value: unknown, targetIds: Set<string>): void {
  if (!value || typeof value !== "object") {
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      if (typeof item === "string") {
        targetIds.add(item);
      } else {
        collectTargetIdsFromUnknown(item, targetIds);
      }
    }
    return;
  }

  for (const [key, child] of Object.entries(value)) {
    if (
      key === "targets" ||
      key === "cardTargets" ||
      key === "selectedCardTargets" ||
      key === "currentSelection"
    ) {
      collectTargetIdsFromUnknown(child, targetIds);
    }
  }
}

function overlayGuidanceEqual(
  existing: ActivePlayerGuidanceItem | undefined,
  next: Omit<ActivePlayerGuidanceItem, "order">,
): boolean {
  return !!(
    existing &&
    existing.id === next.id &&
    existing.message === next.message &&
    existing.inlineReference?.label === next.inlineReference?.label &&
    existing.inlineReference?.card?.cardId === next.inlineReference?.card?.cardId &&
    existing.inlineReference?.prefix === next.inlineReference?.prefix &&
    existing.inlineReference?.suffix === next.inlineReference?.suffix &&
    existing.mode === next.mode &&
    guidanceActionsEqual(existing.actions, next.actions)
  );
}

function mergeNestedResolveEffectParams(
  baseParams: Record<string, unknown>,
  nextNestedParams: Record<string, unknown>,
): Record<string, unknown> {
  const nestedParams =
    baseParams.params && typeof baseParams.params === "object" && !Array.isArray(baseParams.params)
      ? (baseParams.params as Record<string, unknown>)
      : null;
  return {
    ...baseParams,
    params: {
      ...nestedParams,
      ...nextNestedParams,
    },
  };
}

function mergeNestedResolveBagParams(
  baseParams: Record<string, unknown>,
  nextNestedParams: Record<string, unknown>,
): Record<string, unknown> {
  const nestedParams =
    baseParams.params && typeof baseParams.params === "object" && !Array.isArray(baseParams.params)
      ? (baseParams.params as Record<string, unknown>)
      : null;
  return {
    ...baseParams,
    params: {
      ...nestedParams,
      ...nextNestedParams,
    },
  };
}

function getLocaleLabel(locale: SupportedLocale): string {
  return {
    en: m["sim.locale.name.en"]({}),
    es: m["sim.locale.name.es"]({}),
    de: m["sim.locale.name.de"]({}),
    it: m["sim.locale.name.it"]({}),
    "pt-br": m["sim.locale.name.pt-br"]({}),
  }[locale];
}

function getPlayerLabel(side: LorcanaPlayerSide): string {
  return side === "playerOne"
    ? m["sim.player.side.playerOne"]({})
    : m["sim.player.side.playerTwo"]({});
}

export type ActionSelectionSessionCategoryId =
  | "activate-ability"
  | "challenge"
  | "ink-card"
  | "move-to-location"
  | "play-card"
  | "quest"
  | "shift-card"
  | "sing-card";

export type ActionSelectionPhase =
  | "idle"
  | "choose-source"
  | "choose-cost"
  | "choose-option"
  | "choose-target"
  | "confirm"
  | "executing";

type ActionSelectionCostSelections = Partial<Record<MoveOptionSelectableCostKind, string[]>>;

export interface ActionSelectionSession {
  categoryId: ActionSelectionSessionCategoryId;
  label: string;
  phase: ActionSelectionPhase;
  candidateMoves: ExecutableMoveEntry[];
  sourceCardId: string | null;
  targetCardId: string | null;
  selectedCardIds: string[];
  selectedCosts: ActionSelectionCostSelections;
  selectedMoveId: string | null;
  confirmationRequired: boolean;
}

type NamedCardSearchResult = {
  id: string;
  label: string;
  name: string;
};

type ScryResolutionSelection = {
  id: string;
  zone: string;
  cards: string[];
};

type ScryCardView = Pick<
  LorcanaCardSnapshot,
  "cardId" | "label" | "cardType" | "actionSubtype" | "cost" | "classifications"
>;

type ResolutionSelectionPhase = "selecting" | "executing";

interface ResolutionSelectionSession {
  move: PendingResolutionMoveEntry;
  context: ResolutionSelectionContext;
  promptMessage: string;
  promptInlineReference: GuidanceInlineReference | null;
  abilityDescription: string | null;
  sessionStatusMessage: string;
  phase: ResolutionSelectionPhase;
  inline: boolean;
  activeTargetSlotIndex: number | null;
  selectedTargets: string[];
  selectedAmount: number | null;
  selectedChoiceIndex: number | null;
  selectedOptionalValue: boolean | null;
  selectedEnterPlayExerted: boolean | null;
  namedCardQuery: string;
  selectedNamedCard: string | null;
  scryDestinations: ScryResolutionSelection[];
}

interface AutoOpenResolutionCandidate {
  key: string;
  move: PendingResolutionMoveEntry;
  context: ResolutionSelectionContext | null;
}

type ResolutionPromptReferenceKind = "action-card" | "activated-ability";

interface ResolutionPromptContent {
  message: string;
  inlineReference: GuidanceInlineReference | null;
}

interface ResolutionSourceHint {
  kind: ResolutionPromptReferenceKind;
  sourceCardId: string;
  abilityIndex?: number;
}

function isActionSelectionCategoryId(
  categoryId: ExecutableMovePresentationCategoryId,
): categoryId is ActionSelectionSessionCategoryId {
  return (
    categoryId === "activate-ability" ||
    categoryId === "challenge" ||
    categoryId === "ink-card" ||
    categoryId === "move-to-location" ||
    categoryId === "play-card" ||
    categoryId === "shift-card" ||
    categoryId === "sing-card" ||
    categoryId === "quest"
  );
}

function getSourceCardIdForActionSelectionMove(
  categoryId: ActionSelectionSessionCategoryId,
  move: ExecutableMoveEntry,
): string | null {
  if (categoryId === "activate-ability") {
    return getCardActionSourceCardId(move);
  }

  return getCardActionSourceCardId(move);
}

function getTargetCardIdForActionSelectionMove(
  categoryId: ActionSelectionSessionCategoryId,
  move: ExecutableMoveEntry,
): string | null {
  return getCardActionTargetCardId(move);
}

type SingTogetherSelectionCandidate = {
  cardId: string;
  value: number;
};

type SingTogetherSelectionMetadata = {
  requiredValue: number;
  candidateCards: SingTogetherSelectionCandidate[];
};

function getSingTogetherSelectionMetadata(
  move: ExecutableMoveEntry | null | undefined,
): SingTogetherSelectionMetadata | null {
  if (!move || move.moveId !== "playCard" || move.presentation.kind !== "targeted") {
    return null;
  }

  const cost = (move.params as { cost?: unknown }).cost;
  if (cost !== "singTogether" || move.presentation.selectionMode !== "singTogether") {
    return null;
  }

  const candidateCards = Array.isArray(move.presentation.candidateCards)
    ? move.presentation.candidateCards.filter(
        (candidate): candidate is SingTogetherSelectionCandidate =>
          typeof candidate?.cardId === "string" && typeof candidate?.value === "number",
      )
    : [];
  const requiredValue =
    typeof move.presentation.requiredValue === "number" ? move.presentation.requiredValue : null;

  if (candidateCards.length === 0 || requiredValue == null) {
    return null;
  }

  return {
    requiredValue,
    candidateCards,
  };
}

function isSingTogetherSelectionMove(move: ExecutableMoveEntry | null | undefined): boolean {
  return getSingTogetherSelectionMetadata(move) !== null;
}

function getSingTogetherSelectionMove(session: ActionSelectionSession): ExecutableMoveEntry | null {
  const selectedMove =
    session.selectedMoveId != null
      ? (session.candidateMoves.find((move) => move.id === session.selectedMoveId) ?? null)
      : null;
  if (isSingTogetherSelectionMove(selectedMove)) {
    return selectedMove;
  }

  if (!session.sourceCardId) {
    return null;
  }

  const singTogetherMoves = getSourceMovesForActionSelectionSession(
    session,
    session.sourceCardId,
  ).filter((move) => isSingTogetherSelectionMove(move));
  return singTogetherMoves.length === 1 ? (singTogetherMoves[0] ?? null) : null;
}

function isSingTogetherSelectionSession(session: ActionSelectionSession): boolean {
  return session.categoryId === "sing-card" && getSingTogetherSelectionMove(session) !== null;
}

function getSingTogetherSelectionTotal(
  session: ActionSelectionSession,
  move: ExecutableMoveEntry | null | undefined = getSingTogetherSelectionMove(session),
): number {
  const metadata = getSingTogetherSelectionMetadata(move);
  if (!metadata) {
    return 0;
  }

  const selectedCardIds = new Set(session.selectedCardIds);
  return metadata.candidateCards.reduce(
    (total, candidate) => total + (selectedCardIds.has(candidate.cardId) ? candidate.value : 0),
    0,
  );
}

function canConfirmSingTogetherSelection(session: ActionSelectionSession): boolean {
  const move = getSingTogetherSelectionMove(session);
  const metadata = getSingTogetherSelectionMetadata(move);
  if (!metadata) {
    return false;
  }

  return getSingTogetherSelectionTotal(session, move) >= metadata.requiredValue;
}

function getUniqueOrderedIds(values: Array<string | null | undefined>): string[] {
  const seen = new Set<string>();
  const orderedIds: string[] = [];

  for (const value of values) {
    if (!value || seen.has(value)) {
      continue;
    }

    seen.add(value);
    orderedIds.push(value);
  }

  return orderedIds;
}

function getMoveAbilityIndex(move: ExecutableMoveEntry): number | null {
  if (!isActivateAbilityMove(move)) {
    return null;
  }

  return typeof move.params.abilityIndex === "number" ? move.params.abilityIndex : 0;
}

function isActivateAbilityMove(move: ExecutableMoveEntry): move is ExecutableMoveEntry & {
  moveId: "activateAbility";
  params: LorcanaSimulatorMoveParams["activateAbility"];
} {
  return move.moveId === "activateAbility";
}

function getMoveSelectableCosts(
  move: ExecutableMoveEntry | null | undefined,
): MoveOptionSelectableCost[] {
  return move?.presentation.kind === "targeted" && Array.isArray(move.presentation.selectableCosts)
    ? [...move.presentation.selectableCosts]
    : [];
}

function getSelectedCostCardIds(
  session: ActionSelectionSession,
  costKind: MoveOptionSelectableCostKind,
): string[] {
  return [...(session.selectedCosts[costKind] ?? [])];
}

function getNextSelectableCost(
  session: ActionSelectionSession,
  move: ExecutableMoveEntry | null | undefined,
): MoveOptionSelectableCost | null {
  for (const selectableCost of getMoveSelectableCosts(move)) {
    if (getSelectedCostCardIds(session, selectableCost.kind).length < selectableCost.count) {
      return selectableCost;
    }
  }

  return null;
}

function hasOutstandingSelectableCosts(
  session: ActionSelectionSession,
  move: ExecutableMoveEntry | null | undefined,
): boolean {
  return getNextSelectableCost(session, move) !== null;
}

function getCurrentMoveForActionSelectionSession(
  session: ActionSelectionSession,
): ExecutableMoveEntry | null {
  return session.selectedMoveId
    ? (session.candidateMoves.find((move) => move.id === session.selectedMoveId) ?? null)
    : null;
}

function getRelevantMovesForActionSelectionSession(
  session: ActionSelectionSession,
): ExecutableMoveEntry[] {
  return session.candidateMoves.filter((move) => {
    if (
      session.sourceCardId &&
      getSourceCardIdForActionSelectionMove(session.categoryId, move) !== session.sourceCardId
    ) {
      return false;
    }

    if (
      session.targetCardId &&
      getTargetCardIdForActionSelectionMove(session.categoryId, move) !== session.targetCardId
    ) {
      return false;
    }

    return true;
  });
}

function getReferenceMoveForActionSelectionSession(
  session: ActionSelectionSession,
): ExecutableMoveEntry | null {
  return (
    getCurrentMoveForActionSelectionSession(session) ??
    getRelevantMovesForActionSelectionSession(session)[0] ??
    null
  );
}

function getCurrentSelectableCostForActionSelectionSession(
  session: ActionSelectionSession,
): MoveOptionSelectableCost | null {
  return getNextSelectableCost(session, getReferenceMoveForActionSelectionSession(session));
}

function getPostCostActionSelectionPhase(
  session: ActionSelectionSession,
  move: ExecutableMoveEntry,
): "choose-cost" | "choose-target" | "confirm" | "executing" {
  if (hasOutstandingSelectableCosts(session, move)) {
    return "choose-cost";
  }

  if (
    !session.targetCardId &&
    (isSingTogetherSelectionMove(move) ||
      (session.sourceCardId &&
        usesTargetSelectionForActionSelectionMoves(
          session.categoryId,
          getSourceMovesForActionSelectionSession(session, session.sourceCardId),
        )))
  ) {
    return "choose-target";
  }

  return session.confirmationRequired ? "confirm" : "executing";
}

function applySelectedCostsToMoveParams(
  move: ExecutableMoveEntry,
  session: ActionSelectionSession,
): LorcanaSimulatorMoveParams[LorcanaSimulatorMoveId] {
  const selectableCosts = getMoveSelectableCosts(move);
  if (selectableCosts.length === 0) {
    return move.params;
  }

  if (move.moveId === "activateAbility") {
    const activateAbilityParams = move.params as LorcanaSimulatorMoveParams["activateAbility"];
    return {
      ...activateAbilityParams,
      costs: {
        ...activateAbilityParams.costs,
        ...(session.selectedCosts.banishCharacters
          ? { banishCharacters: [...session.selectedCosts.banishCharacters] }
          : {}),
        ...(session.selectedCosts.banishItems
          ? { banishItems: [...session.selectedCosts.banishItems] }
          : {}),
        ...(session.selectedCosts.discardCards
          ? { discardCards: [...session.selectedCosts.discardCards] }
          : {}),
        ...(session.selectedCosts.exertCharacters
          ? { exertCharacters: [...session.selectedCosts.exertCharacters] }
          : {}),
        ...(session.selectedCosts.exertItems
          ? { exertItems: [...session.selectedCosts.exertItems] }
          : {}),
      },
    } satisfies LorcanaSimulatorMoveParams["activateAbility"];
  }

  if (move.moveId === "playCard") {
    const playCardParams = move.params as LorcanaSimulatorMoveParams["playCard"];
    if (playCardParams.cost === "shift") {
      return {
        ...playCardParams,
        ...(session.selectedCosts.discardCards
          ? { discardCards: [...session.selectedCosts.discardCards] }
          : {}),
      } satisfies LorcanaSimulatorMoveParams["playCard"];
    }
    if (playCardParams.cost === "sacrifice" && session.selectedCosts.banishItems?.length) {
      return {
        ...playCardParams,
        sacrificeTarget: session.selectedCosts.banishItems[0],
      } satisfies LorcanaSimulatorMoveParams["playCard"];
    }
    if (playCardParams.cost === "exert-items" && session.selectedCosts.exertItems?.length) {
      return {
        ...playCardParams,
        exertTargets: [...session.selectedCosts.exertItems],
      } satisfies LorcanaSimulatorMoveParams["playCard"];
    }
    if (
      playCardParams.cost === "put-on-deck-bottom" &&
      session.selectedCosts.putOnDeckBottom?.length
    ) {
      return {
        ...playCardParams,
        deckBottomTarget: session.selectedCosts.putOnDeckBottom[0],
      } satisfies LorcanaSimulatorMoveParams["playCard"];
    }
  }

  return move.params;
}

function buildActionSelectionSession(
  categoryId: ActionSelectionSessionCategoryId,
  moves: readonly ExecutableMoveEntry[],
  confirmationRequired: boolean,
): ActionSelectionSession | null {
  if (moves.length === 0) {
    return null;
  }

  return {
    categoryId,
    label: moves[0]?.presentation.categoryLabel ?? getMoveCategoryLabel(moves[0]?.moveId ?? ""),
    phase: "choose-source",
    candidateMoves: [...moves],
    sourceCardId: null,
    targetCardId: null,
    selectedCardIds: [],
    selectedCosts: {},
    selectedMoveId: null,
    confirmationRequired,
  };
}

function isTargetResolutionSelectionContext(
  context: ResolutionSelectionContext,
): context is TargetResolutionSelectionContext {
  return context.kind === "target-selection" || context.kind === "discard-choice";
}

function isOptionalContinuationResolutionContext(context: ResolutionSelectionContext): boolean {
  return (
    context.kind !== "optional-selection" &&
    (context.currentSelection.resolveOptional === true ||
      (isTargetResolutionSelectionContext(context) && context.originatesFromOptional === true))
  );
}

function shouldAutoSubmitResolutionTargetSelection(
  session: ResolutionSelectionSession,
  skipActionConfirmation: boolean,
  amountSelection: ResolutionAmountSelectionState | null = null,
): boolean {
  if (!skipActionConfirmation || !isTargetResolutionSelectionContext(session.context)) {
    return false;
  }
  if (hasPlayCardEntryModeSelection(session.context, session.selectedTargets)) {
    return false;
  }
  if (amountSelection && amountSelection.max > amountSelection.min) {
    return false;
  }

  return (
    session.context.minSelections === 1 &&
    session.context.maxSelections === 1 &&
    !session.context.ordered
  );
}

function getGuidanceTargetSlotLabel(slot: PromptSlot): string {
  switch (slot.labelKey) {
    case "prompt.slot.move-damage.from":
      return "From";
    case "prompt.slot.move-damage.to":
      return "To";
    case "prompt.slot.move-to-location.subject":
      return "Character";
    case "prompt.slot.move-to-location.location":
      return "Location";
    case "prompt.slot.banish-and-play.banish":
      return "Banish";
    case "prompt.slot.banish-and-play.play":
      return "Play";
    default:
      return "Target";
  }
}

function getGuidanceTargetSlotPlaceholder(slot: PromptSlot): string {
  switch (slot.labelKey) {
    case "prompt.slot.move-damage.from":
      return "Choose damage source";
    case "prompt.slot.move-damage.to":
      return "Choose opposing character";
    case "prompt.slot.move-to-location.subject":
      return "Choose character";
    case "prompt.slot.move-to-location.location":
      return "Choose location";
    case "prompt.slot.banish-and-play.banish":
      return "Choose card to banish";
    case "prompt.slot.banish-and-play.play":
      return "Choose card to play";
    default:
      return "Choose target";
  }
}

function buildGuidanceTargetSlots(params: {
  slots: readonly PromptSlot[] | null | undefined;
  activeSlotIndex: number | null | undefined;
  cardSnapshotsById: CardSnapshotMap;
}): GuidanceTargetSlot[] | undefined {
  const { slots, activeSlotIndex, cardSnapshotsById } = params;
  const visibleSlots = slots?.filter((slot) => !slot.autoResolved) ?? [];
  if (visibleSlots.length <= 1) {
    return undefined;
  }

  return visibleSlots.map((slot) => {
    const targetCardId = slot.targetCardId ? String(slot.targetCardId) : null;
    const card = targetCardId ? (cardSnapshotsById[targetCardId] ?? null) : null;

    return {
      id: `target-slot:${slot.key}:${slot.index}`,
      label: getGuidanceTargetSlotLabel(slot),
      detail: card?.label ?? getGuidanceTargetSlotPlaceholder(slot),
      active: activeSlotIndex === slot.index,
      selected: Boolean(card),
    };
  });
}

function buildMoveToLocationGuidanceTargetSlots(params: {
  selectedTargets: readonly string[];
  activeSlotIndex: number | null | undefined;
  cardSnapshotsById: CardSnapshotMap;
  fixedLocationId?: string | null;
}): GuidanceTargetSlot[] | undefined {
  const { subjectIds, locationId } = splitMoveToLocationSessionTargets(params);
  if (subjectIds.length === 0 && locationId === null) {
    return undefined;
  }

  const location = locationId ? (params.cardSnapshotsById[locationId] ?? null) : null;

  return [
    {
      id: "target-slot:move-to-location:subjects",
      label: "Characters",
      detail:
        subjectIds.length === 0
          ? "Choose characters"
          : subjectIds.length === 1
            ? (params.cardSnapshotsById[subjectIds[0]]?.label ?? "1 selected")
            : `${subjectIds.length} selected`,
      active: params.activeSlotIndex === 0,
      selected: subjectIds.length > 0,
    },
    {
      id: "target-slot:move-to-location:location",
      label: "Location",
      detail: location?.label ?? "Choose location",
      active: params.activeSlotIndex === 1,
      selected: location !== null,
    },
  ];
}

function matchesSelectionId(candidateId: string, targetId: string): boolean {
  return candidateId === targetId || String(candidateId) === String(targetId);
}

function includesSelectionId(candidateIds: readonly string[], targetId: string): boolean {
  return candidateIds.some((candidateId) => matchesSelectionId(candidateId, targetId));
}

function getCardTargetTypes(target: LorcanaCardTarget): string[] {
  const cardTypes = Array.isArray(target.cardTypes)
    ? target.cardTypes.filter((cardType): cardType is string => typeof cardType === "string")
    : [];
  return typeof target.cardType === "string"
    ? [...new Set([...cardTypes, target.cardType])]
    : cardTypes;
}

function getSelectionTargetDsl(
  context: TargetResolutionSelectionContext,
  selectionIndex: number,
): LorcanaCardTarget | null {
  if (context.targetDsl.length === 0) {
    return null;
  }

  const targetDsl = context.targetDsl[Math.min(selectionIndex, context.targetDsl.length - 1)];
  return isCardTargetDsl(targetDsl) ? targetDsl : null;
}

/**
 * Validate a single card against a target-DSL entry.
 *
 * `referenceSide` is the side the DSL's `owner: "you" | "opponent"` is
 * interpreted RELATIVE TO — always the source card's controller, NOT the
 * chooser. They are the same for the typical "you play X, choose one of your
 * characters" effects but DIVERGE for `chosenBy: "opponent"` effects (Sid
 * Phillips - Toy Surgeon, Be King Undisputed, Dinky - Has the Brains, etc.)
 * where the controller forces the opponent to pick from THEIR OWN
 * characters: the candidate list correctly contains the chooser's own
 * characters, and the DSL's `owner: "opponent"` is opponent-of-the-controller,
 * which equals the chooser. Passing `chooserSide` here used to reject every
 * legal selection in that case → Confirm stayed greyed out → user timed out.
 *
 * The same convention is documented in `prompt-snapshot.ts` for the candidate
 * list builder (see `buildCandidateEntriesFromView`).
 */
function cardMatchesSelectionTargetDsl(params: {
  card: LorcanaCardSnapshot;
  target: LorcanaCardTarget;
  referenceSide: LorcanaPlayerSide | null;
}): boolean {
  const { card, target, referenceSide } = params;
  if (
    Array.isArray(target.zones) &&
    target.zones.length > 0 &&
    !target.zones.includes(card.zoneId)
  ) {
    return false;
  }

  const cardTypes = getCardTargetTypes(target);
  if (
    cardTypes.length > 0 &&
    (typeof card.cardType !== "string" || !cardTypes.includes(card.cardType))
  ) {
    return false;
  }

  if (target.owner === "you" && referenceSide !== null && card.ownerSide !== referenceSide) {
    return false;
  }

  if (target.owner === "opponent" && referenceSide !== null && card.ownerSide === referenceSide) {
    return false;
  }

  return true;
}

function selectedTargetsMatchTargetDslSequence(params: {
  context: TargetResolutionSelectionContext;
  selectedTargets: readonly string[];
  cardSnapshotsById: CardSnapshotMap;
  referenceSide: LorcanaPlayerSide | null;
}): boolean {
  const { context, selectedTargets, cardSnapshotsById, referenceSide } = params;
  if (context.expectedSlottedKind || context.targetDsl.length === 0) {
    return true;
  }

  let cardSelectionIndex = 0;
  for (const targetId of selectedTargets) {
    if (!includesSelectionId(context.cardCandidateIds, targetId)) {
      continue;
    }

    const card = cardSnapshotsById[targetId];
    const target = getSelectionTargetDsl(context, cardSelectionIndex);
    if (card && target && !cardMatchesSelectionTargetDsl({ card, target, referenceSide })) {
      return false;
    }
    cardSelectionIndex += 1;
  }

  return true;
}

function getPlayCardEntryModeTargetId(
  context: TargetResolutionSelectionContext,
  selectedTargets: readonly string[],
): string | null {
  const entryModeCandidateIds = context.playCardEntryModeCandidateIds ?? [];
  return (
    selectedTargets.find((targetId) => includesSelectionId(entryModeCandidateIds, targetId)) ?? null
  );
}

function hasPlayCardEntryModeSelection(
  context: TargetResolutionSelectionContext,
  selectedTargets: readonly string[],
): boolean {
  return getPlayCardEntryModeTargetId(context, selectedTargets) !== null;
}

function getNextEnterPlayExertedSelection(params: {
  context: TargetResolutionSelectionContext;
  nextSelectedTargets: readonly string[];
  previousSelectedTargets: readonly string[];
  previousValue: boolean | null;
}): boolean | null {
  const nextTargetId = getPlayCardEntryModeTargetId(params.context, params.nextSelectedTargets);
  if (!nextTargetId) {
    return null;
  }

  const previousTargetId = getPlayCardEntryModeTargetId(
    params.context,
    params.previousSelectedTargets,
  );
  return previousTargetId &&
    matchesSelectionId(previousTargetId, nextTargetId) &&
    params.previousValue !== null
    ? params.previousValue
    : false;
}

function splitMoveToLocationSessionTargets(params: {
  selectedTargets: readonly string[];
  cardSnapshotsById: CardSnapshotMap;
  fixedLocationId?: string | null;
}): { subjectIds: string[]; locationId: string | null } {
  const subjectIds: string[] = [];
  let locationId: string | null = params.fixedLocationId ?? null;

  for (const targetId of params.selectedTargets) {
    const card = params.cardSnapshotsById[targetId];
    if (card?.cardType === "location") {
      locationId = params.fixedLocationId ?? targetId;
    } else {
      subjectIds.push(targetId);
    }
  }

  return { subjectIds, locationId };
}

function getFixedMoveToLocationSlotId(
  slots: readonly PromptSlot[] | null | undefined,
): string | null {
  const locationSlot = slots?.find(
    (slot) => slot.key === "location" && slot.autoResolved && slot.targetCardId,
  );
  return locationSlot?.targetCardId ? String(locationSlot.targetCardId) : null;
}

function getFixedMoveToLocationBoardId(
  board: LorcanaProjectedBoardView | null,
  sourceCardId: CardInstanceId,
): string | null {
  const cards = board?.cards as
    | Record<string, { atLocationId?: CardInstanceId; cardType?: string }>
    | undefined;
  const locationId = cards?.[sourceCardId as unknown as string]?.atLocationId;
  if (!locationId) {
    return null;
  }
  return cards?.[locationId as unknown as string]?.cardType === "location"
    ? String(locationId)
    : null;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function canDeclineResolutionSelectionSession(session: ResolutionSelectionSession | null): boolean {
  if (!session || session.phase === "executing") {
    return false;
  }

  if (session.context.kind === "optional-selection") {
    return true;
  }

  return (
    isTargetResolutionSelectionContext(session.context) &&
    (session.context.canDeclineSelection === true ||
      session.context.originatesFromOptional === true)
  );
}

function canAutoResolveLeadingDrawInOptionalSequence(
  board: LorcanaProjectedBoardView,
  bagEffect: LorcanaProjectedBoardView["bagEffects"][number],
): boolean {
  const payloadRecord = asRecord(bagEffect.payload);
  const effectRecord = asRecord(payloadRecord?.effect);
  if (effectRecord?.type !== "sequence") {
    return false;
  }

  const steps = Array.isArray(effectRecord.steps) ? effectRecord.steps : [];
  const firstStep = asRecord(steps[0]);
  if (firstStep?.type !== "draw") {
    return false;
  }

  const requirements = analyzeResolutionRequirements(
    firstStep as Parameters<typeof analyzeResolutionRequirements>[0],
  );
  if (!requirements.canAutoResolve) {
    return false;
  }

  const controllerBoard = board.players[bagEffect.controllerId];
  return (controllerBoard?.hand.length ?? controllerBoard?.handCount ?? 0) === 0;
}

function getResolutionDeclineLabel(session: ResolutionSelectionSession): string {
  return session.context.kind === "optional-selection"
    ? session.context.rejectLabel
    : isOptionalContinuationResolutionContext(session.context)
      ? m["sim.actions.label.skipOptionalEffect"]({})
      : m["sim.actions.label.declineEffect"]({});
}

function getScryCardView(
  cardSnapshotsById: CardSnapshotMap,
  context: Extract<ResolutionSelectionContext, { kind: "scry-selection" }>,
  cardId: string,
): ScryCardView | ResolutionSelectionRevealedCard | null {
  const snapshot = cardSnapshotsById[cardId] ?? null;
  if (snapshot) {
    return {
      cardId: snapshot.cardId,
      label: snapshot.label,
      cardType: snapshot.cardType,
      actionSubtype: snapshot.actionSubtype,
      cost: snapshot.cost,
      classifications: snapshot.classifications,
    };
  }

  return (
    context.revealedCards.find((candidate) => matchesSelectionId(candidate.cardId, cardId)) ?? null
  );
}

function buildScryPreviewDestinations(
  cardSnapshotsById: CardSnapshotMap,
  context: Extract<ResolutionSelectionContext, { kind: "scry-selection" }>,
  manualDestinations: ScryResolutionSelection[],
): ScryResolutionSelection[] {
  const previews = context.destinationRules.map((rule) => {
    const manualSelection = manualDestinations.find((destination) => destination.id === rule.id);
    return {
      id: rule.id,
      zone: rule.zone,
      cards: [...(manualSelection?.cards ?? [])],
    };
  });
  const assignedIds = new Set(previews.flatMap((destination) => destination.cards));

  for (const rule of context.destinationRules) {
    if (!rule.remainder) {
      continue;
    }

    const previewDestination = previews.find((destination) => destination.id === rule.id);
    if (!previewDestination) {
      continue;
    }

    const remainingSlots =
      rule.max === null
        ? Number.POSITIVE_INFINITY
        : Math.max(0, rule.max - previewDestination.cards.length);
    if (remainingSlots === 0) {
      continue;
    }

    for (const cardId of context.revealedCardIds) {
      if (assignedIds.has(cardId)) {
        continue;
      }

      const card = getScryCardView(cardSnapshotsById, context, cardId);
      if (!card || !canAssignCardToScryDestination(card, rule)) {
        continue;
      }

      previewDestination.cards.push(cardId);
      assignedIds.add(cardId);

      if (previewDestination.cards.length >= remainingSlots && Number.isFinite(remainingSlots)) {
        break;
      }
    }
  }

  return previews;
}

function getScryUnassignedCardIds(
  previewDestinations: ScryResolutionSelection[],
  context: Extract<ResolutionSelectionContext, { kind: "scry-selection" }>,
): string[] {
  const assignedIds = new Set(previewDestinations.flatMap((destination) => destination.cards));
  return context.revealedCardIds.filter((cardId) => !assignedIds.has(cardId));
}

/**
 * True when at least one card assigned to a `play` scry destination prints a
 * "may enter play exerted" option — either via the Bodyguard keyword or via
 * a static `may-enter-play-exerted` ability (e.g. Mickey Mouse — Expedition
 * Leader's LONG JOURNEY, Hamish, Hubert & Harris — Making Mischief). Used to
 * gate forwarding of `enterPlayExerted` on the resolveEffect submission and
 * to decide whether to render the entry-mode toggle in the scry overlay.
 * See triage 2026-05-11 #11 (Down in New Orleans).
 */
function scryAssignsEntryModeCardToPlay(
  context: Extract<ResolutionSelectionContext, { kind: "scry-selection" }>,
  manualDestinations: ScryResolutionSelection[],
  cardSnapshotsById: CardSnapshotMap,
): boolean {
  const playDestinationIds = new Set(
    context.destinationRules.filter((rule) => rule.zone === "play").map((rule) => rule.id),
  );
  if (playDestinationIds.size === 0) {
    return false;
  }
  for (const destination of manualDestinations) {
    if (!playDestinationIds.has(destination.id)) {
      continue;
    }
    for (const cardId of destination.cards) {
      const card = cardSnapshotsById[cardId];
      if (!card) {
        continue;
      }
      if (card.keywords?.includes("Bodyguard") || card.mayEnterPlayExertedOption === true) {
        return true;
      }
    }
  }
  return false;
}

function isInlineResolutionSelectionContext(context: ResolutionSelectionContext): boolean {
  return (
    isTargetResolutionSelectionContext(context) &&
    context.playerCandidateIds.length === 0 &&
    context.cardCandidateIds.length > 0 &&
    !context.ordered &&
    context.allowedZones.length > 0 &&
    context.allowedZones.every((zone) => zone === "play")
  );
}

function buildResolutionSelectionSession(
  move: PendingResolutionMoveEntry,
  context: ResolutionSelectionContext,
  promptMessage: string,
  promptInlineReference: GuidanceInlineReference | null,
  abilityDescription: string | null,
  sessionStatusMessage: string,
): ResolutionSelectionSession {
  const scryDestinations =
    context.kind === "scry-selection"
      ? context.destinationRules.map((rule, index) => {
          const currentDestinations = context.currentSelection.destinations ?? [];
          const currentDestination = currentDestinations[index];

          return {
            id: rule.id,
            zone: rule.zone,
            cards: [...(currentDestination?.cards ?? [])],
          };
        })
      : [];

  return {
    move,
    context,
    promptMessage,
    promptInlineReference,
    abilityDescription,
    sessionStatusMessage,
    phase: "selecting",
    inline: isInlineResolutionSelectionContext(context),
    activeTargetSlotIndex: null,
    selectedTargets: [...(context.currentSelection.targets ?? [])],
    selectedAmount:
      typeof context.currentSelection.amount === "number" ? context.currentSelection.amount : null,
    selectedChoiceIndex:
      typeof context.currentSelection.choiceIndex === "number"
        ? context.currentSelection.choiceIndex
        : null,
    selectedOptionalValue:
      typeof context.currentSelection.resolveOptional === "boolean"
        ? context.currentSelection.resolveOptional
        : null,
    selectedEnterPlayExerted:
      typeof context.currentSelection.enterPlayExerted === "boolean"
        ? context.currentSelection.enterPlayExerted
        : null,
    namedCardQuery: context.currentSelection.namedCard ?? "",
    selectedNamedCard: context.currentSelection.namedCard ?? null,
    scryDestinations,
  };
}

/**
 * Distinguishes player-only DSL entries from card targets, including when both use
 * `selector: "chosen"` — mirrors `isPlayerTargetDescriptor` in engine `target-resolver.ts`.
 */
function isPlayerOnlyTargetDslForResolutionFinder(target: object): boolean {
  const descriptor = target as Record<string, unknown>;
  const selector = descriptor.selector;

  if (
    selector !== "you" &&
    selector !== "opponent" &&
    selector !== "each-opponent" &&
    selector !== "each-player" &&
    selector !== "chosen" &&
    selector !== "challenging-player"
  ) {
    return false;
  }

  return (
    descriptor.reference === undefined &&
    descriptor.owner === undefined &&
    descriptor.cardType === undefined &&
    descriptor.cardTypes === undefined &&
    descriptor.zones === undefined
  );
}

const CARD_TARGET_SELECTOR_SCOPES = new Set<string>([
  "self",
  "chosen",
  "all",
  "each",
  "any",
  "random",
] satisfies readonly SelectorScope[]);

function isCardTargetDsl(target: unknown): target is LorcanaCardTarget {
  if (!target || typeof target !== "object" || Array.isArray(target)) {
    return false;
  }

  if (isPlayerOnlyTargetDslForResolutionFinder(target)) {
    return false;
  }

  const selector = (target as { selector?: unknown }).selector;
  if (typeof selector !== "string" || !CARD_TARGET_SELECTOR_SCOPES.has(selector)) {
    return false;
  }

  return true;
}

function getTargetOwnerForViewer(params: {
  candidateCards: readonly LorcanaCardSnapshot[];
  viewerSide: LorcanaPlayerSide | null;
}): LorcanaCardTarget["owner"] | undefined {
  const { candidateCards, viewerSide } = params;
  if (candidateCards.length === 0) {
    return undefined;
  }

  const ownerSides = new Set(candidateCards.map((card) => card.ownerSide));
  if (ownerSides.size !== 1) {
    return undefined;
  }

  const [ownerSide] = [...ownerSides];
  if (!ownerSide || !viewerSide) {
    return "any";
  }

  return ownerSide === viewerSide ? "you" : "opponent";
}

function buildResolutionSelectionTargetQuery(params: {
  context: TargetResolutionSelectionContext;
  cardSnapshotsById: CardSnapshotMap;
  viewerSide: LorcanaPlayerSide | null;
}): LorcanaCardTarget | null {
  const { context, cardSnapshotsById, viewerSide } = params;
  const candidateCards = context.cardCandidateIds
    .map((cardId) => cardSnapshotsById[cardId] ?? null)
    .filter((card): card is LorcanaCardSnapshot => card !== null);
  const fallbackOwner = getTargetOwnerForViewer({ candidateCards, viewerSide });
  const cardTargetDsl = context.targetDsl.find(isCardTargetDsl) ?? null;

  if (cardTargetDsl) {
    return {
      ...cardTargetDsl,
      owner: cardTargetDsl.owner ?? fallbackOwner ?? "any",
      zones:
        Array.isArray(cardTargetDsl.zones) && cardTargetDsl.zones.length > 0
          ? [...cardTargetDsl.zones]
          : context.allowedZones.length > 0
            ? [...context.allowedZones]
            : undefined,
    };
  }

  if (context.cardCandidateIds.length === 0) {
    return null;
  }

  const cardTypes = new Set(candidateCards.map((card) => card.cardType).filter(Boolean));

  return {
    selector: "all",
    owner: fallbackOwner ?? "any",
    zones: context.allowedZones.length > 0 ? [...context.allowedZones] : undefined,
    cardType:
      cardTypes.size === 1 ? ([...cardTypes][0] as LorcanaCardTarget["cardType"]) : undefined,
  };
}

function getSourceMovesForActionSelectionSession(
  session: ActionSelectionSession,
  sourceCardId: string,
): ExecutableMoveEntry[] {
  return session.candidateMoves.filter(
    (move) => getSourceCardIdForActionSelectionMove(session.categoryId, move) === sourceCardId,
  );
}

function usesTargetSelectionForActionSelectionMoves(
  categoryId: ActionSelectionSessionCategoryId,
  moves: readonly ExecutableMoveEntry[],
): boolean {
  if (categoryId === "challenge" || categoryId === "move-to-location") {
    return moves.length > 0;
  }

  if (
    categoryId !== "play-card" &&
    categoryId !== "shift-card" &&
    categoryId !== "sing-card" &&
    categoryId !== "activate-ability"
  ) {
    return false;
  }

  return (
    moves.length > 0 &&
    moves.every((move) => getTargetCardIdForActionSelectionMove(categoryId, move) !== null)
  );
}

function getChooseTargetStatusMessage(
  categoryId: ActionSelectionSessionCategoryId,
  sourceCardLabel: string,
): string {
  if (categoryId === "challenge") {
    return m["sim.guidance.session.chooseChallengeTarget"]({ cardLabel: sourceCardLabel });
  }

  if (categoryId === "move-to-location") {
    return m["sim.guidance.session.chooseMoveTarget"]({ cardLabel: sourceCardLabel });
  }

  if (categoryId === "sing-card") {
    return m["sim.guidance.session.chooseSinger"]({ cardLabel: sourceCardLabel });
  }

  if (categoryId === "play-card") {
    return `Choose a target for ${sourceCardLabel}.`;
  }

  if (categoryId === "shift-card") {
    return `Choose a shift target for ${sourceCardLabel}.`;
  }

  return `Choose a target for ${sourceCardLabel}.`;
}

function getChooseSingTogetherStatusMessage(
  sourceCardLabel: string,
  selectedTotal: number,
  requiredValue: number,
): string {
  return `Choose any number of ready characters to sing ${sourceCardLabel}. Selected ${selectedTotal}/${requiredValue}.`;
}

function getChooseSourceStatusMessage(categoryId: ActionSelectionSessionCategoryId): string {
  return categoryId === "ink-card"
    ? m["sim.guidance.session.chooseInkSource"]({})
    : categoryId === "quest"
      ? m["sim.guidance.session.chooseQuestSource"]({})
      : categoryId === "play-card" || categoryId === "shift-card" || categoryId === "sing-card"
        ? m["sim.guidance.session.choosePlaySource"]({})
        : categoryId === "challenge"
          ? m["sim.guidance.session.chooseChallengeSource"]({})
          : categoryId === "move-to-location"
            ? m["sim.guidance.session.chooseMoveSource"]({})
            : m["sim.guidance.session.activateAbilityPending"]({});
}

function getChooseOptionStatusMessage(
  session: ActionSelectionSession,
  sourceCardLabel: string,
): string {
  if (
    session.categoryId === "play-card" &&
    session.candidateMoves.some(
      (move) =>
        move.moveId === "playCard" &&
        typeof (move.params as { resolveOptional?: unknown }).resolveOptional === "boolean",
    )
  ) {
    return `Choose how ${sourceCardLabel} enters play. Bodyguard may enter exerted.`;
  }

  return session.categoryId === "play-card" ||
    session.categoryId === "shift-card" ||
    session.categoryId === "sing-card"
    ? m["sim.guidance.session.choosePlayOption"]({ cardLabel: sourceCardLabel })
    : `Choose an ability for ${sourceCardLabel}.`;
}

function getCostSelectionSummary(
  selectableCost: MoveOptionSelectableCost,
  selectedCount: number,
): string | undefined {
  const noun =
    selectableCost.kind === "discardCards"
      ? selectableCost.count === 1
        ? "card"
        : "cards"
      : selectableCost.kind === "exertCharacters"
        ? selectableCost.count === 1
          ? "character to exert"
          : "characters to exert"
        : selectableCost.kind === "exertItems"
          ? selectableCost.count === 1
            ? "item to exert"
            : "items to exert"
          : selectableCost.kind === "banishCharacters"
            ? selectableCost.count === 1
              ? "character to banish"
              : "characters to banish"
            : selectableCost.kind === "putOnDeckBottom"
              ? selectableCost.count === 1
                ? "Toy character to put on deck bottom"
                : "Toy characters to put on deck bottom"
              : selectableCost.count === 1
                ? "item to banish"
                : "items to banish";
  return selectedCount > 0
    ? `${selectedCount}/${selectableCost.count} ${noun} selected`
    : undefined;
}

function getChooseCostStatusMessage(
  sourceCardLabel: string,
  selectableCost: MoveOptionSelectableCost,
): string {
  const countPrefix = selectableCost.count === 1 ? "a" : `${selectableCost.count}`;
  const qualifier = selectableCost.cardName
    ? ` named ${selectableCost.cardName}`
    : selectableCost.classification
      ? ` with ${selectableCost.classification}`
      : selectableCost.cardType
        ? ` ${selectableCost.cardType}`
        : "";

  if (selectableCost.kind === "discardCards") {
    return `Choose ${countPrefix} card${selectableCost.count === 1 ? "" : "s"}${qualifier} to discard for ${sourceCardLabel}.`;
  }

  if (selectableCost.kind === "exertCharacters" || selectableCost.kind === "exertItems") {
    return `Choose ${countPrefix} ${selectableCost.kind === "exertCharacters" ? "character" : "item"}${selectableCost.count === 1 ? "" : "s"}${qualifier} to exert for ${sourceCardLabel}.`;
  }

  if (selectableCost.kind === "putOnDeckBottom") {
    return `Choose ${countPrefix} Toy character${selectableCost.count === 1 ? "" : "s"} from your discard to put on bottom of your deck to play ${sourceCardLabel} for free.`;
  }

  return `Choose ${countPrefix} ${selectableCost.kind === "banishCharacters" ? "character" : "item"}${selectableCost.count === 1 ? "" : "s"}${qualifier} to banish for ${sourceCardLabel}.`;
}

function getInvalidCostSelectionReason(selectableCost: MoveOptionSelectableCost): string {
  if (selectableCost.kind === "discardCards") {
    return "This card is not a valid discard cost.";
  }
  if (selectableCost.kind === "exertCharacters" || selectableCost.kind === "exertItems") {
    return "This card is not a valid exert cost.";
  }
  if (selectableCost.kind === "putOnDeckBottom") {
    return "This card is not a valid Toy character in your discard.";
  }
  return "This card is not a valid banish cost.";
}

function capitalize(value: string): string {
  return value.length > 0 ? `${value.charAt(0).toUpperCase()}${value.slice(1)}` : value;
}

function buildAvailableMovesCardDetail(card: LorcanaCardSnapshot): string | undefined {
  const fragments: string[] = [];

  if (card.cardType) {
    fragments.push(capitalize(card.cardType));
  }

  if (card.atLocationLabel) {
    fragments.push(`At ${card.atLocationLabel}`);
  }

  if (card.readyState === "exerted" && card.cardType === "character") {
    fragments.push("Exerted");
  }

  if (card.isDrying) {
    fragments.push("Drying");
  }

  return fragments.length > 0 ? fragments.join(" · ") : undefined;
}

async function saveGameplaySettings(update: {
  gameplaySettings: Record<string, unknown>;
}): Promise<void> {
  try {
    await updateUserSettings(update);
  } catch {
    // Silently fail - gameplay settings are non-critical
  }
}

async function saveVisualSettings(settings: {
  cardBack?: string;
  playmat?: string;
}): Promise<void> {
  try {
    await updateUserVisualSettings({ visualSettings: settings });
  } catch {
    // Silently fail - visual settings are non-critical
  }
}

export class LorcanaSidebarPresenter {
  readonly #game: LorcanaGameContextValue;
  readonly #settings: PlayerSettingsStore;
  #mobileNoticeId = 0;

  get selectedLocale() {
    return this.#settings.selectedLocale;
  }
  set selectedLocale(v) {
    this.#settings.selectedLocale = v;
  }
  isPlayerSettingsOpen = $state(false);
  showRawLogRegistryJson = $state(false);
  showRawErrorDialog = $state(false);
  mobileNotice = $state<{ id: number; message: string; tone: "info" } | null>(null);
  pendingMulliganDangerConfirm = $state<"keepHand" | "allCards" | null>(null);
  get skipActionConfirmation() {
    return this.#settings.skipActionConfirmation;
  }
  set skipActionConfirmation(v) {
    this.#settings.skipActionConfirmation = v;
  }
  get hotkeyMode() {
    return this.#settings.hotkeyMode;
  }
  set hotkeyMode(v) {
    this.#settings.hotkeyMode = v;
  }
  get cardPreviewMode() {
    return this.#settings.cardPreviewMode;
  }
  set cardPreviewMode(v) {
    this.#settings.cardPreviewMode = v;
  }
  get cardInfoMode() {
    return this.#settings.cardInfoMode;
  }
  set cardInfoMode(v) {
    this.#settings.cardInfoMode = v;
  }
  get primaryClickAction() {
    return this.#settings.primaryClickAction;
  }
  set primaryClickAction(v) {
    this.#settings.primaryClickAction = v;
  }
  get animationSpeed() {
    return this.#settings.animationSpeed;
  }
  set animationSpeed(v) {
    this.#settings.animationSpeed = v;
  }
  get soundVolume() {
    return this.#settings.soundVolume;
  }
  set soundVolume(v) {
    this.#settings.soundVolume = v;
  }
  get accessibleMobileControls() {
    return this.#settings.accessibleMobileControls;
  }
  set accessibleMobileControls(v) {
    this.#settings.accessibleMobileControls = v;
  }
  get showZoneCounters() {
    return this.#settings.showZoneCounters;
  }
  set showZoneCounters(v) {
    this.#settings.showZoneCounters = v;
  }
  guidancePosition = $state<GuidancePosition>("bottom");
  #mulliganSelectionActive = $state(false);
  #actionSelectionSession = $state<ActionSelectionSession | null>(null);
  #resolutionSelectionSession = $state<ResolutionSelectionSession | null>(null);
  #pendingResolutionSourceHint = $state<ResolutionSourceHint | null>(null);
  #lastHandledAutoOpenResolutionKey = $state<string | null>(null);

  #secondLayerCategoryLabel = $state<string | null>(null);
  #guidanceOrder = $state(0);
  #overlayGuidanceById = $state<Record<string, ActivePlayerGuidanceItem>>({});

  readonly activePlayerGuidanceController: ActivePlayerGuidanceController;

  constructor(game: LorcanaGameContextValue) {
    this.#game = game;
    this.#settings = new PlayerSettingsStore();
    this.#settings.setSaveToServer((update) => {
      saveGameplaySettings(update).catch(() => {});
    });
    this.#settings.setSaveVisualSettingsToServer((update) => {
      saveVisualSettings(update.visualSettings).catch(() => {});
    });

    this.activePlayerGuidanceController = {
      upsert: (item: {
        id: string;
        message: string;
        inlineReference?: GuidanceInlineReference;
        actions?: GuidanceAction[];
        mode?: ActivePlayerGuidanceItem["mode"];
      }) => {
        const existing = this.#overlayGuidanceById[item.id];
        const nextItem = {
          id: item.id,
          message: item.message,
          inlineReference: item.inlineReference,
          actions: item.actions ?? [],
          mode: item.mode ?? "default",
        } satisfies Omit<ActivePlayerGuidanceItem, "order">;

        if (overlayGuidanceEqual(existing, nextItem)) {
          return;
        }

        const nextOrder = existing ? existing.order : ++this.#guidanceOrder;
        this.#overlayGuidanceById = {
          ...this.#overlayGuidanceById,
          [item.id]: {
            ...nextItem,
            order: nextOrder,
          },
        };
      },
      remove: (id: string) => {
        if (!(id in this.#overlayGuidanceById)) {
          return;
        }

        const { [id]: _removed, ...remaining } = this.#overlayGuidanceById;
        this.#overlayGuidanceById = remaining;
      },
      setSecondLayerCategory: (categoryLabel: string | null) => {
        this.#secondLayerCategoryLabel = categoryLabel;
      },
    };
  }

  initializeLocale(): void {
    const storedRawRegistryFlag = localStorage.getItem(RAW_LOG_REGISTRY_STORAGE_KEY);
    if (storedRawRegistryFlag === "true") {
      this.showRawLogRegistryJson = true;
    } else if (storedRawRegistryFlag === "false") {
      this.showRawLogRegistryJson = false;
    }

    // Delegate bulk hydration to the shared settings store
    this.#settings.initialize();

    // Apply game-specific side effects that the shared store doesn't know about
    this.#game.setAnimationSpeed(this.animationSpeed);
    this.#game.setSoundVolume(this.soundVolume);
    this.#game.setShowZoneCounters(this.showZoneCounters);
    if (this.selectedLocale !== getLocale()) {
      this.#game.handleLocaleChanged();
    }
  }

  /**
   * Hydrate gameplay settings from server data, overriding localStorage values.
   * Call once after construction with data from GET /v1/users/me/settings.
   */
  initializeFromServer(serverSettings: ServerGameplaySettings): void {
    this.#settings.initializeFromServer(serverSettings);
    // Re-apply game-specific side effects with server values
    this.#game.setAnimationSpeed(this.animationSpeed);
    this.#game.setSoundVolume(this.soundVolume);
    this.#game.setShowZoneCounters(this.showZoneCounters);
  }

  syncAutoOpenPendingResolution(): void {
    this.#reconcileLocalInteractionSessions();

    const candidate = this.#getAutoOpenResolutionCandidate();
    if (!candidate || candidate.key === this.#lastHandledAutoOpenResolutionKey) {
      return;
    }

    // Don't auto-dispatch while an optimistic move is still awaiting server
    // confirmation. The engine would reject the second move with
    // OPTIMISTIC_MOVE_PENDING. Leave the key unset so this effect retries once
    // the confirmed board state arrives (which produces a fresh stateID key).
    if (this.#game.isOptimisticMovePending()) {
      sidebarLogger.debug(
        "Deferring auto-resolve of {moveId} (bag={bagId}): optimistic move in flight",
        {
          moveId: candidate.move.moveId,
          bagId:
            "params" in candidate.move
              ? (candidate.move.params as Record<string, unknown>).bagId
              : undefined,
        },
      );
      return;
    }

    sidebarLogger.debug("Auto-resolving {moveId} (key={key})", {
      moveId: candidate.move.moveId,
      key: candidate.key,
    });

    this.#lastHandledAutoOpenResolutionKey = candidate.key;

    if (this.#startResolutionSelectionSessionForMove(candidate.move, candidate.context)) {
      return;
    }

    if (candidate.move.moveId === "resolveEffect") {
      this.handleResolvePendingEffect(candidate.move);
    } else if (candidate.move.moveId === "resolveBag") {
      this.handleResolveBag(candidate.move);
    }
  }

  #reconcileLocalInteractionSessions(): void {
    const resolutionSession = this.#resolutionSelectionSession;
    if (resolutionSession) {
      const nextMove =
        resolutionSession.move.moveId === "resolveEffect"
          ? this.pendingResolutionMoveByEffectId.get(resolutionSession.move.params.effectId)
          : resolutionSession.move.moveId === "resolveBag"
            ? this.pendingResolutionMoveByBagId.get(resolutionSession.move.params.bagId)
            : null;

      if (!nextMove) {
        this.#resolutionSelectionSession = null;
      } else {
        const nextContext = this.#getSelectionContextForPendingResolutionMove(nextMove);
        if (
          !nextContext ||
          nextContext.kind !== resolutionSession.context.kind ||
          nextContext.requestId !== resolutionSession.context.requestId ||
          nextContext.origin !== resolutionSession.context.origin
        ) {
          this.#resolutionSelectionSession = null;
        } else if (
          nextMove !== resolutionSession.move ||
          nextContext !== resolutionSession.context
        ) {
          this.#resolutionSelectionSession = this.#normalizeResolutionSelectionSession({
            ...resolutionSession,
            move: nextMove,
            context: nextContext,
          });
        }
      }
    }

    const actionSession = this.#actionSelectionSession;
    if (!actionSession) {
      return;
    }

    const nextCandidateMoves = this.expandCategoryMoves(actionSession.categoryId).filter((move) =>
      actionSession.candidateMoves.some((candidate) => candidate.id === move.id),
    );

    if (nextCandidateMoves.length === 0) {
      this.#setActionSelectionSession(null);
      return;
    }

    const selectedMoveId =
      actionSession.selectedMoveId &&
      nextCandidateMoves.some((move) => move.id === actionSession.selectedMoveId)
        ? actionSession.selectedMoveId
        : null;

    const candidateMovesUnchanged =
      nextCandidateMoves.length === actionSession.candidateMoves.length &&
      nextCandidateMoves.every(
        (move, index) => move.id === actionSession.candidateMoves[index]?.id,
      );
    if (candidateMovesUnchanged && selectedMoveId === actionSession.selectedMoveId) {
      return;
    }

    this.#setActionSelectionSession({
      ...actionSession,
      candidateMoves: nextCandidateMoves,
      selectedMoveId,
    });
  }

  get boardSnapshot(): LorcanaProjectedBoardView | null {
    return this.#game.boardSnapshot();
  }

  get cardSnapshotsById(): CardSnapshotMap {
    return this.#game.cardSnapshotsById();
  }

  resolveCardSnapshot(cardId: string): LorcanaCardSnapshot | null {
    return this.#game.resolveCardSnapshot(cardId);
  }

  resolveStaticCardSnapshot(cardId: string): LorcanaCardSnapshot | null {
    return this.#game.resolveStaticCardSnapshot(cardId);
  }

  resolveCardName(cardId: string): string | null {
    return this.#game.resolveCardName(cardId);
  }

  resolveCardInkable(cardId: string): boolean | null {
    return this.#game.resolveCardInkable(cardId);
  }

  resolvePlayerName(playerId: string): string | null {
    return this.#game.resolvePlayerName(playerId);
  }

  get executableMoves(): ExecutableMoveEntry[] {
    return this.#game.executableMoves();
  }

  get moveCategorySummaries(): MoveCategorySummary[] {
    return this.#game.moveCategorySummaries();
  }

  get moveCategoryCount(): number {
    return this.#game.moveCategoryCount();
  }

  expandCategoryMoves = (
    categoryId: ExecutableMovePresentationCategoryId,
  ): ExecutableMoveEntry[] => {
    return this.#game.expandCategoryMoves(categoryId);
  };

  expandCardActionCategoryMoves = (
    cardId: string,
    categoryId: ExecutableMovePresentationCategoryId,
  ): ExecutableMoveEntry[] => {
    return this.#game.expandCardActionCategoryMoves(cardId, categoryId);
  };

  get resolutionActions(): ResolutionActionView[] {
    return buildResolutionActionViews({
      items: this.pendingEffectsPopoverItems,
      labels: {
        acceptEffect: m["sim.actions.label.acceptEffect"]({}),
        arrangeCards: m["sim.actions.label.arrangeCards"]({}),
        declineEffect: m["sim.actions.label.declineEffect"]({}),
        resolveEffect: m["sim.actions.label.resolveEffect"]({}),
        resolveTriggeredAbility: m["sim.actions.label.resolveTriggeredAbility"]({}),
      },
    });
  }

  get moveLogEntries(): MoveLogEntrySnapshot[] {
    return this.#game.moveLogEntries();
  }

  get ownerSide(): LorcanaPlayerSide | null {
    return this.#game.ownerSide();
  }

  get pregameActiveSide(): LorcanaPlayerSide | null {
    return this.#game.pregameActiveSide();
  }

  get pregamePhase(): PregamePhase | null {
    return this.#game.pregamePhase();
  }

  get canActInPregame(): boolean {
    return this.#game.canActInPregame();
  }

  get statusMessage(): string {
    return this.#game.statusMessage();
  }

  get selectedMulliganCardIds(): string[] {
    return this.#game.selectedMulliganCardIds();
  }

  get pendingErrorReason(): string | null {
    return this.#game.pendingErrorReason();
  }

  get pendingMoveError(): SimulatorMoveError | null {
    return this.#game.pendingMoveError();
  }

  get pendingResolutionMoves(): PendingResolutionMoveEntry[] {
    return this.#game.pendingResolutionMoves();
  }

  get actionSelectionSession(): ActionSelectionSession | null {
    return this.#actionSelectionSession;
  }

  /**
   * Surfaces the scry-overlay's Bodyguard "may enter exerted" control state.
   * Returns `null` when no scry-assigned `play` card has Bodyguard (so the
   * overlay can skip rendering the toggle). Returns the current selection
   * (`true`/`false`/`null` for not-yet-chosen) when a Bodyguard play
   * assignment is staged. See triage 2026-05-11 #11.
   */
  get scryBodyguardEntryMode(): { selected: boolean | null } | null {
    const session = this.#resolutionSelectionSession;
    if (!session || session.context.kind !== "scry-selection") {
      return null;
    }
    if (
      !scryAssignsEntryModeCardToPlay(
        session.context,
        session.scryDestinations,
        this.cardSnapshotsById,
      )
    ) {
      return null;
    }
    return { selected: session.selectedEnterPlayExerted };
  }

  get resolutionSelectionSession(): ResolutionSelectionSession | null {
    return this.#resolutionSelectionSession;
  }

  /**
   * Renderer-facing view of the active engine prompt, enriched with the
   * chooser's in-flight (typed-but-not-submitted) selection state from
   * `#resolutionSelectionSession`. Use this from overlays and TabletopBoard
   * mount calls; `LorcanaGameContext.interactionView` returns an engine-only
   * view that's correct for dispatcher reads but stale for renderer copy
   * (e.g. `submission.canSubmit` after a target click but before submit).
   *
   * Resolves work-log gap #18: the sidebar owns the session, so the
   * derivation needs to live here for `pendingSelectedCardIds` /
   * `pendingScryAssignments` to flow through to the view.
   */
  readonly interactionView = $derived.by((): PlayerInteractionView | null => {
    const snapshot = this.#game.boardSnapshot();
    if (!snapshot) return null;
    const localOwnerSide = this.#game.ownerSide();
    const localPlayerId = localOwnerSide ? this.#game.getOwnerIdForSide(localOwnerSide) : null;
    if (!localPlayerId) return null;

    const session = this.#resolutionSelectionSession;
    // selectedTargets is a flat string[] that mixes CardInstanceIds and
    // PlayerIds. Split it against the engine's candidate sets so we
    //   (a) feed the builder typed inputs (no unsafe cast), and
    //   (b) drop entries the engine no longer accepts as candidates —
    //       the optimistic-merge "stale candidate" guard (gap from audit
    //       Session 16, contract law L1: pending state must be a subset
    //       of the engine's authoritative candidates).
    let pendingSelectedCardIds: readonly CardInstanceId[] | undefined;
    let pendingSelectedPlayerIds: readonly PlayerId[] | undefined;
    if (session && isTargetResolutionSelectionContext(session.context)) {
      const cardCandidates = new Set<string>(
        (session.context.cardCandidateIds as readonly string[]) ?? [],
      );
      const playerCandidates = new Set<string>(
        (session.context.playerCandidateIds as readonly string[]) ?? [],
      );
      const currentTargets = new Set<string>(session.context.currentSelection.targets ?? []);
      const cards: CardInstanceId[] = [];
      const players: PlayerId[] = [];
      for (const id of session.selectedTargets) {
        if (cardCandidates.has(id) || (currentTargets.has(id) && this.cardSnapshotsById[id])) {
          cards.push(id as CardInstanceId);
        } else if (playerCandidates.has(id)) {
          players.push(id as PlayerId);
        }
        // else: stale (engine has refined candidates since last click) —
        // drop silently; submission will recompute canSubmit below.
      }
      pendingSelectedCardIds = cards;
      pendingSelectedPlayerIds = players;
    }
    const pendingScryAssignments =
      session && session.context.kind === "scry-selection"
        ? session.scryDestinations.map((destination) => ({
            id: destination.id,
            zone: destination.zone,
            cards: destination.cards,
          }))
        : undefined;

    return buildPlayerInteractionView(snapshot, localPlayerId as PlayerId, {
      pendingSelectedCardIds,
      pendingSelectedPlayerIds,
      pendingActiveSlotIndex: session?.activeTargetSlotIndex,
      pendingScryAssignments,
    });
  });

  #capturePendingResolutionSourceHint(move: ExecutableMoveEntry): void {
    const sourceCardId = getCardActionSourceCardId(move);
    if (!sourceCardId) {
      this.#pendingResolutionSourceHint = null;
      return;
    }

    if (move.moveId === "activateAbility") {
      const abilityIndex = getMoveAbilityIndex(move);
      this.#pendingResolutionSourceHint = {
        kind: "activated-ability",
        sourceCardId,
        ...(typeof abilityIndex === "number" ? { abilityIndex } : {}),
      };
      return;
    }

    const sourceCard = this.cardSnapshotsById[sourceCardId] ?? null;
    if (move.moveId === "playCard" && sourceCard?.cardType === "action") {
      this.#pendingResolutionSourceHint = {
        kind: "action-card",
        sourceCardId,
      };
      return;
    }

    this.#pendingResolutionSourceHint = null;
  }

  #getResolutionMoveAbilityIndex(move: PendingResolutionMoveEntry): number | null {
    if (move.moveId === "resolveEffect") {
      const pendingEffect =
        this.boardSnapshot?.pendingEffects.find((effect) => effect.id === move.params.effectId) ??
        null;
      return getPendingEffectPayloadMeta(pendingEffect?.payload).abilityIndex ?? null;
    }

    if (move.moveId === "resolveBag") {
      const bagEffect =
        this.boardSnapshot?.bagEffects.find((effect) => effect.id === move.params.bagId) ?? null;
      return getBagEffectPayloadMeta(bagEffect?.payload).abilityIndex ?? null;
    }

    return null;
  }

  #getSelectionContextForPendingResolutionMove(
    move: PendingResolutionMoveEntry,
  ): ResolutionSelectionContext | null {
    if (move.moveId === "resolveEffect") {
      return (
        this.boardSnapshot?.pendingEffects.find((effect) => effect.id === move.params.effectId)
          ?.selectionContext ?? null
      );
    }

    if (move.moveId === "resolveBag") {
      return (
        this.boardSnapshot?.bagEffects.find((effect) => effect.id === move.params.bagId)
          ?.selectionContext ?? null
      );
    }

    return null;
  }

  #startResolutionSelectionSessionForMove(
    move: PendingResolutionMoveEntry,
    fallbackContext?: ResolutionSelectionContext | null,
  ): boolean {
    const selectionContext =
      fallbackContext ?? this.#getSelectionContextForPendingResolutionMove(move);
    if (!selectionContext) {
      return false;
    }
    // Don't start a selection session when the selection's chooser is a
    // different player — e.g. resolving Anastasia's bag as its controller while
    // the downstream discard belongs to the challenging player. In that case
    // the local player just submits resolveBag without targets, which creates
    // a pending effect the downstream chooser can then resolve on their side.
    const localOwnerSide = this.#game.ownerSide();
    const localPlayerId = localOwnerSide ? this.#game.getOwnerIdForSide(localOwnerSide) : null;
    if (
      localPlayerId != null &&
      selectionContext.chooserId != null &&
      selectionContext.chooserId !== localPlayerId
    ) {
      return false;
    }
    return this.startResolutionSelectionSession(move, selectionContext);
  }

  #buildResolutionPromptContent(
    move: PendingResolutionMoveEntry,
    context: ResolutionSelectionContext,
  ): ResolutionPromptContent {
    const sourceCard = this.cardSnapshotsById[context.sourceCardId] ?? null;
    const targetSelectionContext = isTargetResolutionSelectionContext(context)
      ? context
      : undefined;
    const persistedAbilityIndex = this.#getResolutionMoveAbilityIndex(move);

    if (move.moveId !== "resolveEffect") {
      this.#pendingResolutionSourceHint = null;
      const copy = buildResolutionCopyBundle({
        kind: context.kind,
        sourceCard,
        abilityIndex: persistedAbilityIndex,
        targetSelectionContext,
      });
      return {
        message: copy.promptMessage,
        inlineReference: copy.promptInlineReference,
      };
    }

    const pendingEffect =
      this.boardSnapshot?.pendingEffects.find((effect) => effect.id === move.params.effectId) ??
      null;
    const pendingPayload = asRecord(pendingEffect?.payload);
    const cardPlayed = asRecord(pendingPayload?.cardPlayed);
    const sourceHint = this.#pendingResolutionSourceHint;
    this.#pendingResolutionSourceHint = null;

    let explicitReferenceLabel: string | null = null;
    let effectTitle: string | null = null;
    let abilityIndex: number | null = persistedAbilityIndex;

    if (cardPlayed?.cardType === "action") {
      explicitReferenceLabel = sourceCard?.label ?? null;
      abilityIndex = null;
    } else if (
      abilityIndex == null &&
      sourceHint?.kind === "activated-ability" &&
      sourceHint.sourceCardId === context.sourceCardId
    ) {
      abilityIndex = sourceHint.abilityIndex ?? null;
      effectTitle = sourceCard?.textEntries?.[sourceHint.abilityIndex ?? 0]?.title?.trim() ?? "";
    } else if (abilityIndex == null && sourceCard) {
      const availableAbilityMoves = this.#game
        .expandCardActionCategoryMoves(sourceCard.cardId, "activate-ability")
        .filter((candidateMove) => candidateMove.moveId === "activateAbility");
      if (availableAbilityMoves.length === 1) {
        const derivedAbilityIndex = getMoveAbilityIndex(availableAbilityMoves[0]!);
        abilityIndex = typeof derivedAbilityIndex === "number" ? derivedAbilityIndex : null;
        effectTitle =
          typeof derivedAbilityIndex === "number"
            ? (sourceCard.textEntries?.[derivedAbilityIndex]?.title?.trim() ?? "")
            : "";
      } else if (sourceCard.textEntries?.length === 1) {
        effectTitle = sourceCard.textEntries[0]?.title?.trim() ?? "";
      }
    }

    const copy = buildResolutionCopyBundle({
      kind: context.kind,
      sourceCard,
      explicitReferenceLabel,
      effectTitle,
      abilityIndex,
      targetSelectionContext,
    });
    return {
      message: copy.promptMessage,
      inlineReference: copy.promptInlineReference,
    };
  }

  get manualCardActionSession(): ActionSelectionSession | null {
    return this.#actionSelectionSession;
  }

  get selectedActionSessionCard(): LorcanaCardSnapshot | null {
    // Use selectedActionSessionCardIds which filters to card candidates only
    // (selectedTargets can contain player IDs which don't exist in cardSnapshotsById)
    const cardIds = this.selectedActionSessionCardIds;
    if (cardIds.length > 0) {
      return this.cardSnapshotsById[cardIds[0]] ?? null;
    }

    const selectedCardId =
      this.#actionSelectionSession?.targetCardId ?? this.#actionSelectionSession?.sourceCardId;
    return selectedCardId ? (this.cardSnapshotsById[selectedCardId] ?? null) : null;
  }

  get bottomSide(): LorcanaPlayerSide {
    return this.ownerSide ?? "playerOne";
  }

  get topSide(): LorcanaPlayerSide {
    return this.bottomSide === "playerOne" ? "playerTwo" : "playerOne";
  }

  get hasOwnedView(): boolean {
    return this.ownerSide !== null;
  }

  get activeSide(): LorcanaPlayerSide | null {
    return this.boardSnapshot ? getActiveSide(this.boardSnapshot) : null;
  }

  get headerPlayerData(): LorcanaPlayerSummary | null {
    return this.#game.getPlayerSummary(this.topSide);
  }

  get footerPlayerData(): LorcanaPlayerSummary | null {
    return this.#game.getPlayerSummary(this.bottomSide);
  }

  get headerPlayerLabel(): string {
    return this.#game.getRelativePlayerLabel(this.topSide);
  }

  get footerPlayerLabel(): string {
    return this.#game.getRelativePlayerLabel(this.bottomSide);
  }

  get headerPlayerIsMobile(): boolean {
    const id = this.#game.getOwnerIdForSide(this.topSide);
    return id ? this.#game.isPlayerMobile(id) : false;
  }

  get footerPlayerIsMobile(): boolean {
    const id = this.#game.getOwnerIdForSide(this.bottomSide);
    return id ? this.#game.isPlayerMobile(id) : false;
  }

  get headerPlayerMmr(): number | undefined {
    const id = this.#game.getOwnerIdForSide(this.topSide);
    return id ? this.#game.getPlayerMmr(id) : undefined;
  }

  get footerPlayerMmr(): number | undefined {
    const id = this.#game.getOwnerIdForSide(this.bottomSide);
    return id ? this.#game.getPlayerMmr(id) : undefined;
  }

  get headerPlayerSubscriptionTier(): string | undefined {
    const id = this.#game.getOwnerIdForSide(this.topSide);
    return id ? this.#game.getPlayerSubscriptionTier(id) : undefined;
  }

  get footerPlayerSubscriptionTier(): string | undefined {
    const id = this.#game.getOwnerIdForSide(this.bottomSide);
    return id ? this.#game.getPlayerSubscriptionTier(id) : undefined;
  }

  get pendingResolutionMoveByBagId(): Map<string, PendingResolutionMoveEntry> {
    const entries = this.pendingResolutionMoves
      .filter((move) => move.moveId === "resolveBag")
      .flatMap((move) => {
        const bagId = typeof move.params.bagId === "string" ? move.params.bagId : null;
        return bagId ? [[bagId, move] as const] : [];
      });
    return new Map(entries);
  }

  get pendingResolutionMoveByEffectId(): Map<string, PendingResolutionMoveEntry> {
    const entries = this.pendingResolutionMoves
      .filter((move) => move.moveId === "resolveEffect")
      .flatMap((move) => {
        const effectId = typeof move.params.effectId === "string" ? move.params.effectId : null;
        return effectId ? [[effectId, move] as const] : [];
      });
    return new Map(entries);
  }

  #buildAutoOpenResolutionKey(
    move: PendingResolutionMoveEntry,
    context: ResolutionSelectionContext | null,
  ): string | null {
    const stateId = this.boardSnapshot?.stateID;
    if (typeof stateId !== "number") {
      return null;
    }

    if (context) {
      return `${stateId}:${move.moveId}:${context.origin}:${context.requestId}`;
    }

    return `${stateId}:${move.moveId}:auto-resolve:${move.id}`;
  }

  #getAutoOpenResolutionCandidate(): AutoOpenResolutionCandidate | null {
    const board = this.boardSnapshot;
    if (!board) {
      return null;
    }

    if (this.#actionSelectionSession || this.#resolutionSelectionSession) {
      return null;
    }

    const autoOpenStateId = this.#game.pendingResolutionAutoOpenStateId();
    const isAutoOpenState = autoOpenStateId === board.stateID;

    const localOwnerSide = this.#game.ownerSide();
    const localPlayerId = localOwnerSide ? this.#game.getOwnerIdForSide(localOwnerSide) : null;

    const activePendingEffectId = board.pendingChoice?.requestID ?? null;
    const activePendingEffect = activePendingEffectId
      ? (board.pendingEffects.find((effect) => effect.id === activePendingEffectId) ?? null)
      : null;

    // Mandatory active pending effects auto-open/auto-resolve immediately.
    // Scry-selection and non-optional effects skip the "Resolve" button.
    if (activePendingEffect) {
      const pendingKind = activePendingEffect.selectionContext?.kind;
      const isMandatory = pendingKind !== "optional-selection";
      const pendingChooser = activePendingEffect.selectionContext?.chooserId ?? null;
      const isLocalChooser =
        localPlayerId == null || pendingChooser == null || pendingChooser === localPlayerId;

      if (isMandatory && isLocalChooser) {
        const move = this.pendingResolutionMoveByEffectId.get(activePendingEffect.id);
        if (move) {
          const context = activePendingEffect.selectionContext ?? null;
          const key = this.#buildAutoOpenResolutionKey(move, context);
          if (key) {
            return { key, move, context };
          }
        }
      }
    }

    // Mandatory bag effects auto-resolve only when there's exactly one actionable bag move.
    // Multiple actionable triggers must preserve player's choice of resolution order.
    const resolvableBagEffect = board.bagEffects[0] ?? null;
    if (resolvableBagEffect && this.pendingResolutionMoveByBagId.size === 1) {
      const bagKind = resolvableBagEffect.selectionContext?.kind;
      const isMandatory = bagKind !== "optional-selection";
      const bagChooser = resolvableBagEffect.selectionContext?.chooserId ?? null;
      const isLocalChooser =
        localPlayerId == null || bagChooser == null || bagChooser === localPlayerId;
      const move = this.pendingResolutionMoveByBagId.get(resolvableBagEffect.id);

      // When selectionContext is undefined, the effect's first immediate step
      // needs no selection (e.g. draw in a draw-then-optional sequence). Check
      // the raw effect tree for optional/requires-decision flags to avoid
      // auto-resolving effects that contain optional later steps.
      let effectivelyMandatory = isMandatory;
      if (isMandatory && bagKind === undefined) {
        const payloadRecord = resolvableBagEffect.payload as Record<string, unknown> | undefined;
        const rawEffect = payloadRecord?.effect;
        if (rawEffect) {
          const requirements = analyzeResolutionRequirements(rawEffect);
          if (requirements.isOptional) {
            effectivelyMandatory = canAutoResolveLeadingDrawInOptionalSequence(
              board,
              resolvableBagEffect,
            );
          }
        }
      }

      if (effectivelyMandatory && isLocalChooser && move) {
        const context = resolvableBagEffect.selectionContext ?? null;
        const key = this.#buildAutoOpenResolutionKey(move, context);
        if (key) {
          return { key, move, context };
        }
      }
    }

    if (!isAutoOpenState) {
      return null;
    }

    // Fallback: auto-open effects with selection context when there's exactly one queued
    // (preserves existing behavior for optional effects triggered by playCard/activateAbility)
    const queuedResolutionCount = board.pendingEffects.length + board.bagEffects.length;
    if (queuedResolutionCount !== 1) {
      return null;
    }

    const pendingEffect = board.pendingEffects[0] ?? null;
    if (pendingEffect?.selectionContext) {
      const pendingChooser = pendingEffect.selectionContext.chooserId ?? null;
      const isLocalChooser =
        localPlayerId == null || pendingChooser == null || pendingChooser === localPlayerId;
      if (isLocalChooser) {
        const move = this.pendingResolutionMoveByEffectId.get(pendingEffect.id);
        const key = move
          ? this.#buildAutoOpenResolutionKey(move, pendingEffect.selectionContext)
          : null;
        return move && key
          ? {
              key,
              move,
              context: pendingEffect.selectionContext,
            }
          : null;
      }
    }

    const bagEffect = board.bagEffects[0] ?? null;
    if (bagEffect?.selectionContext) {
      const bagChooser = bagEffect.selectionContext.chooserId ?? null;
      const isLocalChooser =
        localPlayerId == null || bagChooser == null || bagChooser === localPlayerId;
      if (isLocalChooser) {
        const move = this.pendingResolutionMoveByBagId.get(bagEffect.id);
        const key = move
          ? this.#buildAutoOpenResolutionKey(move, bagEffect.selectionContext)
          : null;
        return move && key
          ? {
              key,
              move,
              context: bagEffect.selectionContext,
            }
          : null;
      }
    }

    return null;
  }

  get #activeResolutionPopoverItemId(): string | null {
    const session = this.#resolutionSelectionSession;
    if (!session) return null;
    if (session.move.moveId === "resolveEffect") return `pending:${session.move.params.effectId}`;
    if (session.move.moveId === "resolveBag") return `bag:${session.move.params.bagId}`;
    return null;
  }

  get pendingEffectsPopoverItems(): PendingEffectsPopoverItem[] {
    if (!this.boardSnapshot) {
      return [];
    }

    const activePendingEffectId = this.boardSnapshot.pendingChoice?.requestID ?? null;
    const activeResolutionItemId = this.#activeResolutionPopoverItemId;
    const activeSession = this.#resolutionSelectionSession;
    const localOwnerSide = this.#game.ownerSide();
    const localPlayerId = localOwnerSide ? this.#game.getOwnerIdForSide(localOwnerSide) : null;
    const bagItems = this.boardSnapshot.bagEffects.map<PendingEffectsPopoverItem>((bagEffect) => {
      const resolveMove = this.pendingResolutionMoveByBagId.get(bagEffect.id);
      const payloadMeta = getBagEffectPayloadMeta(bagEffect.payload);
      const selectionContext = bagEffect.selectionContext ?? null;
      const selectionCopy = selectionContext
        ? buildResolutionCopyBundle({
            kind: selectionContext.kind,
            sourceCard: bagEffect.sourceId
              ? (this.cardSnapshotsById[bagEffect.sourceId] ?? null)
              : null,
            abilityIndex: payloadMeta.abilityIndex ?? null,
          })
        : null;
      const rawSelectionKind = selectionContext?.kind;
      const effectiveChooser = selectionContext?.chooserId ?? bagEffect.chooserId;
      // "Cross-chooser" bag: the downstream selection belongs to someone other
      // than the bag's controller (e.g. Anastasia's CHALLENGING_PLAYER discard,
      // Donald Duck's OPPONENT optional draw). The engine only lets the direct
      // chooser submit resolveBag atomically for discard selections — optional
      // cross-chooser triggers require the controller to submit first, which
      // creates a pending effect the chooser then resolves.
      const isCrossChooserBag =
        selectionContext?.chooserId != null &&
        selectionContext.chooserId !== bagEffect.controllerId;
      const allowsDirectChooserResolve =
        isCrossChooserBag &&
        (rawSelectionKind === "target-selection" || rawSelectionKind === "discard-choice");
      const isLocallyActionable =
        localPlayerId != null &&
        (bagEffect.controllerId === localPlayerId ||
          (allowsDirectChooserResolve && effectiveChooser === localPlayerId));
      // Suppress Accept/Reject on the controller's side for cross-chooser
      // optional triggers — they submit a plain resolveBag that creates a
      // pending effect, and the opponent (the real chooser) gets the actual
      // Accept/Reject prompt on that pending effect.
      const isOptionalSelection =
        rawSelectionKind === "optional-selection" &&
        (!isCrossChooserBag || effectiveChooser === localPlayerId);
      const card = bagEffect.sourceId ? (this.cardSnapshotsById[bagEffect.sourceId] ?? null) : null;
      const availableAbilityMoves = card
        ? this.#game
            .expandCardActionCategoryMoves(card.cardId, "activate-ability")
            .filter((candidateMove) => candidateMove.moveId === "activateAbility")
        : [];
      const instanceReferences = buildPendingEffectCardReferenceViews(
        getResolutionEffectInstanceReferences(bagEffect.payload),
        this.cardSnapshotsById,
      );
      const secondaryTitle = getPendingEffectSecondaryTitle({
        sourceCard: card,
        abilityIndex: payloadMeta.abilityIndex ?? null,
        availableAbilityMoves,
      });
      const summaryTitle = buildPendingEffectSummaryTitle({
        title: card?.label ?? "Queued bag effect",
        secondaryTitle,
        sourceCardId: bagEffect.sourceId ?? null,
        instanceReferences,
      });
      const itemId = `bag:${bagEffect.id}`;
      const isInActiveSession = activeResolutionItemId === itemId && activeSession != null;

      if (isInActiveSession) {
        const canConfirm = this.canConfirmResolutionSelection;
        const canDecline = canDeclineResolutionSelectionSession(activeSession);
        return {
          id: itemId,
          kind: "bag",
          title: card?.label ?? "Queued bag effect",
          secondaryTitle,
          summaryTitle,
          subtitle: "Triggered ability in bag",
          detail: resolveMove
            ? (selectionCopy?.detailMessage ?? "Resolve this queued triggered ability.")
            : "Waiting for the current bag resolver before this effect can be chosen.",
          badge: "Bag",
          card,
          instanceReferences,
          canResolve: false,
          statusMessage: getResolutionInteractionStatusMessage({
            kind: activeSession.context.kind,
            phase: activeSession.phase,
            selectedTargetCount: activeSession.selectedTargets.length,
          }),
          inlineActions:
            activeSession.context.kind === "optional-selection"
              ? [
                  {
                    id: `${itemId}:accept`,
                    label: activeSession.context.acceptLabel,
                    onClick: () => {
                      this.submitResolutionOptional(true);
                    },
                    emphasis: activeSession.selectedOptionalValue === true,
                  },
                  {
                    id: `${itemId}:reject`,
                    label: getResolutionDeclineLabel(activeSession),
                    onClick: () => {
                      this.submitResolutionOptional(false);
                    },
                    emphasis: activeSession.selectedOptionalValue === false,
                  },
                ]
              : activeSession.context.kind === "choice-selection"
                ? [
                    ...activeSession.context.options.map((option) => ({
                      id: `${itemId}:choice:${option.index}`,
                      label: option.label,
                      onClick: () => {
                        this.selectResolutionChoice(option.index);
                      },
                      disabled: !option.legal,
                      emphasis: activeSession.selectedChoiceIndex === option.index,
                    })),
                    ...(canDecline
                      ? [
                          {
                            id: `${itemId}:reject`,
                            label: getResolutionDeclineLabel(activeSession),
                            onClick: this.rejectActiveResolutionSelection,
                          },
                        ]
                      : []),
                  ]
                : canDecline
                  ? [
                      {
                        id: `${itemId}:reject`,
                        label: getResolutionDeclineLabel(activeSession),
                        onClick: this.rejectActiveResolutionSelection,
                      },
                    ]
                  : undefined,
          onConfirm:
            canConfirm && activeSession.context.kind !== "optional-selection"
              ? this.confirmResolutionSelection
              : undefined,
          onCancel:
            activeSession.context.kind === "optional-selection"
              ? undefined
              : this.cancelResolutionSelectionSession,
          isLocalPlayer: localPlayerId != null ? isLocallyActionable : undefined,
          namedCardSearch:
            activeSession.context.kind === "name-card-selection"
              ? {
                  query: activeSession.namedCardQuery,
                  results: this.resolutionSelectionNamedCardResults.map((result) => ({
                    id: result.id,
                    label: result.label,
                    name: result.name,
                    selected:
                      activeSession.selectedNamedCard === result.name ||
                      activeSession.namedCardQuery.trim() === result.label,
                  })),
                  oninput: this.updateResolutionNamedCardQuery,
                  onselect: this.chooseResolutionNamedCard,
                }
              : undefined,
        };
      }

      return {
        id: itemId,
        kind: "bag",
        title: card?.label ?? "Queued bag effect",
        secondaryTitle,
        summaryTitle,
        subtitle: "Triggered ability in bag",
        detail: resolveMove
          ? (selectionCopy?.detailMessage ?? "Resolve this queued triggered ability.")
          : "Waiting for the current bag resolver before this effect can be chosen.",
        badge: "Bag",
        card,
        instanceReferences,
        canResolve: isLocallyActionable && !isOptionalSelection && Boolean(resolveMove),
        canAccept: isLocallyActionable && isOptionalSelection && Boolean(resolveMove),
        canReject: isLocallyActionable && isOptionalSelection && Boolean(resolveMove),
        isLocalPlayer: localPlayerId != null ? isLocallyActionable : undefined,
        disabledReason: resolveMove ? undefined : "Not actionable from this view right now.",
        onResolve:
          isLocallyActionable && resolveMove ? () => this.handleResolveBag(resolveMove) : undefined,
        onAccept:
          isLocallyActionable && resolveMove
            ? () => this.handleAcceptBagEffect(resolveMove)
            : undefined,
        onReject:
          isLocallyActionable && resolveMove
            ? () => this.handleRejectBagEffect(resolveMove)
            : undefined,
      };
    });

    const pendingItems = this.boardSnapshot.pendingEffects.map<PendingEffectsPopoverItem>(
      (pendingEffect) => {
        const payloadMeta = getPendingEffectPayloadMeta(pendingEffect.payload);
        const effectId = pendingEffect.id;
        const resolveMove = this.pendingResolutionMoveByEffectId.get(effectId);
        const selectionContext = pendingEffect.selectionContext ?? null;
        const cardId =
          pendingEffect.sourceId ?? payloadMeta.sourceCardId ?? payloadMeta.sourceId ?? null;
        const chooserId = selectionContext?.chooserId ?? payloadMeta.chooserId ?? null;
        const isLocallyActionable = localPlayerId != null && chooserId === localPlayerId;
        const card = cardId ? (this.cardSnapshotsById[cardId] ?? null) : null;
        const availableAbilityMoves = card
          ? this.#game
              .expandCardActionCategoryMoves(card.cardId, "activate-ability")
              .filter((candidateMove) => candidateMove.moveId === "activateAbility")
          : [];
        const instanceReferences = buildPendingEffectCardReferenceViews(
          getResolutionEffectInstanceReferences(pendingEffect.payload),
          this.cardSnapshotsById,
        );
        const secondaryTitle = getPendingEffectSecondaryTitle({
          sourceCard: card,
          abilityIndex: payloadMeta.abilityIndex ?? null,
          availableAbilityMoves,
        });
        const summaryTitle = buildPendingEffectSummaryTitle({
          title: card?.label ?? "Pending effect",
          secondaryTitle,
          sourceCardId: cardId,
          instanceReferences,
        });
        const pendingKind = selectionContext?.kind ?? payloadMeta.kind;
        const selectionCopy =
          selectionContext && card
            ? buildResolutionCopyBundle({
                kind: selectionContext.kind,
                sourceCard: card,
                abilityIndex: payloadMeta.abilityIndex ?? null,
                targetSelectionContext: isTargetResolutionSelectionContext(selectionContext)
                  ? selectionContext
                  : undefined,
              })
            : selectionContext
              ? buildResolutionCopyBundle({
                  kind: selectionContext.kind,
                  sourceCard: null,
                  abilityIndex: payloadMeta.abilityIndex ?? null,
                  targetSelectionContext: isTargetResolutionSelectionContext(selectionContext)
                    ? selectionContext
                    : undefined,
                })
              : null;
        const isOptionalSelection = pendingKind === "optional-selection";
        const isActive = activePendingEffectId === effectId;

        const isScrySelection = pendingKind === "scry-selection";
        const itemId = `pending:${effectId}`;
        const isInActiveSession = activeResolutionItemId === itemId && activeSession != null;

        if (isInActiveSession) {
          const canConfirm = this.canConfirmResolutionSelection;
          const canDecline = canDeclineResolutionSelectionSession(activeSession);
          return {
            id: itemId,
            kind: "pending",
            title: card?.label ?? "Pending effect",
            secondaryTitle,
            summaryTitle,
            subtitle: selectionCopy?.subtitle ?? "Pending resolution",
            detail:
              selectionCopy?.detailMessage ??
              "This effect is queued and waiting for additional input.",
            badge: "Pending",
            card,
            instanceReferences,
            isActive,
            canResolve: false,
            statusMessage: getResolutionInteractionStatusMessage({
              kind: activeSession.context.kind,
              phase: activeSession.phase,
              selectedTargetCount: activeSession.selectedTargets.length,
            }),
            inlineActions:
              activeSession.context.kind === "optional-selection"
                ? [
                    {
                      id: `${itemId}:accept`,
                      label: activeSession.context.acceptLabel,
                      onClick: () => {
                        this.submitResolutionOptional(true);
                      },
                      emphasis: activeSession.selectedOptionalValue === true,
                    },
                    {
                      id: `${itemId}:reject`,
                      label: getResolutionDeclineLabel(activeSession),
                      onClick: () => {
                        this.submitResolutionOptional(false);
                      },
                      emphasis: activeSession.selectedOptionalValue === false,
                    },
                  ]
                : activeSession.context.kind === "choice-selection"
                  ? [
                      ...activeSession.context.options.map((option) => ({
                        id: `${itemId}:choice:${option.index}`,
                        label: option.label,
                        onClick: () => {
                          this.selectResolutionChoice(option.index);
                        },
                        disabled: !option.legal,
                        emphasis: activeSession.selectedChoiceIndex === option.index,
                      })),
                      ...(canDecline
                        ? [
                            {
                              id: `${itemId}:reject`,
                              label: getResolutionDeclineLabel(activeSession),
                              onClick: this.rejectActiveResolutionSelection,
                            },
                          ]
                        : []),
                    ]
                  : canDecline
                    ? [
                        {
                          id: `${itemId}:reject`,
                          label: getResolutionDeclineLabel(activeSession),
                          onClick: this.rejectActiveResolutionSelection,
                        },
                      ]
                    : undefined,
            onConfirm:
              canConfirm && activeSession.context.kind !== "optional-selection"
                ? this.confirmResolutionSelection
                : undefined,
            onCancel:
              activeSession.context.kind === "optional-selection"
                ? undefined
                : this.cancelResolutionSelectionSession,
            isLocalPlayer:
              localPlayerId != null && chooserId != null ? chooserId === localPlayerId : undefined,
            namedCardSearch:
              activeSession.context.kind === "name-card-selection"
                ? {
                    query: activeSession.namedCardQuery,
                    results: this.resolutionSelectionNamedCardResults.map((result) => ({
                      id: result.id,
                      label: result.label,
                      name: result.name,
                      selected:
                        activeSession.selectedNamedCard === result.name ||
                        activeSession.namedCardQuery.trim() === result.label,
                    })),
                    oninput: this.updateResolutionNamedCardQuery,
                    onselect: this.chooseResolutionNamedCard,
                  }
                : undefined,
          };
        }

        return {
          id: itemId,
          kind: "pending",
          title: card?.label ?? "Pending effect",
          secondaryTitle,
          summaryTitle,
          subtitle: selectionCopy?.subtitle ?? "Pending resolution",
          detail:
            selectionCopy?.detailMessage ??
            "This effect is queued and waiting for additional input.",
          badge: "Pending",
          card,
          instanceReferences,
          isActive,
          canResolve:
            isLocallyActionable &&
            isActive &&
            !isScrySelection &&
            !isOptionalSelection &&
            Boolean(resolveMove),
          canAccept: isLocallyActionable && isActive && isOptionalSelection && Boolean(resolveMove),
          canReject: isLocallyActionable && isActive && isOptionalSelection && Boolean(resolveMove),
          primaryActionLabel: isScrySelection ? m["sim.actions.label.arrangeCards"]({}) : undefined,
          onPrimaryAction:
            isLocallyActionable && isActive && isScrySelection && resolveMove
              ? () => this.handleResolvePendingEffect(resolveMove)
              : undefined,
          disabledReason: isActive
            ? resolveMove
              ? undefined
              : "This pending effect is waiting for the responding player."
            : "This pending effect is waiting for its turn in the resolution queue.",
          onResolve:
            isLocallyActionable &&
            isActive &&
            !isScrySelection &&
            !isOptionalSelection &&
            resolveMove
              ? () => this.handleResolvePendingEffect(resolveMove)
              : undefined,
          onAccept:
            isLocallyActionable && isActive && isOptionalSelection && resolveMove
              ? () => this.handleAcceptPendingEffect(resolveMove)
              : undefined,
          onReject:
            isLocallyActionable && isActive && isOptionalSelection && resolveMove
              ? () => this.handleRejectPendingEffect(resolveMove)
              : undefined,
          isLocalPlayer:
            localPlayerId != null && chooserId != null ? chooserId === localPlayerId : undefined,
        };
      },
    );

    return [...pendingItems, ...bagItems];
  }

  get baselineGuidance(): ActivePlayerGuidanceItem[] {
    if (!this.boardSnapshot || !this.ownerSide) {
      return [];
    }

    if (!this.pregamePhase) {
      return [];
    }

    if (!this.canActInPregame) {
      return [
        {
          id: "pregame-waiting-turn",
          message: m["sim.actions.empty.waitingTurn"]({}),
          actions: [],
          mode: "pregame",
          order: -1,
        },
      ];
    }

    if (this.pregamePhase === "chooseFirstPlayer") {
      return [
        {
          id: "pregame-choose-first-player",
          message: m["sim.guidance.pregame.chooseFirst"]({}),
          actions: [
            {
              id: "choose-first-player-one",
              label: `${this.#game.getRelativePlayerLabel("playerOne")}`,
              onClick: () => {
                this.executeChooseFirstPlayer("playerOne");
              },
            },
            {
              id: "choose-first-player-two",
              label: `${this.#game.getRelativePlayerLabel("playerTwo")}`,
              onClick: () => {
                this.executeChooseFirstPlayer("playerTwo");
              },
            },
          ],
          mode: "pregame",
          order: -1,
        },
      ];
    }

    return [
      {
        id: "pregame-mulligan",
        message: m["sim.guidance.pregame.mulligan"]({}),
        actions: [
          {
            id: "mulligan-keep-hand",
            label:
              this.pendingMulliganDangerConfirm === "keepHand"
                ? m["sim.guidance.action.areYouSure"]({})
                : m["sim.pregame.mulligan.button.keepHand"]({}),
            onClick: this.handleKeepHand,
          },
          {
            id: "mulligan-all-cards",
            label:
              this.pendingMulliganDangerConfirm === "allCards"
                ? m["sim.guidance.action.areYouSure"]({})
                : m["sim.pregame.mulligan.button.allCards"]({}),
            onClick: this.handleMulliganAllCards,
          },
          {
            id: "mulligan-confirm",
            label: m["sim.pregame.mulligan.button.confirmCount"]({
              count: this.selectedMulliganCardIds.length,
            }),
            onClick: this.handleConfirmMulligan,
            disabled: this.selectedMulliganCardIds.length === 0,
            emphasis: true,
          },
        ],
        mode: "pregame",
        order: -1,
      },
    ];
  }

  /**
   * Resolve the player side that the target DSL's `owner: "you" | "opponent"`
   * is interpreted relative to — always the SOURCE CARD's controller.
   *
   * The lookup tries three sources in order:
   *  1. The source card's snapshot in `cardSnapshotsById`. Fast path when the
   *     card is in a zone the chooser's view projects (play, discard, hand).
   *  2. The pending or bag effect's `controllerId` field. Required when the
   *     source card sits in a zone the chooser's view does NOT project
   *     (e.g. the controller's `limbo` — where freshly-revealed cards in
   *     transit live, including songs played for free via scry / play-from-
   *     deck-top effects like Powerline's MASH-UP).
   *  3. The chooser's side. Legacy fallback. This is correct for normal
   *     self-targeted effects (chooser === controller) but WRONG for any
   *     `chosenBy: "opponent"` effect — the very class of effect this
   *     helper exists to support.
   *
   * Without (2), Be King Undisputed / Sid Phillips / Dinky / Madam Mim
   * forced-opponent prompts get a chooser-side reference, every legal
   * candidate fails the owner gate in `cardMatchesSelectionTargetDsl`,
   * `canConfirmResolutionSelection` returns false, and the prompt user
   * times out without ever being able to confirm — see
   * digest-2026-05-08 reports #2/#3/#4/#9/#10/#12/#14/#15/#18/#19 (Be
   * King played for free via MASH-UP into the controller's limbo, then
   * the opponent can't reach Confirm).
   */
  #resolveSelectionReferenceSide(
    context: TargetResolutionSelectionContext,
  ): LorcanaPlayerSide | null {
    const board = this.boardSnapshot;
    if (!board) {
      return null;
    }

    const sourceCardId = context.sourceCardId as unknown as string;
    const snapshotOwnerId = sourceCardId
      ? this.cardSnapshotsById[sourceCardId]?.ownerId
      : undefined;
    const fromSnapshot = snapshotOwnerId ? getSideForOwnerId(board, snapshotOwnerId) : null;
    if (fromSnapshot) {
      return fromSnapshot;
    }

    const pending = sourceCardId
      ? board.pendingEffects.find((entry) => entry.id === context.requestId)
      : undefined;
    const pendingControllerId = ((pending?.payload as { controllerId?: string } | null)
      ?.controllerId ?? null) as string | null;
    const fromPending = pendingControllerId ? getSideForOwnerId(board, pendingControllerId) : null;
    if (fromPending) {
      return fromPending;
    }

    const bag = sourceCardId
      ? board.bagEffects.find((entry) => entry.id === context.requestId)
      : undefined;
    const fromBag = bag?.controllerId ? getSideForOwnerId(board, bag.controllerId) : null;
    if (fromBag) {
      return fromBag;
    }

    return getSideForOwnerId(board, context.chooserId);
  }

  #getResolutionSelectionCardCandidateIds(context: TargetResolutionSelectionContext): string[] {
    if (context.cardCandidateIds.length > 0) {
      return [...context.cardCandidateIds];
    }

    if (
      context.kind !== "discard-choice" ||
      !context.allowedZones.includes("hand") ||
      !this.boardSnapshot
    ) {
      return [];
    }

    const chooserSide = getSideForOwnerId(this.boardSnapshot, context.chooserId);
    if (!chooserSide) {
      return [];
    }

    return Object.values(this.cardSnapshotsById)
      .filter(
        (card) => card.ownerSide === chooserSide && context.allowedZones.includes(card.zoneId),
      )
      .map((card) => card.cardId);
  }

  #resolveChoiceSelectionTargetLabel(context: ResolutionSelectionContext): string | null {
    if (context.kind !== "choice-selection" || context.origin !== "pending-effect") {
      return null;
    }

    const pendingEffect = this.boardSnapshot?.pendingEffects.find(
      (pe) => pe.id === context.requestId,
    );
    if (!pendingEffect) {
      return null;
    }

    const payloadRecord = pendingEffect.payload as Record<string, unknown> | null;
    const resolutionInput =
      (payloadRecord?.resolutionInput as Record<string, unknown> | null) ?? null;
    const contextTargets = resolutionInput?.contextTargets;

    let targetCardId: string | null = null;
    if (typeof contextTargets === "string" && contextTargets.length > 0) {
      targetCardId = contextTargets;
    } else if (Array.isArray(contextTargets) && contextTargets.length > 0) {
      const first = contextTargets[0];
      if (typeof first === "string" && first.length > 0) {
        targetCardId = first;
      }
    }

    if (!targetCardId || targetCardId === context.sourceCardId) {
      return null;
    }

    return this.cardSnapshotsById[targetCardId]?.label ?? null;
  }

  #resolveChoiceSelectionTargetCard(
    context: ResolutionSelectionContext,
  ): LorcanaCardSnapshot | null {
    if (context.kind !== "choice-selection" || context.origin !== "pending-effect") {
      return null;
    }

    const pendingEffect = this.boardSnapshot?.pendingEffects.find(
      (pe) => pe.id === context.requestId,
    );
    if (!pendingEffect) {
      return null;
    }

    const payloadRecord = pendingEffect.payload as Record<string, unknown> | null;
    const resolutionInput =
      (payloadRecord?.resolutionInput as Record<string, unknown> | null) ?? null;
    const contextTargets = resolutionInput?.contextTargets;

    let targetCardId: string | null = null;
    if (typeof contextTargets === "string" && contextTargets.length > 0) {
      targetCardId = contextTargets;
    } else if (Array.isArray(contextTargets) && contextTargets.length > 0) {
      const first = contextTargets[0];
      if (typeof first === "string" && first.length > 0) {
        targetCardId = first;
      }
    }

    if (!targetCardId || targetCardId === context.sourceCardId) {
      return null;
    }

    return this.cardSnapshotsById[targetCardId] ?? null;
  }

  #getResolutionSelectionEffectType(
    session: ResolutionSelectionSession,
  ): SupportedResolutionTargetEffectType | null {
    if (!this.boardSnapshot || !isTargetResolutionSelectionContext(session.context)) {
      return null;
    }

    if (session.move.moveId === "resolveEffect") {
      const effectId = session.move.params.effectId;
      const pendingEffect = this.boardSnapshot.pendingEffects.find(
        (effect) => effect.id === effectId,
      );
      const effectType = pendingEffect
        ? getPendingEffectPayloadMeta(pendingEffect.payload).effectType
        : null;
      return isSupportedResolutionTargetEffectType(effectType) ? effectType : null;
    }

    if (session.move.moveId === "resolveBag") {
      const bagId = session.move.params.bagId;
      const bagEffect = this.boardSnapshot.bagEffects.find((effect) => effect.id === bagId);
      const effectType = bagEffect ? getBagEffectPayloadMeta(bagEffect.payload).effectType : null;
      return isSupportedResolutionTargetEffectType(effectType) ? effectType : null;
    }

    return null;
  }

  #getResolutionSelectionPayload(session: ResolutionSelectionSession): unknown | null {
    if (!this.boardSnapshot) {
      return null;
    }

    if (session.move.moveId === "resolveEffect") {
      const effectId = session.move.params.effectId;
      return (
        this.boardSnapshot.pendingEffects.find((effect) => effect.id === effectId)?.payload ?? null
      );
    }

    if (session.move.moveId === "resolveBag") {
      const bagId = session.move.params.bagId;
      return this.boardSnapshot.bagEffects.find((effect) => effect.id === bagId)?.payload ?? null;
    }

    return null;
  }

  #getResolutionAmountSelectionState(session: ResolutionSelectionSession) {
    if (!isTargetResolutionSelectionContext(session.context)) {
      return null;
    }

    const payload = this.#getResolutionSelectionPayload(session);
    if (!payload) {
      return null;
    }

    // Use the view's slot targets so that auto-resolved slots
    // (e.g. from: { ref: "self" }) appear at the correct position.
    // move-damage's getSelectionMax reads selectedCardTargets[0] as the source —
    // if we pass session.selectedTargets the auto-resolved "from" card is missing
    // and the cap defaults to baseAmount or picks the wrong card.
    const slots = this.interactionView?.activePrompt?.slots;
    let userSlotIndex = 0;
    const effectiveSelectedTargets = slots
      ? (slots
          .map((slot) => {
            if (slot.targetCardId) {
              return slot.targetCardId;
            }
            if (!slot.autoResolved) {
              return session.selectedTargets[userSlotIndex++] ?? null;
            }
            return null;
          })
          .filter((id): id is NonNullable<typeof id> => id !== null) as string[])
      : session.selectedTargets;

    return buildResolutionAmountSelectionState({
      payload,
      selectedTargets: effectiveSelectedTargets,
      currentAmount: session.selectedAmount,
      cardSnapshotsById: this.cardSnapshotsById,
    });
  }

  #normalizeResolutionSelectionSession(
    session: ResolutionSelectionSession,
  ): ResolutionSelectionSession {
    const amountSelection = this.#getResolutionAmountSelectionState(session);
    return {
      ...session,
      selectedAmount: amountSelection?.value ?? null,
    };
  }

  #getResolutionSelectableCardIds(context: TargetResolutionSelectionContext): string[] {
    const interactionCandidateIds =
      this.interactionView?.interactions.flatMap((interaction) =>
        interaction.kind === "select-card" ? [interaction.cardId as string] : [],
      ) ?? [];

    return interactionCandidateIds.length > 0
      ? interactionCandidateIds
      : [...this.#getResolutionSelectionCardCandidateIds(context)];
  }

  get resolutionSelectionCandidateCards(): LorcanaCardSnapshot[] {
    const session = this.#resolutionSelectionSession;
    if (!session || !isTargetResolutionSelectionContext(session.context)) {
      return [];
    }

    const candidateIds = this.#getResolutionSelectableCardIds(session.context);

    return candidateIds
      .map((cardId) => this.resolveCardSnapshot(cardId))
      .filter((card): card is LorcanaCardSnapshot => card !== null);
  }

  get resolutionSelectionNamedCardResults(): NamedCardSearchResult[] {
    const session = this.#resolutionSelectionSession;
    if (!session || session.context.kind !== "name-card-selection") {
      return [];
    }

    const query = session.namedCardQuery.trim();
    if (query.length === 0) {
      return [];
    }

    return searchCardsByName(query)
      .slice(0, 24)
      .map((card) => ({
        id: card.id,
        label: card.version ? `${card.name} - ${card.version}` : card.name,
        name: card.name,
      }));
  }

  get selectedActionSessionCardIds(): string[] {
    const resolutionSession = this.#resolutionSelectionSession;
    const resolutionContext = resolutionSession?.context;
    if (
      resolutionSession &&
      resolutionContext &&
      isTargetResolutionSelectionContext(resolutionContext)
    ) {
      if (resolutionContext.expectedSlottedKind === "move-to-location") {
        const { subjectIds, locationId } = splitMoveToLocationSessionTargets({
          selectedTargets: resolutionSession.selectedTargets,
          cardSnapshotsById: this.cardSnapshotsById,
          fixedLocationId:
            getFixedMoveToLocationSlotId(this.interactionView?.activePrompt?.slots) ??
            getFixedMoveToLocationBoardId(
              this.#game.boardSnapshot(),
              resolutionContext.sourceCardId,
            ),
        });
        return getUniqueOrderedIds([...subjectIds, ...(locationId ? [locationId] : [])]);
      }

      const slots = this.interactionView?.activePrompt?.slots;
      if (slots) {
        return getUniqueOrderedIds(slots.map((slot) => slot.targetCardId));
      }

      return resolutionSession.selectedTargets.filter((targetId) =>
        includesSelectionId(
          this.#getResolutionSelectionCardCandidateIds(resolutionContext),
          targetId,
        ),
      );
    }

    return this.#actionSelectionSession
      ? getUniqueOrderedIds([
          this.#actionSelectionSession.sourceCardId,
          this.#actionSelectionSession.targetCardId,
          ...this.#actionSelectionSession.selectedCardIds,
          ...Object.values(this.#actionSelectionSession.selectedCosts).flat(),
        ])
      : [];
  }

  get selectableActionSessionCardIds(): string[] {
    const resolutionSession = this.#resolutionSelectionSession;
    if (resolutionSession && isTargetResolutionSelectionContext(resolutionSession.context)) {
      return this.#getResolutionSelectableCardIds(resolutionSession.context);
    }

    const session = this.#actionSelectionSession;
    if (!session) {
      return [];
    }

    if (session.phase === "choose-source") {
      return getUniqueOrderedIds(
        session.candidateMoves.map((move) =>
          getSourceCardIdForActionSelectionMove(session.categoryId, move),
        ),
      );
    }

    if (session.phase === "choose-cost") {
      return getCurrentSelectableCostForActionSelectionSession(session)?.candidateCardIds ?? [];
    }

    if (session.phase === "choose-target" && session.sourceCardId) {
      if (isSingTogetherSelectionSession(session)) {
        const metadata = getSingTogetherSelectionMetadata(getSingTogetherSelectionMove(session));
        return metadata ? metadata.candidateCards.map((candidate) => candidate.cardId) : [];
      }

      return getUniqueOrderedIds(
        session.candidateMoves
          .filter(
            (move) =>
              getSourceCardIdForActionSelectionMove(session.categoryId, move) ===
              session.sourceCardId,
          )
          .map((move) => getTargetCardIdForActionSelectionMove(session.categoryId, move)),
      );
    }

    return [];
  }

  get invalidActionSessionCardIds(): string[] {
    const resolutionSession = this.#resolutionSelectionSession;
    if (
      resolutionSession &&
      isTargetResolutionSelectionContext(resolutionSession.context) &&
      this.boardSnapshot
    ) {
      const selectableCardIds = new Set(
        this.#getResolutionSelectionCardCandidateIds(resolutionSession.context).map((cardId) =>
          String(cardId),
        ),
      );
      return Object.values(this.cardSnapshotsById)
        .filter((card) => card.zoneId === "play")
        .map((card) => card.cardId)
        .filter((cardId) => !selectableCardIds.has(String(cardId)));
    }

    const session = this.#actionSelectionSession;
    if (
      !session ||
      (session.categoryId !== "challenge" &&
        session.categoryId !== "play-card" &&
        session.categoryId !== "sing-card" &&
        session.categoryId !== "shift-card" &&
        session.phase !== "choose-cost") ||
      (session.phase !== "choose-target" && session.phase !== "choose-cost") ||
      !this.boardSnapshot
    ) {
      return [];
    }

    if (session.phase === "choose-cost") {
      const selectableCost = getCurrentSelectableCostForActionSelectionSession(session);
      if (!selectableCost) {
        return [];
      }

      const validTargetIds = new Set(this.selectableActionSessionCardIds);
      const sourceOwnerSide = session.sourceCardId
        ? (this.cardSnapshotsById[session.sourceCardId]?.ownerSide ?? this.ownerSide)
        : this.ownerSide;

      if (!sourceOwnerSide) {
        return [];
      }

      return getCardsForZone(
        this.cardSnapshotsById,
        this.boardSnapshot,
        sourceOwnerSide,
        selectableCost.zone,
      )
        .map((card) => card.cardId)
        .filter((cardId) => !validTargetIds.has(cardId));
    }

    const validTargetIds = new Set(this.selectableActionSessionCardIds);

    if (session.categoryId === "challenge") {
      if (!this.ownerSide) {
        return [];
      }

      const opponentSide = this.ownerSide === "playerOne" ? "playerTwo" : "playerOne";
      return getCardsForZone(this.cardSnapshotsById, this.boardSnapshot, opponentSide, "play")
        .map((card) => card.cardId)
        .filter((cardId) => !validTargetIds.has(cardId));
    }

    return Object.values(this.cardSnapshotsById)
      .filter((card) => card.zoneId === "play")
      .map((card) => card.cardId)
      .filter((cardId) => !validTargetIds.has(cardId));
  }

  get currentActionSelectionMove(): ExecutableMoveEntry | null {
    const selectedMoveId = this.#actionSelectionSession?.selectedMoveId;
    if (!selectedMoveId) {
      return null;
    }

    return (
      this.#actionSelectionSession?.candidateMoves.find((move) => move.id === selectedMoveId) ??
      null
    );
  }

  get availableMovesSelectionState(): AvailableMovesSelectionState | null {
    if (this.#mulliganSelectionActive && this.boardSnapshot && this.ownerSide) {
      const handCards = getCardsForZone(
        this.cardSnapshotsById,
        this.boardSnapshot,
        this.ownerSide,
        "hand",
      );
      const selectedIds = this.selectedMulliganCardIds;
      const entries = handCards.map((card) => ({
        id: `mulligan:card:${card.cardId}`,
        kind: "card" as const,
        cardId: card.cardId,
        label: card.label,
        detail: buildAvailableMovesCardDetail(card),
        selected: selectedIds.includes(card.cardId),
      }));
      const categoryLabel = getMoveCategoryLabel("alterHand");

      return {
        mode: "resolution-target",
        sessionKey: "mulligan-selection",
        sourceCardId: null,
        categoryId: "alter-hand",
        categoryLabel,
        title: categoryLabel,
        message: m["sim.guidance.pregame.mulligan"]({}),
        entries,
        effectType: null,
        target: {
          selector: "all",
          owner: "you",
          zones: ["hand"],
        },
        allowedZones: ["hand"],
        candidateCardIds: handCards.map((card) => card.cardId),
        candidatePlayerIds: [],
        viewerSide: this.ownerSide,
        candidateEntries: entries,
        activeSlotIndex: null,
        slots: [],
        amountSelection: null,
        selectedTargetLabels: selectedIds
          .map((id) => this.cardSnapshotsById[id]?.label ?? "")
          .filter(Boolean),
        minimumSelections: 0,
        maximumSelections: handCards.length,
        canBack: false,
        canCancel: true,
        canConfirm: true,
      };
    }

    const resolutionSession = this.#resolutionSelectionSession;
    if (resolutionSession && resolutionSession.phase !== "executing") {
      const { context } = resolutionSession;
      const canDecline = canDeclineResolutionSelectionSession(resolutionSession);
      const declineLabel = canDecline ? getResolutionDeclineLabel(resolutionSession) : undefined;
      const categoryLabel =
        resolutionSession.move.moveId === "resolveBag"
          ? m["sim.actions.label.resolveTriggeredAbility"]({})
          : m["sim.actions.label.resolveEffect"]({});
      const sourceCard = this.cardSnapshotsById[context.sourceCardId] ?? null;
      const abilityIndex = this.#getResolutionMoveAbilityIndex(resolutionSession.move);
      const resolutionTargetLabel = this.#resolveChoiceSelectionTargetLabel(context);
      const resolutionCopy = buildResolutionCopyBundle({
        kind: context.kind,
        sourceCard,
        abilityIndex,
        targetSelectionContext: isTargetResolutionSelectionContext(context) ? context : undefined,
        targetLabel: resolutionTargetLabel,
      });
      const sourceLabel = sourceCard?.label ?? "Pending effect";
      const selectionTitle = isOptionalContinuationResolutionContext(context)
        ? (resolutionCopy.optionalContinuationLabel ?? sourceLabel)
        : sourceLabel;

      if (isTargetResolutionSelectionContext(context)) {
        const effectType = this.#getResolutionSelectionEffectType(resolutionSession);
        const cardCandidateIds = this.#getResolutionSelectionCardCandidateIds(context);
        const selectionTarget = buildResolutionSelectionTargetQuery({
          context,
          cardSnapshotsById: this.cardSnapshotsById,
          viewerSide: this.ownerSide,
        });
        const sessionKey =
          this.#buildAutoOpenResolutionKey(resolutionSession.move, context) ??
          `${resolutionSession.move.id}:${context.requestId}`;
        const playerEntries =
          this.boardSnapshot?.playerOrder.flatMap((playerId) => {
            if (!includesSelectionId(context.playerCandidateIds, playerId)) {
              return [];
            }

            const side =
              this.boardSnapshot &&
              getOwnerIdForSideFromBoard(this.boardSnapshot, "playerOne") === playerId
                ? "playerOne"
                : "playerTwo";
            const label = this.#game.getRelativePlayerLabel(side);

            return [
              {
                id: `resolution:player:${playerId}`,
                kind: "player" as const,
                playerId,
                label,
                selected: includesSelectionId(resolutionSession.selectedTargets, playerId),
              },
            ];
          }) ?? [];
        const cardEntries = cardCandidateIds.flatMap((cardId) => {
          const card = this.resolveCardSnapshot(cardId);
          return card
            ? [
                {
                  id: `resolution:card:${card.cardId}`,
                  kind: "card" as const,
                  cardId: card.cardId,
                  label: card.label,
                  detail: buildAvailableMovesCardDetail(card),
                  selected: includesSelectionId(resolutionSession.selectedTargets, card.cardId),
                },
              ]
            : [];
        });
        const selectedTargetLabels = resolutionSession.selectedTargets.flatMap((targetId) => {
          const card = this.resolveCardSnapshot(targetId);
          if (card) {
            return [card.label];
          }

          if (includesSelectionId(context.playerCandidateIds, targetId)) {
            const ownerOne = this.boardSnapshot
              ? getOwnerIdForSideFromBoard(this.boardSnapshot, "playerOne")
              : null;
            const side =
              ownerOne != null && matchesSelectionId(ownerOne, targetId)
                ? "playerOne"
                : "playerTwo";
            return [
              side === "playerOne"
                ? m["sim.player.side.playerOne"]({})
                : m["sim.player.side.playerTwo"]({}),
            ];
          }

          return [];
        });
        const playCardEntryModeChoice = hasPlayCardEntryModeSelection(
          context,
          resolutionSession.selectedTargets,
        )
          ? { selected: resolutionSession.selectedEnterPlayExerted }
          : undefined;
        const amountSelection = this.#getResolutionAmountSelectionState(resolutionSession);

        return {
          mode: "resolution-target",
          sessionKey,
          sourceCardId: context.sourceCardId,
          categoryId: "unknown",
          categoryLabel,
          title: selectionTitle,
          message:
            getResolutionTargetPromptMessage(
              effectType,
              this.interactionView?.activePrompt?.activeSlotIndex ?? null,
              this.interactionView?.activePrompt?.slots?.length,
            ) ?? resolutionSession.promptMessage,
          entries: this.interactionView?.interactions
            ? [
                ...playerEntries,
                ...this.interactionView.interactions.flatMap((interaction) => {
                  if (interaction.kind !== "select-card") return [];
                  const card = this.cardSnapshotsById[interaction.cardId as unknown as string];
                  if (!card) return [];
                  return [
                    {
                      id: `resolution:card:${interaction.cardId}`,
                      kind: "card" as const,
                      cardId: interaction.cardId as unknown as string,
                      label: card.label,
                      // The view's interactions don't carry per-card selection
                      // state — selection is owned by the session. Read it from
                      // there so this entry list reflects the chooser's clicks.
                      selected: includesSelectionId(
                        resolutionSession.selectedTargets,
                        interaction.cardId as unknown as string,
                      ),
                    },
                  ];
                }),
              ]
            : [...playerEntries, ...cardEntries],
          effectType,
          target: selectionTarget,
          allowedZones: [...context.allowedZones],
          candidateCardIds: [...cardCandidateIds],
          candidatePlayerIds: [...context.playerCandidateIds],
          viewerSide: this.ownerSide,
          candidateEntries: [...playerEntries, ...cardEntries],
          playCardEntryModeChoice,
          activeSlotIndex: this.interactionView?.activePrompt?.activeSlotIndex ?? null,
          slots: [],
          amountSelection,
          selectedTargetLabels,
          minimumSelections: context.minSelections,
          maximumSelections: context.maxSelections,
          canBack: false,
          canCancel: true,
          canDecline,
          declineLabel,
          canConfirm: this.canConfirmResolutionSelection,
        };
      }

      if (context.kind === "choice-selection") {
        const choiceTargetCard = resolutionTargetLabel
          ? this.#resolveChoiceSelectionTargetCard(context)
          : null;
        return {
          mode: "resolution-choice",
          categoryId: "unknown",
          categoryLabel,
          title: selectionTitle,
          message: resolutionSession.promptMessage,
          entries: context.options.map((option) => ({
            id: `resolution:choice:${option.index}`,
            kind: "option" as const,
            moveId: String(option.index),
            label: sourceCard?.choiceOptionTexts?.[option.index] ?? option.label,
            selected: resolutionSession.selectedChoiceIndex === option.index,
            disabled: !option.legal,
            disabledReason: option.legal ? undefined : "Unavailable",
          })),
          targetCard: choiceTargetCard,
          canBack: false,
          canCancel: true,
          canDecline,
          declineLabel,
          canConfirm: this.canConfirmResolutionSelection,
        };
      }

      if (context.kind === "optional-selection") {
        return {
          mode: "resolution-optional",
          categoryId: "unknown",
          categoryLabel,
          title: sourceLabel,
          message: resolutionSession.promptMessage,
          entries: [
            {
              id: "resolution:optional:accept",
              kind: "option",
              moveId: "accept",
              label: context.acceptLabel,
              selected: resolutionSession.selectedOptionalValue === true,
            },
            {
              id: "resolution:optional:reject",
              kind: "option",
              moveId: "reject",
              label: context.rejectLabel,
              selected: resolutionSession.selectedOptionalValue === false,
            },
          ],
          canBack: false,
          canCancel: false,
          canDecline,
          declineLabel,
          canConfirm: false,
        };
      }

      if (context.kind === "name-card-selection") {
        return {
          mode: "resolution-name-card",
          categoryId: "unknown",
          categoryLabel,
          title: selectionTitle,
          message: resolutionSession.promptMessage,
          query: resolutionSession.namedCardQuery,
          selectedLabel: resolutionSession.selectedNamedCard,
          entries: this.resolutionSelectionNamedCardResults.map((result) => ({
            id: `resolution:named-card:${result.id}`,
            kind: "named-card",
            moveId: result.name,
            label: result.label,
            selected:
              resolutionSession.selectedNamedCard === result.name ||
              resolutionSession.namedCardQuery.trim() === result.label,
          })),
          canBack: false,
          canCancel: true,
          canDecline,
          declineLabel,
          canConfirm: this.canConfirmResolutionSelection,
        };
      }

      if (context.kind === "scry-selection") {
        const previewDestinations = buildScryPreviewDestinations(
          this.cardSnapshotsById,
          context,
          resolutionSession.scryDestinations,
        );
        const unassignedCardIds = getScryUnassignedCardIds(previewDestinations, context);
        const entries = context.revealedCardIds.flatMap((cardId) => {
          const card = getScryCardView(this.cardSnapshotsById, context, cardId);
          const assignedRule = previewDestinations.find((destination) =>
            destination.cards.includes(cardId),
          );
          const availableDestinationIds = context.destinationRules
            .filter((rule) => canAssignCardToScryDestination(card ?? {}, rule))
            .map((rule) => rule.id);
          return card
            ? [
                {
                  id: `resolution:scry-card:${card.cardId}`,
                  kind: "scry-card" as const,
                  cardId: card.cardId,
                  label: card.label,
                  availableDestinationIds,
                  detail: assignedRule
                    ? `Goes to ${getScryZoneLabel(assignedRule.zone)}`
                    : "Needs a destination",
                  selected: assignedRule !== undefined,
                },
              ]
            : [];
        });

        const scryHeader = buildScryOverlayHeaderHeading(selectionTitle, sourceCard?.label ?? null);

        return {
          mode: "resolution-scry",
          categoryId: "unknown",
          categoryLabel,
          sourceCardId: sourceCard?.cardId ?? null,
          title: scryHeader.title,
          headerSubtitle: scryHeader.headerSubtitle,
          message:
            unassignedCardIds.length > 0
              ? `${resolutionSession.promptMessage} ${unassignedCardIds.length} card${unassignedCardIds.length === 1 ? "" : "s"} still need a destination.`
              : resolutionSession.promptMessage,
          entries,
          remainingManualAssignments: unassignedCardIds.length,
          destinations: context.destinationRules.map((rule) => {
            const destination = previewDestinations.find((candidate) => candidate.id === rule.id);
            const cards = destination?.cards ?? [];
            const detail = getScryDestinationConstraintSummary(rule);

            return {
              id: rule.id,
              zone: rule.zone,
              label: rule.label ?? getScryZoneLabel(rule.zone),
              detail,
              orderingEnabled: isScryDestinationManuallyOrdered(rule),
              rule,
              cards: cards.flatMap((cardId) => {
                const card = getScryCardView(this.cardSnapshotsById, context, cardId);
                const manualDestination = resolutionSession.scryDestinations.find(
                  (candidate) => candidate.id === rule.id,
                );
                const isAutoAssigned = !manualDestination?.cards.includes(cardId);
                return card
                  ? [
                      {
                        id: `resolution:scry-destination:${rule.id}:${card.cardId}`,
                        kind: "scry-card" as const,
                        cardId: card.cardId,
                        label: card.label,
                        detail: isAutoAssigned
                          ? "Automatic remainder"
                          : this.cardSnapshotsById[card.cardId]
                            ? buildAvailableMovesCardDetail(this.cardSnapshotsById[card.cardId]!)
                            : undefined,
                        selected: true,
                      },
                    ]
                  : [];
              }),
            };
          }),
          canBack: false,
          canCancel: true,
          canDecline,
          declineLabel,
          canConfirm: this.canConfirmResolutionSelection,
        };
      }
    }

    const session = this.#actionSelectionSession;
    if (!session || session.phase === "idle" || session.phase === "executing") {
      return null;
    }

    const sourceCard = session.sourceCardId
      ? (this.cardSnapshotsById[session.sourceCardId] ?? null)
      : null;
    const targetCard = session.targetCardId
      ? (this.cardSnapshotsById[session.targetCardId] ?? null)
      : null;
    const currentMove = this.currentActionSelectionMove;
    const sourceCardLabel = sourceCard?.label ?? m["sim.card.unknown"]({});
    const confirmMessage = session.confirmationRequired
      ? m["sim.guidance.session.confirmWithHint"]({ label: session.label })
      : m["sim.guidance.session.confirm"]({ label: session.label });
    const currentSelectableCost = getCurrentSelectableCostForActionSelectionSession(session);
    const singTogetherMove = getSingTogetherSelectionMove(session);
    const singTogetherMetadata = getSingTogetherSelectionMetadata(singTogetherMove);
    const singTogetherTotal =
      singTogetherMetadata && singTogetherMove
        ? getSingTogetherSelectionTotal(session, singTogetherMove)
        : 0;

    let entries: AvailableMovesSelectionEntry[] = [];
    let message = getChooseSourceStatusMessage(session.categoryId);

    if (session.phase === "choose-source") {
      entries = this.selectableActionSessionCardIds.flatMap((cardId) => {
        const card = this.cardSnapshotsById[cardId] ?? null;
        return card
          ? [
              {
                id: `available-moves:card:${card.cardId}`,
                kind: "card" as const,
                cardId: card.cardId,
                label: card.label,
                detail: buildAvailableMovesCardDetail(card),
                selected: session.sourceCardId === card.cardId,
              },
            ]
          : [];
      });
    } else if (session.phase === "choose-cost" && currentSelectableCost) {
      const selectedCostIds = new Set(getSelectedCostCardIds(session, currentSelectableCost.kind));
      message = getChooseCostStatusMessage(sourceCardLabel, currentSelectableCost);
      entries = this.selectableActionSessionCardIds.flatMap((cardId) => {
        const card = this.cardSnapshotsById[cardId] ?? null;
        return card
          ? [
              {
                id: `available-moves:card:${card.cardId}`,
                kind: "card" as const,
                cardId: card.cardId,
                label: card.label,
                detail: buildAvailableMovesCardDetail(card),
                selected: selectedCostIds.has(card.cardId),
              },
            ]
          : [];
      });
    } else if (session.phase === "choose-target") {
      message =
        singTogetherMetadata && singTogetherMove
          ? getChooseSingTogetherStatusMessage(
              sourceCardLabel,
              singTogetherTotal,
              singTogetherMetadata.requiredValue,
            )
          : getChooseTargetStatusMessage(session.categoryId, sourceCardLabel);
      entries = this.selectableActionSessionCardIds.flatMap((cardId) => {
        const card = this.cardSnapshotsById[cardId] ?? null;
        const singerValue =
          singTogetherMetadata?.candidateCards.find((candidate) => candidate.cardId === cardId)
            ?.value ?? null;
        return card
          ? [
              {
                id: `available-moves:card:${card.cardId}`,
                kind: "card" as const,
                cardId: card.cardId,
                label: card.label,
                detail:
                  singerValue != null
                    ? `Counts as ${singerValue} to sing`
                    : buildAvailableMovesCardDetail(card),
                selected:
                  singTogetherMetadata != null
                    ? session.selectedCardIds.includes(card.cardId)
                    : session.targetCardId === card.cardId,
              },
            ]
          : [];
      });
    } else if (session.phase === "choose-option") {
      message = getChooseOptionStatusMessage(session, sourceCardLabel);
      entries = session.sourceCardId
        ? getSourceMovesForActionSelectionSession(session, session.sourceCardId).map((move) => ({
            id: `available-moves:option:${move.id}`,
            kind: "option" as const,
            moveId: move.id,
            label:
              move.presentation.kind === "targeted" ? move.presentation.optionLabel : move.label,
            detail: move.presentation.kind === "targeted" ? move.label : undefined,
            selected: session.selectedMoveId === move.id,
          }))
        : [];
    } else if (session.phase === "confirm") {
      message =
        session.categoryId === "challenge" && sourceCard && targetCard
          ? `${confirmMessage}\n${m["sim.actions.challengeVs"]({
              attacker: sourceCard.label,
              defender: targetCard.label,
            })}`
          : session.categoryId === "play-card" && sourceCard && targetCard
            ? session.confirmationRequired
              ? m["sim.guidance.session.confirmPlayingWithTargetHint"]({
                  cardName: sourceCard.label,
                  targetName: targetCard.label,
                })
              : m["sim.guidance.session.confirmPlayingWithTarget"]({
                  cardName: sourceCard.label,
                  targetName: targetCard.label,
                })
            : session.categoryId === "play-card" && sourceCard
              ? session.confirmationRequired
                ? m["sim.guidance.session.confirmPlayingHint"]({ cardName: sourceCard.label })
                : m["sim.guidance.session.confirmPlaying"]({ cardName: sourceCard.label })
              : confirmMessage;
    }

    return {
      mode: "action",
      categoryId: session.categoryId,
      categoryLabel: session.label,
      phase: session.phase,
      title:
        session.phase === "choose-option" && sourceCard
          ? sourceCard.label
          : session.phase === "choose-cost" && sourceCard
            ? sourceCard.label
            : session.phase === "choose-target" && sourceCard
              ? sourceCard.label
              : session.label,
      message,
      entries,
      sourceCardId: session.sourceCardId,
      sourceLabel: sourceCard?.label ?? null,
      targetCardId: session.targetCardId,
      targetLabel:
        singTogetherMetadata != null
          ? session.selectedCardIds
              .map((cardId) => this.cardSnapshotsById[cardId]?.label ?? null)
              .filter((label): label is string => Boolean(label))
              .join(", ")
          : (targetCard?.label ?? null),
      selectedMoveId: session.selectedMoveId,
      selectedMoveLabel: currentMove
        ? currentMove.presentation.kind === "targeted"
          ? currentMove.presentation.optionLabel
          : currentMove.label
        : null,
      canBack: session.phase !== "choose-source",
      canCancel: true,
      canConfirm:
        (session.phase === "confirm" && currentMove !== null) ||
        (session.phase === "choose-target" && canConfirmSingTogetherSelection(session)),
    };
  }

  getActionSessionCardState(cardId: string): {
    isSelected: boolean;
    isSelectable: boolean;
    isInvalidTarget: boolean;
    isConfirmPending: boolean;
  } {
    const session = this.#actionSelectionSession;
    const resolutionSession = this.#resolutionSelectionSession;
    const isResolutionTarget =
      resolutionSession !== null &&
      resolutionSession.phase !== "executing" &&
      isTargetResolutionSelectionContext(resolutionSession.context) &&
      includesSelectionId(
        this.#getResolutionSelectionCardCandidateIds(resolutionSession.context),
        cardId,
      );
    const isResolutionSelected =
      resolutionSession !== null &&
      isTargetResolutionSelectionContext(resolutionSession.context) &&
      includesSelectionId(resolutionSession.selectedTargets, cardId);
    const isSelected = this.selectedActionSessionCardIds.includes(cardId) || isResolutionSelected;
    const isSelectable = this.selectableActionSessionCardIds.includes(cardId) || isResolutionTarget;
    const isInvalidTarget = this.invalidActionSessionCardIds.includes(cardId);
    const isConfirmPending = session !== null && session.phase === "confirm" && isSelected;

    return {
      isSelected,
      isSelectable,
      isInvalidTarget,
      isConfirmPending,
    };
  }

  getChallengePreviewCardState(cardId: string): {
    wouldBeBanished: boolean;
  } {
    const session = this.#actionSelectionSession;
    if (
      !session ||
      session.categoryId !== "challenge" ||
      !session.sourceCardId ||
      !session.targetCardId
    ) {
      return { wouldBeBanished: false };
    }

    const preview = this.#game.previewChallenge(session.sourceCardId, session.targetCardId);
    if (!preview) {
      return { wouldBeBanished: false };
    }

    return {
      wouldBeBanished:
        (preview.attackerId === cardId && preview.attackerWouldBeBanished) ||
        (preview.defenderId === cardId && preview.defenderWouldBeBanished),
    };
  }

  getActionSessionCardReason(cardId: string): string | null {
    if (
      this.#resolutionSelectionSession &&
      isTargetResolutionSelectionContext(this.#resolutionSelectionSession.context) &&
      this.invalidActionSessionCardIds.includes(cardId)
    ) {
      return "This card is not a valid target for the current effect.";
    }

    if (
      this.#actionSelectionSession?.phase === "choose-cost" &&
      this.invalidActionSessionCardIds.includes(cardId)
    ) {
      const selectableCost = getCurrentSelectableCostForActionSelectionSession(
        this.#actionSelectionSession,
      );
      return selectableCost ? getInvalidCostSelectionReason(selectableCost) : null;
    }

    if (
      (this.#actionSelectionSession?.categoryId === "play-card" ||
        this.#actionSelectionSession?.categoryId === "sing-card") &&
      this.#actionSelectionSession.phase === "choose-target" &&
      this.invalidActionSessionCardIds.includes(cardId)
    ) {
      return this.#actionSelectionSession.categoryId === "sing-card"
        ? "This character can't sing this song right now."
        : "This card is not a valid target for this action.";
    }

    return this.#game.invalidChallengeTargetReasons()[cardId] ?? null;
  }

  getCardActionViews = (card: LorcanaCardSnapshot): CardActionView[] =>
    buildCardActionViews({
      card,
      executableMoves: this.#game
        .expandCardMoves(card.cardId)
        .filter(
          (move) =>
            move.presentation.categoryId !== "challenge" &&
            move.presentation.categoryId !== "move-to-location",
        ),
      ownerSide: this.ownerSide,
      challengeReadyCardIds: this.#game.challengeReadyCardIds(),
      movableToLocationCardIds:
        this.moveCategorySummaries
          .find((summary) => summary.categoryId === "move-to-location")
          ?.sourceCardIds.slice() ?? [],
      disabledReasonAccessors: {
        getStandardPlayDisabledReason: this.#game.getStandardPlayDisabledReason,
        getShiftPlayDisabledReason: this.#game.getShiftPlayDisabledReason,
        getSingPlayDisabledReason: this.#game.getSingPlayDisabledReason,
        getInkActionDisabledReason: this.#game.getInkActionDisabledReason,
      },
    });

  getSingleClickItemAbilityAction = (card: LorcanaCardSnapshot): CardActionView | null => {
    if (
      card.zoneId !== "play" ||
      card.cardType !== "item" ||
      !this.ownerSide ||
      card.ownerSide !== this.ownerSide
    ) {
      return null;
    }

    const action = this.getCardActionViews(card).find(
      (candidateAction) =>
        candidateAction.categoryId === "activate-ability" && candidateAction.enabled,
    );
    if (!action || action.moves.length !== 1) {
      return null;
    }

    return {
      ...action,
      moves: [action.moves[0]!],
    };
  };

  handleCardAbilityByIndex = (cardId: string, abilityIndex: number): boolean => {
    const card = this.cardSnapshotsById[cardId];
    if (!card) {
      return false;
    }

    const action = this.getCardActionViews(card).find(
      (candidateAction) => candidateAction.categoryId === "activate-ability",
    );
    if (!action) {
      return false;
    }

    const matchingMove = action.moves.find((move) => getMoveAbilityIndex(move) === abilityIndex);
    if (!matchingMove) {
      return false;
    }

    return this.handleCardActionClick(
      {
        ...action,
        moves: [matchingMove],
      },
      { skipConfirmation: true },
    );
  };

  handleCardActionClick = (
    action: CardActionView,
    options?: { skipConfirmation?: boolean; preselectedTargetCardId?: string },
  ): boolean => {
    if (!action.enabled) {
      return false;
    }

    const requireConfirmation = !this.skipActionConfirmation && !options?.skipConfirmation;
    // For multi-step session flows (choose-target → confirm), the hover-card skipConfirmation
    // override should not suppress the user's global confirmation preference — the confirmation
    // step is a deliberate second decision, not a redundant prompt for an already-decided action.
    const requireSessionConfirmation = !this.skipActionConfirmation;
    const actionMoves =
      action.interaction === "expand-on-click"
        ? this.#game.expandCardActionCategoryMoves(action.cardId, action.categoryId)
        : action.moves;

    if (actionMoves.length === 0) {
      return false;
    }

    if (action.categoryId === "challenge") {
      const session = buildActionSelectionSession(
        action.categoryId,
        actionMoves,
        requireConfirmation,
      );
      if (!session) {
        return false;
      }

      this.#setActionSelectionSession({
        ...session,
        sourceCardId: action.cardId,
        phase: "choose-target",
      });
      this.pendingMulliganDangerConfirm = null;
      this.#secondLayerCategoryLabel = null;
      this.#game.setPendingError(null);
      this.#game.setStatusMessage(
        m["sim.guidance.session.chooseChallengeTarget"]({
          cardLabel: this.cardSnapshotsById[action.cardId]?.label ?? m["sim.card.unknown"]({}),
        }),
      );
      return true;
    }

    if (action.categoryId === "move-to-location") {
      const session = buildActionSelectionSession(
        action.categoryId,
        actionMoves,
        requireConfirmation,
      );
      if (!session) {
        return false;
      }

      this.#setActionSelectionSession({
        ...session,
        sourceCardId: action.cardId,
        phase: "choose-target",
      });
      this.pendingMulliganDangerConfirm = null;
      this.#secondLayerCategoryLabel = null;
      this.#game.setPendingError(null);
      this.#game.setStatusMessage(
        m["sim.guidance.session.chooseMoveTarget"]({
          cardLabel: this.cardSnapshotsById[action.cardId]?.label ?? m["sim.card.unknown"]({}),
        }),
      );
      return true;
    }

    if (action.categoryId === "activate-ability") {
      const session = buildActionSelectionSession(
        action.categoryId,
        actionMoves,
        requireConfirmation,
      );
      if (!session) {
        return false;
      }

      const sourceMoves = getSourceMovesForActionSelectionSession(session, action.cardId);
      const singleMove = sourceMoves.length === 1 ? sourceMoves[0] : null;
      const singleMovePreviewSession = singleMove
        ? ({
            ...session,
            sourceCardId: action.cardId,
            selectedMoveId: singleMove.id,
          } satisfies ActionSelectionSession)
        : null;
      const singleMovePhase =
        singleMove && singleMovePreviewSession
          ? getPostCostActionSelectionPhase(singleMovePreviewSession, singleMove)
          : null;
      this.#setActionSelectionSession({
        ...session,
        sourceCardId: action.cardId,
        selectedMoveId: singleMove?.id ?? null,
        phase: singleMove ? (singleMovePhase ?? "choose-option") : "choose-option",
      });
      this.pendingMulliganDangerConfirm = null;
      this.#secondLayerCategoryLabel = null;
      this.#game.setPendingError(null);

      if (singleMove) {
        if (singleMovePhase === "choose-cost") {
          this.#game.setStatusMessage(
            getChooseCostStatusMessage(
              this.cardSnapshotsById[action.cardId]?.label ?? m["sim.card.unknown"]({}),
              getCurrentSelectableCostForActionSelectionSession(singleMovePreviewSession!) ??
                getMoveSelectableCosts(singleMove)[0]!,
            ),
          );
          return true;
        }

        if (session.confirmationRequired) {
          this.#game.setStatusMessage(
            m["sim.guidance.session.confirm"]({ label: singleMove.label }),
          );
          return true;
        }

        return this.#executeActionSelectionMove(
          {
            ...session,
            sourceCardId: action.cardId,
            selectedMoveId: singleMove.id,
            phase: "executing",
          },
          singleMove,
        );
      }

      this.#game.setStatusMessage(
        getChooseOptionStatusMessage(
          session,
          this.cardSnapshotsById[action.cardId]?.label ?? m["sim.card.unknown"]({}),
        ),
      );
      return true;
    }

    if (
      (action.categoryId === "play-card" ||
        action.categoryId === "shift-card" ||
        action.categoryId === "sing-card") &&
      usesTargetSelectionForActionSelectionMoves(action.categoryId, actionMoves)
    ) {
      const session = buildActionSelectionSession(
        action.categoryId,
        actionMoves,
        requireSessionConfirmation,
      );
      if (!session) {
        return false;
      }

      const preselectedTargetMoves = options?.preselectedTargetCardId
        ? actionMoves.filter(
            (move) =>
              getTargetCardIdForActionSelectionMove(action.categoryId, move) ===
              options.preselectedTargetCardId,
          )
        : [];
      const preselectedMove =
        preselectedTargetMoves.length === 1 ? (preselectedTargetMoves[0] ?? null) : null;
      const nextSession = {
        ...session,
        sourceCardId: action.cardId,
        targetCardId: null,
        selectedMoveId: null,
        phase:
          getMoveSelectableCosts(actionMoves[0]).length > 0
            ? "choose-cost"
            : preselectedTargetMoves.length > 1
              ? "choose-option"
              : preselectedMove
                ? session.confirmationRequired
                  ? "confirm"
                  : "executing"
                : "choose-target",
      } satisfies ActionSelectionSession;

      this.pendingMulliganDangerConfirm = null;
      this.#secondLayerCategoryLabel = null;
      this.#game.setPendingError(null);

      if (preselectedTargetMoves.length > 1) {
        this.#setActionSelectionSession(nextSession);
        this.#game.setStatusMessage(
          getChooseOptionStatusMessage(
            session,
            this.cardSnapshotsById[action.cardId]?.label ?? m["sim.card.unknown"]({}),
          ),
        );
        return true;
      }

      if (nextSession.phase === "choose-cost") {
        this.#setActionSelectionSession(nextSession);
        this.#game.setStatusMessage(
          getChooseCostStatusMessage(
            this.cardSnapshotsById[action.cardId]?.label ?? m["sim.card.unknown"]({}),
            getMoveSelectableCosts(actionMoves[0])[0]!,
          ),
        );
        return true;
      }

      if (preselectedMove) {
        if (session.confirmationRequired) {
          this.#setActionSelectionSession(nextSession);
          this.#game.setStatusMessage(
            m["sim.guidance.session.confirm"]({ label: preselectedMove.label }),
          );
          return true;
        }

        return this.#executeActionSelectionMove(nextSession, preselectedMove);
      }

      this.#setActionSelectionSession(nextSession);
      this.#game.setStatusMessage(
        getChooseTargetStatusMessage(
          action.categoryId,
          this.cardSnapshotsById[action.cardId]?.label ?? m["sim.card.unknown"]({}),
        ),
      );
      return true;
    }

    if (
      (action.categoryId === "play-card" ||
        action.categoryId === "shift-card" ||
        action.categoryId === "sing-card") &&
      actionMoves.length > 1
    ) {
      const session = buildActionSelectionSession(
        action.categoryId,
        actionMoves,
        requireConfirmation,
      );
      if (!session) {
        return false;
      }

      this.#setActionSelectionSession({
        ...session,
        sourceCardId: action.cardId,
        phase: "choose-option",
      });
      this.pendingMulliganDangerConfirm = null;
      this.#secondLayerCategoryLabel = null;
      this.#game.setPendingError(null);
      this.#game.setStatusMessage(
        getChooseOptionStatusMessage(
          session,
          this.cardSnapshotsById[action.cardId]?.label ?? m["sim.card.unknown"]({}),
        ),
      );
      return true;
    }

    if (action.categoryId === "sing-card" && isSingTogetherSelectionMove(actionMoves[0])) {
      const session = buildActionSelectionSession(
        action.categoryId,
        actionMoves,
        requireSessionConfirmation,
      );
      const singTogetherMove = actionMoves[0];
      const singTogetherMetadata = getSingTogetherSelectionMetadata(singTogetherMove);
      if (!session || !singTogetherMove || !singTogetherMetadata) {
        return false;
      }

      this.#setActionSelectionSession({
        ...session,
        sourceCardId: action.cardId,
        phase: "choose-target",
        selectedMoveId: singTogetherMove.id,
      });
      this.pendingMulliganDangerConfirm = null;
      this.#secondLayerCategoryLabel = null;
      this.#game.setPendingError(null);
      this.#game.setStatusMessage(
        getChooseSingTogetherStatusMessage(
          this.cardSnapshotsById[action.cardId]?.label ?? m["sim.card.unknown"]({}),
          0,
          singTogetherMetadata.requiredValue,
        ),
      );
      return true;
    }

    this.handleAvailableMoveClick(actionMoves[0]);
    return true;
  };

  openPlayCardSelection = (cardId: string, options?: { targetCardId?: string }): boolean => {
    const card = this.cardSnapshotsById[cardId];
    if (!card) {
      return false;
    }

    const action = this.getCardActionViews(card).find(
      (candidateAction) => candidateAction.categoryId === "play-card",
    );
    if (!action) {
      return false;
    }

    return this.handleCardActionClick(
      action,
      options?.targetCardId ? { preselectedTargetCardId: options.targetCardId } : {},
    );
  };

  #setActionSelectionSession(nextSession: ActionSelectionSession | null): void {
    this.#actionSelectionSession = nextSession;
    if (nextSession) {
      this.#resolutionSelectionSession = null;
    }
    this.#game.setSelectedCardId(nextSession?.targetCardId ?? nextSession?.sourceCardId ?? null);
    this.#game.setChallengeSourceCardId(null);
  }

  #clearActionSelectionSession(statusMessage?: string): void {
    this.#setActionSelectionSession(null);
    this.#game.setPendingError(null);
    if (statusMessage) {
      this.#game.setStatusMessage(statusMessage);
    }
  }

  #executeActionSelectionMove(session: ActionSelectionSession, move: ExecutableMoveEntry): boolean {
    this.#setActionSelectionSession({
      ...session,
      phase: "executing",
      selectedMoveId: move.id,
    });

    const moveParams = (() => {
      const paramsWithCosts = applySelectedCostsToMoveParams(move, session);
      if (!isSingTogetherSelectionMove(move) || session.selectedCardIds.length === 0) {
        return paramsWithCosts;
      }

      const playCardParams = paramsWithCosts as LorcanaSimulatorMoveParams["playCard"];
      return {
        ...playCardParams,
        singers: [...session.selectedCardIds],
      } satisfies LorcanaSimulatorMoveParams["playCard"];
    })();

    this.#capturePendingResolutionSourceHint(move);
    const success = this.#game.executeMove(move.moveId, moveParams, {
      clearChallengeMode: true,
      clearSelection: true,
      status: move.label,
    });

    if (success) {
      this.#setActionSelectionSession(null);
      return true;
    }

    this.#pendingResolutionSourceHint = null;
    this.#setActionSelectionSession(session);
    return false;
  }

  get actionSelectionGuidance(): ActivePlayerGuidanceItem[] {
    const resolutionSession = this.#resolutionSelectionSession;
    if (resolutionSession && isTargetResolutionSelectionContext(resolutionSession.context)) {
      const canDecline = canDeclineResolutionSelectionSession(resolutionSession);
      const selectedCount = resolutionSession.selectedTargets.length;
      const minSelections = resolutionSession.context.minSelections;
      const activePrompt = this.interactionView?.activePrompt;
      // Display uses the printed max (e.g. "up to 2") so the counter matches
      // the card text, but never exceed the actual candidate count — otherwise
      // a card like Leviathan ("any number, total cost ≤ 10") would show
      // "Confirm (1/10)" when only 3 opponents are in play, making players
      // think they must select 10 targets before confirming.
      const displayMaxSelections = Math.min(
        resolutionSession.context.declaredMaxSelections ?? resolutionSession.context.maxSelections,
        resolutionSession.context.maxSelections,
      );
      const isOptional = minSelections === 0;
      const needsEntryModeChoice = hasPlayCardEntryModeSelection(
        resolutionSession.context,
        resolutionSession.selectedTargets,
      );
      const amountSelection = this.#getResolutionAmountSelectionState(resolutionSession);
      // For "up to N" with nothing picked, the confirm action IS a skip. Show
      // "Skip" so the affordance is obvious; otherwise show "Confirm (selected/max)"
      // so the player can see how many of the allowed targets they've chosen.
      const confirmLabel =
        isOptional && selectedCount === 0
          ? m["sim.actions.skip"]({})
          : displayMaxSelections > 1
            ? `${m["sim.actions.confirm"]({})} (${selectedCount}/${displayMaxSelections})`
            : selectedCount > 0
              ? `${m["sim.actions.confirm"]({})} (${selectedCount})`
              : m["sim.actions.confirm"]({});

      return [
        {
          id: "resolution-selection-inline",
          message: resolutionSession.promptMessage,
          abilityDescription: resolutionSession.abilityDescription ?? undefined,
          inlineReference: resolutionSession.promptInlineReference ?? undefined,
          targetSlots:
            resolutionSession.context.expectedSlottedKind === "move-to-location"
              ? buildMoveToLocationGuidanceTargetSlots({
                  selectedTargets: resolutionSession.selectedTargets,
                  activeSlotIndex: activePrompt?.activeSlotIndex,
                  cardSnapshotsById: this.cardSnapshotsById,
                  fixedLocationId:
                    getFixedMoveToLocationSlotId(activePrompt?.slots) ??
                    getFixedMoveToLocationBoardId(
                      this.#game.boardSnapshot(),
                      resolutionSession.context.sourceCardId,
                    ),
                })
              : buildGuidanceTargetSlots({
                  slots: activePrompt?.slots,
                  activeSlotIndex: activePrompt?.activeSlotIndex,
                  cardSnapshotsById: this.cardSnapshotsById,
                }),
          amountSelection: amountSelection,
          actions: [
            ...(canDecline
              ? [
                  {
                    id: "resolution-selection-decline",
                    label: getResolutionDeclineLabel(resolutionSession),
                    onClick: this.rejectActiveResolutionSelection,
                  } satisfies GuidanceAction,
                ]
              : []),
            ...(needsEntryModeChoice
              ? [
                  {
                    id: "resolution-selection-play-ready",
                    label: "Play Ready",
                    onClick: () => this.selectResolutionEnterPlayExerted(false),
                    emphasis: resolutionSession.selectedEnterPlayExerted === false,
                  } satisfies GuidanceAction,
                  {
                    id: "resolution-selection-play-exerted",
                    label: "Play Exerted",
                    onClick: () => this.selectResolutionEnterPlayExerted(true),
                    emphasis: resolutionSession.selectedEnterPlayExerted === true,
                  } satisfies GuidanceAction,
                ]
              : []),
            {
              id: "resolution-selection-cancel",
              label: m["sim.actions.hide"]({}),
              onClick: this.cancelResolutionSelectionSession,
            },
            {
              id: "resolution-selection-confirm",
              label: confirmLabel,
              onClick: this.confirmResolutionSelection,
              disabled: !this.canConfirmResolutionSelection,
              emphasis: true,
            },
          ],
          mode: "default",
          order: 2,
        },
      ];
    }

    if (resolutionSession && resolutionSession.context.kind === "optional-selection") {
      return [
        {
          id: "resolution-optional-inline",
          message: resolutionSession.promptMessage,
          abilityDescription: resolutionSession.abilityDescription ?? undefined,
          inlineReference: resolutionSession.promptInlineReference ?? undefined,
          actions: [
            {
              id: "resolution-optional-accept",
              label: resolutionSession.context.acceptLabel,
              onClick: () => {
                this.submitResolutionOptional(true);
              },
              emphasis: resolutionSession.selectedOptionalValue === true,
            },
            {
              id: "resolution-optional-reject",
              label: getResolutionDeclineLabel(resolutionSession),
              onClick: () => {
                this.submitResolutionOptional(false);
              },
              emphasis: resolutionSession.selectedOptionalValue === false,
            },
          ],
          mode: "default",
          order: 2,
        },
      ];
    }

    if (resolutionSession && resolutionSession.context.kind === "choice-selection") {
      const canDecline = canDeclineResolutionSelectionSession(resolutionSession);
      return [
        {
          id: "resolution-choice-inline",
          message: resolutionSession.promptMessage,
          inlineReference: resolutionSession.promptInlineReference ?? undefined,
          actions: [
            ...resolutionSession.context.options.map(
              (option) =>
                ({
                  id: `resolution-choice-option:${option.index}`,
                  label: option.label,
                  onClick: () => {
                    this.selectResolutionChoice(option.index);
                  },
                  disabled: !option.legal,
                  emphasis: resolutionSession.selectedChoiceIndex === option.index,
                }) satisfies GuidanceAction,
            ),
            ...(canDecline
              ? [
                  {
                    id: "resolution-choice-decline",
                    label: getResolutionDeclineLabel(resolutionSession),
                    onClick: this.rejectActiveResolutionSelection,
                  } satisfies GuidanceAction,
                ]
              : []),
            {
              id: "resolution-choice-cancel",
              label: m["sim.actions.hide"]({}),
              onClick: this.cancelResolutionSelectionSession,
            },
            {
              id: "resolution-choice-confirm",
              label: m["sim.actions.confirm"]({}),
              onClick: this.confirmResolutionSelection,
              disabled: !this.canConfirmResolutionSelection,
              emphasis: true,
            },
          ],
          mode: "default",
          order: 2,
        },
      ];
    }

    if (resolutionSession && resolutionSession.context.kind === "name-card-selection") {
      const canDecline = canDeclineResolutionSelectionSession(resolutionSession);
      return [
        {
          id: "resolution-name-card-inline",
          message: resolutionSession.promptMessage,
          inlineReference: resolutionSession.promptInlineReference ?? undefined,
          namedCardSearch: {
            query: resolutionSession.namedCardQuery,
            results: this.resolutionSelectionNamedCardResults.map((result) => ({
              id: result.id,
              label: result.label,
              name: result.name,
              selected:
                resolutionSession.selectedNamedCard === result.name ||
                resolutionSession.namedCardQuery.trim() === result.label,
            })),
            oninput: this.updateResolutionNamedCardQuery,
            onselect: this.chooseResolutionNamedCard,
          },
          actions: [
            ...(canDecline
              ? [
                  {
                    id: "resolution-name-card-decline",
                    label: getResolutionDeclineLabel(resolutionSession),
                    onClick: this.rejectActiveResolutionSelection,
                  } satisfies GuidanceAction,
                ]
              : []),
            {
              id: "resolution-name-card-cancel",
              label: m["sim.actions.hide"]({}),
              onClick: this.cancelResolutionSelectionSession,
            },
            {
              id: "resolution-name-card-confirm",
              label: m["sim.actions.confirm"]({}),
              onClick: this.confirmResolutionSelection,
              disabled: !this.canConfirmResolutionSelection,
              emphasis: true,
            },
          ],
          mode: "default",
          order: 2,
        },
      ];
    }

    const session = this.#actionSelectionSession;
    if (!session) {
      const actionableItems = this.pendingEffectsPopoverItems.filter(
        (item) =>
          item.isLocalPlayer !== false &&
          Boolean(
            (item.canResolve && item.onResolve) ||
            (item.canAccept && item.onAccept) ||
            (item.canReject && item.onReject),
          ),
      );
      if (actionableItems.length > 0) {
        return actionableItems.map((item) => ({
          id: `resolve-pending:${item.id}`,
          message: item.summaryTitle ?? item.title,
          actions: [
            ...(item.canResolve && item.onResolve
              ? [
                  {
                    id: `resolve-pending-action:${item.id}`,
                    label:
                      item.kind === "bag"
                        ? m["sim.actions.label.resolveTriggeredAbility"]({})
                        : m["sim.actions.label.resolveEffect"]({}),
                    onClick: item.onResolve,
                    emphasis: true,
                  } satisfies GuidanceAction,
                ]
              : []),
            ...(item.canAccept && item.onAccept
              ? [
                  {
                    id: `resolve-pending-accept:${item.id}`,
                    label: m["sim.actions.label.acceptEffect"]({}),
                    onClick: item.onAccept,
                    emphasis: true,
                  } satisfies GuidanceAction,
                ]
              : []),
            ...(item.canReject && item.onReject
              ? [
                  {
                    id: `resolve-pending-reject:${item.id}`,
                    label: m["sim.actions.label.declineEffect"]({}),
                    onClick: item.onReject,
                  } satisfies GuidanceAction,
                ]
              : []),
          ],
          mode: "default" as const,
          order: 2,
        }));
      }
      return [];
    }

    const sourceCard = session.sourceCardId
      ? (this.cardSnapshotsById[session.sourceCardId] ?? null)
      : null;
    const confirmMessage = session.confirmationRequired
      ? m["sim.guidance.session.confirmWithHint"]({ label: session.label })
      : m["sim.guidance.session.confirm"]({ label: session.label });
    const targetCard = session.targetCardId
      ? (this.cardSnapshotsById[session.targetCardId] ?? null)
      : null;

    if (
      session.phase === "choose-option" &&
      session.categoryId === "activate-ability" &&
      sourceCard
    ) {
      const candidateActions = getSourceMovesForActionSelectionSession(
        session,
        sourceCard.cardId,
      ).map(
        (move) =>
          ({
            id: `action-selection-option:${move.id}`,
            label:
              move.presentation.kind === "targeted" ? move.presentation.optionLabel : move.label,
            onClick: () => {
              this.selectActionSelectionOption(move.id);
            },
          }) satisfies GuidanceAction,
      );

      return [
        {
          id: "action-selection-ability",
          message: getChooseOptionStatusMessage(session, sourceCard.label),
          actions: [
            {
              id: "action-selection-ability-back",
              label: m["sim.actions.back"]({}),
              onClick: this.backActionSelectionSession,
            },
            ...candidateActions,
            {
              id: "action-selection-ability-cancel",
              label: m["sim.actions.cancel"]({}),
              onClick: this.cancelActionSelectionSession,
            },
          ],
          mode: "default",
          order: 2,
        },
      ];
    }

    if (
      session.phase === "choose-option" &&
      (session.categoryId === "play-card" ||
        session.categoryId === "shift-card" ||
        session.categoryId === "sing-card") &&
      sourceCard
    ) {
      const candidateActions = session.candidateMoves
        .filter(
          (move) =>
            getSourceCardIdForActionSelectionMove(session.categoryId, move) === sourceCard.cardId,
        )
        .map(
          (move) =>
            ({
              id: `action-selection-option:${move.id}`,
              label:
                move.presentation.kind === "targeted" ? move.presentation.optionLabel : move.label,
              onClick: () => {
                this.selectActionSelectionOption(move.id);
              },
            }) satisfies GuidanceAction,
        );

      return [
        {
          id: "action-selection-option",
          message: getChooseOptionStatusMessage(session, sourceCard.label),
          actions: [
            {
              id: "action-selection-option-back",
              label: m["sim.actions.back"]({}),
              onClick: this.backActionSelectionSession,
            },
            ...candidateActions,
            {
              id: "action-selection-option-cancel",
              label: m["sim.actions.cancel"]({}),
              onClick: this.cancelActionSelectionSession,
            },
          ],
          mode: "default",
          order: 2,
        },
      ];
    }

    if (session.phase === "confirm") {
      const challengeConfirmMessage =
        session.categoryId === "challenge" && sourceCard && targetCard
          ? `${confirmMessage}\n${m["sim.actions.challengeVs"]({
              attacker: sourceCard.label,
              defender: targetCard.label,
            })}`
          : session.categoryId === "play-card" && sourceCard && targetCard
            ? session.confirmationRequired
              ? m["sim.guidance.session.confirmPlayingWithTargetHint"]({
                  cardName: sourceCard.label,
                  targetName: targetCard.label,
                })
              : m["sim.guidance.session.confirmPlayingWithTarget"]({
                  cardName: sourceCard.label,
                  targetName: targetCard.label,
                })
            : session.categoryId === "play-card" && sourceCard
              ? session.confirmationRequired
                ? m["sim.guidance.session.confirmPlayingHint"]({ cardName: sourceCard.label })
                : m["sim.guidance.session.confirmPlaying"]({ cardName: sourceCard.label })
              : confirmMessage;

      return [
        {
          id: "action-selection-confirm",
          message: challengeConfirmMessage,
          actions: [
            {
              id: "action-selection-confirm-back",
              label: m["sim.actions.back"]({}),
              onClick: this.backActionSelectionSession,
            },
            {
              id: "action-selection-confirm-cancel",
              label: m["sim.actions.cancel"]({}),
              onClick: this.cancelActionSelectionSession,
            },
            {
              id: "action-selection-confirm-submit",
              label: m["sim.actions.confirmMoveLabel"]({ label: session.label }),
              onClick: this.confirmActionSelection,
              emphasis: true,
            },
          ],
          mode: session.categoryId === "challenge" ? "challenge" : "default",
          order: 2,
        },
      ];
    }

    const message =
      session.phase === "choose-source"
        ? getChooseSourceStatusMessage(session.categoryId)
        : session.phase === "choose-cost"
          ? getChooseCostStatusMessage(
              sourceCard?.label ?? m["sim.card.unknown"]({}),
              getCurrentSelectableCostForActionSelectionSession(session) ?? {
                kind: "discardCards",
                count: 1,
                candidateCardIds: [],
                zone: "hand",
              },
            )
          : isSingTogetherSelectionSession(session)
            ? getChooseSingTogetherStatusMessage(
                sourceCard?.label ?? m["sim.card.unknown"]({}),
                getSingTogetherSelectionTotal(session),
                getSingTogetherSelectionMetadata(getSingTogetherSelectionMove(session))
                  ?.requiredValue ?? 0,
              )
            : getChooseTargetStatusMessage(
                session.categoryId,
                sourceCard?.label ?? m["sim.card.unknown"]({}),
              );

    return [
      {
        id: "action-selection",
        message,
        actions: [
          ...(session.phase === "choose-target" || session.phase === "choose-cost"
            ? [
                {
                  id: "action-selection-back",
                  label: m["sim.actions.back"]({}),
                  onClick: this.backActionSelectionSession,
                } satisfies GuidanceAction,
              ]
            : []),
          ...(session.phase === "choose-target" && isSingTogetherSelectionSession(session)
            ? [
                {
                  id: "action-selection-confirm",
                  label: m["sim.actions.confirmMoveLabel"]({ label: session.label }),
                  onClick: this.confirmActionSelection,
                  disabled: !canConfirmSingTogetherSelection(session),
                  emphasis: true,
                } satisfies GuidanceAction,
              ]
            : []),
          {
            id: "action-selection-cancel",
            label: m["sim.actions.cancel"]({}),
            onClick: this.cancelActionSelectionSession,
          },
        ],
        mode: session.categoryId === "challenge" ? "challenge" : "default",
        order: 2,
      },
    ];
  }

  get activePlayerGuidance(): ActivePlayerGuidanceItem[] {
    const secondLayerGuidance =
      this.#secondLayerCategoryLabel &&
      this.ownerSide &&
      (!this.activeSide || this.activeSide === this.ownerSide)
        ? [
            {
              id: SECOND_LAYER_GUIDANCE_ID,
              message: m["sim.guidance.secondLayer.chooseCategoryAction"]({
                category: this.#secondLayerCategoryLabel,
              }),
              actions: [],
              mode: "default" as const,
              order: 0,
            },
          ]
        : [];

    return [
      ...this.baselineGuidance,
      ...this.actionSelectionGuidance,
      ...secondLayerGuidance,
      ...Object.values(this.#overlayGuidanceById),
    ].sort((left, right) => right.order - left.order);
  }

  get canConfirmResolutionSelection(): boolean {
    const session = this.#resolutionSelectionSession;
    if (!session || session.phase === "executing") {
      return false;
    }

    const { context } = session;
    if (context.kind === "choice-selection") {
      return (
        typeof session.selectedChoiceIndex === "number" &&
        context.options.some(
          (option) => option.index === session.selectedChoiceIndex && option.legal,
        )
      );
    }

    if (context.kind === "optional-selection") {
      return typeof session.selectedOptionalValue === "boolean";
    }

    if (context.kind === "name-card-selection") {
      return (
        (session.selectedNamedCard?.trim().length ?? 0) > 0 ||
        (session.namedCardQuery.trim().length > 0 &&
          this.resolutionSelectionNamedCardResults.some(
            (result) =>
              result.label === session.namedCardQuery.trim() ||
              result.name === session.namedCardQuery.trim(),
          ))
      );
    }

    if (isTargetResolutionSelectionContext(context)) {
      if (context.expectedSlottedKind === "move-to-location") {
        const fixedLocationId =
          getFixedMoveToLocationSlotId(this.interactionView?.activePrompt?.slots) ??
          getFixedMoveToLocationBoardId(this.#game.boardSnapshot(), context.sourceCardId);
        const { subjectIds, locationId } = splitMoveToLocationSessionTargets({
          selectedTargets: session.selectedTargets,
          cardSnapshotsById: this.cardSnapshotsById,
          fixedLocationId,
        });
        const resolvedSubjectIds =
          subjectIds.length > 0
            ? subjectIds
            : ((context.currentSelection.targets ?? []) as string[]);
        const totalSelectionCount = resolvedSubjectIds.length + (locationId ? 1 : 0);
        const confirmedSelectionCount = context.currentSelection.targets?.length ?? 0;
        const userSelectionCount = Math.max(
          0,
          session.selectedTargets.length - confirmedSelectionCount,
        );
        return (
          resolvedSubjectIds.length > 0 &&
          locationId !== null &&
          totalSelectionCount >= context.minSelections &&
          (context.maxSelections <= 0 || userSelectionCount <= context.maxSelections)
        );
      }

      // Block confirmation when an "up-to" amount selection has resolved to
      // a 0-damage cap (e.g. user picked an undamaged character as the
      // move-damage source). The engine would silently advance the prompt
      // with amount=0 and apply no patches — players see a "hung" prompt and
      // retry endlessly. Replay mgGuD8kTITPMhvIEL3wO5ZG turn 22 (Luisa
      // Madrigal — "I CAN TAKE IT"): the user activated the ability three
      // times in a row, each time submitting an undamaged friendly source
      // and watching nothing happen. Forcing the user to pick a damaged
      // source — or decline the optional — keeps the UX honest.
      //
      // Only gate when the player has an escape hatch (a damaged candidate
      // they could pick instead, or a Cancel/Skip option). Otherwise we
      // would deadlock a mandatory prompt where every eligible source is
      // undamaged: rules-wise an "up to N" with no available damage is a
      // valid 0-damage resolution and must remain confirmable.
      const amountSelection = this.#getResolutionAmountSelectionState(session);
      if (amountSelection && amountSelection.max === 0) {
        const canDecline =
          context.canDeclineSelection === true || context.originatesFromOptional === true;
        const hasDamagedAlternative = context.cardCandidateIds.some((candidateId) => {
          if (session.selectedTargets.includes(candidateId)) {
            return false;
          }
          const damage = this.cardSnapshotsById[candidateId]?.damage ?? 0;
          return typeof damage === "number" && Number.isFinite(damage) && damage > 0;
        });
        if (canDecline || hasDamagedAlternative) {
          return false;
        }
      }

      const slots = this.interactionView?.activePrompt?.slots;
      if (slots) {
        // When maxSelections < total slots (e.g. move-damage with from: ALL_CHARACTERS),
        // only the last `maxSelections` slots are required user selections.
        // The earlier slots may be filled as context but should not block confirmation.
        const requiredSlots =
          context.maxSelections > 0 ? slots.slice(-context.maxSelections) : slots;
        const selectionCount = requiredSlots.filter((slot) => slot.targetCardId).length;
        return selectionCount >= context.minSelections && selectionCount <= requiredSlots.length;
      }

      // Validate that all selected targets are still valid candidates
      const validSelections = session.selectedTargets.filter(
        (targetId) =>
          includesSelectionId(this.#getResolutionSelectionCardCandidateIds(context), targetId) ||
          includesSelectionId(context.playerCandidateIds, targetId),
      );
      if (
        !selectedTargetsMatchTargetDslSequence({
          context,
          selectedTargets: validSelections,
          cardSnapshotsById: this.cardSnapshotsById,
          // The DSL's `owner: "you" | "opponent"` is interpreted relative to
          // the source card's controller, not the chooser. See
          // `cardMatchesSelectionTargetDsl` JSDoc for why this matters
          // (forced-opponent banish prompts: Sid Phillips, Be King
          // Undisputed, Dinky - Has the Brains). The chooser fallback below
          // is the LAST RESORT — it only matches the controller for
          // self-targeted effects, and gives the wrong answer for forced-
          // opponent prompts. We therefore prefer (in order):
          //   1. The source card's snapshot ownerId.
          //   2. The pending/bag effect's `controllerId` field, which is
          //      the source card's controller. This fallback is critical
          //      for cards played indirectly into limbo zones the
          //      chooser's view doesn't project (e.g. Be King Undisputed
          //      played for free via Powerline's MASH-UP scry —
          //      digest-2026-05-08 reports #2/#3/#4/#9/#10/#12/#14/#15/
          //      #18/#19, gameId mggXgny0UumOSRY-6TCxg_B turn 13).
          //   3. The chooser side (legacy fallback, almost always wrong
          //      for `chosenBy: "opponent"` effects but correct for
          //      self-targeted effects where chooser === controller).
          referenceSide: this.#resolveSelectionReferenceSide(context),
        })
      ) {
        return false;
      }
      const selectionCount = validSelections.length;
      if (
        hasPlayCardEntryModeSelection(context, validSelections) &&
        typeof session.selectedEnterPlayExerted !== "boolean"
      ) {
        return false;
      }
      return (
        selectionCount >= context.minSelections &&
        (context.maxSelections <= 0 || selectionCount <= context.maxSelections)
      );
    }

    if (context.kind === "scry-selection") {
      const previewDestinations = buildScryPreviewDestinations(
        this.cardSnapshotsById,
        context,
        session.scryDestinations,
      );
      const assignedIds = new Set(previewDestinations.flatMap((destination) => destination.cards));
      if (assignedIds.size !== context.revealedCardIds.length) {
        return false;
      }

      return context.destinationRules.every((rule) => {
        const destination = previewDestinations.find((candidate) => candidate.id === rule.id);
        const count = destination?.cards.length ?? 0;
        if (count < rule.min) {
          return false;
        }

        if (rule.max !== null && count > rule.max) {
          return false;
        }

        return true;
      });
    }

    return false;
  }

  startResolutionSelectionSession = (
    move: PendingResolutionMoveEntry,
    context: ResolutionSelectionContext,
  ): boolean => {
    // Phase 1 #3: Don't open a picker on a player's view when the engine
    // assigned the choice to a different player. The auto-open path already
    // gates on this; the manual entry point ("Resolve" click in pending-effects
    // popover) used to bypass it, letting player_one open a dialog meant for
    // player_two and submit choices that the engine would silently reject.
    const localOwnerSide = this.#game.ownerSide();
    const localPlayerId = localOwnerSide ? this.#game.getOwnerIdForSide(localOwnerSide) : null;
    if (localPlayerId != null && context.chooserId !== localPlayerId) {
      return false;
    }

    // Phase 1 #1: When the engine flagged the context as `autoRejected`, no
    // legal targets exist and the engine expects an empty resolution rather
    // than a prompt. Submit immediately and skip the picker — otherwise the
    // user sees an empty dialog with a dead Confirm button.
    if (
      isTargetResolutionSelectionContext(context) &&
      context.autoRejected === true &&
      (move.moveId === "resolveEffect" || move.moveId === "resolveBag")
    ) {
      const nestedParams = { targets: [] as readonly string[] };
      const params =
        move.moveId === "resolveBag"
          ? (mergeNestedResolveBagParams(
              move.params,
              nestedParams,
            ) as LorcanaSimulatorMoveParams["resolveBag"])
          : (mergeNestedResolveEffectParams(
              move.params,
              nestedParams,
            ) as LorcanaSimulatorMoveParams["resolveEffect"]);
      this.#game.executeMove(move.moveId, params, {
        clearChallengeMode: false,
        clearSelection: false,
        status: "Auto-resolved (no legal targets)",
      });
      return true;
    }

    const promptContent = this.#buildResolutionPromptContent(move, context);
    const abilityIndex = this.#getResolutionMoveAbilityIndex(move);
    const resolutionTargetLabel = this.#resolveChoiceSelectionTargetLabel(context);
    const resolutionCopyBundle = buildResolutionCopyBundle({
      kind: context.kind,
      sourceCard: this.cardSnapshotsById[context.sourceCardId] ?? null,
      explicitReferenceLabel: promptContent.inlineReference?.label ?? null,
      abilityIndex,
      targetSelectionContext: isTargetResolutionSelectionContext(context) ? context : undefined,
      targetLabel: resolutionTargetLabel,
    });
    const sessionStatusMessage = resolutionCopyBundle.sessionStatusMessage;
    const abilityDescription = resolutionCopyBundle.abilityDescription;
    this.#actionSelectionSession = null;
    this.#resolutionSelectionSession = this.#normalizeResolutionSelectionSession(
      buildResolutionSelectionSession(
        move,
        context,
        promptContent.message,
        promptContent.inlineReference,
        abilityDescription,
        sessionStatusMessage,
      ),
    );
    this.pendingMulliganDangerConfirm = null;
    this.#secondLayerCategoryLabel = null;
    this.#game.setPendingError(null);
    this.#game.setStatusMessage(sessionStatusMessage);
    return true;
  };

  cancelResolutionSelectionSession = (): void => {
    const session = this.#resolutionSelectionSession;
    if (!session) {
      return;
    }

    const sessionKey = this.#buildAutoOpenResolutionKey(session.move, session.context);
    if (sessionKey) {
      this.#lastHandledAutoOpenResolutionKey = sessionKey;
    }
    this.#resolutionSelectionSession = null;
    this.#game.setSelectedCardId(null);
    this.#game.setPendingError(null);
    this.#game.setStatusMessage(m["sim.status.selectionCleared"]({}));
  };

  toggleResolutionTargetSelection = (targetId: string): boolean => {
    const session = this.#resolutionSelectionSession;
    if (!session || !isTargetResolutionSelectionContext(session.context)) {
      return false;
    }

    const isCandidate =
      includesSelectionId(this.#getResolutionSelectableCardIds(session.context), targetId) ||
      includesSelectionId(session.context.playerCandidateIds, targetId);
    if (!isCandidate) {
      return false;
    }

    const isSelected = includesSelectionId(session.selectedTargets, targetId);
    const isAtMaxCapacity =
      session.context.maxSelections > 0 &&
      session.selectedTargets.length >= session.context.maxSelections;

    const nextSelectedTargets = isSelected
      ? session.selectedTargets.filter(
          (selectedTargetId) => !matchesSelectionId(selectedTargetId, targetId),
        )
      : session.context.maxSelections === 1
        ? [targetId]
        : isAtMaxCapacity
          ? [...session.selectedTargets.slice(1), targetId]
          : [...session.selectedTargets, targetId];

    this.#resolutionSelectionSession = this.#normalizeResolutionSelectionSession({
      ...session,
      selectedTargets: nextSelectedTargets,
      selectedAmount: session.selectedAmount,
      selectedEnterPlayExerted: getNextEnterPlayExertedSelection({
        context: session.context,
        nextSelectedTargets,
        previousSelectedTargets: session.selectedTargets,
        previousValue: session.selectedEnterPlayExerted,
      }),
    });
    this.#game.setPendingError(null);
    if (
      shouldAutoSubmitResolutionTargetSelection(
        this.#resolutionSelectionSession,
        this.skipActionConfirmation,
        this.#getResolutionAmountSelectionState(this.#resolutionSelectionSession),
      ) &&
      this.canConfirmResolutionSelection
    ) {
      return this.confirmResolutionSelection();
    }

    return true;
  };

  assignResolutionTargetSelection = (targetId: string): boolean => {
    const session = this.#resolutionSelectionSession;
    if (!session || !isTargetResolutionSelectionContext(session.context)) {
      return false;
    }

    // Read slot machinery from the engine-derived view rather than the
    // legacy presenter. The view's `activeSlotIndex` is slot-key-aligned
    // (matches `SLOTTED_TARGET_SLOT_KEYS`); the simulator session's
    // `selectedTargets[]` is user-pick-ordered (skips auto-resolved
    // slots). We convert by subtracting `autoResolvedSlotCount`.
    const view = this.interactionView;
    const activePrompt = view?.activePrompt;

    // When the engine view is not yet available (e.g. in test stubs or before
    // the board hydrates), fall back to a local effect-type check. Supported
    // slotted effect types must use assign-not-toggle so that re-clicking the
    // same card on the board re-assigns the slot rather than deselecting it
    // (the slotted UX uses explicit clear, not double-click).
    if (!view && session.context.expectedSlottedKind !== "move-to-location") {
      const effectType = this.#getResolutionSelectionEffectType(session);
      if (effectType) {
        // Use slot-assign at position 0 (the first user-selectable slot).
        // autoResolvedFromSlots is 0 for all single-target effects; the
        // move-damage case is handled by the interactionView path above.
        const candidateIds = this.#getResolutionSelectionCardCandidateIds(session.context);
        if (!includesSelectionId(candidateIds, targetId)) {
          return false;
        }
        const nextSelectedTargets = [...session.selectedTargets];
        nextSelectedTargets[0] = targetId;
        const nextSession = this.#normalizeResolutionSelectionSession({
          ...session,
          activeTargetSlotIndex: null,
          selectedTargets: nextSelectedTargets,
          selectedAmount: session.selectedAmount,
          selectedEnterPlayExerted: getNextEnterPlayExertedSelection({
            context: session.context,
            nextSelectedTargets,
            previousSelectedTargets: session.selectedTargets,
            previousValue: session.selectedEnterPlayExerted,
          }),
        });
        this.#resolutionSelectionSession = nextSession;
        this.#game.setPendingError(null);
        if (
          shouldAutoSubmitResolutionTargetSelection(
            this.#resolutionSelectionSession,
            this.skipActionConfirmation,
            this.#getResolutionAmountSelectionState(this.#resolutionSelectionSession),
          ) &&
          this.canConfirmResolutionSelection
        ) {
          return this.confirmResolutionSelection();
        }
        return true;
      }
      return this.toggleResolutionTargetSelection(targetId);
    }

    if (
      (!activePrompt || activePrompt.activeSlotIndex === null) &&
      session.context.expectedSlottedKind !== "move-to-location"
    ) {
      return this.toggleResolutionTargetSelection(targetId);
    }

    const candidateIds = this.#getResolutionSelectableCardIds(session.context);
    if (!includesSelectionId(candidateIds, targetId)) {
      return false;
    }

    if (session.context.expectedSlottedKind === "move-to-location") {
      const card = this.cardSnapshotsById[targetId];
      if (!card) {
        return false;
      }

      const { subjectIds, locationId } = splitMoveToLocationSessionTargets({
        selectedTargets: session.selectedTargets,
        cardSnapshotsById: this.cardSnapshotsById,
        fixedLocationId:
          getFixedMoveToLocationSlotId(activePrompt?.slots) ??
          getFixedMoveToLocationBoardId(this.#game.boardSnapshot(), session.context.sourceCardId),
      });
      const fixedLocationId =
        getFixedMoveToLocationSlotId(activePrompt?.slots) ??
        getFixedMoveToLocationBoardId(this.#game.boardSnapshot(), session.context.sourceCardId);
      const boardCards = this.#game.boardSnapshot()?.cards as
        | Record<string, { cardType?: string }>
        | undefined;
      const [onlyTargetDsl] = session.context.targetDsl;
      const onlyTargetCardTypes =
        onlyTargetDsl && typeof onlyTargetDsl === "object" && "cardTypes" in onlyTargetDsl
          ? onlyTargetDsl.cardTypes
          : undefined;
      const isLocation =
        card.cardType === "location" ||
        boardCards?.[targetId]?.cardType === "location" ||
        (session.context.targetDsl.length === 1 &&
          Array.isArray(onlyTargetCardTypes) &&
          onlyTargetCardTypes.includes("location"));
      const currentSelectionTargets = session.context.currentSelection.targets ?? [];
      const baseSubjectIds =
        subjectIds.length > 0
          ? subjectIds
          : currentSelectionTargets.filter(
              (selectedTargetId) => !matchesSelectionId(selectedTargetId, targetId),
            );
      const selectionCount = subjectIds.length + (locationId && !fixedLocationId ? 1 : 0);
      const userSelectedLocationIds = locationId && !fixedLocationId ? [locationId] : [];
      const nextSelectedTargets = isLocation
        ? [...baseSubjectIds, targetId]
        : subjectIds.includes(targetId)
          ? [
              ...subjectIds.filter((selectedTargetId) => selectedTargetId !== targetId),
              ...userSelectedLocationIds,
            ]
          : session.context.maxSelections > 0 && selectionCount >= session.context.maxSelections
            ? session.selectedTargets
            : [...subjectIds, targetId, ...userSelectedLocationIds];

      const nextSession = this.#normalizeResolutionSelectionSession({
        ...session,
        activeTargetSlotIndex: isLocation ? 1 : 0,
        selectedTargets: nextSelectedTargets,
        selectedAmount: null,
        selectedEnterPlayExerted: getNextEnterPlayExertedSelection({
          context: session.context,
          nextSelectedTargets,
          previousSelectedTargets: session.selectedTargets,
          previousValue: session.selectedEnterPlayExerted,
        }),
      });
      this.#resolutionSelectionSession = nextSession;
      this.#game.setPendingError(null);
      if (
        isLocation &&
        shouldAutoSubmitResolutionTargetSelection(
          this.#resolutionSelectionSession,
          this.skipActionConfirmation,
          this.#getResolutionAmountSelectionState(this.#resolutionSelectionSession),
        ) &&
        this.canConfirmResolutionSelection
      ) {
        return this.confirmResolutionSelection();
      }
      return true;
    }

    const activeSlotIndex = activePrompt?.activeSlotIndex;
    if (activeSlotIndex === null || activeSlotIndex === undefined) {
      return false;
    }
    const promptSlots = activePrompt?.slots ?? [];

    const rawSlotIndex = promptSlots.filter(
      (slot) => !slot.autoResolved && slot.index < activeSlotIndex,
    ).length;
    const nextSelectedTargets = [...session.selectedTargets];
    nextSelectedTargets[rawSlotIndex] = targetId;
    const nextSession = this.#normalizeResolutionSelectionSession({
      ...session,
      activeTargetSlotIndex: null,
      selectedTargets: nextSelectedTargets,
      selectedAmount: session.selectedAmount,
      selectedEnterPlayExerted: getNextEnterPlayExertedSelection({
        context: session.context,
        nextSelectedTargets,
        previousSelectedTargets: session.selectedTargets,
        previousValue: session.selectedEnterPlayExerted,
      }),
    });

    this.#resolutionSelectionSession = nextSession;
    this.#game.setPendingError(null);
    if (
      shouldAutoSubmitResolutionTargetSelection(
        this.#resolutionSelectionSession,
        this.skipActionConfirmation,
        this.#getResolutionAmountSelectionState(this.#resolutionSelectionSession),
      ) &&
      this.canConfirmResolutionSelection
    ) {
      return this.confirmResolutionSelection();
    }

    return true;
  };

  selectResolutionTargetSlot = (slotIndex: number): boolean => {
    const session = this.#resolutionSelectionSession;
    if (!session || !isTargetResolutionSelectionContext(session.context)) {
      return false;
    }

    const slots = this.interactionView?.activePrompt?.slots;
    const slot = slots?.[slotIndex];
    if (!slots || !slot) {
      return false;
    }

    this.#resolutionSelectionSession = {
      ...session,
      activeTargetSlotIndex: slotIndex,
    };
    this.#game.setPendingError(null);
    return true;
  };

  updateResolutionSelectedAmount = (value: number): boolean => {
    const session = this.#resolutionSelectionSession;
    if (!session) {
      return false;
    }

    const amountSelection = this.#getResolutionAmountSelectionState(session);
    if (!amountSelection) {
      return false;
    }

    this.#resolutionSelectionSession = {
      ...session,
      selectedAmount: Math.max(
        amountSelection.min,
        Math.min(amountSelection.max, Math.floor(value)),
      ),
    };
    this.#game.setPendingError(null);
    return true;
  };

  selectResolutionChoice = (choiceIndex: number): boolean => {
    const session = this.#resolutionSelectionSession;
    if (!session || session.context.kind !== "choice-selection") {
      return false;
    }

    const option = session.context.options.find((candidate) => candidate.index === choiceIndex);
    if (!option || !option.legal) {
      return false;
    }

    this.#resolutionSelectionSession = {
      ...session,
      selectedChoiceIndex: choiceIndex,
    };
    this.#game.setPendingError(null);
    return true;
  };

  updateResolutionNamedCardQuery = (query: string): void => {
    const session = this.#resolutionSelectionSession;
    if (!session || session.context.kind !== "name-card-selection") {
      return;
    }

    this.#resolutionSelectionSession = {
      ...session,
      namedCardQuery: query,
      selectedNamedCard:
        session.selectedNamedCard &&
        (session.selectedNamedCard === query ||
          session.selectedNamedCard.toLowerCase() === query.trim().toLowerCase())
          ? session.selectedNamedCard
          : null,
    };
  };

  chooseResolutionNamedCard = (cardName: string, displayLabel: string): void => {
    const session = this.#resolutionSelectionSession;
    if (!session || session.context.kind !== "name-card-selection") {
      return;
    }

    this.#resolutionSelectionSession = {
      ...session,
      namedCardQuery: displayLabel,
      selectedNamedCard: cardName,
    };
    this.#game.setPendingError(null);
  };

  selectResolutionOptional = (value: boolean): boolean => {
    const session = this.#resolutionSelectionSession;
    if (!session || session.context.kind !== "optional-selection") {
      return false;
    }

    this.#resolutionSelectionSession = {
      ...session,
      selectedOptionalValue: value,
    };
    this.#game.setPendingError(null);
    return true;
  };

  selectResolutionEnterPlayExerted = (value: boolean): boolean => {
    const session = this.#resolutionSelectionSession;
    if (!session) {
      return false;
    }

    // Two legal entry points for this selection:
    //   1. target-selection where a Bodyguard candidate from hand is chosen
    //      (existing flow — e.g. playing a Bodyguard character normally).
    //   2. scry-selection where a Bodyguard card is assigned to a `play`
    //      destination (triage 2026-05-11 #11 — Down in New Orleans).
    const isTargetEntryMode =
      isTargetResolutionSelectionContext(session.context) &&
      hasPlayCardEntryModeSelection(session.context, session.selectedTargets);
    const isScryBodyguardEntryMode =
      session.context.kind === "scry-selection" &&
      scryAssignsEntryModeCardToPlay(
        session.context,
        session.scryDestinations,
        this.cardSnapshotsById,
      );
    if (!isTargetEntryMode && !isScryBodyguardEntryMode) {
      return false;
    }

    this.#resolutionSelectionSession = {
      ...session,
      selectedEnterPlayExerted: value,
    };
    this.#game.setPendingError(null);
    // Scry's confirm is gated on full destination assignment, not on
    // selectedEnterPlayExerted; don't auto-submit on toggle.
    if (isScryBodyguardEntryMode) {
      return true;
    }
    return this.canConfirmResolutionSelection ? this.confirmResolutionSelection() : true;
  };

  submitResolutionOptional = (value: boolean): boolean => {
    if (!this.selectResolutionOptional(value)) {
      return false;
    }

    return this.confirmResolutionSelection();
  };

  rejectActiveResolutionSelection = (): boolean => {
    const session = this.#resolutionSelectionSession;
    if (!canDeclineResolutionSelectionSession(session)) {
      return false;
    }
    const activeSession = session;
    if (!activeSession) {
      return false;
    }

    if (activeSession.move.moveId === "resolveEffect") {
      const success = this.handleRejectPendingEffect(activeSession.move);
      if (success) {
        this.#resolutionSelectionSession = null;
      }
      return success;
    }

    if (activeSession.move.moveId === "resolveBag") {
      const success = this.handleRejectBagEffect(activeSession.move);
      if (success) {
        this.#resolutionSelectionSession = null;
      }
      return success;
    }

    return false;
  };

  assignResolutionScryCard = (cardId: string, destinationId: string): boolean => {
    const session = this.#resolutionSelectionSession;
    if (!session || session.context.kind !== "scry-selection") {
      return false;
    }

    const rule = session.context.destinationRules.find(
      (candidate) => candidate.id === destinationId,
    );
    const card = getScryCardView(this.cardSnapshotsById, session.context, cardId);
    if (
      !rule ||
      !card ||
      !includesSelectionId(session.context.revealedCardIds, cardId) ||
      !canAssignCardToScryDestination(card, rule)
    ) {
      return false;
    }

    const nextDestinations = session.scryDestinations.map((destination) => ({
      ...destination,
      cards: destination.cards.filter((existingCardId) => existingCardId !== cardId),
    }));
    const targetDestination = nextDestinations.find(
      (destination) => destination.id === destinationId,
    );
    if (!targetDestination) {
      return false;
    }

    const previewDestinations = buildScryPreviewDestinations(
      this.cardSnapshotsById,
      session.context,
      nextDestinations,
    );
    const previewTarget = previewDestinations.find(
      (destination) => destination.id === destinationId,
    );
    if (rule.max !== null && (previewTarget?.cards.length ?? 0) >= rule.max) {
      return false;
    }

    targetDestination.cards = [...targetDestination.cards, cardId];
    this.#resolutionSelectionSession = {
      ...session,
      scryDestinations: nextDestinations,
    };
    this.#game.setPendingError(null);
    return true;
  };

  reorderResolutionScryCard = (
    destinationId: string,
    cardId: string,
    direction: "up" | "down",
  ): boolean => {
    const session = this.#resolutionSelectionSession;
    if (!session || session.context.kind !== "scry-selection") {
      return false;
    }

    const rule = session.context.destinationRules.find(
      (candidate) => candidate.id === destinationId,
    );
    if (!rule || !isScryDestinationManuallyOrdered(rule)) {
      return false;
    }

    const nextDestinations = buildScryPreviewDestinations(
      this.cardSnapshotsById,
      session.context,
      session.scryDestinations,
    ).map((destination) => ({
      ...destination,
      cards: [...destination.cards],
    }));
    const targetDestination = nextDestinations.find(
      (destination) => destination.id === destinationId,
    );
    if (!targetDestination) {
      return false;
    }

    const currentIndex = targetDestination.cards.indexOf(cardId);
    if (currentIndex < 0) {
      return false;
    }

    const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (nextIndex < 0 || nextIndex >= targetDestination.cards.length) {
      return false;
    }

    const [removed] = targetDestination.cards.splice(currentIndex, 1);
    targetDestination.cards.splice(nextIndex, 0, removed);
    this.#resolutionSelectionSession = {
      ...session,
      scryDestinations: nextDestinations,
    };
    return true;
  };

  confirmResolutionSelection = (): boolean => {
    const session = this.#resolutionSelectionSession;
    if (!session || !this.canConfirmResolutionSelection) {
      return false;
    }

    const amountSelection = this.#getResolutionAmountSelectionState(session);

    this.#resolutionSelectionSession = {
      ...session,
      phase: "executing",
    };

    const nestedParams =
      session.context.kind === "choice-selection"
        ? { choiceIndex: session.selectedChoiceIndex ?? undefined }
        : session.context.kind === "optional-selection"
          ? { resolveOptional: session.selectedOptionalValue ?? undefined }
          : session.context.kind === "name-card-selection"
            ? {
                namedCard:
                  session.selectedNamedCard ??
                  this.resolutionSelectionNamedCardResults.find(
                    (result) =>
                      result.label === session.namedCardQuery.trim() ||
                      result.name === session.namedCardQuery.trim(),
                  )?.name ??
                  session.namedCardQuery.trim(),
              }
            : session.context.kind === "scry-selection"
              ? {
                  destinations: buildScryPreviewDestinations(
                    this.cardSnapshotsById,
                    session.context,
                    session.scryDestinations,
                  ).map((destination) => ({
                    zone: destination.zone,
                    cards: [...destination.cards],
                  })),
                  // Forward the chooser's Bodyguard "may enter exerted" choice
                  // when any scry-assigned `play` destination contains a card
                  // with Bodyguard. The engine ignores this flag for non-
                  // Bodyguard plays, so forwarding it unconditionally is safe.
                  // See triage 2026-05-11 #11 (Down in New Orleans → Bodyguard).
                  ...(typeof session.selectedEnterPlayExerted === "boolean" &&
                  scryAssignsEntryModeCardToPlay(
                    session.context,
                    session.scryDestinations,
                    this.cardSnapshotsById,
                  )
                    ? { enterPlayExerted: session.selectedEnterPlayExerted }
                    : {}),
                }
              : {
                  ...(isTargetResolutionSelectionContext(session.context) &&
                  session.context.originatesFromOptional === true
                    ? { resolveOptional: true }
                    : {}),
                  ...(isTargetResolutionSelectionContext(session.context) &&
                  hasPlayCardEntryModeSelection(session.context, session.selectedTargets) &&
                  typeof session.selectedEnterPlayExerted === "boolean"
                    ? { enterPlayExerted: session.selectedEnterPlayExerted }
                    : {}),
                  targets: (() => {
                    const ctx = session.context;
                    const maxSel = isTargetResolutionSelectionContext(ctx) ? ctx.maxSelections : 0;
                    const slots = this.interactionView?.activePrompt?.slots ?? null;

                    // Engine opted into slotted serialization for this pending
                    // effect — convert once both slots are filled, otherwise
                    // fall through to the flat path (engine accepts both).
                    if (
                      isTargetResolutionSelectionContext(ctx) &&
                      ctx.expectedSlottedKind === "move-to-location"
                    ) {
                      const { subjectIds, locationId } = splitMoveToLocationSessionTargets({
                        selectedTargets: session.selectedTargets,
                        cardSnapshotsById: this.cardSnapshotsById,
                        fixedLocationId:
                          getFixedMoveToLocationSlotId(this.interactionView?.activePrompt?.slots) ??
                          getFixedMoveToLocationBoardId(
                            this.#game.boardSnapshot(),
                            ctx.sourceCardId,
                          ),
                      });
                      const resolvedSubjectIds =
                        subjectIds.length > 0
                          ? subjectIds
                          : ((ctx.currentSelection.targets ?? []) as string[]);
                      const totalSelectionCount = resolvedSubjectIds.length + (locationId ? 1 : 0);
                      if (
                        locationId &&
                        resolvedSubjectIds.length > 0 &&
                        totalSelectionCount >= ctx.minSelections
                      ) {
                        return {
                          kind: "move-to-location",
                          subject: resolvedSubjectIds as CardInstanceId[],
                          location: [locationId as CardInstanceId],
                        };
                      }
                    }

                    const flat =
                      slots && maxSel > 0 && session.selectedTargets.length > maxSel
                        ? session.selectedTargets.slice(-maxSel)
                        : [...session.selectedTargets];

                    if (
                      isTargetResolutionSelectionContext(ctx) &&
                      ctx.expectedSlottedKind &&
                      flat.length >= SLOTTED_TARGET_SLOT_KEYS[ctx.expectedSlottedKind].length
                    ) {
                      return buildSlottedTargetsFromSelection(ctx.expectedSlottedKind, flat);
                    }

                    return flat;
                  })(),
                  ...(amountSelection ? { amount: amountSelection.value } : {}),
                };

    const params =
      session.move.moveId === "resolveBag"
        ? (mergeNestedResolveBagParams(
            session.move.params,
            nestedParams,
          ) as LorcanaSimulatorMoveParams["resolveBag"])
        : (mergeNestedResolveEffectParams(
            session.move.params,
            nestedParams,
          ) as LorcanaSimulatorMoveParams["resolveEffect"]);

    const previousSelectedCardId = this.#game.selectedCardId();
    this.#resolutionSelectionSession = null;
    const success = this.#game.executeMove(session.move.moveId, params, {
      clearChallengeMode: false,
      clearSelection: true,
      status: "Resolved effect input",
    });

    if (!success) {
      this.#resolutionSelectionSession = { ...session, phase: "selecting" };
      this.#game.setSelectedCardId(previousSelectedCardId);
    }
    return success;
  };

  handleResolveBag = (move: PendingResolutionMoveEntry): void => {
    if (move.moveId !== "resolveBag") {
      return;
    }

    if (this.#startResolutionSelectionSessionForMove(move)) {
      return;
    }

    this.#game.executeMove(move.moveId, move.params, {
      clearChallengeMode: false,
      clearSelection: false,
      status: "Resolved bag effect",
    });
  };

  handleResolvePendingEffect = (move: PendingResolutionMoveEntry): void => {
    if (move.moveId !== "resolveEffect") {
      return;
    }

    if (this.#startResolutionSelectionSessionForMove(move)) {
      return;
    }

    this.#game.executeMove(move.moveId, move.params, {
      clearChallengeMode: false,
      clearSelection: false,
      status: "Resolved pending effect",
    });
  };

  handleAcceptPendingEffect = (move: PendingResolutionMoveEntry): void => {
    if (move.moveId !== "resolveEffect") {
      return;
    }
    this.#game.executeMove(
      move.moveId,
      mergeNestedResolveEffectParams(move.params, {
        resolveOptional: true,
      }) as LorcanaSimulatorMoveParams["resolveEffect"],
      {
        clearChallengeMode: false,
        clearSelection: false,
        status: "Accepted pending effect",
      },
    );
  };

  handleAcceptBagEffect = (move: PendingResolutionMoveEntry): void => {
    if (move.moveId !== "resolveBag") {
      return;
    }

    this.#game.executeMove(
      move.moveId,
      mergeNestedResolveBagParams(move.params, {
        resolveOptional: true,
      }) as LorcanaSimulatorMoveParams["resolveBag"],
      {
        clearChallengeMode: false,
        clearSelection: false,
        status: "Accepted bag effect",
      },
    );
  };

  handleRejectBagEffect = (move: PendingResolutionMoveEntry): boolean => {
    if (move.moveId !== "resolveBag") {
      return false;
    }

    return this.#game.executeMove(
      move.moveId,
      mergeNestedResolveBagParams(move.params, {
        resolveOptional: false,
      }) as LorcanaSimulatorMoveParams["resolveBag"],
      {
        clearChallengeMode: false,
        clearSelection: false,
        status: "Rejected bag effect",
      },
    );
  };

  handleRejectPendingEffect = (move: PendingResolutionMoveEntry): boolean => {
    if (move.moveId !== "resolveEffect") {
      return false;
    }
    return this.#game.executeMove(
      move.moveId,
      mergeNestedResolveEffectParams(move.params, {
        resolveOptional: false,
      }) as LorcanaSimulatorMoveParams["resolveEffect"],
      {
        clearChallengeMode: false,
        clearSelection: false,
        status: "Rejected pending effect",
      },
    );
  };

  armMulliganDangerConfirm(action: "keepHand" | "allCards"): boolean {
    if (this.pendingMulliganDangerConfirm !== action) {
      this.pendingMulliganDangerConfirm = action;
      return false;
    }

    this.pendingMulliganDangerConfirm = null;
    return true;
  }

  executeChooseFirstPlayer = (side: LorcanaPlayerSide): boolean => {
    if (this.pregamePhase !== "chooseFirstPlayer") {
      return false;
    }

    if (!this.canActInPregame) {
      this.#game.setPendingError(m["sim.errors.pregame.notYourTurnChooseFirst"]({}));
      this.#game.setStatusMessage(m["sim.status.actionRejected"]({}));
      return false;
    }

    const targetPlayerId = this.#game.getOwnerIdForSide(side);
    if (!targetPlayerId) {
      this.#game.setPendingError(m["sim.errors.pregame.unresolvedFirstPlayer"]({}));
      this.#game.setStatusMessage(m["sim.status.actionRejected"]({}));
      return false;
    }

    return this.#game.executeMove(
      "chooseWhoGoesFirst",
      { playerId: targetPlayerId, side },
      {
        clearSelection: true,
        status: m["sim.status.firstPlayerWillStart"]({ playerLabel: getPlayerLabel(side) }),
      },
    );
  };

  handleConfirmMulligan = (): void => {
    if (this.pregamePhase !== "mulligan") {
      return;
    }

    if (!this.canActInPregame) {
      this.#game.setPendingError(m["sim.errors.pregame.notYourTurnMulligan"]({}));
      this.#game.setStatusMessage(m["sim.status.actionRejected"]({}));
      return;
    }

    const playerId = this.ownerSide ? this.#game.getOwnerIdForSide(this.ownerSide) : null;
    if (!playerId) {
      this.#game.setPendingError(m["sim.errors.pregame.notYourTurnMulligan"]({}));
      this.#game.setStatusMessage(m["sim.status.actionRejected"]({}));
      return;
    }

    const cardsToMulligan = [...this.selectedMulliganCardIds];
    const success = this.#game.executeMove(
      "alterHand",
      { playerId, cardsToMulligan },
      {
        clearSelection: true,
        status: m["sim.status.mulliganSubmitted"]({ count: cardsToMulligan.length }),
      },
    );

    if (success) {
      this.pendingMulliganDangerConfirm = null;
      this.#game.setSelectedMulliganCardIds([]);
    }
  };

  handleKeepHand = (): void => {
    if (this.pregamePhase !== "mulligan") {
      return;
    }
    if (!this.canActInPregame) {
      this.#game.setPendingError(m["sim.errors.pregame.notYourTurnMulligan"]({}));
      this.#game.setStatusMessage(m["sim.status.actionRejected"]({}));
      return;
    }
    if (!this.armMulliganDangerConfirm("keepHand")) {
      return;
    }

    const playerId = this.ownerSide ? this.#game.getOwnerIdForSide(this.ownerSide) : null;
    if (!playerId) {
      this.#game.setPendingError(m["sim.errors.pregame.notYourTurnMulligan"]({}));
      this.#game.setStatusMessage(m["sim.status.actionRejected"]({}));
      return;
    }

    const success = this.#game.executeMove(
      "alterHand",
      { playerId, cardsToMulligan: [] },
      {
        clearSelection: true,
        status: m["sim.status.keepHand"]({}),
      },
    );

    if (success) {
      this.pendingMulliganDangerConfirm = null;
      this.#game.setSelectedMulliganCardIds([]);
    }
  };

  handleMulliganAllCards = (): void => {
    if (this.pregamePhase !== "mulligan") {
      return;
    }
    if (!this.canActInPregame) {
      this.#game.setPendingError(m["sim.errors.pregame.notYourTurnMulligan"]({}));
      this.#game.setStatusMessage(m["sim.status.actionRejected"]({}));
      return;
    }
    if (!this.boardSnapshot || !this.ownerSide) {
      return;
    }
    if (!this.armMulliganDangerConfirm("allCards")) {
      return;
    }

    const cardsToMulligan = getCardsForZone(
      this.cardSnapshotsById,
      this.boardSnapshot,
      this.ownerSide,
      "hand",
    ).map((card) => card.cardId);
    const playerId = this.#game.getOwnerIdForSide(this.ownerSide);
    if (!playerId) {
      this.#game.setPendingError(m["sim.errors.pregame.notYourTurnMulligan"]({}));
      this.#game.setStatusMessage(m["sim.status.actionRejected"]({}));
      return;
    }
    const success = this.#game.executeMove(
      "alterHand",
      { playerId, cardsToMulligan },
      {
        clearSelection: true,
        status: m["sim.status.mulliganSubmitted"]({ count: cardsToMulligan.length }),
      },
    );

    if (success) {
      this.pendingMulliganDangerConfirm = null;
      this.#game.setSelectedMulliganCardIds([]);
    }
  };

  clearMulliganSelectionIfInvalid = (): void => {
    if (this.#mulliganSelectionActive) {
      const hasMulligan = this.moveCategorySummaries.some((s) => s.categoryId === "alter-hand");
      if (!hasMulligan) {
        this.#mulliganSelectionActive = false;
      }
    }
  };

  startActionSelectionSession = (
    categoryId: ExecutableMovePresentationCategoryId,
    moves: readonly ExecutableMoveEntry[],
  ): boolean => {
    if (!isActionSelectionCategoryId(categoryId)) {
      return false;
    }

    const session = buildActionSelectionSession(categoryId, moves, !this.skipActionConfirmation);
    if (!session) {
      return false;
    }

    this.#setActionSelectionSession(session);
    this.pendingMulliganDangerConfirm = null;
    this.#secondLayerCategoryLabel = null;
    this.#game.setPendingError(null);
    this.#game.setStatusMessage(getChooseSourceStatusMessage(categoryId));
    return true;
  };

  startManualCardActionSelection = (
    categoryId: ExecutableMovePresentationCategoryId,
    moves: readonly ExecutableMoveEntry[],
  ): boolean => this.startActionSelectionSession(categoryId, moves);

  cancelActionSelectionSession = (): void => {
    if (this.#mulliganSelectionActive) {
      this.#mulliganSelectionActive = false;
      this.#game.setSelectedMulliganCardIds([]);
      this.#game.setStatusMessage(m["sim.status.selectionCleared"]({}));
      return;
    }

    if (this.#resolutionSelectionSession) {
      this.cancelResolutionSelectionSession();
      return;
    }

    if (!this.#actionSelectionSession) {
      return;
    }

    this.#clearActionSelectionSession(m["sim.status.selectionCleared"]({}));
  };

  cancelManualCardActionSelection = (): void => {
    this.cancelActionSelectionSession();
  };

  isCardSelectableForActionSession = (card: LorcanaCardSnapshot | null | undefined): boolean => {
    if (!card) {
      return false;
    }

    return this.selectableActionSessionCardIds.includes(card.cardId);
  };

  isCardSelectableForManualAction = (card: LorcanaCardSnapshot | null | undefined): boolean =>
    this.isCardSelectableForActionSession(card);

  handleActionSessionCardSelection = (card: LorcanaCardSnapshot | null | undefined): boolean => {
    if (
      card &&
      this.#resolutionSelectionSession &&
      isTargetResolutionSelectionContext(this.#resolutionSelectionSession.context)
    ) {
      return this.assignResolutionTargetSelection(card.cardId);
    }

    const session = this.#actionSelectionSession;
    if (!card || !session) {
      return false;
    }

    if (session.phase === "choose-source") {
      const sourceMoves = getSourceMovesForActionSelectionSession(session, card.cardId);
      if (sourceMoves.length === 0) {
        return false;
      }

      const sourceMovePreviewSession = {
        ...session,
        sourceCardId: card.cardId,
        targetCardId: null,
        selectedCardIds: [],
        selectedCosts: {},
        selectedMoveId: sourceMoves.length === 1 ? (sourceMoves[0]?.id ?? null) : null,
      } satisfies ActionSelectionSession;

      if (
        sourceMoves.length === 1 &&
        getPostCostActionSelectionPhase(sourceMovePreviewSession, sourceMoves[0]!) === "choose-cost"
      ) {
        const selectableCost =
          getCurrentSelectableCostForActionSelectionSession(sourceMovePreviewSession);
        if (!selectableCost) {
          return false;
        }

        this.#setActionSelectionSession({
          ...sourceMovePreviewSession,
          phase: "choose-cost",
        });
        this.#game.setPendingError(null);
        this.#game.setStatusMessage(getChooseCostStatusMessage(card.label, selectableCost));
        return true;
      }

      if (
        getMoveSelectableCosts(sourceMoves[0]).length > 0 &&
        usesTargetSelectionForActionSelectionMoves(session.categoryId, sourceMoves)
      ) {
        const selectableCost = getMoveSelectableCosts(sourceMoves[0])[0];
        if (!selectableCost) {
          return false;
        }

        this.#setActionSelectionSession({
          ...session,
          sourceCardId: card.cardId,
          targetCardId: null,
          selectedCardIds: [],
          selectedCosts: {},
          selectedMoveId: null,
          phase: "choose-cost",
        });
        this.#game.setPendingError(null);
        this.#game.setStatusMessage(getChooseCostStatusMessage(card.label, selectableCost));
        return true;
      }

      if (usesTargetSelectionForActionSelectionMoves(session.categoryId, sourceMoves)) {
        this.#setActionSelectionSession({
          ...session,
          sourceCardId: card.cardId,
          targetCardId: null,
          selectedCardIds: [],
          selectedCosts: {},
          selectedMoveId: null,
          phase: "choose-target",
        });
        this.#game.setPendingError(null);
        this.#game.setStatusMessage(getChooseTargetStatusMessage(session.categoryId, card.label));
        return true;
      }

      if (session.categoryId === "activate-ability") {
        const move = sourceMoves[0];
        const nextSession = {
          ...session,
          label: move?.label ?? session.label,
          sourceCardId: card.cardId,
          targetCardId: null,
          selectedCardIds: [],
          selectedCosts: {},
          selectedMoveId: sourceMoves.length === 1 ? (move?.id ?? null) : null,
          phase:
            sourceMoves.length === 1
              ? getPostCostActionSelectionPhase(sourceMovePreviewSession, move!)
              : "choose-option",
        } satisfies ActionSelectionSession;

        this.#game.setPendingError(null);
        if (sourceMoves.length > 1) {
          this.#setActionSelectionSession(nextSession);
          this.#game.setStatusMessage(getChooseOptionStatusMessage(session, card.label));
          return true;
        }

        if (!move) {
          return false;
        }

        if (nextSession.phase === "choose-cost") {
          this.#setActionSelectionSession(nextSession);
          this.#game.setStatusMessage(
            getChooseCostStatusMessage(
              card.label,
              getCurrentSelectableCostForActionSelectionSession(nextSession) ??
                getMoveSelectableCosts(move)[0]!,
            ),
          );
          return true;
        }

        if (session.confirmationRequired) {
          this.#setActionSelectionSession(nextSession);
          this.#game.setStatusMessage(m["sim.guidance.session.confirm"]({ label: move.label }));
          return true;
        }

        return this.#executeActionSelectionMove(nextSession, move);
      }

      if (
        (session.categoryId === "play-card" ||
          session.categoryId === "shift-card" ||
          session.categoryId === "sing-card") &&
        sourceMoves.length > 1
      ) {
        this.#setActionSelectionSession({
          ...session,
          sourceCardId: card.cardId,
          targetCardId: null,
          selectedCardIds: [],
          selectedMoveId: null,
          phase: "choose-option",
        });
        this.#game.setPendingError(null);
        this.#game.setStatusMessage(getChooseOptionStatusMessage(session, card.label));
        return true;
      }

      const move = sourceMoves[0];
      const singTogetherMetadata = getSingTogetherSelectionMetadata(move);
      if (singTogetherMetadata) {
        this.#setActionSelectionSession({
          ...session,
          sourceCardId: card.cardId,
          targetCardId: null,
          selectedCardIds: [],
          selectedMoveId: move.id,
          phase: "choose-target",
        });
        this.#game.setPendingError(null);
        this.#game.setStatusMessage(
          getChooseSingTogetherStatusMessage(card.label, 0, singTogetherMetadata.requiredValue),
        );
        return true;
      }

      const nextSession = {
        ...session,
        sourceCardId: card.cardId,
        targetCardId: null,
        selectedCardIds: [],
        selectedCosts: {},
        selectedMoveId: move.id,
        phase: getPostCostActionSelectionPhase(
          {
            ...session,
            sourceCardId: card.cardId,
            targetCardId: null,
            selectedCardIds: [],
            selectedCosts: {},
            selectedMoveId: move.id,
          },
          move,
        ),
      } satisfies ActionSelectionSession;

      this.#game.setPendingError(null);
      if (nextSession.phase === "choose-cost") {
        this.#setActionSelectionSession(nextSession);
        this.#game.setStatusMessage(
          getChooseCostStatusMessage(
            card.label,
            getCurrentSelectableCostForActionSelectionSession(nextSession) ??
              getMoveSelectableCosts(move)[0]!,
          ),
        );
        return true;
      }

      if (session.confirmationRequired) {
        this.#setActionSelectionSession(nextSession);
        this.#game.setStatusMessage(m["sim.guidance.session.confirm"]({ label: move.label }));
        return true;
      }

      return this.#executeActionSelectionMove(nextSession, move);
    }

    if (session.phase === "choose-cost") {
      const referenceMove = getReferenceMoveForActionSelectionSession(session);
      const selectableCost = getCurrentSelectableCostForActionSelectionSession(session);
      if (!referenceMove || !selectableCost) {
        return false;
      }

      if (!includesSelectionId(selectableCost.candidateCardIds, card.cardId)) {
        this.#game.setPendingError(getInvalidCostSelectionReason(selectableCost));
        return false;
      }

      const selectedCostIds = getSelectedCostCardIds(session, selectableCost.kind);
      const nextSelectedCostIds = selectedCostIds.includes(card.cardId)
        ? selectedCostIds.filter((selectedCardId) => selectedCardId !== card.cardId)
        : selectedCostIds.length >= selectableCost.count
          ? [...selectedCostIds.slice(1), card.cardId]
          : [...selectedCostIds, card.cardId];
      const nextSession = {
        ...session,
        selectedCosts: {
          ...session.selectedCosts,
          [selectableCost.kind]: nextSelectedCostIds,
        },
      } satisfies ActionSelectionSession;
      const nextPhase = getPostCostActionSelectionPhase(nextSession, referenceMove);
      const sourceLabel =
        this.cardSnapshotsById[nextSession.sourceCardId ?? ""]?.label ?? m["sim.card.unknown"]({});

      this.#setActionSelectionSession({
        ...nextSession,
        phase: nextPhase,
      });
      this.#game.setPendingError(null);

      if (nextPhase === "choose-cost") {
        const nextSelectableCost = getCurrentSelectableCostForActionSelectionSession(nextSession);
        if (!nextSelectableCost) {
          return false;
        }

        this.#game.setStatusMessage(getChooseCostStatusMessage(sourceLabel, nextSelectableCost));
        return true;
      }

      if (nextPhase === "choose-target") {
        this.#game.setStatusMessage(getChooseTargetStatusMessage(session.categoryId, sourceLabel));
        return true;
      }

      if (nextPhase === "confirm") {
        this.#game.setStatusMessage(
          m["sim.guidance.session.confirm"]({ label: referenceMove.label }),
        );
        return true;
      }

      return this.#executeActionSelectionMove(
        {
          ...nextSession,
          phase: "executing",
        },
        referenceMove,
      );
    }

    if (session.phase === "choose-target" && session.sourceCardId) {
      if (isSingTogetherSelectionSession(session)) {
        const singTogetherMove = getSingTogetherSelectionMove(session);
        const singTogetherMetadata = getSingTogetherSelectionMetadata(singTogetherMove);
        if (
          !singTogetherMetadata ||
          !singTogetherMetadata.candidateCards.some((candidate) => candidate.cardId === card.cardId)
        ) {
          this.#game.setPendingError(
            this.getActionSessionCardReason(card.cardId) ??
              "This character can't sing this song right now.",
          );
          return false;
        }

        const nextSelectedCardIds = session.selectedCardIds.includes(card.cardId)
          ? session.selectedCardIds.filter((selectedCardId) => selectedCardId !== card.cardId)
          : [...session.selectedCardIds, card.cardId];
        const nextSession = {
          ...session,
          targetCardId: null,
          selectedCardIds: nextSelectedCardIds,
        } satisfies ActionSelectionSession;

        this.#setActionSelectionSession(nextSession);
        this.#game.setPendingError(null);
        this.#game.setStatusMessage(
          getChooseSingTogetherStatusMessage(
            this.cardSnapshotsById[session.sourceCardId]?.label ?? m["sim.card.unknown"]({}),
            getSingTogetherSelectionTotal(nextSession, singTogetherMove),
            singTogetherMetadata.requiredValue,
          ),
        );
        return true;
      }

      const targetMoves = session.candidateMoves.filter(
        (candidateMove) =>
          getSourceCardIdForActionSelectionMove(session.categoryId, candidateMove) ===
            session.sourceCardId &&
          getTargetCardIdForActionSelectionMove(session.categoryId, candidateMove) === card.cardId,
      );
      const move = targetMoves[0];

      if (!move) {
        this.#game.setPendingError(
          this.getActionSessionCardReason(card.cardId) ?? "This card is not a valid target.",
        );
        return false;
      }

      if (targetMoves.length > 1) {
        const nextSession = {
          ...session,
          targetCardId: card.cardId,
          selectedCardIds: [],
          selectedMoveId: null,
          phase: "choose-option",
        } satisfies ActionSelectionSession;

        this.#setActionSelectionSession(nextSession);
        this.#game.setPendingError(null);
        this.#game.setStatusMessage(
          getChooseOptionStatusMessage(
            session,
            this.cardSnapshotsById[session.sourceCardId]?.label ?? m["sim.card.unknown"]({}),
          ),
        );
        return true;
      }

      const nextSession = {
        ...session,
        targetCardId: card.cardId,
        selectedCardIds: [],
        selectedMoveId: move.id,
        phase: session.confirmationRequired ? "confirm" : "executing",
      } satisfies ActionSelectionSession;

      this.#game.setPendingError(null);
      if (session.confirmationRequired) {
        this.#setActionSelectionSession(nextSession);
        this.#game.setStatusMessage(m["sim.guidance.session.confirm"]({ label: move.label }));
        return true;
      }

      return this.#executeActionSelectionMove(nextSession, move);
    }

    return false;
  };

  handleManualCardActionSelection = (card: LorcanaCardSnapshot | null | undefined): boolean =>
    this.handleActionSessionCardSelection(card);

  handleAvailableMovesSelectionCard = (cardId: string): boolean => {
    if (this.#mulliganSelectionActive) {
      const current = this.selectedMulliganCardIds;
      const next = current.includes(cardId)
        ? current.filter((id) => id !== cardId)
        : [...current, cardId];
      this.#game.setSelectedMulliganCardIds(next);
      return true;
    }

    if (
      this.#resolutionSelectionSession &&
      isTargetResolutionSelectionContext(this.#resolutionSelectionSession.context)
    ) {
      return this.assignResolutionTargetSelection(cardId);
    }

    return this.handleActionSessionCardSelection(this.cardSnapshotsById[cardId] ?? null);
  };

  handleAvailableMovesSelectionPlayer = (playerId: string): boolean => {
    if (!this.#resolutionSelectionSession) {
      return false;
    }

    return this.toggleResolutionTargetSelection(playerId);
  };

  handleAvailableMovesSelectionOption = (moveId: string): boolean =>
    this.#resolutionSelectionSession
      ? this.#resolutionSelectionSession.context.kind === "choice-selection"
        ? this.selectResolutionChoice(Number(moveId))
        : this.#resolutionSelectionSession.context.kind === "optional-selection"
          ? this.submitResolutionOptional(moveId === "accept")
          : moveId === "reject" &&
              canDeclineResolutionSelectionSession(this.#resolutionSelectionSession)
            ? this.rejectActiveResolutionSelection()
            : false
      : this.selectActionSelectionOption(moveId);

  handleAvailableMovesNamedCardQueryInput = (query: string): void => {
    this.updateResolutionNamedCardQuery(query);
  };

  handleAvailableMovesNamedCardSelection = (cardName: string): boolean => {
    const result = this.resolutionSelectionNamedCardResults.find(
      (candidate) => candidate.name === cardName,
    );
    if (!result) {
      return false;
    }

    this.chooseResolutionNamedCard(result.name, result.label);
    return true;
  };

  handleAvailableMovesScryAssignment = (cardId: string, destinationId: string): boolean =>
    this.assignResolutionScryCard(cardId, destinationId);

  handleAvailableMovesScryReorder = (
    destinationId: string,
    cardId: string,
    direction: "up" | "down",
  ): boolean => this.reorderResolutionScryCard(destinationId, cardId, direction);

  selectActionSelectionOption = (moveId: string): boolean => {
    const session = this.#actionSelectionSession;
    if (!session || session.phase !== "choose-option") {
      return false;
    }

    const move = session.candidateMoves.find((candidateMove) => candidateMove.id === moveId);
    if (!move) {
      return false;
    }

    const singTogetherMetadata = getSingTogetherSelectionMetadata(move);
    if (singTogetherMetadata) {
      this.#setActionSelectionSession({
        ...session,
        selectedCardIds: [],
        selectedMoveId: move.id,
        targetCardId: null,
        phase: "choose-target",
      });
      this.#game.setPendingError(null);
      this.#game.setStatusMessage(
        getChooseSingTogetherStatusMessage(
          this.cardSnapshotsById[session.sourceCardId ?? ""]?.label ?? m["sim.card.unknown"]({}),
          0,
          singTogetherMetadata.requiredValue,
        ),
      );
      return true;
    }

    const nextSession = {
      ...session,
      label: session.categoryId === "activate-ability" ? move.label : session.label,
      selectedCardIds: [],
      selectedCosts: {},
      selectedMoveId: move.id,
      phase: getPostCostActionSelectionPhase(
        {
          ...session,
          selectedCardIds: [],
          selectedCosts: {},
          selectedMoveId: move.id,
        },
        move,
      ),
    } satisfies ActionSelectionSession;

    this.#game.setPendingError(null);
    if (nextSession.phase === "choose-cost") {
      this.#setActionSelectionSession(nextSession);
      this.#game.setStatusMessage(
        getChooseCostStatusMessage(
          this.cardSnapshotsById[session.sourceCardId ?? ""]?.label ?? m["sim.card.unknown"]({}),
          getCurrentSelectableCostForActionSelectionSession(nextSession) ??
            getMoveSelectableCosts(move)[0]!,
        ),
      );
      return true;
    }

    if (session.confirmationRequired) {
      this.#setActionSelectionSession(nextSession);
      this.#game.setStatusMessage(m["sim.guidance.session.confirm"]({ label: move.label }));
      return true;
    }

    return this.#executeActionSelectionMove(nextSession, move);
  };

  backActionSelectionSession = (): void => {
    if (this.#resolutionSelectionSession) {
      this.cancelResolutionSelectionSession();
      return;
    }

    const session = this.#actionSelectionSession;
    if (!session) {
      return;
    }

    if (session.phase === "choose-target") {
      const referenceMove = getReferenceMoveForActionSelectionSession(session);
      if (referenceMove && getMoveSelectableCosts(referenceMove).length > 0) {
        this.#setActionSelectionSession({
          ...session,
          phase: "choose-cost",
          targetCardId: null,
          selectedCardIds: [],
          selectedMoveId: session.categoryId === "activate-ability" ? session.selectedMoveId : null,
        });
        this.#game.setStatusMessage(
          getChooseCostStatusMessage(
            this.cardSnapshotsById[session.sourceCardId ?? ""]?.label ?? m["sim.card.unknown"]({}),
            getCurrentSelectableCostForActionSelectionSession(session) ??
              getMoveSelectableCosts(referenceMove)[0]!,
          ),
        );
        return;
      }

      if (isSingTogetherSelectionSession(session)) {
        if (
          session.sourceCardId &&
          session.candidateMoves.filter(
            (move) =>
              getSourceCardIdForActionSelectionMove(session.categoryId, move) ===
              session.sourceCardId,
          ).length > 1
        ) {
          this.#setActionSelectionSession({
            ...session,
            phase: "choose-option",
            targetCardId: null,
            selectedCardIds: [],
            selectedMoveId: null,
          });
          this.#game.setStatusMessage(
            getChooseOptionStatusMessage(
              session,
              this.cardSnapshotsById[session.sourceCardId]?.label ?? m["sim.card.unknown"]({}),
            ),
          );
          return;
        }

        this.#setActionSelectionSession({
          ...session,
          phase: "choose-source",
          sourceCardId: null,
          targetCardId: null,
          selectedCardIds: [],
          selectedMoveId: null,
        });
        this.#game.setStatusMessage(getChooseSourceStatusMessage(session.categoryId));
        return;
      }

      this.#setActionSelectionSession({
        ...session,
        phase: "choose-source",
        sourceCardId: null,
        targetCardId: null,
        selectedCardIds: [],
        selectedMoveId: null,
      });
      this.#game.setStatusMessage(getChooseSourceStatusMessage(session.categoryId));
      return;
    }

    if (session.phase === "choose-option") {
      if (session.categoryId === "activate-ability") {
        this.#setActionSelectionSession({
          ...session,
          phase: "choose-source",
          sourceCardId: null,
          selectedCardIds: [],
          selectedCosts: {},
          selectedMoveId: null,
        });
        this.#game.setStatusMessage(getChooseSourceStatusMessage(session.categoryId));
        return;
      }

      this.#setActionSelectionSession({
        ...session,
        phase: "choose-source",
        sourceCardId: null,
        targetCardId: null,
        selectedCardIds: [],
        selectedCosts: {},
        selectedMoveId: null,
      });
      this.#game.setStatusMessage(m["sim.guidance.session.choosePlaySource"]({}));
      return;
    }

    if (session.phase === "choose-cost") {
      if (session.selectedMoveId) {
        const sourceMoveCount = session.sourceCardId
          ? getSourceMovesForActionSelectionSession(session, session.sourceCardId).length
          : 0;

        if (sourceMoveCount > 1) {
          this.#setActionSelectionSession({
            ...session,
            phase: "choose-option",
            selectedCardIds: [],
            selectedCosts: {},
            selectedMoveId: null,
          });
          this.#game.setStatusMessage(
            getChooseOptionStatusMessage(
              session,
              this.cardSnapshotsById[session.sourceCardId ?? ""]?.label ??
                m["sim.card.unknown"]({}),
            ),
          );
          return;
        }
      }

      this.#setActionSelectionSession({
        ...session,
        phase: "choose-source",
        sourceCardId: null,
        targetCardId: null,
        selectedCardIds: [],
        selectedCosts: {},
        selectedMoveId: null,
      });
      this.#game.setStatusMessage(getChooseSourceStatusMessage(session.categoryId));
      return;
    }

    if (session.phase === "confirm") {
      const currentMove = getCurrentMoveForActionSelectionSession(session);
      if (
        session.sourceCardId &&
        usesTargetSelectionForActionSelectionMoves(
          session.categoryId,
          getSourceMovesForActionSelectionSession(session, session.sourceCardId),
        )
      ) {
        this.#setActionSelectionSession({
          ...session,
          phase: "choose-target",
          targetCardId: null,
          selectedCardIds: [],
          selectedCosts: session.selectedCosts,
          selectedMoveId: null,
        });
        this.#game.setStatusMessage(
          getChooseTargetStatusMessage(
            session.categoryId,
            this.cardSnapshotsById[session.sourceCardId]?.label ?? m["sim.card.unknown"]({}),
          ),
        );
        return;
      }

      if (currentMove && getMoveSelectableCosts(currentMove).length > 0) {
        this.#setActionSelectionSession({
          ...session,
          phase: "choose-cost",
        });
        this.#game.setStatusMessage(
          getChooseCostStatusMessage(
            this.cardSnapshotsById[session.sourceCardId ?? ""]?.label ?? m["sim.card.unknown"]({}),
            getCurrentSelectableCostForActionSelectionSession(session) ??
              getMoveSelectableCosts(currentMove)[0]!,
          ),
        );
        return;
      }

      if (
        (session.categoryId === "play-card" ||
          session.categoryId === "shift-card" ||
          session.categoryId === "sing-card") &&
        session.sourceCardId &&
        session.candidateMoves.filter(
          (move) =>
            getSourceCardIdForActionSelectionMove(session.categoryId, move) ===
            session.sourceCardId,
        ).length > 1
      ) {
        this.#setActionSelectionSession({
          ...session,
          phase: "choose-option",
          selectedCardIds: [],
          selectedCosts: {},
          selectedMoveId: null,
        });
        this.#game.setStatusMessage(
          getChooseOptionStatusMessage(
            session,
            this.cardSnapshotsById[session.sourceCardId]?.label ?? m["sim.card.unknown"]({}),
          ),
        );
        return;
      }

      if (session.categoryId === "activate-ability") {
        const sourceCardLabel =
          this.cardSnapshotsById[session.sourceCardId ?? ""]?.label ?? m["sim.card.unknown"]({});
        this.#setActionSelectionSession({
          ...session,
          phase: "choose-option",
          selectedCardIds: [],
          selectedCosts: {},
          selectedMoveId: null,
        });
        this.#game.setStatusMessage(getChooseOptionStatusMessage(session, sourceCardLabel));
        return;
      }

      this.#setActionSelectionSession({
        ...session,
        phase: "choose-source",
        sourceCardId: null,
        targetCardId: null,
        selectedCardIds: [],
        selectedCosts: {},
        selectedMoveId: null,
      });
      this.#game.setStatusMessage(getChooseSourceStatusMessage(session.categoryId));
    }
  };

  confirmActionSelection = (): boolean => {
    if (this.#mulliganSelectionActive) {
      this.#mulliganSelectionActive = false;
      this.handleConfirmMulligan();
      return true;
    }

    if (this.#resolutionSelectionSession) {
      return this.confirmResolutionSelection();
    }

    const session = this.#actionSelectionSession;
    const move = this.currentActionSelectionMove;
    if (!session || !move) {
      return false;
    }

    if (session.phase === "choose-target" && isSingTogetherSelectionSession(session)) {
      return canConfirmSingTogetherSelection(session)
        ? this.#executeActionSelectionMove(session, move)
        : false;
    }

    return this.#executeActionSelectionMove(session, move);
  };

  confirmManualCardActionSelection = (): boolean => this.confirmActionSelection();

  handleAvailableMoveClick = (move: ExecutableMoveEntry): void => {
    if (move.moveId === "alterHand") {
      this.#mulliganSelectionActive = true;
      this.#setActionSelectionSession(null);
      this.#game.setSelectedMulliganCardIds([]);
      this.#game.setPendingError(null);
      this.#game.setStatusMessage(m["sim.guidance.pregame.mulligan"]({}));
      return;
    }

    const selectableCosts = getMoveSelectableCosts(move);
    if (selectableCosts.length > 0 && isActionSelectionCategoryId(move.presentation.categoryId)) {
      const sourceCardId = getCardActionSourceCardId(move);
      const session: ActionSelectionSession = {
        categoryId: move.presentation.categoryId,
        label: move.presentation.categoryLabel ?? getMoveCategoryLabel(move.moveId),
        phase: "choose-cost",
        candidateMoves: [move],
        sourceCardId,
        targetCardId: null,
        selectedCardIds: [],
        selectedCosts: {},
        selectedMoveId: move.id,
        confirmationRequired: false,
      };
      this.#game.setPendingError(null);
      this.#setActionSelectionSession(session);
      this.#game.setStatusMessage(
        getChooseCostStatusMessage(
          this.cardSnapshotsById[sourceCardId ?? ""]?.label ?? m["sim.card.unknown"]({}),
          selectableCosts[0]!,
        ),
      );
      return;
    }

    this.#setActionSelectionSession(null);
    this.#capturePendingResolutionSourceHint(move);
    const success = this.#game.executeMove(move.moveId, move.params ?? {}, {
      clearChallengeMode: true,
      clearSelection: true,
      status: move.label,
    });
    if (!success) {
      this.#pendingResolutionSourceHint = null;
    }
  };

  handleOpenPlayerSettings = (): void => {
    this.isPlayerSettingsOpen = true;
    this.#game.setPendingError(null);
  };

  get hasPendingEffects(): boolean {
    return this.pendingEffectsPopoverItems.length > 0;
  }

  get canAdvancePendingEffects(): boolean {
    return this.pendingEffectsPopoverItems.some(
      (item) =>
        item.isLocalPlayer !== false &&
        Boolean(item.onPrimaryAction || (item.canResolve && item.onResolve)),
    );
  }

  handleAdvancePendingEffects = (): boolean => {
    const nextActionableItem =
      this.pendingEffectsPopoverItems.find(
        (item) => item.isLocalPlayer !== false && item.onPrimaryAction,
      ) ??
      this.pendingEffectsPopoverItems.find(
        (item) => item.isLocalPlayer !== false && item.canResolve && item.onResolve,
      ) ??
      null;

    if (!nextActionableItem) {
      return false;
    }

    if (nextActionableItem.onPrimaryAction) {
      nextActionableItem.onPrimaryAction();
      return true;
    }

    nextActionableItem.onResolve?.();
    return true;
  };

  get canConcede(): boolean {
    return this.moveCategorySummaries.some((summary) => summary.categoryId === "concede");
  }

  handleMobileConcede = (): boolean => {
    const concedeMove = this.expandCategoryMoves("concede")[0] ?? null;
    if (!concedeMove) {
      this.#game.setStatusMessage(m["sim.status.actionRejected"]({}));
      return false;
    }

    this.#setActionSelectionSession(null);
    this.#game.setPendingError(null);

    return this.#game.executeMove(concedeMove.moveId, concedeMove.params ?? {}, {
      clearChallengeMode: true,
      clearSelection: true,
      status: concedeMove.label,
    });
  };

  handleMobileReportPlayer = (): void => {
    const message = "Player reporting is not available yet.";
    this.mobileNotice = {
      id: ++this.#mobileNoticeId,
      message,
      tone: "info",
    };
    this.#game.setPendingError(null);
    this.#game.setStatusMessage(message);
  };

  formatRawMoveError(error: SimulatorMoveError): string {
    return JSON.stringify(
      {
        code: error.code ?? null,
        moveId: error.moveId,
        params: error.params ?? {},
        reason: error.rawReason ?? null,
      },
      null,
      2,
    );
  }

  handleLocaleSelection = (nextLocale: SupportedLocale): void => {
    const prev = this.selectedLocale;
    this.#settings.handleLocaleSelection(nextLocale);
    if (this.selectedLocale !== prev) {
      this.#game.setStatusMessage(
        m["sim.status.languageChanged"]({ localeLabel: getLocaleLabel(nextLocale) }),
      );
      this.#game.handleLocaleChanged();
    }
  };

  handleRawLogRegistryToggle = (enabled: boolean): void => {
    this.showRawLogRegistryJson = enabled;
    localStorage.setItem(RAW_LOG_REGISTRY_STORAGE_KEY, enabled ? "true" : "false");
  };

  handleSkipActionConfirmationToggle = (enabled: boolean): void => {
    void enabled;
  };

  handleHotkeyModeChange = (mode: HotkeyMode): void => {
    this.#settings.handleHotkeyModeChange(mode);
    this.#game.setStatusMessage(
      mode === "on"
        ? m["sim.settings.hotkeysModeOn"]({})
        : mode === "confirm-only"
          ? m["sim.settings.hotkeysModeConfirmOnly"]({})
          : m["sim.settings.hotkeysModeOff"]({}),
    );
  };

  handleCardPreviewModeChange = (mode: CardPreviewMode): void => {
    this.#settings.handleCardPreviewModeChange(mode);
  };

  handleCardInfoModeChange = (mode: CardInfoMode): void => {
    this.#settings.handleCardInfoModeChange(mode);
  };

  handlePrimaryClickActionChange = (action: PrimaryClickAction): void => {
    this.#settings.handlePrimaryClickActionChange(action);
  };

  handleAnimationSpeedChange = (speed: AnimationSpeed): void => {
    this.#settings.handleAnimationSpeedChange(speed);
    this.#game.setAnimationSpeed(speed);
  };

  handleSoundVolumeChange = (volume: number): void => {
    this.#settings.handleSoundVolumeChange(volume);
    this.#game.setSoundVolume(this.soundVolume);
  };

  handleAccessibleMobileControlsToggle = (enabled: boolean): void => {
    this.#settings.handleAccessibleMobileControlsToggle(enabled);
  };

  handleShowZoneCountersToggle = (enabled: boolean): void => {
    this.#settings.handleShowZoneCountersToggle(enabled);
    this.#game.setShowZoneCounters(enabled);
  };

  handleGuidancePositionToggle = (): void => {
    this.guidancePosition = this.guidancePosition === "bottom" ? "top" : "bottom";
  };

  get selectedCardBack(): string {
    return this.#game.getOwnPlayerVisualSettings()?.cardBack ?? "default";
  }

  get selectedPlaymat(): string {
    return this.#game.getOwnPlayerVisualSettings()?.playmat ?? "default";
  }

  handleCardBackChange = (id: string): void => {
    this.#settings.handleCardBackChange(id);
    this.#game.setOwnPlayerVisualSettings({ cardBack: id });
  };

  handlePlaymatChange = (id: string): void => {
    this.#settings.handlePlaymatChange(id);
    this.#game.setOwnPlayerVisualSettings({ playmat: id });
  };
}

export function setLorcanaGameContext(value: SetLorcanaGameContextOptions): LorcanaGameContext {
  const context = new LorcanaGameContext(
    value.engine,
    value.readModel,
    value.playerSettings,
    value.playerMetadataMap,
    value.debugPerformance,
  );
  onDestroy(() => {
    context.destroy();
  });
  setContext(LORCANA_GAME_CONTEXT_KEY, context);
  return context;
}

export function useLorcanaGameContext(): LorcanaGameContextValue {
  if (!hasContext(LORCANA_GAME_CONTEXT_KEY)) {
    throw new Error("Lorcana game context not found");
  }

  return getContext<LorcanaGameContextValue>(LORCANA_GAME_CONTEXT_KEY);
}

export function useLorcanaSidebarPresenter(): LorcanaSidebarPresenter {
  if (hasContext(LORCANA_SIDEBAR_PRESENTER_CONTEXT_KEY)) {
    return getContext<LorcanaSidebarPresenter>(LORCANA_SIDEBAR_PRESENTER_CONTEXT_KEY);
  }

  const presenter = new LorcanaSidebarPresenter(useLorcanaGameContext());
  setContext(LORCANA_SIDEBAR_PRESENTER_CONTEXT_KEY, presenter);

  onMount(() => {
    presenter.initializeLocale();
  });

  $effect(() => {
    presenter.syncAutoOpenPendingResolution();
  });

  $effect(() => {
    presenter.clearMulliganSelectionIfInvalid();
  });

  return presenter;
}

export function maybeUseLorcanaSidebarPresenter(): LorcanaSidebarPresenter | null {
  if (hasContext(LORCANA_SIDEBAR_PRESENTER_CONTEXT_KEY)) {
    return getContext<LorcanaSidebarPresenter>(LORCANA_SIDEBAR_PRESENTER_CONTEXT_KEY);
  }

  if (!hasContext(LORCANA_GAME_CONTEXT_KEY)) {
    return null;
  }

  return useLorcanaSidebarPresenter();
}

export function useLorcanaBoardPresenter(): LorcanaBoardPresenter {
  return new LorcanaBoardPresenter(useLorcanaGameContext());
}

export function maybeUseLorcanaBoardPresenter(): LorcanaBoardPresenter | null {
  if (!hasContext(LORCANA_GAME_CONTEXT_KEY)) {
    return null;
  }

  return new LorcanaBoardPresenter(useLorcanaGameContext());
}
