import type { ActivatedAbility, Cost, ResolutionAbility, StaticAbility, TriggeredAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import type { DynamicAmount } from "@lorcanito/lorcana-engine/abilities/amounts";
import type { Abilities } from "@lorcanito/lorcana-engine/cards/cardTypes";
import type { CardEffectTarget, PlayerEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
import type { CardModel } from "@lorcanito/lorcana-engine/store/models/CardModel";
import type { Condition } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";
import type { NumericComparison } from "@lorcanito/lorcana-engine/store/resolvers/filterResolver";
import type { TargetFilter } from "@lorcanito/lorcana-engine/store/resolvers/filters";
import type { Zones } from "@lorcanito/lorcana-engine/types/types";
export type PlayerEffects = LoreEffect | DrawEffect | ScryEffect | MillEffect | ShuffleDeckEffect | TargetCardEffect | CreateLayerForPlayer | CreateLayerTargetingPlayer | AdditionalInkwell | CreateLayerBasedOnCondition | PlayerRestrictionEffect;
export type CardEffects = RevealEffect | RevealAndPlayEffect | ModalEffect | RevealTopCardEffect | RevealFromTopUntilCardEffect | PlayEffect | MoveToLocationEffect | CharacterMovingToLocation | ReplacementEffect | ShuffleEffect | AttributeEffect | MoveCardEffect | HealEffect | ExertEffect | CardRestrictionEffect | PutDamageEffect | DamageEffect | AbilityEffect | BanishEffect | ProtectionEffect | DiscardEffect | MoveDamageEffect | CreateLayerBasedOnTarget | MoveDamageToEffect | TargetConditionalEffect;
export type Effect = CardEffects | PlayerEffects;
export type ScryEffectPayload = {
    top?: CardModel[];
    bottom?: CardModel[];
    inkwell?: CardModel[];
    hand?: CardModel[];
    discard?: CardModel[];
    play?: CardModel[];
    shouldRevealTutored?: ScryEffect["shouldRevealTutored"];
    limits?: ScryEffect["limits"];
    tutorFilters?: ScryEffect["tutorFilters"];
    playFilters?: ScryEffect["playFilters"];
};
interface PlayerBaseEffect {
    type: PlayerEffects["type"];
    target: PlayerEffectTarget;
    conditions?: Condition[];
    resolveAmountBeforeCreatingLayer?: boolean;
}
interface CardBaseEffect {
    type: CardEffects["type"];
    target: CardEffectTarget;
    amount?: number | DynamicAmount;
    conditions?: Condition[];
    forEach?: Effect[];
    subEffect?: Effect;
    afterEffect?: CreateLayerBasedOnTarget[];
    resolveAmountBeforeCreatingLayer?: boolean;
}
export interface ContinuousEffect {
    type: "continuous";
    id: string;
    source?: string;
    target?: string;
    playerTarget?: string;
    filters?: TargetFilter[];
    duration?: {
        turn: number;
        times?: number;
        challenge?: boolean;
        until?: boolean;
    };
    effect: Effect;
}
interface ContinuousBaseEffect {
    duration?: "turn" | "next_turn" | "static" | "next" | "challenge";
    until?: boolean;
    nonAccumulative?: boolean;
}
export interface CardContinuousEffect extends CardBaseEffect, ContinuousBaseEffect {
}
interface PlayerContinuousEffect extends PlayerBaseEffect, ContinuousBaseEffect {
}
export interface CardRestrictionEffect extends CardContinuousEffect {
    type: "restriction";
    restriction: "quest" | "challenge" | "challenge-characters" | "be-challenged" | "damage-removal" | "damage-dealt" | "ready-at-start-of-turn";
    challengerFilters?: TargetFilter[];
}
export interface PlayerRestrictionEffect extends PlayerContinuousEffect {
    type: "player-restriction";
    restriction: "play-action-cards" | "play-character-cards" | "gain-lore";
}
export interface AdditionalInkwell extends PlayerContinuousEffect {
    type: "additional-inkwell";
    amount: number | DynamicAmount;
}
export interface ProtectionEffect extends CardBaseEffect {
    type: "protection";
    from: "challenge" | "damage";
    as?: "attacker" | "defender";
}
export interface BanishEffect extends CardBaseEffect {
    type: "banish";
}
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
export interface CreateLayerForPlayer extends PlayerBaseEffect {
    type: "create-layer-for-player";
    layer: ResolutionAbility;
}
export interface CreateLayerTargetingPlayer extends PlayerBaseEffect {
    type: "create-layer-targeting-player";
    layer: ResolutionAbility;
}
export interface CreateLayerBasedOnCondition extends PlayerBaseEffect {
    type: "create-layer-based-on-condition";
    conditionalEffects: Array<{
        conditions: Condition[];
        effects: Array<Exclude<Effect, CreateLayerBasedOnCondition>>;
    }>;
}
export interface CreateLayerBasedOnTarget extends CardBaseEffect {
    type: "create-layer-based-on-target";
    effects: Array<Exclude<Effect, CreateLayerBasedOnTarget>>;
    responder?: "self" | "opponent" | "target_card_owner";
    filters?: TargetFilter[];
    numberOfMatchingTargets?: NumericComparison;
    replaceEffectTarget?: boolean;
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
    fallback: Array<Exclude<CardEffects | PlayerEffects, TargetConditionalEffect>>;
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
    mode: "top" | "bottom" | "both" | "inkwell" | "discard" | "none";
    limits?: {
        hand?: number | CardEffectTarget[];
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
export interface MoveDamageEffect extends CardBaseEffect {
    type: "move-damage";
    amount: number | DynamicAmount;
    to: CardEffectTarget;
}
export interface MoveDamageToEffect extends CardBaseEffect {
    type: "move-damage-to";
    amount: number | DynamicAmount;
    from: string[];
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
    attribute: "strength" | "willpower" | "lore" | "cost" | "moveCost" | "singCost";
    amount: number | DynamicAmount;
    modifier: "add" | "subtract";
}
export interface AbilityEffect extends CardContinuousEffect {
    type: "ability";
    ability: Abilities | "custom";
    customAbility?: TriggeredAbility | ActivatedAbility | StaticAbility;
    modifier: "add" | "remove";
}
export declare const attributeEffectPredicate: (effect?: Effect) => effect is AttributeEffect;
export declare const modalEffectPredicate: (effect?: Effect) => effect is ModalEffect;
export declare const strengthEffectPredicate: (effect?: Effect) => effect is AttributeEffect;
export declare const moveCostEffectPredicate: (effect?: Effect) => effect is AttributeEffect;
export declare const costEffectPredicate: (effect?: Effect) => effect is AttributeEffect;
export declare const willPowerEffectPredicate: (effect?: Effect) => effect is AttributeEffect;
export declare const singCostEffectPredicate: (effect?: Effect) => effect is AttributeEffect;
export declare const loreEffectPredicate: (effect?: Effect) => effect is AttributeEffect;
export declare const targetConditionalEffectPredicate: (effect?: Effect) => effect is TargetConditionalEffect;
export declare const scryEffectPredicate: (effect?: Effect) => effect is ScryEffect;
export declare const replacementEffectPredicate: (effect?: Effect) => effect is ReplacementEffect;
export declare const costReplacementEffectPredicate: (effect?: Effect) => effect is ReplacementEffect;
export declare const costReplacementShiftEffectPredicate: (effect?: Effect) => effect is ReplacementEffect;
export declare const protectionEffectPredicate: (effect?: Effect) => effect is ProtectionEffect;
export declare const damageProtectionEffectPredicate: (effect?: Effect) => effect is ProtectionEffect;
export declare const restrictionEffectPredicate: (effect?: Effect) => effect is CardRestrictionEffect;
export declare const questRestrictionEffectPredicate: (effect?: Effect) => effect is CardRestrictionEffect;
export declare const damageRemovalRestrictionEffectPredicate: (effect?: Effect) => effect is CardRestrictionEffect;
export declare const damageDealtRestrictionEffectPredicate: (effect?: Effect) => effect is CardRestrictionEffect;
export declare const additionalInkwellEffectPredicate: (effect?: Effect) => effect is CardRestrictionEffect;
export declare const challengeRestrictionEffectPredicate: (effect?: Effect) => effect is CardRestrictionEffect;
export declare const challengeCharactersRestrictionEffectPredicate: (effect?: Effect) => effect is CardRestrictionEffect;
export declare const beChallengedRestrictionEffectPredicate: (effect?: Effect) => effect is CardRestrictionEffect;
export declare const readyAtStartOfTurnEffectPredicate: (effect?: Effect) => effect is CardRestrictionEffect;
export declare const playActionCardsRestrictionEffectPredicate: (effect?: Effect) => effect is PlayerRestrictionEffect;
export declare const gainLoreRestrictionEffectPredicate: (effect?: Effect) => effect is PlayerRestrictionEffect;
export declare const damageEffectPredicate: (effect?: Effect) => effect is DamageEffect;
export declare const discardEffectPredicate: (effect?: Effect) => effect is DiscardEffect;
export declare const isDynamicAmount: (amount?: DynamicAmount | number | "all") => amount is DynamicAmount;
export declare const isDiscardCost: (cost: Cost | undefined) => cost is {
    type: "card";
    action: "discard" | "exert" | "banish";
    amount: number;
    filters: TargetFilter[];
};
export {};
//# sourceMappingURL=effectTypes.d.ts.map