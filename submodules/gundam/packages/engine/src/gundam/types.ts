/**
 * Gundam TCG — Core game-state and projection types.
 *
 * GundamG is the game-specific state object (the "G" in MatchState<G>).
 * Everything else (ctx, zones, etc.) is managed by the engine framework.
 */

import type { DeepReadonly, MoveDefinition } from "../types/move-types.ts";
import type { ProjectedTimerView } from "../types/projection.ts";
import type { CardEffect, CardType, TargetFilter, Zone } from "@tcg/gundam-types";
import type { GundamDomainEvent } from "./events.ts";

export type { TargetFilter };

// =============================================================================
// Re-export card types for convenience
// =============================================================================

export type {
  Card,
  UnitCard,
  PilotCard,
  CommandCard,
  BaseCard,
  ResourceCard,
} from "@tcg/gundam-types";

// =============================================================================
// Player State
// =============================================================================

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GundamPlayerState {
  // Resource count and level are derived from the resourceArea zone state.
  // Use getAvailableResources() and getResourceLevel() from derived-state.ts.
}

// =============================================================================
// Combat
// =============================================================================

export interface PendingCombatState {
  stage:
    | "attacker-declared"
    | "blocker-window"
    | "entering-battle"
    | "attack-step"
    | "block-step"
    | "blocker-declared"
    | "block-passed"
    | "action-step"
    | "damage-step"
    | "battle-end";
  attackerId: string;
  attackerPlayerId: string;
  /** Instance ID of target unit, or "direct" for a direct attack */
  target: string;
  blockerId?: string;
  blockerPlayerId?: string;
}

// =============================================================================
// Turn Metadata
// =============================================================================

export interface TurnMetadata {
  /** Unit instance IDs that have attacked this turn */
  attackedThisTurn: string[];
  /** Card instance IDs deployed this turn */
  deployedThisTurn: string[];
  /** Pending combat, if any */
  pendingCombat?: PendingCombatState;
}

// =============================================================================
// Continuous Effects
// =============================================================================

export type ContinuousEffectPayload =
  | { kind: "stat-modifier"; stat: "ap" | "hp"; modifier: number }
  | { kind: "keyword-grant"; keyword: string }
  | { kind: "trait-grant"; trait: string }
  | { kind: "restriction"; restriction: string }
  /**
   * Prevents damage dealt to this card by sources matching unitFilter (all if absent).
   *
   * `damageType` restricts to "battle"-only or "effect"-only damage.
   * `sourceCardType` restricts the source to a specific card type (e.g.
   * "command" for "can't receive effect damage from enemy Commands").
   * When either field is absent, no restriction applies for that axis.
   */
  | {
      kind: "prevent-damage";
      unitFilter?: TargetFilter;
      damageType?: "battle" | "effect";
      sourceCardType?: CardType;
    }
  | {
      kind: "damage-reduction";
      amount: number;
      damageType?: "battle" | "effect";
      sourceCardType?: CardType;
      source?: "enemy";
    }
  | { kind: "battle-damage-redirect"; redirectToId: string }
  | { kind: "prevent-destroy"; source?: "enemy" }
  /** Prevents damage from matched units to all cards in the given zone (targetId = owning playerId) */
  | { kind: "prevent-damage-to-zone"; zone: Zone; unitFilter: TargetFilter }
  /** Forces this card to only attack targets matching attackTarget */
  | { kind: "force-attack-target"; attackTarget: TargetFilter; attackTargetId?: string }
  /** Grants this card the option to also attack targets matching attackTarget (may-choose) */
  | { kind: "grant-attack-target-option"; attackTarget: TargetFilter }
  /** Lets this card ignore the same-turn deploy attack gate. */
  | { kind: "allow-attack-deployed-this-turn" }
  /**
   * A temporary event watcher created by an effect such as "During this
   * turn, when ...". `targetId` is the controller that owns the delayed
   * trigger decision.
   */
  | {
      kind: "delayed-trigger";
      eventType: "attackerDestroyedDefender" | "battleDamageDealtToUnit";
      eventCardFilter: TargetFilter;
      eventSourceFilter?: TargetFilter;
      eventSourceIds?: string[];
      effect: CardEffect;
    };

export interface ContinuousEffectEntry {
  id: string;
  sourceId: string;
  targetId: string;
  payload: ContinuousEffectPayload;
  duration: "permanent" | "this-turn" | "this-battle" | "until-start-of-next-turn";
  createdAtTurn: number;
}

// =============================================================================
// Pending Effect Queue (rules 10-1-6, 10-1-7, 10-1-8)
// =============================================================================

/**
 * Data-driven cleanup run after a PendingEffect's body resolves. Kept as
 * a discriminated union (not a callback) so queue entries stay
 * serializable across clients / replays / snapshots.
 *
 * `moveToTrash` — used by Command cards to transition from removalArea
 * to trash after the effect resolves (rule 3-4-4).
 * `emitEvent` — post-resolve domain events like COMMAND_PLAYED that
 * should fire only after the effect finishes.
 */
export type PostResolveAction =
  | { kind: "moveToTrash"; cardId: string; playerId: string }
  | {
      kind: "emitEvent";
      event: GundamDomainEvent;
    };

/**
 * An effect waiting to be resolved.
 *
 * Triggering moves (deploy-unit, play-command, attack-step lifecycle,
 * shield-destroyed, etc.) push these onto `g.pendingEffects` rather than
 * executing inline. The flow engine's onTransitionCheck drains the queue
 * before advancing steps:
 *  - Effects with no player choice (no target filter, no "you may") are
 *    auto-resolved by the engine.
 *  - Effects that require a choice halt the flow until the controller
 *    submits a `resolveEffect` move with their selection.
 *
 * Priority ordering follows rule 10-1-6-8 → 10-1-6-5/6:
 *  1. "burst" (rule 10-1-6-8)
 *  2. "triggered" owned by the active player
 *  3. "triggered" owned by the standby player
 *  4. "activated" / "command" in arrival order (own-choice moves)
 *
 * When a new effect is triggered mid-resolution (rule 10-1-6-7), it is
 * inserted at the **front** of the queue but the current directive
 * completes first (user preference b).
 */
export interface PendingEffect {
  id: string;
  /** Player who decides targets / "you may" for this effect. */
  controllerId: string;
  /** Card that generated the effect; undefined for engine-synthesised effects. */
  /** Card that generated the effect. Required on every pending effect. */
  sourceCardId: string;
  /** Underlying CardEffect (triggered / activated / command). */
  effect: import("@tcg/gundam-types").CardEffect;
  /**
   * Stable index of the effect within its lookup list. Interpretation
   * depends on how the entry was enqueued:
   *   - `kind: "triggered"` / `"burst"` / `"command"`: index into the
   *     source card's `definition.effects` array (set by enqueue helpers
   *     that iterate the raw effects list).
   *   - `kind: "activated"`: index into
   *     `getActivatedEffects(sourceCardId, G, cards)` — printed activated
   *     effects followed by keyword-synthesised ones (e.g. `<Support N>`).
   *     Not equal to the `definition.effects` index when the card has
   *     non-activated effects before the activated ones.
   *
   * Used for diagnostics, trigger dedup keys, and once-per-turn tracking —
   * not for re-reading the effect body (the `effect` field holds that).
   */
  effectIndex: number;
  /**
   * Classification used for priority sorting and reporting.
   *
   * `sentinel` is an internal kind used by the move-completion fence
   * (see `enqueueMoveCompletionFence` in pending-effects.ts). It has
   * no card-effect body — `drainPendingEffects` resolves it by
   * running only its `postActions`. Tier-sorted strictly last so it
   * fires after every same-move trigger has settled.
   */
  kind: "burst" | "triggered" | "activated" | "command" | "sentinel";
  /** Triggering event, if any (populated for `kind: "triggered"` / "burst"). */
  trigger?: {
    type: string;
    [key: string]: unknown;
  };
  /**
   * Targets the controller has committed to. Populated either by the
   * triggering move up-front (e.g. play-command validates targets at
   * play-time per rule 10-1-8-1-1) or by the resolveEffect move.
   */
  chosenTargets?: readonly string[];
  /**
   * Data-driven cleanup to run after executeCardEffect completes. See
   * PostResolveAction — used primarily by Command cards to transition
   * from removalArea to trash (rule 3-4-4).
   */
  postActions?: readonly PostResolveAction[];
  /**
   * `commandID` of the move that ultimately produced this entry — set
   * directly when the enqueuing move provides it, or inherited from the
   * currently-resolving parent for cascading rule 10-1-6-7 preempts.
   *
   * Pure metadata: replay UIs, multi-move undo, and `gundam.pending.*`
   * log entries use it to group a play-card move and every effect it
   * spawned into one logical transaction. The engine never reads it for
   * priority or resolution decisions.
   */
  originatingMoveId?: string;
}

// =============================================================================
// Pending Choice Prompt (PR F.1 — player-choice UX descriptor)
// =============================================================================

/**
 * UI-agnostic descriptor of the input the priority-head pending effect
 * needs from its controller. Produced by `buildPendingChoicePrompt` and
 * surfaced through `GundamBoardView.pendingChoice`.
 *
 * Pure derived state — computed from `g.pendingEffects[priorityHead]` and
 * the target-DSL filter evaluator. Clients (UI, bots, replays) read this
 * instead of inspecting the queue directly.
 *
 * F.1 emits `targetSelection` and `optional`; `ordering` is reserved for
 * PR F.3 (within-controller ordering, rule 10-1-6-5) so the shape can be
 * extended without breaking consumers.
 */
export type PendingChoicePrompt =
  | PendingTargetSelectionPrompt
  | PendingOptionalPrompt
  | PendingOrderingPrompt
  | PendingChooseOnePrompt
  | PendingDeckLookPrompt;

export interface PendingTargetSelectionPrompt {
  kind: "targetSelection";
  /** `PendingEffect.id` this prompt belongs to. */
  effectId: string;
  /** Player who answers. */
  controllerId: string;
  sourceCardId: string;
  /** Top-level index into `effect.directives` whose action carries the filter. */
  directiveIndex: number;
  /** The raw filter from the directive's action (useful for richer UX). */
  filter: TargetFilter;
  /** Inclusive bounds on how many targets the controller must pick. */
  minTargets: number;
  maxTargets: number;
  /** Card-instance IDs that currently satisfy the filter. */
  legalTargetIds: readonly string[];
  /** Human-readable prompt — effect's `sourceText` by default. */
  prompt: string;
}

export interface PendingOptionalPrompt {
  kind: "optional";
  effectId: string;
  controllerId: string;
  sourceCardId: string;
  /** Top-level index of the `optional: true` directive. */
  directiveIndex: number;
  /** Human-readable prompt — effect's `sourceText` by default. */
  prompt: string;
}

export interface PendingOrderingPrompt {
  kind: "ordering";
  /** `PendingEffect.id` of the current priority head. */
  effectId: string;
  controllerId: string;
  /** Same-tier same-controller peers the caller may resolve in any order. */
  candidateEffectIds: readonly string[];
  prompt: string;
}

/**
 * Modal-effect prompt — the controller must pick exactly one of the
 * `options` (e.g. ST04-012 Striker Pack: "deploy 1 [Sword Strike] or 1
 * [Launcher Strike]"). The answer is supplied by `resolveEffect` via
 * `chooseOneAnswers[directiveIndex] = optionIndex`.
 */
export interface PendingChooseOnePrompt {
  kind: "chooseOne";
  effectId: string;
  controllerId: string;
  sourceCardId: string;
  /** Top-level index of the `chooseOne` directive within `effect.directives`. */
  directiveIndex: number;
  /** UI-facing labels (in option order). Empty string when an option had no label. */
  options: readonly { index: number; label: string }[];
  /** Human-readable prompt — effect's `sourceText` by default. */
  prompt: string;
}

export interface PendingDeckLookPrompt {
  kind: "deckLook";
  effectId: string;
  controllerId: string;
  sourceCardId: string;
  /** Top-level index of the `lookAtTopDeck` directive. */
  directiveIndex: number;
  prompt: string;
  revealedCardIds: readonly string[];
  returnMode: "topAndBottom" | "chooseTop" | "topOrTrash";
  remainingDestination?: "bottom" | "trash";
  tutorDestination: "hand" | "battleArea";
  legalTutorCardIds: readonly string[];
  /**
   * Optional directive that must be accepted for this deck-look directive
   * to execute (for "You may ... If you do, look..." effects).
   */
  acceptOptionalDirectiveIndex?: number;
}

// =============================================================================
// Game State (G)
// =============================================================================

export interface GundamG {
  /** Per-player game state */
  players: Record<string, GundamPlayerState>;
  /** Damage counters per card instance ID */
  damage: Record<string, number>;
  /** Exhaustion state per card instance ID */
  exhausted: Record<string, boolean>;
  /** Pilot assignments: unitInstanceId → pilotInstanceId */
  pilotAssignments: Record<string, string>;
  /** Turn-scoped metadata */
  turnMetadata: TurnMetadata;
  /**
   * Queue of effects waiting to resolve (rules 10-1-6, 10-1-7, 10-1-8).
   * Populated by triggering moves / lifecycle hooks; drained by the
   * flow engine's onTransitionCheck — effects with no player choice
   * auto-resolve, others wait for a `resolveEffect` move from the
   * controller. Populated empty on a fresh state.
   */
  pendingEffects: PendingEffect[];
  /**
   * Pre-halt snapshot of `ctx.status.activePlayer`. Set by
   * `drainPendingEffects` when the queue halts with a priority-head
   * controller that differs from the current `activePlayer` — we shift
   * `activePlayer` to the head's controller so the runtime's active-player
   * gate admits the controller's `resolveEffect` without a blanket
   * `ignoreActivePlayer` bypass. Restored (and cleared) when the queue
   * fully drains.
   */
  pendingEffectPreHaltActor?: string;
  /**
   * `PendingEffect.originatingMoveId` of the head currently being
   * resolved by `drainPendingEffects`. Set while the executor is
   * running so any nested enqueue (rule 10-1-6-7 preempts, cascading
   * triggers from inside the effect body) inherits the parent's move
   * id. Cleared once the head finishes. Out-of-band metadata only —
   * never inspected by priority / resolution logic.
   */
  pendingEffectCurrentMoveId?: string;
  /** Active continuous effects */
  continuousEffects: ContinuousEffectEntry[];
  /** Effects/abilities resolved this turn (for once-per-turn tracking) */
  resolvedThisTurn: string[];
  /** Generic event counters (turn number, attack count, etc.) */
  eventCounters: Record<string, number>;
}

// =============================================================================
// Card Meta (per-instance state stored in zone runtime)
// =============================================================================

export interface GundamCardMeta {
  exhausted?: boolean;
  deployedThisTurn?: boolean;
  attackedThisTurn?: boolean;
  /** Per-ability use count this turn (activated effects) */
  abilityUsesThisTurn?: Record<string, number>;
  /** Per-effect use count this turn (triggered effects, for once-per-turn) */
  triggerUsesThisTurn?: Record<string, number>;
  /** Keywords temporarily granted to this card */
  grantedKeywords?: string[];
  /** Keywords temporarily removed from this card */
  removedKeywords?: string[];
  /** Permanent AP modifier (from card effects) */
  apModifier?: number;
  /** Permanent HP modifier (from card effects) */
  hpModifier?: number;
  /** Whether this card is a token */
  isToken?: boolean;
  [key: string]: unknown;
}

// =============================================================================
// Move Inputs
// =============================================================================

export interface ChooseFirstPlayerArgs {
  playerId: string;
}

export interface AlterHandArgs {
  /** Whether the player wants to return their entire hand and redraw */
  wantsRedraw: boolean;
}

export interface DeployUnitArgs {
  cardId: string;
  /** Instance IDs chosen as targets for the unit's deploy triggered effect. */
  targets?: string[];
}

export interface DeployBaseArgs {
  cardId: string;
  /** Instance IDs chosen as targets for the base's deploy triggered effect. */
  targets?: string[];
}

export interface PlayCommandArgs {
  cardId: string;
  /** Instance IDs of cards chosen as targets for the command effect. */
  targets?: string[];
}

export interface ActivateAbilityArgs {
  cardId: string;
  /** Index into card's Activated effects */
  effectIndex: number;
  targets?: string[];
  resolutionInput?: unknown;
}

export interface AssignPilotArgs {
  pilotId: string;
  unitId: string;
}

/**
 * Args for `playCommandAsPilot`: a Command card with the 【Pilot】 keyword
 * (rule 3-4-6) being played as a Pilot instead of activating its command
 * effect (rule 3-4-6-2). The card is paired beneath the chosen Unit.
 */
export interface PlayCommandAsPilotArgs {
  cardId: string;
  unitId: string;
}

export interface DeclareBlockArgs {
  blockerId: string;
}

export interface EnterBattleArgs {
  attackerId: string;
  target: string;
}

export interface PassBlockArgs {
  // no args — standby player declines to block
}

export interface PassBattleActionArgs {
  // no args — player passes in battle action step
}

export interface DiscardToHandLimitArgs {
  cardIds: string[];
}

export interface ConcedeArgs {
  // derives conceding player from caller
}

export interface SkipOpponentTurnArgs {
  // derives opponent from caller
}

export interface DropOpponentArgs {
  // derives opponent from caller
}

export interface ResolveEffectArgs {
  /** Targets the controller is committing to for this effect (rule 10-3-3). */
  targets?: readonly string[];
  /**
   * Which pending-effect entry the controller is resolving. When omitted,
   * the priority head is resolved (existing behaviour). When supplied,
   * the entry must be one of the current priority head's same-tier,
   * same-controller peers — exactly the set surfaced by
   * `PendingOrderingPrompt.candidateEffectIds` (rule 10-1-6-5 within-
   * controller ordering). Callers cannot jump a higher-priority tier
   * (rule 10-1-6-8, e.g. 【Burst】 before triggered) nor skip past
   * another controller whose head sits at the same tier (rule 10-1-6-6,
   * active player's entries resolve before standby's).
   */
  pendingEffectId?: string;
  /**
   * Answers to "you may" optional directives (rule 10-1-3), keyed by the
   * top-level `directiveIndex` surfaced on `PendingOptionalPrompt`. A
   * value of `true` activates the directive, `false` skips it. Missing
   * entries default to activating the directive (backwards-compat).
   */
  optionalAnswers?: Record<number, boolean>;
  /**
   * Answers to modal `chooseOne` directives, keyed by the top-level
   * `directiveIndex` surfaced on `PendingChooseOnePrompt`. The value is
   * the index into the directive's `options[]` the controller picked.
   * Missing entries fall back to option 0 in the executor.
   */
  chooseOneAnswers?: Record<number, number>;
  /**
   * Answers to `lookAtTopDeck` deck-look prompts, keyed by the top-level
   * directive index surfaced on `PendingDeckLookPrompt`.
   */
  deckLookAnswers?: Record<number, DeckLookAnswer>;
}

export interface DeckLookAnswer {
  tutorCardId?: string;
  toTop?: readonly string[];
  toBottom?: readonly string[];
  toTrash?: readonly string[];
}

export type NoMoveArgs = Record<string, never>;

export type PassActionStepArgs = NoMoveArgs;

export type PassTurnArgs = NoMoveArgs;

export interface GundamRuntimeMoveParams {
  chooseFirstPlayer: ChooseFirstPlayerArgs;
  alterHand: AlterHandArgs;
  deployUnit: DeployUnitArgs;
  deployBase: DeployBaseArgs;
  playCommand: PlayCommandArgs;
  activateAbility: ActivateAbilityArgs;
  assignPilot: AssignPilotArgs;
  playCommandAsPilot: PlayCommandAsPilotArgs;
  declareBlock: DeclareBlockArgs;
  enterBattle: EnterBattleArgs;
  passBlock: PassBlockArgs;
  passBattleAction: PassBattleActionArgs;
  discardToHandLimit: DiscardToHandLimitArgs;
  passTurn: PassTurnArgs;
  passActionStep: PassActionStepArgs;
  concede: ConcedeArgs;
  skipOpponentTurn: SkipOpponentTurnArgs;
  dropOpponent: DropOpponentArgs;
  resolveEffect: ResolveEffectArgs;
}

export type GundamMoveName = keyof GundamRuntimeMoveParams;

export type GundamMoveDefinition<K extends GundamMoveName> = MoveDefinition<
  GundamRuntimeMoveParams[K],
  GundamG
>;

export type ReadonlyGundamG = DeepReadonly<GundamG>;

// =============================================================================
// Runtime Card (derived view, not stored in state)
// =============================================================================

export interface GundamRuntimeCard {
  instanceId: string;
  definitionId: string;
  ownerId: string;
  controllerId: string;
  zoneId: string;
  effectiveAp?: number;
  effectiveHp?: number;
  effectiveCost?: number;
  damage: number;
  exhausted: boolean;
  pilotId?: string;
  keywords: string[];
  restrictions: string[];
}

// =============================================================================
// Board Projection
// =============================================================================

export interface GundamPlayerBoardView {
  playerId: string;
  /** Total number of resource cards in the resource area (includes exhausted). */
  resourceCount: number;
  handCount: number;
  deckCount: number;
  trashCount: number;
  shieldCount: number;
  battlefield: GundamRuntimeCard[];
  /** Base section cards — the base section of the shield area (public, max 1). */
  baseSection: GundamRuntimeCard[];
  /** Resource area cards (public — visible to all players per Rule 4-4-3) */
  resourceArea: GundamRuntimeCard[];
  /** Only visible to the owner */
  hand?: GundamRuntimeCard[];
}

export interface GundamBoardView {
  players: Record<string, GundamPlayerBoardView>;
  gameSegment?: string;
  phase?: string;
  step?: string;
  activePlayer?: string;
  turnPlayer?: string;
  pendingDecision: string[];
  pendingCombat?: PendingCombatState;
  pendingEffectCount: number;
  /**
   * Descriptor for the input the priority-head pending effect needs from
   * its controller, or `undefined` when the queue is empty / nothing is
   * waiting on a choice. Computed by `buildPendingChoicePrompt`.
   */
  pendingChoice?: PendingChoicePrompt;
  timerView: ProjectedTimerView;
  winner?: string;
  stateId: number;
}
