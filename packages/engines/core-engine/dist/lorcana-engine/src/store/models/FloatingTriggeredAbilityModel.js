import { AbilityModel, isValidAbilityTriggerTarget, } from "@lorcanito/lorcana-engine";
import { isConditionMet } from "@lorcanito/lorcana-engine/store/resolvers/conditionResolver";
import { makeAutoObservable } from "mobx";
export class FloatingTriggeredAbilityModel {
    cardSource;
    // cardTrigger: CardModel;
    id;
    // DelayedTriggeredAbility
    type = "floating-triggered";
    duration;
    layer;
    trigger;
    optional;
    responder;
    text;
    name;
    cost;
    conditions;
    rootStore;
    observable;
    constructor(id, ability, source, 
    // cardTrigger: CardModel,
    duration, rootStore, observable) {
        if (observable) {
            makeAutoObservable(this, {
                rootStore: false,
            });
        }
        this.observable = observable;
        this.rootStore = rootStore;
        this.cardSource = source;
        this.id = id;
        // We gotta make sure changes to the type DelayedTriggeredAbility are reflected in the constructor
        this.duration = duration;
        this.trigger = ability.trigger;
        this.optional = ability.optional;
        this.layer = ability.layer;
        this.responder = ability.responder;
        this.text = ability.text;
        this.name = ability.name;
        this.cost = ability.costs;
        this.conditions = ability.conditions;
    }
    sync(ability) {
        // We don't sync abilities, we just create new ones
    }
    replaceTriggerSourceAndTarget() {
        console.warn("NOT IMPLEMENTED replaceTriggerSourceAndTarget");
    }
    activate(target, params = {}) {
        if (this.isValidTrigger(target)) {
            this.rootStore.stackLayerStore.addAbilityToStack(new AbilityModel(this.layer, this.cardSource, this.rootStore, this.observable), this.cardSource, {
                addToTheBottomOfStack: true,
                skipAutoResolve: params.skipAutoResolve,
            });
        }
    }
    isValidTrigger(target, params = {}) {
        console.warn("NOT IMPLEMENTED isValidTrigger");
        return true;
    }
    isValidTarget(target) {
        console.warn("NOT IMPLEMENTED isValidTarget");
        return false;
    }
    replaceDynamicTargets(params) {
        console.warn("NOT IMPLEMENTED replaceDynamicTargets");
    }
    meetTriggerConditions() {
        if (!this.trigger.conditions) {
            return true;
        }
        return isConditionMet(this.rootStore, this.cardSource, this.trigger.conditions);
    }
    isValidTriggerTarget(target, params, debug = false) {
        if (!target) {
            debug && console.log("[isValidTriggerTarget] Target is undefined");
            return false;
        }
        return isValidAbilityTriggerTarget(this.rootStore, this, target, this.cardSource, debug);
    }
    toJSON() {
        return {
            type: "floating-triggered",
            trigger: this.trigger,
            optional: this.optional,
            layer: this.layer,
            responder: this.responder,
            text: this.text,
            name: this.name,
            costs: this.cost,
            duration: this.duration,
        };
    }
}
//# sourceMappingURL=FloatingTriggeredAbilityModel.js.map