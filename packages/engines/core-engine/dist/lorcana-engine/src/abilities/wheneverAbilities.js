import { gainAbilityWhileHere } from "@lorcanito/lorcana-engine/abilities/abilities";
import { anyCardYouOwn } from "@lorcanito/lorcana-engine/abilities/target";
import { thisCard, thisCharacter, } from "@lorcanito/lorcana-engine/abilities/targets";
export const wheneverIsExerted = (params) => {
    const { optional, name, text, effects, target } = params;
    const layer = {
        type: "resolution",
        optional,
        name,
        text,
        effects,
    };
    const staticTrigger = {
        type: "static-triggered",
        trigger: {
            on: "exert",
            target: target,
        },
        name,
        text,
        layer,
    };
    return staticTrigger;
};
export const wheneverIsReturnedToHand = (params) => {
    const { optional, name, text, effects, target } = params;
    const layer = {
        type: "resolution",
        optional,
        name,
        text,
        effects,
    };
    const trigger = {
        on: "leave",
        destination: "hand",
        // TODO: The trigger should also known source and destination.
        target: target,
        from: params.from,
    };
    const staticTrigger = {
        type: "static-triggered",
        name,
        text,
        trigger,
        layer,
    };
    return staticTrigger;
};
export const wheneverACardIsPutIntoYourInkwell = (params) => {
    const { target, optional, effects, name, text, conditions, costs, oncePerTurn, responder, resolveEffectsIndividually, } = params;
    const layer = {
        type: "resolution",
        oncePerTurn,
        optional,
        name,
        text,
        effects,
        costs,
        responder,
        resolveEffectsIndividually,
    };
    const trigger = {
        on: "inkwell",
        target: target || anyCardYouOwn,
    };
    return {
        type: "static-triggered",
        oncePerTurn,
        name,
        text,
        trigger,
        conditions,
        layer,
    };
};
export const wheneverOneOfYourCharactersIsBanishedInAChallenge = (params) => {
    const { triggerFilter, optional, effects, name, text, conditions } = params;
    const layer = {
        type: "resolution",
        optional,
        name,
        text,
        effects,
    };
    const ability = {
        type: "static-triggered",
        name,
        text,
        trigger: {
            on: "banish",
            in: "challenge",
            as: "both",
            exclude: "source",
            filters: triggerFilter,
        },
        conditions,
        layer,
    };
    return ability;
};
// TODO: What's the difference between this and wheneverCharacterChallengesAndBanishes?
export const wheneverBanishesAnotherCharacterInChallenge = (params) => {
    const { optional, effects, name, text, detrimental } = params;
    const layer = {
        type: "resolution",
        optional,
        name,
        text,
        detrimental,
        effects,
    };
    return {
        type: "static-triggered",
        name,
        text,
        layer: layer,
        trigger: {
            on: "banish-another",
            cardType: "character",
        },
    };
};
export const wheneverAnotherCharIsBanished = (params) => {
    const { optional, effects, name, text } = params;
    return {
        type: "static-triggered",
        name,
        text,
        trigger: {
            on: "banish",
            exclude: "source",
            filters: [{ filter: "type", value: "character" }],
        },
        layer: {
            type: "resolution",
            optional,
            name,
            text,
            effects,
        },
    };
};
export const wheneverAnotherCharIsBanishedInChallenge = (params) => {
    const { optional, effects, name, text } = params;
    return {
        type: "static-triggered",
        name,
        text,
        trigger: {
            on: "banish",
            exclude: "source",
            in: "challenge",
            filters: [{ filter: "type", value: "character" }],
        },
        layer: {
            type: "resolution",
            optional,
            name,
            text,
            effects,
        },
    };
};
export const wheneverOpposingCharIsBanishedInChallenge = (params) => {
    const { optional, effects, name, text, conditions, costs } = params;
    const banishTrigger = {
        on: "banish",
        in: "challenge",
        exclude: "source",
        conditions,
        filters: [
            { filter: "type", value: "character" },
            { filter: "owner", value: "opponent" },
        ],
    };
    const layer = {
        type: "resolution",
        optional,
        name,
        text,
        effects,
        costs,
    };
    return {
        type: "static-triggered",
        name,
        text,
        trigger: banishTrigger,
        layer,
    };
};
export const wheneverOpposingCharIsBanished = (params) => {
    const { optional, effects, name, text, conditions } = params;
    const banishTrigger = {
        on: "banish",
        exclude: "source",
        conditions,
        filters: [
            { filter: "type", value: "character" },
            { filter: "owner", value: "opponent" },
        ],
    };
    const layer = {
        type: "resolution",
        optional,
        name,
        text,
        effects,
    };
    return {
        type: "static-triggered",
        name,
        text,
        trigger: banishTrigger,
        layer,
    };
};
export const wheneverYouPlayAFloodBorn = (params) => {
    return wheneverPlays({
        triggerTarget: {
            type: "card",
            value: "all",
            filters: [
                { filter: "owner", value: "self" },
                { filter: "type", value: "character" },
                { filter: "zone", value: "play" },
                { filter: "characteristics", value: ["floodborn"] },
            ],
        },
        ...params,
    });
};
export const wheneverYouPlayACharacter = (params) => {
    return wheneverPlays({
        triggerTarget: {
            type: "card",
            value: "all",
            filters: [
                { filter: "owner", value: "self" },
                { filter: "type", value: "character" },
                { filter: "zone", value: "play" },
            ],
        },
        ...params,
    });
};
export const wheneverYouPlayAnotherCharacter = (params) => {
    return wheneverPlays({
        triggerTarget: {
            type: "card",
            value: "all",
            excludeSelf: true,
            filters: [
                { filter: "owner", value: "self" },
                { filter: "type", value: "character" },
                { filter: "zone", value: "play" },
            ],
        },
        ...params,
    });
};
// whenever one of your (.*) characters is banished
// whenever one of your characters with Bodyguard is banished, you may reveal the top card of your deck. If it’s a character card with cost 5 or less, you may play that character for free. Otherwise, put it on the top of your deck.
export const wheneverOneOfYouCharactersIsBanished = (params) => {
    const { optional, effects, name, text, conditions, triggerTarget } = params;
    const layer = {
        type: "resolution",
        optional,
        name,
        text,
        effects,
    };
    return {
        type: "static-triggered",
        name,
        text,
        trigger: {
            on: "banish",
            filters: triggerTarget || [
                { filter: "owner", value: "self" },
                { filter: "type", value: "character" },
            ],
        },
        conditions,
        layer: layer,
    };
};
export const wheneverThisCharacterDealsDamageInChallenge = (params) => {
    const { optional, effects, name, text, conditions } = params;
    const damageTrigger = {
        on: "damage",
        dealt: true,
        inAChallenge: true,
        filters: [{ filter: "source", value: "self" }],
        defenderFilters: [{ filter: "type", value: "character" }],
    };
    const layer = {
        type: "resolution",
        optional,
        name,
        text,
        effects,
    };
    return {
        type: "static-triggered",
        trigger: damageTrigger,
        conditions,
        name,
        text,
        layer,
    };
};
export const wheneverOneOfYourCharChallengesAnotherCharOrLocation = (params) => {
    const { responder, optional, effects, name, text, defenderFilter, attackerFilter, } = params;
    const layer = {
        type: "resolution",
        optional,
        responder,
        name,
        text,
        effects,
    };
    const trigger = {
        on: "challenge",
        as: "attacker",
        filters: attackerFilter || [{ filter: "source", value: "self" }],
        secondaryFilters: defenderFilter
            ? [
                { filter: "type", value: ["character", "location"] },
                ...defenderFilter,
            ]
            : [{ filter: "type", value: ["character", "location"] }],
    };
    return {
        type: "static-triggered",
        name,
        text,
        layer,
        trigger: trigger,
    };
};
export const wheneverChallengesAnotherChar = (params) => {
    const { responder, optional, effects, name, text, defenderFilter, attackerFilters, } = params;
    const layer = {
        type: "resolution",
        optional,
        responder,
        name,
        text,
        effects,
    };
    const trigger = {
        on: "challenge",
        as: "attacker",
        filters: attackerFilters || [{ filter: "source", value: "self" }],
        secondaryFilters: defenderFilter
            ? [{ filter: "type", value: "character" }, ...defenderFilter]
            : [{ filter: "type", value: "character" }],
    };
    return {
        type: "static-triggered",
        name,
        text,
        layer,
        trigger: trigger,
    };
};
export const wheneverACharacterQuests = (params) => {
    const { dependentEffects, resolveEffectsIndividually, optional, effects, name, text, responder, characterFilter, } = params;
    const layer = {
        type: "resolution",
        optional,
        resolveEffectsIndividually,
        dependentEffects,
        responder,
        name,
        text,
        effects,
    };
    const questTrigger = {
        on: "quest",
        target: {
            type: "card",
            value: "all",
            filters: characterFilter,
        },
    };
    const ability = {
        type: "static-triggered",
        name,
        text,
        trigger: questTrigger,
        layer,
    };
    return ability;
};
export function wheneverACharacterQuestsWhileHere(params) {
    return gainAbilityWhileHere({
        name: params.name,
        text: params.text,
        ability: wheneverQuests(params),
    });
}
export function wheneverOneOfYourCharsQuests(params) {
    return wheneverQuests({
        ...params,
        triggerTarget: {
            type: "card",
            value: "all",
            filters: [
                { filter: "owner", value: "self" },
                { filter: "zone", value: "play" },
                { filter: "type", value: "character" },
            ],
        },
    });
}
export const wheneverQuests = (params) => {
    const { dependentEffects, resolveEffectsIndividually, optional, effects, name, text, conditions, responder, costs, triggerTarget, nameACard, } = params;
    const layer = {
        type: "resolution",
        optional,
        resolveEffectsIndividually,
        dependentEffects,
        responder,
        costs,
        name,
        text,
        effects,
        nameACard,
    };
    const questTrigger = {
        on: "quest",
        target: triggerTarget || thisCharacter,
    };
    const ability = {
        type: "static-triggered",
        name,
        text,
        trigger: questTrigger,
        conditions,
        layer,
    };
    return ability;
};
export const wheneverThisCharacterQuests = (params) => {
    return wheneverQuests(params);
};
export const wheneverOneOfYourCharactersSings = (params) => {
    const { dependentEffects, resolveEffectsIndividually, optional, effects, name, text, responder, oncePerTurn, } = params;
    const layer = {
        type: "resolution",
        optional,
        resolveEffectsIndividually,
        dependentEffects,
        responder,
        name,
        text,
        effects,
    };
    const trigger = {
        on: "sing",
        target: {
            type: "card",
            value: "all",
            filters: [
                { filter: "owner", value: "self" },
                { filter: "type", value: "action" },
                { filter: "characteristics", value: ["song"] },
            ],
        },
    };
    const ability = {
        type: "static-triggered",
        name,
        text,
        trigger,
        layer,
        oncePerTurn,
    };
    return ability;
};
export const wheneverThisCharSings = (params) => {
    const { dependentEffects, resolveEffectsIndividually, optional, effects, name, text, responder, } = params;
    const layer = {
        type: "resolution",
        optional,
        resolveEffectsIndividually,
        dependentEffects,
        responder,
        name,
        text,
        effects,
    };
    const trigger = {
        on: "sing",
        onlySelf: true,
        target: {
            type: "card",
            value: "all",
            filters: [
                { filter: "owner", value: "self" },
                { filter: "type", value: "action" },
                { filter: "characteristics", value: ["song"] },
            ],
        },
    };
    const ability = {
        type: "static-triggered",
        name,
        text,
        trigger,
        layer,
    };
    return ability;
};
export const wheneverYouDiscardACard = (params) => {
    const { name, text, optional, effects } = params;
    const layer = {
        type: "resolution",
        optional,
        name,
        effects,
    };
    return {
        type: "static-triggered",
        name,
        text,
        layer,
        trigger: {
            on: "discard",
            player: "self",
        },
    };
};
export const wheneverYourOpponentDiscardsOneOrMore = (params) => {
    const { name, text, optional, effects } = params;
    const layer = {
        type: "resolution",
        optional,
        name,
        effects,
    };
    return {
        type: "static-triggered",
        name,
        text,
        layer,
        trigger: {
            on: "discard",
            player: "opponent",
        },
    };
};
export const wheneverYouDrawACard = (params) => {
    const { conditions, name, text, optional, effects } = params;
    const layer = {
        type: "resolution",
        optional,
        name,
        effects,
    };
    const trigger = {
        on: "draw",
        player: "self",
    };
    return {
        type: "static-triggered",
        name,
        text,
        trigger,
        conditions,
        layer: layer,
    };
};
export const wheneverOpponentDrawsACard = (params) => {
    const { conditions, name, text, optional, effects } = params;
    const layer = {
        type: "resolution",
        optional,
        name,
        effects,
    };
    const trigger = {
        on: "draw",
        player: "opponent",
    };
    return {
        type: "static-triggered",
        name,
        text,
        trigger,
        conditions,
        layer: layer,
    };
};
export const wheneverYouHeal = (params) => {
    const { resolveEffectsIndividually, detrimental, costs, optional, effects, name, text, } = params;
    const layer = {
        type: "resolution",
        name,
        text,
        optional,
        detrimental,
        resolveEffectsIndividually,
        effects,
        costs,
    };
    return {
        type: "static-triggered",
        optional,
        name,
        text,
        trigger: {
            on: "heal",
            filters: [
                { filter: "owner", value: "self" },
                { filter: "zone", value: "play" },
                { filter: "type", value: "character" },
            ],
        },
        layer,
    };
};
export const wheneverYouHealAnyCharacter = (params) => {
    const { resolveEffectsIndividually, detrimental, costs, optional, effects, name, text, } = params;
    const layer = {
        type: "resolution",
        name,
        text,
        optional,
        detrimental,
        resolveEffectsIndividually,
        effects,
        costs,
    };
    return {
        type: "static-triggered",
        optional,
        name,
        text,
        trigger: {
            on: "heal",
            triggeredByPlayer: "self",
            filters: [
                { filter: "zone", value: "play" },
                { filter: "type", value: "character" },
            ],
        },
        layer,
    };
};
export const wheneverThisCharIsDamaged = (params) => {
    const { resolveEffectsIndividually, detrimental, costs, optional, effects, name, text, } = params;
    const layer = {
        type: "resolution",
        name,
        text,
        optional,
        detrimental,
        resolveEffectsIndividually,
        effects,
        costs,
    };
    return {
        type: "static-triggered",
        optional,
        name,
        text,
        trigger: {
            on: "damage",
            received: true,
            filters: thisCard.filters,
        },
        layer,
    };
};
export const wheneverOppCharIsDamaged = (params) => {
    const { resolveEffectsIndividually, detrimental, costs, optional, oncePerTurn, effects, name, text, conditions, } = params;
    const layer = {
        type: "resolution",
        name,
        text,
        optional,
        oncePerTurn,
        detrimental,
        resolveEffectsIndividually,
        effects,
        costs,
    };
    return {
        type: "static-triggered",
        optional,
        name,
        text,
        trigger: {
            on: "damage",
            filters: [
                { filter: "owner", value: "opponent" },
                { filter: "zone", value: "play" },
                { filter: "type", value: "character" },
            ],
        },
        layer,
        conditions,
    };
};
export const wheneverOneOfYourCharChallengesAnotherChar = (params) => {
    const { responder, optional, effects, name, text, conditions, defenderFilter, attackerFilter, } = params;
    const layer = {
        type: "resolution",
        optional,
        responder,
        name,
        text,
        effects,
    };
    const challengeTrigger = {
        on: "challenge",
        as: "attacker",
        filters: attackerFilter
            ? [{ filter: "owner", value: "self" }, ...attackerFilter]
            : [{ filter: "owner", value: "self" }],
        secondaryFilters: defenderFilter
            ? [{ filter: "type", value: "character" }, ...defenderFilter]
            : [{ filter: "type", value: "character" }],
    };
    return {
        type: "static-triggered",
        name,
        text,
        trigger: challengeTrigger,
        layer: layer,
        conditions,
    };
};
export const wheneverTargetPlays = (params) => {
    const { excludeSelf, detrimental, costs, triggerFilter, optional, effects, hasShifted, resolveEffectsIndividually, name, text, responder, conditions, oncePerTurn, hasSang, } = params;
    const layer = {
        type: "resolution",
        oncePerTurn,
        responder,
        name,
        resolveEffectsIndividually,
        text,
        optional,
        detrimental,
        effects,
        costs,
    };
    const trigger = {
        on: "play",
        hasShifted,
        hasSang,
        conditions,
        target: {
            type: "card",
            excludeSelf,
            value: "all",
            filters: triggerFilter || [],
        },
    };
    const ability = {
        type: "static-triggered",
        oncePerTurn,
        optional,
        name,
        text,
        trigger,
        layer,
    };
    return ability;
};
export const wheneverYouPlayAnItem = (params) => {
    return wheneverTargetPlays({
        ...params,
        triggerFilter: [
            { filter: "type", value: "item" },
            { filter: "owner", value: "self" },
        ],
    });
};
export const wheneverOpponentPlaysASong = (params) => {
    return wheneverTargetPlays({
        ...params,
        triggerFilter: [
            { filter: "type", value: "action" },
            { filter: "characteristics", value: ["song"] },
            { filter: "owner", value: "opponent" },
        ],
    });
};
export const wheneverYouPlayASong = (params) => {
    return wheneverTargetPlays({
        ...params,
        triggerFilter: [
            { filter: "type", value: "action" },
            { filter: "characteristics", value: ["song"] },
            { filter: "owner", value: "self" },
        ],
    });
};
export const wheneverOneOrMoreOfYourCharSingsASong = (params) => {
    return wheneverTargetPlays({
        ...params,
        hasSang: true,
        triggerFilter: [
            { filter: "type", value: "action" },
            { filter: "characteristics", value: ["song"] },
            { filter: "owner", value: "self" },
        ],
    });
};
export const wheneverYouPlayAnActionNotASong = (params) => {
    return wheneverTargetPlays({
        ...params,
        triggerFilter: [
            { filter: "type", value: "action" },
            { filter: "characteristics", value: ["song"], negate: true },
            { filter: "owner", value: "self" },
        ],
    });
};
export const wheneverYouPlayAnAction = (params) => {
    return wheneverTargetPlays({
        ...params,
        triggerFilter: [
            { filter: "type", value: "action" },
            { filter: "characteristics", value: ["action"] },
            { filter: "owner", value: "self" },
        ],
    });
};
export const wheneverYouPlayALocation = (params) => {
    return wheneverTargetPlays({
        ...params,
        triggerFilter: [
            { filter: "type", value: "location" },
            { filter: "characteristics", value: ["location"] },
            { filter: "owner", value: "self" },
        ],
    });
};
export const wheneverYouPlayAnotherPrincess = (params) => {
    return wheneverTargetPlays({
        ...params,
        excludeSelf: true,
        triggerFilter: [
            { filter: "type", value: "character" },
            { filter: "characteristics", value: ["princess"] },
            { filter: "owner", value: "self" },
        ],
    });
};
export const wheneverPlays = (params) => {
    const { triggerTarget } = params;
    return wheneverTargetPlays({
        ...params,
        triggerFilter: "filters" in triggerTarget ? triggerTarget.filters : [],
    });
};
export function wheneverYouReadyThisCharacter({ name, text, conditions, effects, optional, unless, oncePerTurn, }) {
    const layer = {
        type: "resolution",
        optional,
        unless,
        name,
        text,
        effects,
        oncePerTurn,
    };
    const triggerAbility = {
        type: "static-triggered",
        name: "We'll Always Be Together",
        text: "Whenever you ready this character, if you have 2 or more other characters in play, gain 2 lore.",
        trigger: {
            on: "ready",
            target: thisCharacter,
        },
        conditions,
        oncePerTurn,
        layer: layer,
    };
    return triggerAbility;
}
//# sourceMappingURL=wheneverAbilities.js.map