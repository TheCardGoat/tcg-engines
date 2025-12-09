import { cardEffectTargetPredicate, exhaustiveCheck, matchesTargetFilters, staticTriggeredAbilityPredicate, } from "@lorcanito/lorcana-engine";
// TODO: This function is sort of duplicated by StaticTriggeredModel.ts@isValidTrigger
export function isValidTrigger(abilityModel, rootStore, target, params = {}) {
    const source = abilityModel.cardSource;
    const trigger = abilityModel.trigger;
    const { attacker, defender } = params;
    if (abilityModel.conditions &&
        !rootStore.effectStore.metCondition(abilityModel.cardSource, abilityModel.conditions)) {
        return;
    }
    // TODO: This is not where this should belong
    if ("replaceChallengeTarget" in abilityModel) {
        abilityModel.replaceChallengeTarget(params);
    }
    // TODO: This is not where this should belong
    if ("replaceSingTarget" in abilityModel) {
        abilityModel.replaceSingTarget(params);
    }
    if (trigger.triggeredByPlayer && params.triggeredBy) {
        switch (trigger.triggeredByPlayer) {
            case "self":
                return source.ownerId === params.triggeredBy.ownerId;
            case "opponent":
                return source.ownerId !== params.triggeredBy.ownerId;
            default:
                exhaustiveCheck(trigger.triggeredByPlayer);
                return false;
        }
    }
    switch (trigger.on) {
        case "moves-to-a-location": {
            let isValidTarget = true;
            let isValidSource = true;
            if (trigger.target) {
                isValidTarget = target.matchesTargetFilter(trigger.target.filters, source.ownerId, source);
            }
            if (trigger.source) {
                const cardSource = abilityModel.cardSource;
                isValidSource = cardSource.matchesTargetFilter(trigger.source.filters, cardSource.ownerId, cardSource);
            }
            return isValidTarget && isValidSource;
        }
        case "quest": {
            // TODO: Move abilityModel to the respective model
            const isValidCardTarget = cardEffectTargetPredicate(trigger.target) &&
                abilityModel.isValidTriggerTarget(target);
            const hasSourceSelfFilter = trigger.target.filters.find((item) => item.filter === "source" && item.value === "self");
            if (hasSourceSelfFilter) {
                const isValidThisCharacterTarget = hasSourceSelfFilter &&
                    target.instanceId === abilityModel.cardSource.instanceId;
                return isValidCardTarget && isValidThisCharacterTarget;
            }
            return isValidCardTarget;
        }
        case "ready": {
            const validTarget = target.matchesTargetFilter(abilityModel.filters, source.ownerId, source);
            const isSelf = trigger.target.filters.find((item) => item.filter === "source" && item.value === "self") && target.instanceId !== abilityModel.cardSource.instanceId;
            return !isSelf && validTarget;
        }
        case "discard": {
            if ("player" in abilityModel.trigger) {
                const { player } = abilityModel.trigger;
                if (player === "opponent" && source.ownerId === target.ownerId) {
                    return false;
                }
            }
            return true;
        }
        case "damage": {
            const { inAChallenge } = trigger;
            if (inAChallenge) {
                if (!(attacker && defender)) {
                    return false;
                }
                if (trigger.dealt && trigger.defenderFilters && defender) {
                    return defender.matchesTargetFilter(trigger.defenderFilters, source.ownerId, source);
                }
            }
            if (trigger.dealt && params.damageSource) {
                return params.damageSource.matchesTargetFilter(abilityModel.filters, source.ownerId, source);
            }
            return target.matchesTargetFilter(abilityModel.filters, source.ownerId, source);
        }
        case "heal": {
            return target.matchesTargetFilter(abilityModel.filters, source.ownerId, source);
        }
        case "start_turn":
        case "end_turn":
            if (trigger.target.value === "opponent") {
                return (rootStore.opponentPlayer(source.ownerId) === rootStore.turnPlayer);
            }
            return source.ownerId === rootStore.turnPlayer;
        case "play":
        case "leave":
        case "inkwell": {
            return abilityModel.isValidTarget(target);
        }
        case "banish-another": {
            const { cardType } = trigger;
            if (!(attacker && defender)) {
                console.error("No attacker or defender");
                return;
            }
            if (abilityModel.cardSource.instanceId !== attacker.instanceId) {
                rootStore.debug("[triggerResolver] Not the attacker");
                return;
            }
            return defender.type === cardType;
        }
        case "shift": {
            const { shifter, shifted } = params;
            const { shifterFilter, shiftedFilter } = trigger;
            if (!(shifter && shifted)) {
                console.error("No shifter or shifted");
                return;
            }
            // TODO: we may also need to validate the shifted
            const shifterMatches = shifter.matchesTargetFilter(shifterFilter, source.ownerId, source);
            const shiftedMatches = shifted.matchesTargetFilter(shiftedFilter, source.ownerId, source);
            return shifterMatches && shiftedMatches;
        }
        case "banish": {
            const source = abilityModel.cardSource;
            if (trigger.in === "challenge") {
                if (!(attacker && defender)) {
                    console.error("No attacker or defender");
                    return;
                }
                if (trigger.as === "defender" &&
                    source.instanceId !== defender?.instanceId) {
                    rootStore.debug("Not the defender");
                    return;
                }
                // TODO: I have to split the effect "banish" from "is banished"
                if (trigger.as === "attacker" &&
                    source.instanceId !== attacker?.instanceId) {
                    rootStore.debug("Not the attacker");
                    return;
                }
                if (trigger.as === "both" &&
                    target.instanceId !== attacker?.instanceId &&
                    target.instanceId !== defender?.instanceId) {
                    rootStore.debug("Not the attacker nor the defender");
                    return;
                }
            }
            return true;
        }
        case "challenge": {
            const { secondaryFilters } = trigger;
            const primary = trigger.as === "attacker" ? attacker : defender;
            const secondaryTarget = trigger.as === "attacker" ? defender : attacker;
            if (!(primary && secondaryTarget)) {
                return false;
            }
            // TODO: I have to fix the models
            if ("cardThatTriggered" in abilityModel) {
                abilityModel.cardThatTriggered = primary;
            }
            // When filter is not present, it means it triggers for the source
            if (abilityModel.filters.length === 0) {
                return source.instanceId === primary.instanceId;
            }
            const isValidSecondary = secondaryFilters
                ? matchesTargetFilters(rootStore, secondaryTarget, { type: "card", value: "all", filters: secondaryFilters }, secondaryTarget.ownerId, source)
                : true;
            return abilityModel.isValidTarget(primary) && isValidSecondary;
        }
        case "draw": {
            if ("player" in abilityModel.trigger) {
                const { player } = abilityModel.trigger;
                switch (player) {
                    case "opponent":
                        return target.ownerId !== source.ownerId;
                    case "self":
                        return target.ownerId === source.ownerId;
                    case "both":
                        return true;
                    default:
                        return false;
                }
            }
            return false;
        }
        case "sing": {
            const { singer, song } = params;
            const { onlySelf } = trigger;
            if (onlySelf && singer?.instanceId !== source.instanceId) {
                return false;
            }
            return abilityModel.isValidTarget(target);
        }
        case "exert": {
            return abilityModel.isValidTarget(target);
        }
        default: {
            exhaustiveCheck(trigger);
            return false;
        }
    }
}
export const onEndOfTurnPredicate = (ability) => staticTriggeredAbilityPredicate(ability) && ability.trigger.on === "end_turn";
export const startOfTurnPredicate = (ability) => staticTriggeredAbilityPredicate(ability) &&
    ability.trigger.on === "start_turn";
export function getTriggerPredicate(trigger) {
    let predicate = (ability) => {
        return false;
    };
    switch (trigger) {
        case "discard": {
            predicate = (ability) => {
                return ability.trigger.on === "discard";
            };
            break;
        }
        case "quest": {
            predicate = (ability) => {
                return ability.trigger.on === "quest";
            };
            break;
        }
        case "play": {
            predicate = (ability) => {
                return ability.trigger.on === "play";
            };
            break;
        }
        case "banish": {
            predicate = (ability) => {
                return ability.trigger.on === "banish";
            };
            break;
        }
        case "banish-another": {
            predicate = (ability) => {
                return ability.trigger.on === "banish-another";
            };
            break;
        }
        case "challenge": {
            predicate = (ability) => {
                return ability.trigger.on === "challenge";
            };
            break;
        }
        case "leave": {
            predicate = (ability) => {
                return ability.trigger.on === "leave";
            };
            break;
        }
        case "ready": {
            predicate = (ability) => {
                return ability.trigger.on === "ready";
            };
            break;
        }
        case "start_turn": {
            predicate = (ability) => {
                return ability.trigger.on === "start_turn";
            };
            break;
        }
        case "end_turn": {
            predicate = (ability) => {
                return ability.trigger.on === "end_turn";
            };
            break;
        }
        case "damage": {
            predicate = (ability) => {
                return ability.trigger.on === "damage";
            };
            break;
        }
        case "heal": {
            predicate = (ability) => {
                return ability.trigger.on === "heal";
            };
            break;
        }
        case "moves-to-a-location": {
            predicate = (ability) => {
                return ability.trigger.on === "moves-to-a-location";
            };
            break;
        }
        case "draw": {
            predicate = (ability) => {
                return ability.trigger.on === "draw";
            };
            break;
        }
        case "sing": {
            predicate = (ability) => {
                return ability.trigger.on === "sing";
            };
            break;
        }
        case "inkwell": {
            predicate = (ability) => {
                return ability.trigger.on === "inkwell";
            };
            break;
        }
        case "exert": {
            predicate = (ability) => {
                return ability.trigger.on === "exert";
            };
            break;
        }
        case "shift": {
            predicate = (ability) => {
                return ability.trigger.on === "shift";
            };
            break;
        }
        default: {
            exhaustiveCheck(trigger);
            return predicate;
        }
    }
    return predicate;
}
//# sourceMappingURL=triggerResolver.js.map