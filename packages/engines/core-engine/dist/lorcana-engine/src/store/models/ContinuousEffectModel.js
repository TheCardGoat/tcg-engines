import { costReplacementShiftEffectPredicate, } from "@lorcanito/lorcana-engine";
import { costReplacementEffectPredicate, } from "@lorcanito/lorcana-engine/effects/effectTypes";
import { makeAutoObservable, toJS } from "mobx";
// Continuous effects are effects that last for a duration of time.
// They don't exist in the JSON structure that we call LorcanitoCard
// but they are saved in Firebase
export class ContinuousEffectModel {
    type = "continuous";
    id;
    source;
    target;
    playerTarget;
    filters;
    duration;
    effect;
    rootStore;
    constructor({ id, source, target, playerTarget, duration, effect, filters, rootStore, observable, }) {
        if (observable) {
            makeAutoObservable(this, {
                rootStore: false,
            });
        }
        this.id = id;
        this.source = source;
        this.target = target;
        this.duration = duration;
        // For some reason it's always set as false, and this increases the payload
        if (typeof this.duration?.challenge === "boolean" &&
            !this.duration.challenge) {
            this.duration.challenge = undefined;
        }
        this.effect = effect;
        this.filters = filters;
        this.playerTarget = playerTarget;
        this.rootStore = rootStore;
    }
    isValid(card) {
        if (this.target?.instanceId !== card.instanceId) {
            return false;
        }
        if (this.duration?.until && this.duration?.turn) {
            return this.rootStore.turnCount <= this.duration?.turn;
        }
        if (this.duration?.challenge) {
            return this.rootStore.stateMachineStore.challengeInProgress;
        }
        return this.duration?.turn === this.rootStore.turnCount;
    }
    isCostReplacementEffect(card) {
        const effect = this.effect.effect;
        return (costReplacementEffectPredicate(effect) &&
            card.matchesTargetFilter(effect.target.filters || []));
    }
    isShiftReplacementEffect(card) {
        const effect = this.effect.effect;
        return (costReplacementShiftEffectPredicate(effect) &&
            card.matchesTargetFilter(effect.target.filters || []));
    }
    cardPlayed(card) {
        const effect = this.effect.effect;
        if ((this.isCostReplacementEffect(card) ||
            this.isShiftReplacementEffect(card)) &&
            effect.type === "replacement" &&
            effect.duration === "next") {
            this.rootStore.trace(`Continuous effect ${this.id} was used and it's over`);
            this.rootStore.continuousEffectStore.stopContinuousEffect(this);
        }
    }
    changeTarget(target) {
        this.target = target;
        this.effect.changeTarget(target);
    }
    sync(effect) {
        throw new Error("We don't sync them, we just create them");
    }
    toJSON() {
        return {
            type: this.type,
            id: this.id,
            source: this.source?.instanceId,
            target: this.target?.instanceId,
            playerTarget: this.playerTarget,
            filters: toJS(this.filters),
            duration: toJS(this.duration),
            // TODO: This is not correct, it doesn't expose responder.
            effect: toJS(this.effect.effect),
        };
    }
    isNonAccumulative() {
        return this.effect.isNonAccumulative();
    }
    isEquivalent(effect) {
        if (this.source.instanceId !== effect.source.instanceId ||
            this.target?.instanceId !== effect.target?.instanceId) {
            return false;
        }
        function replacer(key, value) {
            if (key.toLowerCase() === "ID".toLowerCase()) {
                return undefined;
            }
            return value;
        }
        return JSON.stringify(this, replacer) === JSON.stringify(effect, replacer);
    }
}
//# sourceMappingURL=ContinuousEffectModel.js.map