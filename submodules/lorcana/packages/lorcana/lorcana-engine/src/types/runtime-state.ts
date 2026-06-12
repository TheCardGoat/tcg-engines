/**
 * Lorcana Runtime State Types
 *
 * New state types for the MatchRuntime architecture.
 * Uses MatchState<G> = { G, ctx } pattern where:
 * - G: game-specific state (LorcanaG)
 * - ctx: framework-managed runtime state (TCGCtx)
 */

import type {
  Amount,
  Classification,
  Condition,
  Effect,
  ReplacementAbilityKind,
  ReplacementRegistrationKind,
  Trigger,
} from "@tcg/lorcana-types";
import type { CardInstanceId, MatchState, PlayerId } from "#core";
import type { CardPlayedPayload, DynamicAmountEventSnapshot } from "./domain-events";
import type { ResolutionSelectionContext } from "./resolution-selection";
import type { SlottedTargetInput } from "../targeting/slotted-targets";

// Re-export MatchState for convenience
export type { MatchState };

/**
 * Card State (Ready/Exerted)
 */
export type CardReadyState = "ready" | "exerted";

/**
 * Lorcana Phase
 *
 * Three-phase turn structure (Rule 4.1.1):
 * - beginning: Ready, Set, Draw steps
 * - main: Player can take turn actions
 * - end: End of turn cleanup
 */
export type LorcanaPhase = "beginning" | "main" | "end";

/**
 * Turn Step (within Beginning phase)
 */
export type LorcanaStep = "ready" | "set" | "draw";

/**
 * Challenge State
 *
 * Temporary state during challenge resolution.
 */
export interface ChallengeState {
  attacker: CardInstanceId;
  defender: CardInstanceId;
  attackerOwnerId: PlayerId;
  defenderOwnerId: PlayerId;
  stage: "declaration" | "damage" | "post-damage";
}

/**
 * Supported continuous-effect stat keys.
 * Keep this union broad enough for future stat-mod effect coverage.
 */
export type ContinuousEffectStat =
  | "strength"
  | "willpower"
  | "lore"
  | "moveCost"
  | "singer-threshold";

/**
 * Continuous effect instance for stat modifiers.
 * Additional effect kinds can be added to the union as runtime support expands.
 */
export interface StatModifierContinuousEffectInstance {
  id: string;
  kind: "stat-modifier";
  sourceId: CardInstanceId;
  targetId: CardInstanceId;
  controllerId?: PlayerId;
  stat: ContinuousEffectStat;
  modifier: number;
  condition?: Condition;
  duration: "this-turn" | "until-start-of-next-turn";
  createdAtTurn: number;
  expiresAtTurn: number;
  nonStacking?: boolean;
}

/**
 * Continuous effect instances tracked in runtime state.
 * Currently stat-modifier focused; future kinds should extend this union.
 */
export type ContinuousEffectInstance = StatModifierContinuousEffectInstance;

/**
 * Continuous effect runtime state
 */
export interface ContinuousEffectState {
  /** Monotonic sequence for deterministic effect IDs */
  nextSeq: number;
  instances: ContinuousEffectInstance[];
  /** Secondary index: stat-modifier instances keyed by target card for O(1) lookup */
  byTarget: Record<CardInstanceId, StatModifierContinuousEffectInstance[]>;
}

/**
 * Turn Metadata
 *
 * Tracks actions taken this turn for validation and cleanup.
 * Ink available is derived from ctx.framework.zones (Option B: count of ready cards in inkwell).
 */
export interface TurnMetadata {
  cardsPlayedThisTurn: CardInstanceId[];
  charactersQuesting: CardInstanceId[];
  /** Card instance IDs inked this turn (one per turn by default; supports "second inkwell" effects) */
  inkedThisTurn: CardInstanceId[];
  /** Card instance IDs put into any inkwell this turn, including effect-based moves */
  cardsPutIntoInkwellThisTurn: CardInstanceId[];
  /** Additional hand-to-inkwell actions allowed for the active player this turn */
  additionalInkwellActions?: number;
  /** Top cards that were played using Shift this turn */
  shiftPlayedThisTurn: CardInstanceId[];
  /** Challenge declarations by player this turn */
  challengesByPlayerThisTurn: Record<PlayerId, number>;
  /** Characters that took damage this turn, grouped by owner */
  damagedCharactersByOwnerThisTurn: Record<PlayerId, number>;
  /** Total damage removed from characters this turn, grouped by the player who caused the heal */
  damageRemovedByPlayerThisTurn: Record<PlayerId, number>;
  /** Character instance IDs that were challenged this turn */
  challengedCharactersThisTurn: CardInstanceId[];
  /** Character instance IDs banished this turn */
  banishedCharactersThisTurn: CardInstanceId[];
  /** Characters banished in a challenge this turn, grouped by owner */
  banishedCharactersInChallengeByOwnerThisTurn: Record<PlayerId, number>;
  /** Number of cards that left any discard pile this turn */
  discardCardsLeftThisTurn: number;
  /** Number of cards that were put into a discard pile this turn, grouped by owner */
  cardsPutIntoDiscardThisTurnByOwner: Record<PlayerId, number>;
  /** Pending temporary play-cost reductions keyed by controller */
  pendingCostReductionsByPlayer: Record<PlayerId, PendingCostReduction[]>;
  /** Cards drawn this turn, counted per player (for Ink Amplifier and similar) */
  cardsDrawnThisTurnByPlayer: Record<PlayerId, number>;
  /** Cards put under a character this turn, keyed by the character's instance ID */
  cardsUnderThisTurn?: Record<CardInstanceId, CardInstanceId[]>;
}

export interface PendingCostReduction {
  amount: number;
  sourceId?: CardInstanceId;
  cardType?:
    | "character"
    | "item"
    | "location"
    | "action"
    | "song"
    | ("character" | "item" | "location" | "action" | "song")[]
    | readonly ("character" | "item" | "location" | "action" | "song")[];
  classification?: Classification | Classification[] | readonly Classification[];
  expiresAtTurn: number;
  consumeOnUse: boolean;
}

/**
 * Temporary permission to play a card from under a specific item this turn.
 * Created by "RISE AND JOIN ME!" style effects.
 */
export interface PlayFromUnderPermission {
  /** The item whose cards may be played */
  sourceItemId: CardInstanceId;
  /** Which turn this expires at (end-of-turn cleanup) */
  expiresAtTurn: number;
  /** If set, only cards of this type may be played (e.g. "character") */
  cardType?: string;
  /** The player who activated the effect (only their cards should be playable) */
  controllerId: PlayerId;
}

/**
 * Player-level continuous effect state for play-from-under permissions.
 * Tracked at the `LorcanaG` level (not turnMetadata) so permissions are
 * managed via expiry-based cleanup alongside other continuous effects.
 */
export interface PlayFromUnderPermissionsState {
  permissionsByPlayer: Record<PlayerId, PlayFromUnderPermission[]>;
}

export interface TemporaryGrantedAbilityPayload {
  type: string;
  [key: string]: unknown;
}

export interface TemporaryRestrictionPayload {
  type: string;
  sourceId?: CardInstanceId;
  activeWhileSourceInPlay?: boolean;
  duration?: unknown;
  /**
   * A condition that must be met for the restriction to be active.
   * When present, the restriction is only enforced while the condition evaluates to true.
   * For example, `{ type: "not", condition: { type: "at-location" } }` means
   * the restriction is inactive when the card is at a location.
   */
  condition?: { type: string; [key: string]: unknown };
}

export interface TemporaryKeywordPayload {
  type: string;
  sourceId?: CardInstanceId;
  activeWhileSourceInPlay?: boolean;
  duration?: unknown;
}

export interface TemporaryPlayerRestrictionPayload {
  type: string;
  sourceId?: CardInstanceId;
  activeWhileSourceInPlay?: boolean;
  duration?: unknown;
}

export type BufferedTriggeredEvent =
  | "play"
  | "sing"
  | "discard"
  | "draw"
  | "quest"
  | "ready"
  | "support"
  | "move"
  | "challenge"
  | "challenged"
  | "challenged-and-banished"
  | "banish"
  | "banish-in-challenge"
  | "remove-damage"
  | "return-to-hand"
  | "ink"
  | "start-turn"
  | "end-turn"
  | "be-chosen"
  | "boost"
  | "put-card-under"
  | "damage"
  | "deal-damage"
  | "exert"
  | "gain-lore"
  | "lose-lore"
  | "leave-discard";

export interface PendingTriggeredEvent {
  id: string;
  event: BufferedTriggeredEvent;
  playerId?: PlayerId;
  cardPlayed?: CardPlayedPayload;
  fromZone?: string;
  toZone?: string;
  subjectCardId?: CardInstanceId;
  triggerSourceCardId?: CardInstanceId;
  /** The card type of the source that caused this event (e.g., "action", "item") */
  sourceCardType?: "character" | "action" | "item" | "location";
  attackerId?: CardInstanceId;
  defenderId?: CardInstanceId;
  happenedInChallenge?: boolean;
  eventSnapshot?: DynamicAmountEventSnapshot;
  triggerCandidates?: TriggeredEventCandidate[];
}

export interface GeneratedTriggeredAbilityEntry {
  id: string;
  type: "generated-triggered-ability";
  controllerId: PlayerId;
  sourceId: CardInstanceId;
  cardPlayed: CardPlayedPayload;
  ability: {
    name?: string;
    trigger: Trigger;
    condition?: Condition;
    effect: Effect;
  };
  startsAtTurn: number;
  expiresAtTurn: number;
}

export interface BagEffectEntry {
  id: string;
  type: "bag-effect";
  kind: "triggered-ability";
  abilityId: string;
  abilityIndex?: number;
  abilityKey: string;
  abilityName?: string;
  /** Copied from printed/generated triggered ability when present */
  autoResolve?: boolean;
  controllerId: PlayerId;
  chooserId: PlayerId;
  sourceId: CardInstanceId;
  cardPlayed: CardPlayedPayload;
  trigger?: Trigger;
  condition?: Condition;
  effect: Effect;
  occurrenceIndex: number;
  resolutionInput: PendingActionResolutionInput;
}

export interface BagState {
  nextSeq: number;
  items: BagEffectEntry[];
  lastResolvedPlayerId?: PlayerId;
}

export type DelayedTriggerTiming = "end-of-turn" | "start-of-next-turn" | "end-of-next-turn";

export type DelayedTriggerWindow = "end-of-turn" | "start-of-turn";

export interface TriggerRegistrationAbility {
  id?: string;
  name?: string;
  trigger: Trigger;
  sourceZones?: ("play" | "hand" | "discard" | "inkwell")[];
  condition?: Condition;
  effect: Effect;
  autoResolve?: boolean;
}

export interface TriggeredEventCandidate {
  abilityId: string;
  abilityIndex?: number;
  controllerId: PlayerId;
  sourceId: CardInstanceId;
  cardPlayed: CardPlayedPayload;
  ability: TriggerRegistrationAbility;
  resolutionInput: PendingActionResolutionInput;
}

export type TriggerRegistrationLifecycle =
  | {
      kind: "floating";
      startsAtTurn: number;
      expiresAtTurn: number;
    }
  | {
      kind: "delayed";
      timing: DelayedTriggerTiming;
      dueWindow: DelayedTriggerWindow;
      duePlayerId: PlayerId;
      dueCompletedTurns: number;
    };

export interface TriggerRegistration {
  id: string;
  abilityId: string;
  abilityIndex?: number;
  sourceId: CardInstanceId;
  controllerId: PlayerId;
  cardPlayed: CardPlayedPayload;
  ability: TriggerRegistrationAbility;
  lifecycle: TriggerRegistrationLifecycle;
  resolutionInput: PendingActionResolutionInput;
}

export interface TriggeredAbilitiesUsageLedger {
  occurrences: Record<string, number>;
  resolutions: Record<string, number>;
}

export interface TriggeredAbilitiesState {
  pendingEvents: PendingTriggeredEvent[];
  registrations: TriggerRegistration[];
  bag: BagState;
  usageLedger: TriggeredAbilitiesUsageLedger;
}

export type ReplacementEventKind =
  | "modify-stat"
  | "deal-damage"
  | "put-damage"
  | "remove-damage"
  | "challenge-damage"
  | "gain-lore"
  | "zone-change";

export interface ReplacementTriggerContext {
  playerId?: PlayerId;
  subjectCardId?: CardInstanceId;
  triggerSourceCardId?: CardInstanceId;
  attackerId?: CardInstanceId;
  defenderId?: CardInstanceId;
}

export interface ReplacementRegistration {
  id: string;
  sourceId: CardInstanceId;
  controllerId: PlayerId;
  replacement: ReplacementRegistrationKind;
  targetId?: CardInstanceId;
  createdAtTurn: number;
  startsAtTurn: number;
  expiresAtTurn: number;
}

export interface ReplacementUsageLedger {
  perTurn: Record<string, number>;
}

export interface ReplacementEffectsState {
  nextSeq: number;
  registrations: ReplacementRegistration[];
  usageLedger: ReplacementUsageLedger;
  /** Secondary index: registration IDs keyed by event kind for O(1) lookup */
  byEventKind: Record<string, string[]>;
}

export type PendingTurnTransitionStage = "end-of-turn" | "advance-turn" | "start-of-turn";

export interface PendingTurnTransitionState {
  previousPlayer: PlayerId;
  stage: PendingTurnTransitionStage;
  nextPlayer?: PlayerId;
  turnNumber?: number;
  triggerWindowQueued?: boolean;
  drawStepStarted?: boolean;
}

export interface TemporaryPlayerRestrictionsState {
  restrictionsByPlayer: Record<PlayerId, Record<string, number>>;
  startsByPlayer: Record<PlayerId, Record<string, number>>;
  payloadsByPlayer?: Record<PlayerId, Record<string, TemporaryPlayerRestrictionPayload>>;
}

export type PendingActionEffectKind =
  | "discard-choice"
  | "choice-selection"
  | "name-card-selection"
  | "optional-selection"
  | "scry-selection"
  | "target-selection";

export interface PendingActionEffectContinuation {
  remainingEffects?: unknown[];
  stagedSequence?: {
    sequenceEffect: unknown;
    collectedTargets: Array<CardInstanceId | PlayerId>;
    collectedTargetCounts: number[];
    remainingSteps: unknown[];
  };
}

export interface PendingActionResolutionInput {
  targets?: CardInstanceId | PlayerId | readonly (CardInstanceId | PlayerId)[];
  /**
   * Structured selections for multi-slot effects. Populated at the move input
   * boundary (e.g. `resolveEffect`) when the caller passes a
   * {@link SlottedTargetInput}. See `targeting/slotted-targets.ts`.
   */
  slottedTargets?: SlottedTargetInput;
  currentTargets?: CardInstanceId | PlayerId | readonly (CardInstanceId | PlayerId)[];
  contextTargets?: CardInstanceId | PlayerId | readonly (CardInstanceId | PlayerId)[];
  targetSelectionResolved?: boolean;
  amount?: Amount;
  namedCard?: string;
  resolveOptional?: boolean;
  enterPlayExerted?: boolean;
  choiceIndex?: number;
  preventAutoResolveTriggeredEffects?: boolean;
  destinations?: {
    zone: string;
    cards: CardInstanceId | CardInstanceId[];
  }[];
  eventSnapshot?: DynamicAmountEventSnapshot;
  triggerContext?: ReplacementTriggerContext;
  /**
   * Player whose choice is currently being resolved for optional effects where
   * the chooser differs from the source controller. Defaults such as play-card
   * source zones should prefer this value when no explicit target player exists.
   */
  chooserPlayerId?: PlayerId;
}

export interface PendingActionEffect {
  id: string;
  type: "action-effect";
  kind: PendingActionEffectKind;
  abilityIndex?: number;
  sourceId: CardInstanceId;
  sourceCardId: CardInstanceId;
  controllerId: PlayerId;
  chooserId: PlayerId;
  cardPlayed: CardPlayedPayload;
  effect: unknown;
  continuation?: PendingActionEffectContinuation;
  resolutionInput: PendingActionResolutionInput;
  selectionContext?: ResolutionSelectionContext;
  /** Propagates {@link ActionEffectResolutionOptions.allowSuspendWithZeroTargetCandidates} for resolve-effect continuations. */
  allowSuspendWithZeroTargetCandidates?: boolean;
}

/**
 * Lorcana Card Metadata (Dynamic State)
 *
 * Stored in ctx.framework.zones.private.cardMeta
 * Values are optional to optimize memory usage, defaults must be the undefined type.
 */
export interface LorcanaCardMeta extends Record<string, unknown> {
  /** Ready or exerted */
  state?: CardReadyState;
  /** Damage counters */
  damage?: number;
  /** Drying = summoning sickness */
  isDrying?: boolean;
  /** Public face state for cards that can stay visible in an otherwise face-down zone */
  publicFaceState?: "faceUp" | "faceDown";
  /** Location this character is at (if any) */
  atLocationId?: CardInstanceId;
  /** IDs of cards stacked under this top card (Shift stack) */
  cardsUnder?: CardInstanceId[];
  /** ID of the card currently on top of this card in a Shift stack */
  stackParentId?: CardInstanceId;
  /** Whether this card entered play using Shift */
  playedViaShift?: boolean;
  /** Which payment mode was used to play this card */
  playedCostType?: "standard" | "shift" | "sing" | "singTogether" | "free";
  /** Temporary keywords granted by action effects and their inclusive expiration turn */
  temporaryKeywords?: Record<string, number>;
  /** Inclusive start turns for temporary keywords (defaults to current turn when omitted) */
  temporaryKeywordStarts?: Record<string, number>;
  /** Temporary values for parameterized keywords (e.g. Challenger/Resist) */
  temporaryKeywordValues?: Record<string, number>;
  /** Structured payloads for temporary keywords keyed by keyword name */
  temporaryKeywordPayloads?: Record<string, TemporaryKeywordPayload>;
  /** Temporary lost keywords and their inclusive expiration turn */
  temporaryLostKeywords?: Record<string, number>;
  /** Inclusive start turns for temporary lost keywords */
  temporaryLostKeywordStarts?: Record<string, number>;
  /** Temporary classifications granted by action effects and their inclusive expiration turn */
  temporaryClassifications?: Record<string, number>;
  /** Inclusive start turns for temporary classifications */
  temporaryClassificationStarts?: Record<string, number>;
  /** Temporary granted non-keyword abilities and their inclusive expiration turn */
  temporaryAbilities?: Record<string, number>;
  /** Inclusive start turns for temporary non-keyword abilities */
  temporaryAbilityStarts?: Record<string, number>;
  /** Structured payloads for temporary granted abilities keyed by ability id */
  temporaryAbilityPayloads?: Record<string, TemporaryGrantedAbilityPayload>;
  /** Temporary restrictions granted by action effects and their inclusive expiration turn */
  temporaryRestrictions?: Record<string, number>;
  /** Inclusive start turns for temporary restrictions */
  temporaryRestrictionStarts?: Record<string, number>;
  /** Structured payloads for temporary restrictions keyed by restriction id */
  temporaryRestrictionPayloads?: Record<string, TemporaryRestrictionPayload>;
  /** Activated ability usage count keyed by ability id */
  activatedAbilityUses?: Record<string, number>;
  /** Turn number for the current activated ability usage count */
  activatedAbilityUseTurns?: Record<string, number>;
  /** Printed replacement abilities currently active on this card */
  replacementAbilities?: ReplacementAbilityKind[];
  /** Where to send this card when its action effects finish resolving, overriding the default discard */
  afterPlayDestination?: "bottom-of-deck";
}

/**
 * Lorcana Game-Specific State (G)
 *
 * This is the game-owned state that goes in MatchState<G>.
 * Framework manages zones, cards, and ctx. Card definitions from staticResources;
 * ink/character/permanent state derived from ctx.framework.zones and cardMeta; game end from ctx.status.
 */
export interface LorcanaG {
  /** Lore totals for each player (win at 20) */
  lore: Record<PlayerId, number>;

  /**
   * Override lore required to win for specific players.
   * When a player appears in this map, they need that much lore to win
   * instead of the default 20. Populated by win-condition-modification
   * static abilities (e.g. Donald Duck - Flustered Sorcerer).
   *
   * Keys are the player IDs whose win threshold is raised.
   * The map only contains overrides — missing entries use the default 20.
   */
  loreToWin?: Record<PlayerId, number>;

  /** Turn metadata - reset each turn */
  turnMetadata: TurnMetadata;

  /** Triggered-ability runtime state */
  triggeredAbilities: TriggeredAbilitiesState;

  /** Suspended action-effect resolutions waiting for a player decision */
  pendingEffects: PendingActionEffect[];

  /** Pass-turn pipeline continuation when delayed triggers suspend mid-transition */
  pendingTurnTransition?: PendingTurnTransitionState;

  /** Completed turns per player (persistent across turns) */
  turnsCompletedByPlayer: Record<PlayerId, number>;

  /** Active continuous effects */
  continuousEffects: ContinuousEffectState;

  /** Temporary play restrictions tracked on players rather than cards */
  temporaryPlayerRestrictions: TemporaryPlayerRestrictionsState;

  /** Player-level permissions to play cards from under items (continuous effect) */
  playFromUnderPermissions: PlayFromUnderPermissionsState;

  /** Replacement effects created by resolving cards and abilities */
  replacementEffects: ReplacementEffectsState;

  /** Challenge state (only during challenge) */
  challengeState?: ChallengeState;

  /**
   * Monotonically increasing counter incremented whenever state that affects
   * static ability evaluation changes (cards entering/leaving play, keyword grants,
   * ability grants, continuous effects, card damage/location/exert state).
   * Used by move-registry-cache to skip O(N) registry rebuilds for commands
   * that don't touch static ability inputs (e.g. drawing a card, gaining lore).
   */
  staticEffectsVersion: number;
}

/**
 * Lorcana Match State
 *
 * Full state type: MatchState
 */
export type LorcanaMatchState = MatchState;

/**
 * Create initial Lorcana G state
 */
export function createInitialLorcanaG(player1Id: PlayerId, player2Id: PlayerId): LorcanaG {
  return {
    lore: {
      [player1Id]: 0,
      [player2Id]: 0,
    },
    turnMetadata: {
      cardsPlayedThisTurn: [],
      charactersQuesting: [],
      inkedThisTurn: [],
      cardsPutIntoInkwellThisTurn: [],
      additionalInkwellActions: 0,
      shiftPlayedThisTurn: [],
      challengesByPlayerThisTurn: {},
      damagedCharactersByOwnerThisTurn: {},
      damageRemovedByPlayerThisTurn: {},
      challengedCharactersThisTurn: [],
      banishedCharactersThisTurn: [],
      banishedCharactersInChallengeByOwnerThisTurn: {},
      discardCardsLeftThisTurn: 0,
      cardsPutIntoDiscardThisTurnByOwner: {},
      pendingCostReductionsByPlayer: {},
      cardsDrawnThisTurnByPlayer: {} as Record<PlayerId, number>,
    },
    triggeredAbilities: {
      pendingEvents: [],
      registrations: [],
      bag: {
        nextSeq: 1,
        items: [],
      },
      usageLedger: {
        occurrences: {},
        resolutions: {},
      },
    },
    pendingEffects: [],
    turnsCompletedByPlayer: {
      [player1Id]: 0,
      [player2Id]: 0,
    },
    continuousEffects: {
      nextSeq: 1,
      instances: [],
      byTarget: {},
    },
    temporaryPlayerRestrictions: {
      restrictionsByPlayer: {},
      startsByPlayer: {},
      payloadsByPlayer: {},
    },
    playFromUnderPermissions: {
      permissionsByPlayer: {},
    },
    replacementEffects: {
      nextSeq: 1,
      registrations: [],
      usageLedger: {
        perTurn: {},
      },
      byEventKind: {},
    },
    staticEffectsVersion: 0,
  };
}

/**
 * Create default card metadata for new cards entering play
 */
export function createDefaultCardMeta(): LorcanaCardMeta {
  return {
    damage: undefined,
    isDrying: undefined,
    publicFaceState: undefined,
    state: undefined,
    atLocationId: undefined,
    cardsUnder: undefined,
    stackParentId: undefined,
    playedViaShift: undefined,
    playedCostType: undefined,
    temporaryKeywords: undefined,
    temporaryKeywordStarts: undefined,
    temporaryKeywordValues: undefined,
    temporaryAbilities: undefined,
    temporaryAbilityStarts: undefined,
    temporaryAbilityPayloads: undefined,
    temporaryRestrictions: undefined,
    temporaryRestrictionPayloads: undefined,
    temporaryRestrictionStarts: undefined,
    activatedAbilityUses: undefined,
    activatedAbilityUseTurns: undefined,
    replacementAbilities: undefined,
  };
}
