/**
 * Gundam Card Game Effect Type System
 *
 * Defines a pure TypeScript type system for card effects using discriminated unions.
 * All types are serializable (JSON-compatible) with no functions.
 * Type safety is enforced through discriminated unions using the `type` field.
 *
 * Based on Gundam Card Game Official Rules:
 * - Section 11-1: Card Effects Overview
 * - Section 11-2: Effect Categories (Keyword, Triggered, Activated, Command, Constant)
 * - Section 11-3: Effect Timing and Resolution
 * - Section 11-4: Targeting System
 */

import type { CardId, PlayerId } from "@tcg/core";

// ============================================================================
// EFFECT CATEGORIES
// ============================================================================

/**
 * Effect Categories
 *
 * Classification of effects based on how they are activated and controlled.
 * See Official Rules Section 11-2.
 *
 * - **keyword**: Passive abilities defined by game rules (Repair, Breach, Support, etc.)
 * - **triggered**: Effects that automatically activate when a specific condition occurs
 * - **activated**: Effects that a player chooses to activate, usually with a cost
 * - **command**: Effects from Command cards that resolve when played
 * - **constant**: Continuous effects that are always active while the card is in play
 */
export type EffectCategory = "keyword" | "triggered" | "activated" | "command" | "constant";

// ============================================================================
// EFFECT TIMING
// ============================================================================

/**
 * Effect Timing
 *
 * Defines when effects can activate or resolve. Uses discriminated union with
 * `type` field for exhaustive type checking.
 *
 * See Official Rules Section 11-3: Effect Timing.
 */
export type EffectTiming =
  | MainTiming
  | ActionTiming
  | DeployTiming
  | AttackTiming
  | DestroyedTiming
  | BurstTiming
  | ActivateMainTiming
  | ActivateActionTiming
  | StartOfTurnTiming
  | EndOfTurnTiming;

/**
 * Main phase timing - effects can activate during main phase
 */
export interface MainTiming {
  readonly type: "MAIN";
}

/**
 * Action phase timing - effects can activate during action phase
 */
export interface ActionTiming {
  readonly type: "ACTION";
}

/**
 * Deploy timing - effects trigger when a unit is deployed
 */
export interface DeployTiming {
  readonly type: "DEPLOY";
}

/**
 * Attack timing - effects trigger during attack declaration or combat
 */
export interface AttackTiming {
  readonly type: "ATTACK";
  readonly step?: "declaration" | "damage" | "end";
}

/**
 * Destroyed timing - effects trigger when a unit is destroyed
 */
export interface DestroyedTiming {
  readonly type: "DESTROYED";
}

/**
 * Burst timing - effects that can interrupt and respond to other effects
 */
export interface BurstTiming {
  readonly type: "BURST";
  readonly timing: "before" | "after";
}

/**
 * Activate Main timing - activated abilities usable during main phase
 */
export interface ActivateMainTiming {
  readonly type: "ACTIVATE_MAIN";
}

/**
 * Activate Action timing - activated abilities usable during action phase
 */
export interface ActivateActionTiming {
  readonly type: "ACTIVATE_ACTION";
}

/**
 * Start of turn timing - effects trigger at the beginning of a turn
 */
export interface StartOfTurnTiming {
  readonly type: "START_OF_TURN";
}

/**
 * End of turn timing - effects trigger at the end of a turn
 */
export interface EndOfTurnTiming {
  readonly type: "END_OF_TURN";
}

// ============================================================================
// KEYWORD EFFECTS
// ============================================================================

/**
 * Official Gundam Card Game Keywords
 *
 * Keywords are game-defined abilities that work consistently across cards.
 * See Official Rules Section 10 for keyword definitions.
 */
export type KeywordEffect =
  | "Repair" // Remove 1 damage at end of turn
  | "Breach" // Can attack without being blocked by rested units
  | "Support" // Can be rested to boost attacking unit's AP
  | "Blocker" // Can rest to intercept an attack
  | "FirstStrike" // Deals damage before defender in combat
  | "HighManeuver" // Cannot be intercepted by rested units
  | "Assassin" // Can destroy rested units
  | "Intercept" // Can intercept attacks targeting other units
  | "Mobile" // Can attack the turn it is deployed
  | "Counter" // Deals damage when attacked
  | "Pilot" // Can be paired with compatible units
  | "Transform" // Can transform into specified card
  | "Brave" // Gains bonus stats when damaged
  | "Alert"; // Can be activated without resting

// ============================================================================
// ZONE TYPES
// ============================================================================

/**
 * Game Zone Types
 *
 * All possible zones where cards can exist in the Gundam Card Game.
 * Matches the zones defined in GundamGameState.
 */
export type ZoneType =
  | "deck"
  | "resourceDeck"
  | "hand"
  | "battleArea"
  | "shieldSection"
  | "baseSection"
  | "resourceArea"
  | "trash"
  | "removal"
  | "limbo";

// ============================================================================
// EFFECT ACTION TYPES
// ============================================================================

/**
 * Effect Action
 *
 * Discriminated union defining all possible actions an effect can perform.
 * The `type` field enables exhaustive type checking and type narrowing.
 *
 * All actions are serializable and contain only data (no functions).
 */
export type EffectAction =
  | DrawAction
  | DamageAction
  | RestAction
  | ActivateAction
  | MoveCardAction
  | SearchAction
  | ModifyStatsAction
  | GrantKeywordAction
  | DestroyAction
  | DiscardAction;

// ============================================================================
// DRAW ACTION
// ============================================================================

/**
 * Draw cards action
 *
 * Draws the specified number of cards from deck to hand.
 */
export interface DrawAction {
  readonly type: "DRAW";
  readonly count: number;
  readonly player: "self" | "opponent";
}

// ============================================================================
// DAMAGE ACTION
// ============================================================================

/**
 * Deal damage action
 *
 * Deals effect damage to a target. Damage is tracked with counters.
 * See Official Rules Section 5-5.
 */
export interface DamageAction {
  readonly type: "DAMAGE";
  readonly amount: number;
  readonly target: "unit" | "base" | "shield";
  readonly targetSelector?: TargetFilter;
  readonly damageType: "effect";
}

// ============================================================================
// REST ACTION
// ============================================================================

/**
 * Rest action
 *
 * Changes a card's orientation from active to rested.
 * See Official Rules Section 5-4.
 */
export interface RestAction {
  readonly type: "REST";
  readonly target: TargetingSpec;
}

/**
 * Activate action
 *
 * Changes a card's orientation from rested to active.
 */
export interface ActivateAction {
  readonly type: "ACTIVATE";
  readonly target: TargetingSpec;
}

// ============================================================================
// MOVE CARD ACTION
// ============================================================================

/**
 * Move card action
 *
 * Moves a card from one zone to another.
 */
export interface MoveCardAction {
  readonly type: "MOVE_CARD";
  readonly from: ZoneType;
  readonly to: ZoneType;
  readonly target: TargetingSpec;
  readonly owner?: "self" | "opponent";
}

// ============================================================================
// SEARCH ACTION
// ============================================================================

/**
 * Search deck action
 *
 * Searches a zone for cards matching a filter and moves them to a destination.
 */
export interface SearchAction {
  readonly type: "SEARCH";
  readonly sourceZone?: ZoneType;
  readonly destination: ZoneType;
  readonly count: number;
  readonly filter: CardFilter;
  readonly reveal: boolean;
  readonly shuffleAfter: boolean;
}

// ============================================================================
// MODIFY STATS ACTION
// ============================================================================

/**
 * Modify stats action
 *
 * Temporarily or permanently modifies a unit's AP and/or HP.
 * See Official Rules Section 11-5: Stat Modifiers.
 */
export interface ModifyStatsAction {
  readonly type: "MODIFY_STATS";
  readonly target: TargetingSpec;
  readonly apModifier?: number;
  readonly hpModifier?: number;
  readonly duration: "permanent" | "this_turn" | "end_of_combat";
}

// ============================================================================
// GRANT KEYWORD ACTION
// ============================================================================

/**
 * Grant keyword action
 *
 * Grants a keyword to a target for a specified duration.
 */
export interface GrantKeywordAction {
  readonly type: "GRANT_KEYWORD";
  readonly target: TargetingSpec;
  readonly keyword: KeywordEffect;
  readonly duration: "permanent" | "this_turn" | "while_condition";
  readonly condition?: string; // Condition reference for "while_condition"
}

// ============================================================================
// DESTROY ACTION
// ============================================================================

/**
 * Destroy action
 *
 * Destroys a card, moving it to the trash.
 * See Official Rules Section 5-5-2.
 */
export interface DestroyAction {
  readonly type: "DESTROY";
  readonly target: TargetingSpec;
  readonly cannotBeDestroyed?: KeywordEffect[]; // Keywords that prevent destruction
}

// ============================================================================
// DISCARD ACTION
// ============================================================================

/**
 * Discard action
 *
 * Discards cards from hand to trash.
 */
export interface DiscardAction {
  readonly type: "DISCARD";
  readonly count: number;
  readonly player: "self" | "opponent";
  readonly random?: boolean;
}

// ============================================================================
// TARGETING SYSTEM
// ============================================================================

/**
 * Targeting Specification
 *
 * Defines how targets are selected for an effect.
 * See Official Rules Section 11-4: Targeting and Selection.
 */
export interface TargetingSpec {
  readonly count: number | TargetCountRange;
  readonly validTargets: TargetFilter[];
  readonly chooser: "controller" | "opponent";
  readonly timing: "on_declaration" | "on_resolution";
}

/**
 * Target count range
 *
 * Defines minimum and maximum number of targets to select.
 */
export interface TargetCountRange {
  readonly min: number;
  readonly max: number;
}

/**
 * Target Filter
 *
 * Defines criteria for selecting valid targets.
 * Multiple filters are combined with AND logic.
 */
export interface TargetFilter {
  readonly type: "unit" | "base" | "shield" | "card";
  readonly zone?: ZoneType;
  readonly owner: "self" | "opponent" | "any";
  readonly state?: TargetStateFilter;
  readonly properties?: TargetPropertyFilter;
}

/**
 * Target state filter
 *
 * Filters targets based on their current state.
 */
export interface TargetStateFilter {
  readonly rested?: boolean;
  readonly damaged?: boolean;
  readonly hasDamageAtLeast?: number;
}

/**
 * Target property filter
 *
 * Filters targets based on their card properties.
 */
export interface TargetPropertyFilter {
  readonly cardType?: CardType;
  readonly color?: Color;
  readonly trait?: string[];
  readonly cost?: CostFilter;
  readonly level?: LevelFilter;
}

/**
 * Card type filter
 */
export type CardType = "UNIT" | "PILOT" | "COMMAND" | "BASE";

/**
 * Color filter
 */
export type Color = "Red" | "Blue" | "Green" | "Black" | "White" | "Yellow";

/**
 * Cost filter
 */
export interface CostFilter {
  readonly min?: number;
  readonly max?: number;
  readonly exactly?: number;
}

/**
 * Level filter
 */
export interface LevelFilter {
  readonly min?: number;
  readonly max?: number;
  readonly exactly?: number;
}

// ============================================================================
// CARD FILTER (for search effects)
// ============================================================================

/**
 * Card Filter
 *
 * Similar to TargetFilter but used for searching zones rather than
 * selecting targets for effects.
 */
export interface CardFilter {
  readonly cardType?: CardType;
  readonly color?: Color;
  readonly trait?: string[];
  readonly name?: string;
  readonly cost?: CostFilter;
  readonly level?: LevelFilter;
  readonly hasKeyword?: KeywordEffect;
}

// ============================================================================
// EFFECT DEFINITION
// ============================================================================

/**
 * Effect Definition
 *
 * Complete definition of a card's effect including category, timing,
 * actions, and targeting requirements.
 *
 * This is the schema-level definition that appears on card definitions.
 */
export interface EffectDefinition {
  /** Unique identifier for this effect */
  readonly id: string;

  /** Effect category classification */
  readonly category: EffectCategory;

  /** When this effect can activate or resolve */
  readonly timing: EffectTiming;

  /** Actions performed by this effect */
  readonly actions: EffectAction[];

  /** Targeting requirements (if applicable) */
  readonly targeting?: TargetingSpec;

  /** Display text shown on the card */
  readonly text: string;
}

// ============================================================================
// EFFECT INSTANCE
// ============================================================================

/**
 * Effect Instance
 *
 * Runtime state of an effect that has been activated and is on the stack.
 *
 * Created when an effect is triggered/activated and tracked in the
 * effectStack until fully resolved.
 */
export interface EffectInstance {
  /** Unique instance identifier */
  readonly instanceId: string;

  /** Card that generated this effect */
  readonly sourceCardId: CardId;

  /** Player controlling this effect */
  readonly controllerId: PlayerId;

  /** Reference to the effect definition */
  readonly effectRef: {
    readonly effectId: string;
  };

  /** Current action being resolved (index into actions array) */
  readonly currentActionIndex: number;

  /** Selected targets for this effect */
  readonly targets?: CardId[];

  /** Current resolution state */
  readonly state: "pending" | "resolving" | "resolved" | "fizzled";
}

// ============================================================================
// EFFECT STACK STATE
// ============================================================================

/**
 * Effect Stack State
 *
 * Manages the stack of pending effects waiting to resolve.
 * Effects resolve in FIFO (First-In, First-Out) order.
 *
 * See Official Rules Section 11-3: Effect Resolution.
 */
export interface EffectStackState {
  /** Stack of effect instances */
  readonly stack: EffectInstance[];

  /** Counter for generating unique instance IDs (mutable) */
  nextInstanceId: number;
}

// ============================================================================
// TEMPORARY MODIFIER
// ============================================================================

/**
 * Unique identifier for a temporary modifier instance.
 * Allows tracking and removal of specific modifiers.
 */
export type ModifierId = string & { readonly brand: unique symbol };

/**
 * Base properties shared by all temporary modifier types.
 */
interface BaseTemporaryModifier {
  /** Unique identifier for this modifier instance */
  readonly id: ModifierId;

  /** AP modification */
  readonly apModifier?: number;

  /** HP modification */
  readonly hpModifier?: number;

  /** Keywords granted by effects */
  readonly grantedKeywords?: KeywordEffect[];

  /** Source of this modifier (for tracking/cleanup) */
  readonly sourceId: CardId;
}

/**
 * Modifier that expires at the end of the current turn.
 * Corresponds to `this_turn` duration in effect actions.
 */
export interface EndOfTurnModifier extends BaseTemporaryModifier {
  readonly duration: "end_of_turn";
}

/**
 * Modifier that expires at the end of combat.
 * Corresponds to `end_of_combat` duration in effect actions.
 */
export interface EndOfCombatModifier extends BaseTemporaryModifier {
  readonly duration: "end_of_combat";
}

/**
 * Modifier that never expires (persists until card leaves play).
 * Corresponds to `permanent` duration in effect actions.
 */
export interface PermanentModifier extends BaseTemporaryModifier {
  readonly duration: "permanent";
}

/**
 * Modifier that persists while a specific condition is true.
 * Corresponds to `while_condition` duration in effect actions.
 */
export interface WhileConditionModifier extends BaseTemporaryModifier {
  readonly duration: "while_condition";

  /** Condition reference that determines when this modifier expires */
  readonly condition: string;
}

/**
 * Temporary Modifier
 *
 * Discriminated union tracking temporary stat changes and keyword grants on cards.
 * These modifiers expire at specific timing points or when conditions are no longer met.
 *
 * The `duration` field acts as the discriminant, allowing type-safe narrowing:
 * - "end_of_turn": Removed during end phase cleanup
 * - "end_of_combat": Removed after combat resolution
 * - "permanent": Never expires (though card removal clears them)
 * - "while_condition": Expires when the specified condition becomes false
 *
 * Each modifier has a unique `id` for tracking and individual removal.
 *
 * @example
 * ```typescript
 * const endOfTurnBuff: TemporaryModifier = {
 *   id: createModifierId("mod-001"),
 *   duration: "end_of_turn",
 *   apModifier: 2,
 *   sourceId: "card-123"
 * };
 *
 * const conditionalKeyword: TemporaryModifier = {
 *   id: createModifierId("mod-002"),
 *   duration: "while_condition",
 *   condition: "has-pilot",
 *   grantedKeywords: ["Mobile"],
 *   sourceId: "card-456"
 * };
 *
 * // Type narrowing based on duration
 * if (modifier.duration === "while_condition") {
 *   // TypeScript knows modifier.condition exists here
 *   console.log(modifier.condition);
 * }
 * ```
 */
export type TemporaryModifier =
  | EndOfTurnModifier
  | EndOfCombatModifier
  | PermanentModifier
  | WhileConditionModifier;

// ============================================================================
// CARD DEFINITION EXTENSIONS
// ============================================================================

/**
 * Base Card Definition with Effects
 *
 * Common properties for all card types that can have effects.
 */
export interface BaseEffectCardDefinition {
  /** Unique card identifier */
  readonly id: string;

  /** Card name */
  readonly name: string;

  /** Card type */
  readonly cardType: CardType;

  /** Level (for units/commands/bases) */
  readonly lv: number;

  /** Resource cost to play */
  readonly cost: number;

  /** Card text displayed to players */
  readonly text?: string;

  /** Effects defined on this card */
  readonly effects: EffectDefinition[];
}

/**
 * Command Card Definition
 *
 * Command cards have effects that resolve when played.
 * Can have pilot effects and burst effects.
 */
export interface CommandCardDefinition extends BaseEffectCardDefinition {
  readonly cardType: "COMMAND";

  /** Pilot effect when paired with compatible unit */
  readonly pilotEffect?: PilotEffectDefinition;

  /** Burst effect that can activate at burst timing */
  readonly burstEffect?: EffectDefinition;
}

/**
 * Unit Card Definition
 *
 * Unit cards have stats and can have effects and keywords.
 */
export interface UnitCardDefinition extends BaseEffectCardDefinition {
  readonly cardType: "UNIT";

  /** Attack Power */
  readonly ap: number;

  /** Hit Points */
  readonly hp: number;

  /** Keywords inherent to this unit */
  readonly keywordEffects?: KeywordEffect[];

  /** Pilot that can pair with this unit (optional) */
  readonly compatiblePilot?: string;
}

/**
 * Pilot Effect Definition
 *
 * Modifier effects granted when a pilot is paired with a unit.
 */
export interface PilotEffectDefinition {
  /** AP modifier granted */
  readonly apModifier: number;

  /** HP modifier granted */
  readonly hpModifier: number;

  /** Additional effects granted */
  readonly effects: EffectDefinition[];
}

/**
 * Base Card Definition
 *
 * Base cards have effects and represent the player's base.
 */
export interface BaseCardDefinition extends BaseEffectCardDefinition {
  readonly cardType: "BASE";

  /** Base HP */
  readonly hp: number;

  /** Starting shield count */
  readonly startingShields: number;
}

// ============================================================================
// DISCRIMINATED UNION USAGE EXAMPLES
// ============================================================================

/**
 * Example: Type narrowing with discriminated unions
 *
 * ```typescript
 * function processAction(action: EffectAction): void {
 *   switch (action.type) {
 *     case "DRAW":
 *       // TypeScript knows action is DrawAction here
 *       console.log(`Draw ${action.count} cards`);
 *       break;
 *     case "DAMAGE":
 *       // TypeScript knows action is DamageAction here
 *       console.log(`Deal ${action.amount} damage`);
 *       break;
 *     // ... exhaustive handling of all action types
 *   }
 * }
 * ```
 */

/**
 * Example: Creating an effect definition
 *
 * ```typescript
 * const destroyEffect: EffectDefinition = {
 *   id: "destory-weak-unit",
 *   category: "triggered",
 *   timing: { type: "DEPLOY" },
 *   actions: [
 *     {
 *       type: "DESTROY",
 *       target: {
 *         count: 1,
 *         validTargets: [
 *           {
 *             type: "unit",
 *             owner: "opponent",
 *             properties: { cost: { max: 2 } }
 *           }
 *         ],
 *         chooser: "controller",
 *         timing: "on_resolution"
 *       }
 *     }
 *   ],
 *   text: "Destroy a unit with cost 2 or less."
 * };
 * ```
 */
