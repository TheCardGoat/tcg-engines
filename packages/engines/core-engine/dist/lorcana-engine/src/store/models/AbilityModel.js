import { activatedAbilityPredicate, challengerAbilityPredicate, delayedTriggeredAbilityPredicate, gainStaticAbilityPredicate, notEmptyPredicate, resolutionAbilityPredicate, restrictionStaticAbilityPredicate, reverseChallengerAbilityPredicate, singerStaticAbilityPredicate, staticAbilityPredicate, staticTriggeredAbilityPredicate, } from "@lorcanito/lorcana-engine/abilities/abilityTypeGuards";
import { cardEffectTargetPredicate, playerEffectTargetPredicate, } from "@lorcanito/lorcana-engine/effects/effectTargets";
import { costEffectPredicate, costReplacementEffectPredicate, costReplacementShiftEffectPredicate, damageDealtRestrictionEffectPredicate, damageRemovalRestrictionEffectPredicate, isDynamicAmount, loreEffectPredicate, moveCostEffectPredicate, questRestrictionEffectPredicate, readyAtStartOfTurnEffectPredicate, scryEffectPredicate, singCostEffectPredicate, strengthEffectPredicate, targetConditionalEffectPredicate, willPowerEffectPredicate, } from "@lorcanito/lorcana-engine/effects/effectTypes";
import { EffectModel } from "@lorcanito/lorcana-engine/store/models/EffectModel";
import { isSelfReferencingCondition, } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";
import { calculateDynamicAmount } from "@lorcanito/lorcana-engine/store/resolvers/dynamicAmount";
import { isSelfReferencingFilter } from "@lorcanito/lorcana-engine/store/resolvers/filterResolver";
import { hasValidTarget, isUpToTarget, matchesTargetFilters, } from "@lorcanito/lorcana-engine/store/resolvers/targetsResolver";
import { makeAutoObservable } from "mobx";
export class AbilityModel {
    _effects;
    source;
    // This is used by GainedAbilities to flag who's giving the ability
    comingFrom;
    ability;
    rootStore;
    observable;
    constructor(ability, source, rootStore, observable) {
        if (observable) {
            makeAutoObservable(this, {
                rootStore: false,
                observable: false,
                ability: false,
            });
        }
        // beast relentless was causing this issue
        this.ability = JSON.parse(JSON.stringify(ability));
        this.observable = observable || rootStore.observable;
        this.source = source;
        this.rootStore = rootStore;
        this._effects =
            this.ability.effects?.map((effect) => new EffectModel(effect, this.source, this.responder, this.rootStore, this.observable)) || [];
        if ("effect" in this.ability && this.ability.effect) {
            this._effects.push(new EffectModel(
            // @ts-expect-error
            this.ability.effect, this.source, this.responder, this.rootStore, this.observable));
        }
        // if ("effects" in this.ability && Array.isArray(this.ability.effects)) {
        //   for (const effect of this.ability.effects) {
        //     this._effects.push(
        //       new EffectModel(
        //         effect,
        //         this.source,
        //         this.responder,
        //         this.rootStore,
        //         this.observable,
        //       ),
        //     );
        //   }
        // }
        if (gainStaticAbilityPredicate(ability)) {
            this._effects =
                ability.gainedAbility.effects?.map((effect) => new EffectModel(effect, this.source, this.responder, this.rootStore, this.observable)) || [];
        }
    }
    sync(effect) { }
    toJSON() {
        if (!this.ability.name) {
            const match = this.source.lorcanitoCard.text?.match(/\*\*(.*?)\*\*/);
            if (match && match[1]) {
                this.ability.name = match[1]
                    .toLowerCase()
                    .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
            }
        }
        return this.ability;
    }
    get effects() {
        return this._effects;
    }
    get isInvalidResolution() {
        return !(this.hasValidTarget || this.isUpToTarget);
    }
    get hasValidTarget() {
        return hasValidTarget(this);
    }
    // TODO: this can cause problem as calculateAmount requires targets as params
    get allEffectsHaveZeroAmount() {
        const everyEffectHasAmount = this._effects.every((effect) => {
            const rawEffect = effect.effect;
            const effectHasAmountProperty = "amount" in rawEffect;
            // This function doesn't receive target, so these effects can only be known once player chooses a target
            if (effectHasAmountProperty && isDynamicAmount(rawEffect.amount)) {
                return !rawEffect.amount.target;
            }
            return effectHasAmountProperty;
        });
        if (!everyEffectHasAmount) {
            return false;
        }
        return this._effects.every((effect) => effect.calculateAmount() === 0);
    }
    get isUpToTarget() {
        return isUpToTarget(this);
    }
    get resolveEffectsIndividually() {
        return this.ability.resolveEffectsIndividually;
    }
    get costs() {
        return "costs" in this.ability ? this.ability.costs : undefined;
    }
    get type() {
        return this.ability.type;
    }
    get optional() {
        if (this.rootStore.configurationStore.autoAcceptOptionals) {
            return false;
        }
        return !!this.ability.optional;
    }
    get accepted() {
        return !!this.ability.accepted;
    }
    get name() {
        return this.ability.name || this.source.fullName;
    }
    get text() {
        return this.ability.text || this.source.lorcanitoCard.text || "";
    }
    get conditions() {
        const ability = this.ability;
        if (resolutionAbilityPredicate(ability)) {
            return ability.resolutionConditions || [];
        }
        return ability.conditions || [];
    }
    get secondaryConditions() {
        const ability = this.ability;
        if (staticTriggeredAbilityPredicate(ability)) {
            return ability.secondaryConditions || [];
        }
        return [];
    }
    get areConditionsMet() {
        return this.rootStore.effectStore.metCondition(this.source, this.conditions);
    }
    get areSecondaryConditionsMet() {
        return this.rootStore.effectStore.metCondition(this.source, this.secondaryConditions);
    }
    get hasSelfReferencingCondition() {
        return this.conditions.some(isSelfReferencingCondition);
    }
    get hasSelfReferencingTarget() {
        const hasSelfReferencingEffectTarget = this._effects.some((effect) => effect.hasSelfReferencingTarget);
        if (hasSelfReferencingEffectTarget) {
            return hasSelfReferencingEffectTarget;
        }
        if (cardEffectTargetPredicate(this.ability.target)) {
            return this.ability.target.filters.some(isSelfReferencingFilter);
        }
        return false;
    }
    // See engine/store/resolver/README.md
    get evaluate() {
        try {
            return this.hasValidTarget && this.areConditionsMet;
        }
        catch (e) {
            console.error("Error evaluating ability", e);
            return false;
        }
    }
    // See engine/store/resolver/README.md
    get shouldDelayEvaluation() {
        return this.hasSelfReferencingCondition || this.hasSelfReferencingTarget;
    }
    get conditionalEffects() {
        return this.ability.effects?.find(targetConditionalEffectPredicate);
    }
    get scryEffect() {
        return this.ability?.effects?.find(scryEffectPredicate);
    }
    get isResolutionAbility() {
        return resolutionAbilityPredicate(this.ability);
    }
    get responder() {
        const sourceOwner = this.source.ownerId;
        return this.ability.responder === "opponent"
            ? this.rootStore.opponentPlayer(sourceOwner)
            : sourceOwner;
    }
    potentialTargets() {
        if (cardEffectTargetPredicate(this.ability.target)) {
            const target = this.ability.target;
            const validTargets = this.rootStore.cardStore.getCardsByTargetFilter(target.filters, this.responder, this.source, undefined);
            const result = validTargets.filter((card) => this.canTargetCard(card));
            return result;
        }
        let effectsToLookForTarget = this._effects;
        if (this.hasDependentEffects && this.resolveEffectsIndividually) {
            effectsToLookForTarget = [this._effects[this._effects.length - 1]].filter(notEmptyPredicate);
        }
        const cardModels = effectsToLookForTarget
            .reduce((acc, effect) => {
            const potentialTargets = effect.potentialTargets;
            return [...acc, ...potentialTargets];
        }, [])
            .filter((card) => card.zone === "play"
            ? !card.hasWard || card.ownerId === this.responder
            : true);
        return cardModels;
    }
    hasTheRightAmountOfTargets(params = {}, responder) {
        const { targets } = params;
        // TODO: We're currently only looking at the first target
        // the new set will require two targets, so we need to change this
        const cardTargets = this.ability.effects
            ?.map((effect) => effect.target)
            .filter(notEmptyPredicate)
            .filter(cardEffectTargetPredicate) || [];
        // TODO" I'm only looking at the first effect, this is wrong
        // To understand this better look at you have forgotten me
        const effectTarget = cardTargets[0];
        const cards = targets;
        if (!(cards && effectTarget)) {
            return true;
        }
        // Targeting all
        if (!effectTarget.value || typeof effectTarget.value === "string") {
            return true;
        }
        // Should this use target.value or ability.amount?
        // TODO: I should refactor this, but It broke a whole lot of tests, I focusing on something else now.
        // I come back to this later
        const requiredNumberOfTargets = isDynamicAmount(effectTarget.value)
            ? calculateDynamicAmount(effectTarget.value, this.rootStore, targets, this.source, effectTarget)
            : effectTarget.value;
        this.rootStore.trace("requiredNumberOfTargets", requiredNumberOfTargets, effectTarget.value);
        // Single target
        if (requiredNumberOfTargets === cards.length &&
            requiredNumberOfTargets === 1) {
            return true;
        }
        if (requiredNumberOfTargets === cards.length) {
            return true;
        }
        if (cards.length > requiredNumberOfTargets) {
            this.rootStore.debug("Selected more targets than required");
            return false;
        }
        // If the user has chosen fewer targets than the effect requires, we need to check if there are other targets that the user should have chosen,
        // if there are, the player should be notified
        if (cards.length < requiredNumberOfTargets) {
            if (effectTarget.upTo) {
                return true;
            }
            // In such a cases, we should fail the resolution as an subsequent effects might depend on this one
            if (this.ability.dependentEffects) {
                return false;
            }
            const filters = effectTarget ? effectTarget.filters : [];
            const allValidTargets = this.rootStore.cardStore.getCardsByTargetFilter(filters, responder);
            // If they're targeting fewer targets than needed
            return cards.length >= allValidTargets.length;
        }
        return true;
    }
    // TODO: This should be effects.every(effect => effect.isValidTarget)
    isValidResolvingParams(params = {}, responder) {
        if (this.ability.nameACard && !params.nameACard) {
            console.warn("Ability requires player to name a card");
            return false;
        }
        // TODO: better handle effects that target player
        const allEffectsTargets = this.ability.effects
            ?.map((effect) => effect.target)
            .filter(notEmptyPredicate) || [];
        const playerFilter = allEffectsTargets.find(playerEffectTargetPredicate);
        if (playerFilter) {
            return true;
        }
        if (!allEffectsTargets.length) {
            return true;
        }
        if (!params.targets) {
            return true;
        }
        return this._effects.every((effect) => {
            return params.targets?.every((target) => effect.canTargetCard(target, this.responder, undefined, params));
        });
    }
    get requiresTarget() {
        if (this.ability.nameACard) {
            this.rootStore.trace("Ability requires player to name a card");
            return true;
        }
        return this._effects?.some((effect) => effect.requiresTarget());
    }
    get requiresPlayerTarget() {
        return this._effects?.some((effect) => effect.requiresPlayerTarget());
    }
    effectTargets() {
        const conditionalEffect = this.conditionalEffects;
        if (targetConditionalEffectPredicate(conditionalEffect)) {
            return (conditionalEffect.fallback
                ?.map((effect) => effect.target)
                .filter(notEmptyPredicate) || []);
        }
        return (this.ability.effects
            ?.map((effect) => effect.target)
            .filter(notEmptyPredicate) || []);
    }
    onCancelLayer() {
        const ability = this.ability;
        if (this.optional && resolutionAbilityPredicate(ability)) {
            return ability.onCancelLayer;
        }
        return undefined;
    }
    getScryEffect() {
        const found = this._effects.find((effect) => effect.isScryEffect())?.effect;
        if (scryEffectPredicate(found)) {
            return found;
        }
        return undefined;
    }
    // canTargetCard(targetCard: CardModel): boolean {
    //   return this._effects.every((effect) =>
    //       effect.canTargetCard(targetCard, this.source.ownerId, true),
    //   );
    // }
    canTargetItSelf() {
        return !(cardEffectTargetPredicate(this.ability.target) &&
            this.ability.target.excludeSelf);
    }
    // EFFECT TARGET IS DIFFERENT FROM ABILITY TARGET
    canEffectsTargetCard(targetCard) {
        if (targetCard.instanceId === this.source.instanceId &&
            !this.canTargetItSelf()) {
            return false;
        }
        // TODO: This can cause problem when one of the effects targets player and another card
        return this._effects.every((effect) => effect.canTargetCard(targetCard, this.source.ownerId, true));
    }
    // EFFECT TARGET IS DIFFERENT FROM ABILITY TARGET
    canTargetCard(targetCard) {
        if (!this.areConditionsMet) {
            return false;
        }
        const matchesFilter = matchesTargetFilters(this.rootStore, targetCard, this?.ability.target, this.source.ownerId, this.source);
        // TODO: We must unify this with canEffectsTargetCard
        // Ward checks is being done in multiple places
        // if (this.source.instanceId !== targetCard.instanceId) {
        //   if (targetCard.zone === "play" && targetCard.hasWard) {
        //     return false;
        //   }
        // }
        return matchesFilter;
    }
    get resolveAmountBeforeCreatingLayer() {
        return this.ability.resolveAmountBeforeCreatingLayer;
    }
    get isStaticAbility() {
        return staticAbilityPredicate(this.ability);
    }
    get isGainStaticAbility() {
        return gainStaticAbilityPredicate(this.ability);
    }
    get isSingAbility() {
        return singerStaticAbilityPredicate(this.ability);
    }
    // This one doesn't evaluate whether the "sub ability" is an activated ability
    // it only checks the top level ability
    get isRawActivatedAbility() {
        return activatedAbilityPredicate(this.ability);
    }
    get isActivatedAbility() {
        return this.hasAbility(activatedAbilityPredicate);
    }
    get isChallengerAbility() {
        return challengerAbilityPredicate(this.ability);
    }
    get isReverseChallengerAbility() {
        return reverseChallengerAbilityPredicate(this.ability);
    }
    get isStaticTriggeredAbility() {
        return staticTriggeredAbilityPredicate(this.ability);
    }
    get isDelayedTriggered() {
        return delayedTriggeredAbilityPredicate(this.ability);
    }
    get hasReadyAtStartOfTurnPreventionEffect() {
        return this.hasEffect((effect) => readyAtStartOfTurnEffectPredicate(effect.effect));
    }
    get hasLoreAttributeEffect() {
        return this.hasEffect((effect) => loreEffectPredicate(effect.effect));
    }
    get hasCostReplacementEffect() {
        return this.hasEffect((effect) => costReplacementEffectPredicate(effect.effect));
    }
    get hasShiftReplacementEffect() {
        return this.hasEffect((effect) => costReplacementShiftEffectPredicate(effect.effect));
    }
    get hasStrengthAttributeEffect() {
        return this.hasEffect((effect) => strengthEffectPredicate(effect.effect));
    }
    get hasQuestRestrictionEffect() {
        const hasRestrictionEffect = this.hasEffect((effect) => questRestrictionEffectPredicate(effect.effect));
        if (hasRestrictionEffect) {
            return hasRestrictionEffect;
        }
        if ("ability" in this.ability) {
            // @ts-expect-error TODO: fix this, the ability has a sub-ability and it's wrongly typed
            return restrictionStaticAbilityPredicate(this.ability.ability);
        }
        return restrictionStaticAbilityPredicate(this.ability);
    }
    get hasDamageRemovalRestrictionEffect() {
        const hasRestrictionEffect = this.hasEffect((effect) => damageRemovalRestrictionEffectPredicate(effect.effect));
        if (hasRestrictionEffect) {
            return hasRestrictionEffect;
        }
        if ("ability" in this.ability) {
            // @ts-expect-error TODO: fix this, the ability has a sub-ability and it's wrongly typed
            return restrictionStaticAbilityPredicate(this.ability.ability);
        }
        return restrictionStaticAbilityPredicate(this.ability);
    }
    get hasDamageDealtRestrictionEffect() {
        const hasRestrictionEffect = this.hasEffect((effect) => damageDealtRestrictionEffectPredicate(effect.effect));
        if (hasRestrictionEffect) {
            return hasRestrictionEffect;
        }
        if ("ability" in this.ability) {
            // @ts-expect-error TODO: fix this, the ability has a sub-ability and it's wrongly typed
            return restrictionStaticAbilityPredicate(this.ability.ability);
        }
        return restrictionStaticAbilityPredicate(this.ability);
    }
    get hasMoveCostAttributeEffect() {
        return this.hasEffect((effect) => moveCostEffectPredicate(effect.effect));
    }
    get hasCostAttributeEffect() {
        return this.hasEffect((effect) => costEffectPredicate(effect.effect));
    }
    get hasWillPowerAttributeEffect() {
        return this.hasEffect((effect) => willPowerEffectPredicate(effect.effect));
    }
    get hasSingCostAttributeEffect() {
        return this.hasEffect((effect) => singCostEffectPredicate(effect.effect));
    }
    get hasDependentEffects() {
        return this.ability.dependentEffects;
    }
    hasEffect(predicate) {
        return this._effects.some(predicate);
    }
    hasAbility(predicate) {
        const ability = this.ability;
        if (gainStaticAbilityPredicate(ability)) {
            return predicate(ability.gainedAbility);
        }
        return predicate(ability);
    }
    convert(targetCard) {
        const ability = this.ability;
        if (gainStaticAbilityPredicate(ability)) {
            const newModel = new AbilityModel(ability.gainedAbility, targetCard, this.rootStore, this.observable);
            newModel.comingFrom = this.source;
            return newModel;
        }
        return undefined;
    }
    resolveAmount(params) {
        for (const effect of this.effects) {
            effect.resolveAmount(params);
        }
    }
}
//# sourceMappingURL=AbilityModel.js.map