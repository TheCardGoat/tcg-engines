import type {
  ActivatedAbility,
  Cost,
  ResolutionAbility,
  StaticAbility,
  TriggeredAbility,
} from "@lorcanito/lorcana-engine/abilities/abilities";
import type { DynamicAmount } from "@lorcanito/lorcana-engine/abilities/amounts";
import type { Abilities } from "@lorcanito/lorcana-engine/cards/cardTypes";
import type {
  CardEffectTarget,
  PlayerEffectTarget,
} from "@lorcanito/lorcana-engine/effects/effectTargets";
import type { CardModel } from "@lorcanito/lorcana-engine/store/models/CardModel";
import type { Condition } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";
import type { NumericComparison } from "@lorcanito/lorcana-engine/store/resolvers/filterResolver";
import type { TargetFilter } from "@lorcanito/lorcana-engine/store/resolvers/filters";
import type { Zones } from "@lorcanito/lorcana-engine/types/types";

export type PlayerEffects =
  | LoreEffect
  | DrawEffect
  | ScryEffect
  | MillEffect
  | ShuffleDeckEffect
  | TargetCardEffect
  | CreateLayerForPlayer
  | CreateLayerTargetingPlayer
  | AdditionalInkwell
  | CreateLayerBasedOnCondition // not sure this is a player
  | PlayerRestrictionEffect;

export type CardEffects =
  | RevealEffect
  | RevealAndPlayEffect
  | ModalEffect
  | RevealTopCardEffect
  | RevealFromTopUntilCardEffect
  | PlayEffect
  | MoveToLocationEffect
  | CharacterMovingToLocation
  | ReplacementEffect
  | ShuffleEffect
  | AttributeEffect
  | MoveCardEffect
  | HealEffect
  | ExertEffect
  | CardRestrictionEffect
  | PutDamageEffect
  | DamageEffect
  | AbilityEffect
  | BanishEffect
  | ProtectionEffect
  | DiscardEffect
  | MoveDamageEffect
  | CreateLayerBasedOnTarget
  | MoveDamageToEffect
  | TargetConditionalEffect;

export type Effect = CardEffects | PlayerEffects;

export type ScryEffectPayload = {
  top?: CardModel[];
  bottom?: CardModel[];
  inkwell?: CardModel[];
  hand?: CardModel[];
  discard?: CardModel[];
  play?: CardModel[];
  // TODO: Revisit later
  // these fields should not be parte of the payload, they should come from the effect we're resolving
  shouldRevealTutored?: ScryEffect["shouldRevealTutored"];
  limits?: ScryEffect["limits"];
  tutorFilters?: ScryEffect["tutorFilters"];
  playFilters?: ScryEffect["playFilters"];
};

interface PlayerBaseEffect {
  type: PlayerEffects["type"];
  target: PlayerEffectTarget;
  conditions?: Condition[];
  // This flag will transform DynamicAmount into a number, before creating the layer or the triggered layer
  resolveAmountBeforeCreatingLayer?: boolean;
}

interface CardBaseEffect {
  type: CardEffects["type"];
  target: CardEffectTarget;
  amount?: number | DynamicAmount;
  conditions?: Condition[];
  // Resolve the subEffect for each target of the effect
  forEach?: Effect[];
  subEffect?: Effect;
  afterEffect?: CreateLayerBasedOnTarget[];
  // This flag will transform DynamicAmount into a number, before creating the layer or the triggered layer
  resolveAmountBeforeCreatingLayer?: boolean;
}

// This is the serialized version of the effect model
export interface ContinuousEffect {
  type: "continuous";
  id: string;
  // TODO: Source should not be optional
  source?: string;
  target?: string;
  playerTarget?: string;
  filters?: TargetFilter[];
  duration?: {
    // effect last until turn X
    turn: number;
    times?: number;
    challenge?: boolean;
    until?: boolean;
  };
  effect: Effect;
}

interface ContinuousBaseEffect {
  // TODO: Static effects should not have duration, they're valid as long as the source is in play
  duration?: "turn" | "next_turn" | "static" | "next" | "challenge";
  // This changes how duration behave.
  // Next turn means that the effect will start at the beginning of the next turn
  // if until is on, it starts immediately and lasts until the end of the next turn
  until?: boolean;
  nonAccumulative?: boolean; // If true, the effect will not stack with other effects of the same type
}

export interface CardContinuousEffect
  extends CardBaseEffect,
    ContinuousBaseEffect {}

interface PlayerContinuousEffect
  extends PlayerBaseEffect,
    ContinuousBaseEffect {}

export interface CardRestrictionEffect extends CardContinuousEffect {
  type: "restriction";
  restriction:
    | "quest"
    | "challenge"
    | "challenge-characters"
    | "be-challenged"
    | "damage-removal"
    | "damage-dealt"
    | "ready-at-start-of-turn";
  challengerFilters?: TargetFilter[]; // Optional field that is only used by "be-challenged" restriction
}

export interface PlayerRestrictionEffect extends PlayerContinuousEffect {
  type: "player-restriction";
  restriction: "play-action-cards" | "play-character-cards" | "gain-lore";
}

export interface AdditionalInkwell extends PlayerContinuousEffect {
  type: "additional-inkwell";
  amount: number | DynamicAmount;
}

// This is a duplicated effect, it's also called "restriction effect be-challenged"
export interface ProtectionEffect extends CardBaseEffect {
  type: "protection";
  from: "challenge" | "damage";
  as?: "attacker" | "defender";
}

export interface BanishEffect extends CardBaseEffect {
  type: "banish";
}

// This effect is used to target the owner of the card, adding a PlayerEffect to the owner
export interface TargetCardEffect extends Omit<PlayerBaseEffect, "target"> {
  type: "from-target-card-to-target-player";
  player: "card-owner" | "effect-owner";
  effects: PlayerEffects[];
  target: CardEffectTarget;
}

export interface LoreEffect extends PlayerBaseEffect {
  type: "lore";
  modifier: "add" | "subtract";
  amount: number | DynamicAmount;
}

// This effect will let the player resolve the effect, whereas CreateLayerTargetingPlayer will target the player keep active player resolving the effect
export interface CreateLayerForPlayer extends PlayerBaseEffect {
  type: "create-layer-for-player";
  layer: ResolutionAbility;
}

// This effect will target the player and keep the active player resolving the effect, whereas CreateLayerForPlayer will let the player resolve the effect
export interface CreateLayerTargetingPlayer extends PlayerBaseEffect {
  type: "create-layer-targeting-player";
  layer: ResolutionAbility;
}

export interface CreateLayerBasedOnCondition extends PlayerBaseEffect {
  type: "create-layer-based-on-condition";
  // It uses the target from another effect as reference
  // target?: never;
  conditionalEffects: Array<{
    conditions: Condition[];
    effects: Array<Exclude<Effect, CreateLayerBasedOnCondition>>;
  }>;
}

export interface CreateLayerBasedOnTarget extends CardBaseEffect {
  type: "create-layer-based-on-target";
  effects: Array<Exclude<Effect, CreateLayerBasedOnTarget>>;
  responder?: "self" | "opponent" | "target_card_owner";
  // It uses the target from another effect as reference
  // target?: never;
  filters?: TargetFilter[];
  numberOfMatchingTargets?: NumericComparison;
  replaceEffectTarget?: boolean; // If true, the effect will use the target of the effect that created this layer
  optional?: boolean;
  resolveEffectsIndividually?: boolean;
  fallback?: Array<Exclude<Effect, CreateLayerBasedOnTarget>>;
}

export interface ReplacementEffect extends CardContinuousEffect {
  type: "replacement";
  replacement: "cost" | "shift";
}

export interface TargetConditionalEffect extends CardBaseEffect {
  type: "target-conditional";
  effects: Array<Exclude<CardEffects | PlayerEffects, TargetConditionalEffect>>;
  fallback: Array<
    Exclude<CardEffects | PlayerEffects, TargetConditionalEffect>
  >;
}

export interface MillEffect extends PlayerBaseEffect {
  type: "mill";
  amount: number | DynamicAmount;
}

export interface ScryEffect extends PlayerBaseEffect {
  type: "scry";
  amount: number | DynamicAmount;
  shouldRevealTutored?: boolean;
  tutorFilters?: TargetFilter[];
  playFilters?: TargetFilter[];
  playExerted?: boolean;
  // TODO: Mode tells where to put the rest of the cards. We can remove this field and just use the limits
  mode: "top" | "bottom" | "both" | "inkwell" | "discard" | "none";
  limits?: {
    hand?: number | CardEffectTarget[]; // The Family Madrigal requires two different targets
    top?: number;
    bottom?: number;
    inkwell?: number;
    discard?: number;
    play?: number;
  };
}

export interface ExertEffect extends CardBaseEffect {
  type: "exert";
  exert: boolean;
}

// This effect is only responsible for half of the actual effect, when resolving it creates the second part of the effect
export interface MoveDamageEffect extends CardBaseEffect {
  type: "move-damage";
  amount: number | DynamicAmount;
  to: CardEffectTarget;
}

// This is a generated effect, it's always created by the MoveDamageEffect.
export interface MoveDamageToEffect extends CardBaseEffect {
  type: "move-damage-to";
  amount: number | DynamicAmount;
  from: string[]; //instanceId
}

export interface ShuffleEffect extends CardBaseEffect {
  type: "shuffle";
}

export interface HealEffect extends CardBaseEffect {
  type: "heal";
  amount: number | DynamicAmount;
}

export interface DamageEffect extends CardBaseEffect {
  type: "damage";
  amount: number | DynamicAmount;
}

export interface PutDamageEffect extends CardBaseEffect {
  type: "put-damage";
  amount: number | DynamicAmount;
}

export interface DrawEffect extends PlayerBaseEffect {
  type: "draw";
  amount: number | DynamicAmount;
}

export interface ShuffleDeckEffect extends PlayerBaseEffect {
  type: "shuffle-deck";
}

export interface DiscardEffect extends CardBaseEffect {
  type: "discard";
  amount: number | DynamicAmount;
}

export interface PlayEffect extends CardBaseEffect {
  type: "play";
  forFree: boolean;
  bottomCardAfterPlaying?: boolean;
  exerted?: boolean;
}

export interface MoveToLocationEffect extends CardBaseEffect {
  type: "move-to-location";
  to: CardEffectTarget;
}

// This is a generated effect, it's always created by the MoveDamageEffect.
export interface CharacterMovingToLocation extends CardBaseEffect {
  type: "character-moving-to-location";
  characters: string[];
}

export interface RevealEffect extends CardBaseEffect {
  type: "reveal";
}

export interface ModalEffectMode {
  id: string;
  text: string;
  optional?: boolean;
  resolveEffectsIndividually?: boolean;
  responder?: "self" | "opponent";
  effects: Array<Effect>;
}

export interface ModalEffect extends CardBaseEffect {
  type: "modal";
  modes: Array<ModalEffectMode>;
}

export interface RevealAndPlayEffect extends CardBaseEffect {
  type: "reveal-and-play";
  putInto: Zones;
  exerted?: boolean;
}

export interface RevealTopCardEffect extends CardBaseEffect {
  type: "reveal-top-card";
  // Sometimes parent's target is used to resolve children's effect, e.g. we known the way.
  useParentsTarget?: boolean;
  asOptionalLayer?: boolean;
  onTargetMatchEffects: Array<Effect>;
  onTargetMatchFailureEffects?: Array<Effect>;
}

export interface RevealFromTopUntilCardEffect extends CardBaseEffect {
  type: "reveal-from-top-until";
  onTargetMatchEffects: Array<Effect>;
}

export interface MoveCardEffect extends CardBaseEffect {
  type: "move";
  shouldRevealMoved?: boolean;
  exerted?: boolean;
  bottom?: boolean;
  to: Zones;
  isPrivate?: boolean;
}

export interface AttributeEffect extends CardContinuousEffect {
  type: "attribute";
  attribute:
    | "strength"
    | "willpower"
    | "lore"
    | "cost"
    | "moveCost"
    | "singCost";
  amount: number | DynamicAmount;
  modifier: "add" | "subtract";
}

export interface AbilityEffect extends CardContinuousEffect {
  type: "ability";
  ability: Abilities | "custom";
  customAbility?: TriggeredAbility | ActivatedAbility | StaticAbility;
  modifier: "add" | "remove";
}

export const attributeEffectPredicate = (
  effect?: Effect,
): effect is AttributeEffect => effect?.type === "attribute";

export const modalEffectPredicate = (effect?: Effect): effect is ModalEffect =>
  effect?.type === "modal";

export const strengthEffectPredicate = (
  effect?: Effect,
): effect is AttributeEffect =>
  attributeEffectPredicate(effect) && effect.attribute === "strength";

export const moveCostEffectPredicate = (
  effect?: Effect,
): effect is AttributeEffect =>
  attributeEffectPredicate(effect) && effect.attribute === "moveCost";

export const costEffectPredicate = (
  effect?: Effect,
): effect is AttributeEffect =>
  attributeEffectPredicate(effect) && effect.attribute === "cost";

export const willPowerEffectPredicate = (
  effect?: Effect,
): effect is AttributeEffect =>
  attributeEffectPredicate(effect) && effect.attribute === "willpower";

export const singCostEffectPredicate = (
  effect?: Effect,
): effect is AttributeEffect =>
  attributeEffectPredicate(effect) && effect.attribute === "singCost";

export const loreEffectPredicate = (
  effect?: Effect,
): effect is AttributeEffect =>
  attributeEffectPredicate(effect) && effect.attribute === "lore";

export const targetConditionalEffectPredicate = (
  effect?: Effect,
): effect is TargetConditionalEffect => effect?.type === "target-conditional";

export const scryEffectPredicate = (effect?: Effect): effect is ScryEffect =>
  effect?.type === "scry";

export const replacementEffectPredicate = (
  effect?: Effect,
): effect is ReplacementEffect => effect?.type === "replacement";

export const costReplacementEffectPredicate = (
  effect?: Effect,
): effect is ReplacementEffect =>
  replacementEffectPredicate(effect) && effect.replacement === "cost";

export const costReplacementShiftEffectPredicate = (
  effect?: Effect,
): effect is ReplacementEffect =>
  replacementEffectPredicate(effect) && effect.replacement === "shift";

export const protectionEffectPredicate = (
  effect?: Effect,
): effect is ProtectionEffect => effect?.type === "protection";

export const damageProtectionEffectPredicate = (
  effect?: Effect,
): effect is ProtectionEffect =>
  effect?.type === "protection" && effect.from === "damage";

export const restrictionEffectPredicate = (
  effect?: Effect,
): effect is CardRestrictionEffect => effect?.type === "restriction";

export const questRestrictionEffectPredicate = (
  effect?: Effect,
): effect is CardRestrictionEffect =>
  restrictionEffectPredicate(effect) && effect.restriction === "quest";

export const damageRemovalRestrictionEffectPredicate = (
  effect?: Effect,
): effect is CardRestrictionEffect =>
  restrictionEffectPredicate(effect) && effect.restriction === "damage-removal";

export const damageDealtRestrictionEffectPredicate = (
  effect?: Effect,
): effect is CardRestrictionEffect =>
  restrictionEffectPredicate(effect) && effect.restriction === "damage-dealt";

export const additionalInkwellEffectPredicate = (
  effect?: Effect,
): effect is CardRestrictionEffect => effect?.type === "additional-inkwell";

export const challengeRestrictionEffectPredicate = (
  effect?: Effect,
): effect is CardRestrictionEffect =>
  effect?.type === "restriction" && effect.restriction === "challenge";

export const challengeCharactersRestrictionEffectPredicate = (
  effect?: Effect,
): effect is CardRestrictionEffect =>
  effect?.type === "restriction" &&
  effect.restriction === "challenge-characters";

export const beChallengedRestrictionEffectPredicate = (
  effect?: Effect,
): effect is CardRestrictionEffect =>
  effect?.type === "restriction" && effect.restriction === "be-challenged";

export const readyAtStartOfTurnEffectPredicate = (
  effect?: Effect,
): effect is CardRestrictionEffect =>
  effect?.type === "restriction" &&
  effect.restriction === "ready-at-start-of-turn";

export const playActionCardsRestrictionEffectPredicate = (
  effect?: Effect,
): effect is PlayerRestrictionEffect =>
  effect?.type === "player-restriction" &&
  effect.restriction === "play-action-cards";

export const gainLoreRestrictionEffectPredicate = (
  effect?: Effect,
): effect is PlayerRestrictionEffect =>
  effect?.type === "player-restriction" && effect.restriction === "gain-lore";

export const damageEffectPredicate = (
  effect?: Effect,
): effect is DamageEffect => effect?.type === "damage";

export const discardEffectPredicate = (
  effect?: Effect,
): effect is DiscardEffect => effect?.type === "discard";

export const isDynamicAmount = (
  amount?: DynamicAmount | number | "all",
): amount is DynamicAmount => (amount as DynamicAmount).dynamic;

export const isDiscardCost = (
  cost: Cost | undefined,
): cost is {
  type: "card";
  action: "discard" | "exert" | "banish";
  amount: number;
  filters: TargetFilter[];
} => cost?.type === "card" && cost.action === "discard";
