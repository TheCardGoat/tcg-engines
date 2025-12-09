import { cardEffectTargetPredicate } from "@lorcanito/lorcana-engine/effects/effectTargets";
import { modalEffectPredicate, } from "@lorcanito/lorcana-engine/effects/effectTypes";
import { AbilityModel } from "@lorcanito/lorcana-engine/store/models/AbilityModel";
import { calculateHowManyTargets, doesAbilityTargetPlayer, } from "@lorcanito/lorcana-engine/store/resolvers/targetsResolver";
import { logger } from "@lorcanito/shared/libs/logger";
import { makeAutoObservable, toJS } from "mobx";
export class StackLayerModel {
    source;
    instanceId;
    id;
    responder;
    ability;
    observable;
    rootStore;
    constructor(id, source, ability, rootStore, observable) {
        if (observable) {
            makeAutoObservable(this, {
                rootStore: false,
                observable: false,
            });
        }
        this.id = id;
        this.observable = observable;
        this.responder = ability.responder;
        this.rootStore = rootStore;
        this.instanceId = source.instanceId;
        this.source = source;
        this.ability = ability;
    }
    sync(effect) {
        throw new Error("We should not sync effects, they are only created");
    }
    toJSON() {
        return toJS({
            id: this.id,
            responder: this.responder,
            ability: this.ability.toJSON(),
            instanceId: this.source.instanceId,
        });
    }
    cancel() {
        this.rootStore.stackLayerStore.removeLayerFromStack(this);
        this.rootStore.log({ type: "CANCEL_EFFECT", effect: this.toJSON() });
        this.rootStore.changePriority(this.rootStore.turnPlayer);
    }
    skipEffect(recursiveCall = false) {
        this.rootStore.stackLayerStore.removeLayerFromStack(this);
        this.rootStore.log({
            type: "SKIP_EFFECT",
            ability: this.ability.ability,
            source: this.source.instanceId,
        });
        const skipLayer = this.ability.onCancelLayer();
        if (skipLayer) {
            this.rootStore.stackLayerStore.addAbilityToStack(new AbilityModel(skipLayer, this.source, this.rootStore, this.observable), this.source);
        }
        if (!recursiveCall && this.ability.hasDependentEffects) {
            logger.trace("No valid targets for dependent effect, Skipping resolution of dependant effects", this.ability.name);
            this.rootStore.stackLayerStore.layers
                .filter((layer) => layer.ability.ability.name === this.ability.ability.name)
                .forEach((layer) => {
                console.log("Skipping resolution of dependant effects", layer.ability.name);
                layer.skipEffect(true);
            });
        }
        this.rootStore.changePriority(this.rootStore.turnPlayer);
        return this.rootStore.moveResponse(true);
    }
    resolve(params = {}, opts = {}) {
        if (params.skip) {
            this.rootStore.debug("skipping effect");
            this.skipEffect();
            return false;
        }
        // 7.4.4. Some triggered abilities are written as [Trigger Condition], if [Secondary Condition], [Effect]. These abilities check whether
        // the secondary condition is true both when the effect would be added to the bag and again when the effect resolves.
        // 7.4.4.2. If the secondary condition is false when the effect would resolve, the triggered ability resolves with no effect.
        if (!this.ability.areConditionsMet) {
            this.rootStore.debug("Condition not met, skipping effect");
            this.rootStore.log({
                type: "CONDITION_NOT_MET",
                layer: this.toJSON(),
            });
            return true;
        }
        // Not having effect means this is an optional ability layer.
        // I have to work on this concept a bit more.
        if (this.ability.optional && !this.ability.accepted) {
            const ability = JSON.parse(JSON.stringify(this.ability.ability));
            this.rootStore.log({
                type: "OPTIONAL_ABILITY_ON_STACK_ACCEPTED",
                ability: ability,
                source: this.ability.source.instanceId,
            });
            const acceptedAbility = new AbilityModel({ ...ability, accepted: true }, this.ability.source, this.rootStore, this.observable);
            this.rootStore.stackLayerStore.addAbilityToStack(acceptedAbility, this.ability.source);
            return true;
        }
        // Activated abilities should verify conditions while activating
        if (!(this.ability.isActivatedAbility || this.ability.areConditionsMet)) {
            this.rootStore.debug("Condition not met, skipping effect");
            this.rootStore.log({
                type: "CONDITION_NOT_MET",
                layer: this.toJSON(),
            });
            this.skipEffect();
            return false;
        }
        // TODO: Should we change this to effect.hasTheRightAmountOfTargets?
        if (!this.ability.hasTheRightAmountOfTargets(params, this.responder)) {
            // In such cases, we have to cancel the effect
            if (this.ability.ability.dependentEffects) {
                return this.skipEffect();
            }
            this.rootStore.sendNotification({
                type: "icon",
                title: "Invalid number of targets.",
                message: `You're either targeting more or fewer cards than you should.`,
                icon: "warning",
                autoClear: true,
            });
            return false;
        }
        if (!this.ability.isValidResolvingParams(params, this.responder)) {
            this.rootStore.debug("Invalid target for resolving effect: ", this.ability.name);
            this.rootStore.sendNotification({
                type: "icon",
                title: "Invalid target for effect resolution",
                message: "You selected an invalid target for the effect",
                icon: "warning",
                autoClear: true,
            });
            return false;
        }
        // Static triggers vs Activated
        // activate pays cost before generating effect
        if (this.ability.type === "resolution" && this.ability.costs) {
            if (!this.source.canPayCosts(this.ability.costs, [], this.ability.responder)) {
                this.rootStore.log({
                    type: "CANT_PAY_COSTS",
                    //effect: this.toJSON()
                });
                this.skipEffect();
                this.rootStore.debug("Can't pay costs for effect");
                return false;
            }
            this.source.payCosts(this.ability.costs, [], this.ability.responder);
        }
        if (!opts.skipLogs) {
            this.rootStore.log({
                type: "RESOLVE_LAYER",
                layer: this.toJSON(),
                params: params,
            });
        }
        for (const effectModel of this.ability.effects) {
            try {
                if (this.ability.ability.nameACard && params.nameACard) {
                    effectModel?.replaceDynamicTargetFilters({
                        nameACard: params.nameACard,
                    });
                }
                if (this.ability.requiresPlayerTarget && params.targetPlayer) {
                    effectModel?.replaceDynamicTargets({
                        targetPlayer: params.targetPlayer,
                    });
                }
                if (this.ability.requiresPlayerTarget && !params.targetPlayer) {
                    console.error("No target player found for effect", this.ability.name);
                }
                effectModel.resolve(params);
            }
            catch (e) {
                // TODO: I have to find a better way of doing this
                this.rootStore.debug("Error resolving effect", e);
                return false;
            }
        }
        return true;
    }
    effectCardFilters() {
        const targets = this.ability.effectTargets();
        return targets.find(cardEffectTargetPredicate)?.filters || [];
    }
    // TODO: change this to effect
    targetAmount() {
        return calculateHowManyTargets(this.ability, this.rootStore);
    }
    // TODO: change this to effect
    // TODO: add unit tests to this
    hasValidTarget() {
        return this.ability.hasValidTarget;
    }
    isOptional() {
        return this.ability.optional;
    }
    get isNameACardLayer() {
        return this.ability.ability.nameACard;
    }
    get isModalLayer() {
        return this.ability.effects.some((effect) => effect.isModal);
    }
    get getModalEffectModes() {
        const modalEffect = this.ability.effects
            .map((effect) => effect.effect)
            .find(modalEffectPredicate);
        if (!modalEffect) {
            return [];
        }
        return modalEffect.modes;
    }
    get targetsPlayer() {
        return doesAbilityTargetPlayer(this.ability);
    }
    upToTarget() {
        return this.ability.isUpToTarget;
    }
    // TODO: There's a case that dependent effects will rely on the first effect to be resolved so the second one can be resolved
    // e.g. We don't talk about Bruno, first effect moves a card to hand, second effect discards a card
    isInvalidTargetResolution(skipResolution) {
        if (skipResolution) {
            return false;
        }
        return this.ability.isInvalidResolution;
    }
    requiresTarget() {
        return this.ability.requiresTarget;
    }
    requiresPlayerTarget() {
        return this.ability.requiresPlayerTarget;
    }
    getPotentialTargets() {
        return this.ability.potentialTargets();
    }
    getScryEffect() {
        return this.ability.getScryEffect();
    }
    get autoResolve() {
        return !(this.requiresTarget() || this.requiresPlayerTarget());
    }
    get name() {
        return this.ability.name;
    }
    get description() {
        return this.ability.text;
    }
    get responderToPlayer() {
        if (this.responder === "self") {
            return this.source.ownerId;
        }
        if (this.responder === "opponent") {
            return this.rootStore.opponentPlayer(this.source.ownerId);
        }
        return this.responder;
    }
}
//# sourceMappingURL=StackLayerModel.js.map