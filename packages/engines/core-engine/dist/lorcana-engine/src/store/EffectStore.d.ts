import { type Abilities, type AbilityModel, type EffectModel, type Trigger } from "@lorcanito/lorcana-engine";
import type { AbilityFilter, CardModel } from "@lorcanito/lorcana-engine/store/models/CardModel";
import type { MobXRootStore } from "@lorcanito/lorcana-engine/store/RootStore";
import { type WhileCondition } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";
export declare class EffectStore {
    private readonly rootStore;
    private readonly observable;
    evaluatedAbilities: AbilityModel[];
    nonEvaluatedAbilities: AbilityModel[];
    private evaluatedForHash;
    private isInitialising;
    constructor(rootStore: MobXRootStore, observable: boolean);
    hasRestrictionToPlayActionCard(card: CardModel): boolean;
    hasGainLoreRestriction(playerId: string): EffectModel;
    getPlayerAbilities(playerId: string, convertGainedAbilities?: boolean): AbilityModel[];
    getPlayerEffects(playerId: string, convertGainedAbilities?: boolean): EffectModel[];
    hasDiscardRestriction(cardModel: CardModel): boolean;
    damageRemovalRestrictionEffect(targetCard: CardModel): AbilityModel[];
    damageDealtRestrictionEffect(targetCard: CardModel): AbilityModel[];
    hasQuestRestriction(targetCard: CardModel): boolean;
    hasChallengeRestriction(cardModel: CardModel): boolean;
    hasChallengeCharactersRestriction(cardModel: CardModel): boolean;
    getShiftModifier(cardModel: CardModel): number;
    getCostModifier(cardModel: CardModel): number;
    getCostAttributeModifier(cardModel: CardModel): number;
    getWillPowerModifier(cardModel: CardModel): number;
    getSingCostModifier(cardModel: CardModel): number;
    getLoreModifier(cardModel: CardModel): number;
    getStrengthModifier(cardModel: CardModel): number;
    getMoveCostModifier(cardModel: CardModel): number;
    private getStaticGainedAbilities;
    metCondition(sourceCard: CardModel, conditions?: WhileCondition[]): boolean;
    calculateDynamicEffectAmount(effect: EffectModel, target: CardModel): number;
    get getAllNativeAbilities(): AbilityModel[];
    private evaluateAllAbilities;
    getDamageReductionForCard(params: {
        cardModel: CardModel;
        isChallenge?: boolean;
        damageSource?: CardModel;
        isAttacker?: boolean;
        isDefender?: boolean;
    }): number;
    getCardEffects(cardModel: CardModel, filters?: AbilityFilter[], targetCard?: CardModel): EffectModel[];
    getAbilitiesEffectsForCard(card: CardModel, filters?: AbilityFilter[]): EffectModel[];
    getResolutionAbilitiesForCard(card: CardModel): AbilityModel[];
    getActivatedAbilityForCard(card: CardModel, abilityName?: string): AbilityModel;
    getStaticAbilitiesForCard(card: CardModel, keyword: Abilities): AbilityModel[];
    getTriggeredAbilitiesForCard(card: CardModel, filter: (ability: {
        trigger: Trigger;
    }) => boolean): AbilityModel[];
    getAbilitiesForCard(card: CardModel, filters?: AbilityFilter[]): AbilityModel[];
    reEvaluateAbilities(hash: string): void;
    setEvaluatedForHash(hash: string): void;
    private initializeAbilities;
    allAbilitiesByFilters(filters?: AbilityFilter[]): AbilityModel[];
}
//# sourceMappingURL=EffectStore.d.ts.map