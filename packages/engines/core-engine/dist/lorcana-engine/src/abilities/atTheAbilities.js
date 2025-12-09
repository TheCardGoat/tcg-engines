import { opponent, self } from "@lorcanito/lorcana-engine/abilities/targets";
export const atTheEndOfTurnLayer = (params) => {
    const { target, conditions, optional, name, text, layer, secondaryConditions, } = params;
    if (name) {
        layer.name = name;
    }
    if (text) {
        layer.text = text;
    }
    return {
        type: "static-triggered",
        conditions,
        secondaryConditions,
        optional,
        name,
        text,
        trigger: {
            on: "end_turn",
            target,
        },
        layer,
    };
};
export const atTheStartOfYourTurnLayer = (params) => {
    const { conditions, optional, name, text, layer, doesItTriggerFromDiscard } = params;
    if (name) {
        layer.name = name;
    }
    if (text) {
        layer.text = text;
    }
    return {
        type: "static-triggered",
        conditions,
        optional,
        name,
        text,
        trigger: {
            on: "start_turn",
            doesItTriggerFromDiscard,
            target: {
                type: "player",
                value: "self",
            },
        },
        layer,
    };
};
export const atTheEndOfOpponentTurn = (params) => {
    const { resolveEffectsIndividually, detrimental, costs, optional, effects, name, responder, text, conditions, } = params;
    const layer = {
        type: "resolution",
        name,
        text,
        optional,
        detrimental,
        resolveEffectsIndividually,
        effects,
        responder,
        costs,
    };
    return atTheEndOfTurnLayer({
        target: opponent,
        optional,
        name,
        text,
        layer,
        conditions,
    });
};
export const atTheEndOfYourTurn = (params) => {
    const { resolveEffectsIndividually, detrimental, costs, optional, effects, name, text, conditions, secondaryConditions, } = params;
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
    return atTheEndOfTurnLayer({
        target: self,
        optional,
        name,
        text,
        layer,
        conditions,
        secondaryConditions,
    });
};
export const atTheStartOfYourTurn = (params) => {
    const { resolveEffectsIndividually, detrimental, costs, optional, effects, name, text, conditions, resolutionConditions, doesItTriggerFromDiscard, dependentEffects, } = params;
    const layer = {
        type: "resolution",
        name,
        text,
        optional,
        detrimental,
        resolveEffectsIndividually,
        dependentEffects,
        effects,
        resolutionConditions,
        costs,
    };
    return atTheStartOfYourTurnLayer({
        optional,
        name,
        text,
        layer,
        conditions,
        doesItTriggerFromDiscard,
    });
};
//# sourceMappingURL=atTheAbilities.js.map