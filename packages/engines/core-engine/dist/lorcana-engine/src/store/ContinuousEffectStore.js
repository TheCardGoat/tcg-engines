import { AbilityModel } from "@lorcanito/lorcana-engine";
import { notEmptyPredicate } from "@lorcanito/lorcana-engine/abilities/abilityTypeGuards";
import { damageDealtRestrictionEffectPredicate, damageRemovalRestrictionEffectPredicate, replacementEffectPredicate, } from "@lorcanito/lorcana-engine/effects/effectTypes";
import { ContinuousEffectModel } from "@lorcanito/lorcana-engine/store/models/ContinuousEffectModel";
import { EffectModel } from "@lorcanito/lorcana-engine/store/models/EffectModel";
import { doesEffectTargetPlayer, isValidPlayerEffectTarget, } from "@lorcanito/lorcana-engine/store/resolvers/targetsResolver";
import { mapContinuousEffectToAbility } from "@lorcanito/lorcana-engine/store/utils";
import { makeAutoObservable, toJS } from "mobx";
export class ContinuousEffectStore {
    continuousEffects;
    rootStore;
    observable;
    constructor(initialState = [], rootStore, observable) {
        if (observable) {
            makeAutoObservable(this, {
                rootStore: false,
                dependencies: false,
            });
        }
        this.observable = observable;
        this.rootStore = rootStore;
        this.continuousEffects = [];
        this.sync(initialState);
    }
    sync(effects = []) {
        if (!effects) {
            this.continuousEffects = [];
            return;
        }
        const rootStore = this.rootStore;
        this.continuousEffects = effects.map((effect) => {
            const { id, source, target, duration } = effect;
            const cardSource = rootStore.cardStore.getCard(source);
            const cardTarget = target ? rootStore.cardStore.getCard(target) : null;
            const playerTarget = effect.playerTarget;
            const responder = "self";
            const effectModel = new EffectModel(effect.effect, cardSource, // TODO: CardNotFound issue,
            responder, rootStore, this.observable);
            return new ContinuousEffectModel({
                id,
                source: cardSource, // TODO: CardNotFound issue
                target: cardTarget || null, // TODO: CardNotFound issue
                playerTarget,
                duration,
                effect: effectModel,
                filters: effect.filters || [],
                rootStore,
                observable: this.observable,
            });
        });
    }
    // Doing like this to leverage computed properties while not breaking expect toJSON behaviour
    // https://mobx.js.org/computeds.html
    toJSON() {
        if (this.continuousEffects.length === 0) {
            return undefined;
        }
        return toJS(this.continuousEffects.map((effect) => effect.toJSON()));
    }
    startContinuousEffect(effect) {
        if (effect.isNonAccumulative()) {
            const equivalentEffect = this.continuousEffects.find((existingEffect) => existingEffect.isEquivalent(effect));
            if (equivalentEffect) {
                this.rootStore.trace(`Continuous effect already exists: ${effect.id}`);
                return;
            }
        }
        this.rootStore.trace(`Starting continuous effect ${effect.source?.name} on ${effect.target?.name} for ${JSON.stringify(effect.duration)} (current turn: ${this.rootStore.turnCount}): ${JSON.stringify(effect)}`);
        this.continuousEffects.push(effect);
    }
    stopContinuousEffect(effect) {
        const effects = this.continuousEffects || [];
        const index = effects.findIndex((element) => element.id === effect.id);
        if (index !== -1) {
            effects.splice(index, 1);
        }
    }
    get length() {
        return this.continuousEffects.length;
    }
    findContinuousEffect(id) {
        return this.continuousEffects.find((effect) => effect.id === id);
    }
    onPlay(card) {
        this.continuousEffects
            .filter((continuous) => replacementEffectPredicate(continuous.effect.effect))
            .forEach((continuous) => continuous.cardPlayed(card));
    }
    onLeave(card) {
        const continuousEffectModels = this.continuousEffects.filter((continuous) => continuous.target?.instanceId === card.instanceId);
        // iterate the array in reverse order
        // so we can remove items without breaking the loop
        for (let i = continuousEffectModels.length - 1; i >= 0; i--) {
            const effect = continuousEffectModels[i];
            if (effect?.target?.instanceId === card?.instanceId) {
                this.rootStore.trace(`Continuous effect expired: ${effect.id} ${JSON.stringify(effect.duration)}`);
                this.stopContinuousEffect(effect);
            }
        }
    }
    onTurnPassed(turn) {
        // iterate the array in reverse order
        // so we can remove items without breaking the loop
        for (let i = this.continuousEffects.length - 1; i >= 0; i--) {
            const effect = this.continuousEffects[i];
            if (
            // turn can be 0
            effect?.duration?.turn !== undefined &&
                effect?.duration?.turn < turn) {
                this.rootStore.trace(`Continuous effect expired: ${effect.id} ${JSON.stringify(effect.duration)}`);
                this.stopContinuousEffect(effect);
            }
        }
    }
    onChallenge(attacker, defender) { }
    onChallengeFinished() {
        // iterate the array in reverse order
        // so we can remove items without breaking the loop
        for (let i = this.continuousEffects.length - 1; i >= 0; i--) {
            const effect = this.continuousEffects[i];
            if (effect?.duration?.challenge) {
                console.log(`During Challenge Continuous effect expired: ${effect.id} ${JSON.stringify(effect.duration)}`);
                this.stopContinuousEffect(effect);
            }
        }
    }
    findContinuousEffectsByCard(card) {
        return this.continuousEffects
            .filter((effect) => effect.target?.instanceId === card.instanceId)
            .filter((effect) => effect.isValid(card));
    }
    // TODO: Untangle this
    getGainedAbilitiesFromContinuousEffects(card, filters) {
        return this.findContinuousEffectsByCard(card)
            .filter((effect) => effect.effect.type === "ability")
            .map((effect) => {
            const ability = mapContinuousEffectToAbility(effect);
            if (ability) {
                const abilityModel = new AbilityModel(ability, card, this.rootStore, this.observable);
                abilityModel.comingFrom = effect.source;
                return abilityModel;
            }
        })
            .filter(notEmptyPredicate)
            .filter((ability) => filters.every((filter) => filter(ability)));
    }
    getQuestRestriction(card) {
        return this.rootStore.continuousEffectStore.continuousEffects
            .filter((continuous) => {
            const effect = continuous.effect.effect;
            return effect.type === "restriction" && effect.restriction === "quest";
        })
            .filter((continuous) => {
            return continuous.target?.instanceId === card.instanceId;
        });
    }
    getDamageRemovalRestriction(card) {
        return this.rootStore.continuousEffectStore.continuousEffects
            .filter((continuous) => {
            const effect = continuous.effect.effect;
            return damageRemovalRestrictionEffectPredicate(effect);
        })
            .filter((continuous) => {
            return continuous.target?.instanceId === card.instanceId;
        });
    }
    getDamageDealtRestriction(card) {
        return this.rootStore.continuousEffectStore.continuousEffects
            .filter((continuous) => {
            const effect = continuous.effect.effect;
            return damageDealtRestrictionEffectPredicate(effect);
        })
            .filter((continuous) => {
            return continuous.target?.instanceId === card.instanceId;
        });
    }
    getChallengeRestriction(card) {
        return this.rootStore.continuousEffectStore.continuousEffects
            .filter((continuous) => {
            const effect = continuous.effect.effect;
            return (effect.type === "restriction" && effect.restriction === "challenge");
        })
            .filter((continuous) => {
            return continuous.target?.instanceId === card.instanceId;
        });
    }
    getChallengeCharactersRestriction(card) {
        return this.rootStore.continuousEffectStore.continuousEffects
            .filter((continuous) => {
            const effect = continuous.effect.effect;
            return (effect.type === "restriction" &&
                effect.restriction === "challenge-characters");
        })
            .filter((continuous) => {
            return continuous.target?.instanceId === card.instanceId;
        });
    }
    getExertRestriction(card) {
        return this.rootStore.continuousEffectStore.continuousEffects
            .filter((continuous) => {
            const effect = continuous.effect.effect;
            return (effect.type === "restriction" &&
                effect.restriction === "ready-at-start-of-turn");
        })
            .filter((continuous) => {
            return continuous.target?.instanceId === card.instanceId;
        });
    }
    getPlayerEffects(playerId) {
        return this.rootStore.continuousEffectStore.continuousEffects
            .filter((continuous) => doesEffectTargetPlayer(continuous.effect.effect))
            .filter((continuous) => isValidPlayerEffectTarget(continuous.source, continuous.effect.effect, playerId));
    }
    moveEffectsToCard(param) {
        this.findContinuousEffectsByCard(param.from).forEach((effect) => {
            effect.changeTarget(param.to);
        });
    }
}
//# sourceMappingURL=ContinuousEffectStore.js.map