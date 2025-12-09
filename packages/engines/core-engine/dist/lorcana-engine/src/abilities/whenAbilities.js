import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
const movesToALocationTriggeredAbility = (params) => {
    const { optional, name, text, effects, target, source, conditions, movingFrom, oncePerTurn, } = params;
    const layer = {
        type: "resolution",
        optional,
        oncePerTurn,
        name,
        text,
        effects,
    };
    const trigger = {
        on: "moves-to-a-location",
        target: target,
        source: source,
        conditions,
        movingFrom,
        oncePerTurn,
    };
    return {
        type: "static-triggered",
        trigger: trigger,
        oncePerTurn,
        name,
        text,
        layer,
    };
};
export function whenYouMoveACharacterHere(params) {
    const source = {
        type: "card",
        value: "all",
        filters: [{ filter: "source", value: "self" }],
    };
    const anyTarget = {
        type: "card",
        value: "all",
        filters: [{ filter: "owner", value: "self" }],
    };
    return movesToALocationTriggeredAbility({
        ...params,
        source,
        target: params.target ? params.target : anyTarget,
    });
}
export const whenMovesToALocation = (params) => {
    const target = params.target || {
        type: "card",
        value: "all",
        filters: [{ filter: "source", value: "self" }],
    };
    return movesToALocationTriggeredAbility({ ...params, target });
};
export const whenPlayAndWhenLeaves = (params) => {
    const { optional, name, text, effects } = params;
    const layer = {
        type: "resolution",
        optional,
        name,
        text,
        effects,
    };
    const trigger = {
        on: "leave",
        target: {
            type: "card",
            value: "all",
            filters: [{ filter: "source", value: "self" }],
        },
    };
    const staticTrigger = {
        type: "static-triggered",
        name,
        text,
        trigger: trigger,
        layer,
    };
    return [layer, staticTrigger];
};
export const whenThisCharChallengesAndIsBanished = (params) => {
    const { detrimental, optional, effects, name, text } = params;
    const trigger = {
        on: "banish",
        in: "challenge",
        as: "attacker",
        filters: [{ filter: "source", value: "self" }],
    };
    const ability = {
        type: "resolution",
        detrimental,
        optional,
        name,
        text,
        effects,
    };
    return {
        type: "static-triggered",
        name,
        text,
        trigger: trigger,
        layer: ability,
    };
};
export const whenYourOtherCharactersIsBanished = (params) => {
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
            exclude: "source",
            filters: triggerTarget || [
                { filter: "owner", value: "self" },
                { filter: "type", value: "character" },
            ],
        },
        conditions,
        layer: layer,
    };
};
export const whenThisCharacterBanished = (params) => {
    const { optional, effects, name, text, conditions } = params;
    return {
        type: "static-triggered",
        name,
        text,
        trigger: {
            on: "banish",
            filters: [{ filter: "source", value: "self" }],
            conditions,
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
export const whenThisCharacterBanishedInAChallenge = (params) => {
    const { optional, effects, name, text, conditions } = params;
    return {
        type: "static-triggered",
        name,
        text,
        conditions,
        trigger: {
            on: "banish",
            in: "challenge",
            as: "both",
            filters: [{ filter: "source", value: "self" }],
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
export const whenChallengedAndBanished = (params) => {
    const { optional, effects, name, text, responder } = params;
    return {
        type: "static-triggered",
        name,
        text,
        trigger: {
            on: "banish",
            in: "challenge",
            as: "defender",
        },
        layer: {
            type: "resolution",
            responder,
            optional,
            name,
            text,
            effects,
        },
    };
};
export const whenChallenged = (params) => {
    const { responder, optional, effects, name, text } = params;
    return {
        type: "static-triggered",
        name,
        text,
        trigger: {
            on: "challenge",
            as: "defender",
        },
        layer: {
            type: "resolution",
            optional,
            responder,
            name,
            text,
            effects,
        },
    };
};
export const whenYouPlayThis = (params) => {
    const { dependentEffects, resolveEffectsIndividually, optional, effects, conditions, responder, name, text, } = params;
    return {
        type: "resolution",
        resolutionConditions: conditions,
        optional,
        name,
        text,
        responder,
        effects,
        resolveEffectsIndividually,
        dependentEffects,
    };
};
export const whenPlayAndWheneverQuests = (params) => {
    const { dependentEffects, resolveEffectsIndividually, optional, effects, name, text, } = params;
    return [
        whenYouPlayThis({
            optional,
            name,
            text,
            effects,
            resolveEffectsIndividually,
            dependentEffects,
        }),
        wheneverQuests({
            effects,
            name,
            text,
            optional,
            resolveEffectsIndividually,
            dependentEffects,
        }),
    ];
};
export const whenYouPlayMayDrawACard = {
    type: "resolution",
    optional: true,
    responder: "self",
    text: "When you play this, you may draw a card.",
    effects: [
        {
            type: "draw",
            amount: 1,
            target: {
                type: "player",
                value: "self",
            },
        },
    ],
};
export const whenPlayOnThisCard = (params) => {
    const { detrimental, costs, optional, effects, resolveEffectsIndividually, name, text, responder, conditions, shifterTargetFilters, shiftedTargetFilters, } = params;
    const layer = {
        type: "resolution",
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
        on: "shift",
        shifterFilter: shifterTargetFilters,
        shiftedFilter: shiftedTargetFilters,
        conditions,
    };
    return {
        type: "static-triggered",
        optional,
        name,
        text,
        trigger,
        layer,
    };
};
export const whenXIsBanished = (params) => {
    const { optional, effects, name, text, conditions } = params;
    return {
        type: "static-triggered",
        name,
        text,
        trigger: {
            on: "banish",
            filters: [{ filter: "source", value: "self" }],
            conditions,
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
export function whenYouPlayThisCharacter(params) {
    return whenYouPlayThis(params);
}
// Sample text
// Playing this character costs you 2 {I} less if you have an Ally character in play.
export function whenYouPlayThisForEachYouPayLess(params) {
    const { name, text, amount, conditions } = params;
    const costReplacementEffect = {
        type: "replacement",
        replacement: "cost",
        duration: "next",
        amount: amount,
        target: thisCharacter,
    };
    return {
        type: "static",
        ability: "effects",
        name,
        text,
        conditions: conditions || [],
        effects: [costReplacementEffect],
    };
}
export function whenThisIsBanished({ name, text, effects, optional, }) {
    return {
        type: "static-triggered",
        trigger: {
            on: "banish",
            filters: [{ filter: "source", value: "self" }],
        },
        layer: {
            type: "resolution",
            optional,
            name,
            text,
            effects,
        },
    };
}
export function whenYouPlayThisCharAbility(ability) {
    return ability;
}
//# sourceMappingURL=whenAbilities.js.map