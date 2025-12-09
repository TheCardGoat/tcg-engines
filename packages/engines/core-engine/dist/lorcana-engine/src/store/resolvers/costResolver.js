import { costReplacementEffectPredicate, costReplacementShiftEffectPredicate, exhaustiveCheck, matchesTargetFilters, notEmptyPredicate, } from "@lorcanito/lorcana-engine";
export function payCosts(costs, targetCards = [], source, rootStore, payingPlayer) {
    const costPayer = payingPlayer || source.ownerId;
    if (!source.canPayCosts(costs, targetCards, payingPlayer)) {
        return false;
    }
    let result = true;
    costs.forEach((cost) => {
        switch (cost.type) {
            case "exert": {
                source.updateCardMeta({ exerted: true });
                break;
            }
            case "banish": {
                source.banish();
                break;
            }
            case "ink": {
                const table = rootStore.tableStore.getTable(costPayer);
                const amount = source.applyCostModifier(cost.amount);
                const payedInk = rootStore.tableStore.payInk(table, amount);
                result = result && payedInk;
                break;
            }
            case "card": {
                const { action, amount, filters } = cost;
                const cardsToEvaluate = targetCards.slice(0, cost.amount);
                if (cardsToEvaluate.some((card) => !card.matchesTargetFilter(filters, rootStore.activePlayer, source))) {
                    console.error("Card doesn't match filter", cardsToEvaluate, filters);
                }
                switch (action) {
                    case "discard": {
                        cardsToEvaluate.forEach((card) => card.moveTo("discard", { skipLog: true, discard: true }));
                        break;
                    }
                    case "exert": {
                        cardsToEvaluate.forEach((card) => card.updateCardMeta({ exerted: true }));
                        break;
                    }
                    case "banish": {
                        cardsToEvaluate.forEach((card) => card.banish());
                        break;
                    }
                    default: {
                        console.error("Unknown action", action);
                        exhaustiveCheck(action);
                    }
                }
                break;
            }
            default: {
                console.error("Unknown cost type", cost);
                exhaustiveCheck(cost);
            }
        }
    });
    return result;
}
export function canPayCosts(costs, targetCards = [], source, rootStore, payingPlayer) {
    const costPayer = payingPlayer ?? source.ownerId;
    return costs.every((cost) => {
        switch (cost.type) {
            case "exert": {
                if (source.type === "item") {
                    return source.ready;
                }
                return source.ready && !source.meta.playedThisTurn;
            }
            case "ink": {
                const amount = source.applyCostModifier(source.applyShiftCostModifiers(cost.amount) || cost.amount);
                return (rootStore.tableStore
                    .getPlayerZone(costPayer, "inkwell")
                    ?.inkAvailable() >= amount);
            }
            case "banish": {
                if (source.zone !== "play") {
                    console.warn("Can't banish a card that's not in play");
                    return false;
                }
                return true;
            }
            case "card": {
                const cardsToEvaluate = targetCards.slice(0, cost.amount);
                if (cardsToEvaluate.length < cost.amount) {
                    return false;
                }
                return cardsToEvaluate.every((card) => card.matchesTargetFilter(cost.filters, rootStore.activePlayer, source));
            }
            default: {
                console.error("Unknown cost type", cost);
                exhaustiveCheck(cost);
            }
        }
    });
}
export function calculateShiftCostModifier(rootStore, cardModel) {
    const continuousEffects = rootStore.continuousEffectStore.continuousEffects
        .filter((continuous) => continuous.isShiftReplacementEffect(cardModel))
        .map((continuous) => continuous.effect);
    const filters = [
        (model) => !(model.isResolutionAbility ||
            model.isStaticTriggeredAbility ||
            model.isActivatedAbility) && model.hasShiftReplacementEffect,
    ];
    // Doing like this as we calculate cost when the card is in hand
    const cardEffects = rootStore.effectStore
        .getAbilitiesForCard(cardModel, filters)
        .map((ability) => {
        return ability.effects.find((model) => costReplacementShiftEffectPredicate(model.effect));
    })
        .filter(notEmptyPredicate);
    const allEffects = rootStore.cardStore.cardsInPlay
        .filter((card) => !card.isCard(cardModel))
        .flatMap((card) => card.getOwnEffects(filters))
        .filter((effect) => costReplacementShiftEffectPredicate(effect.effect));
    const result = [...allEffects, ...continuousEffects, ...cardEffects]
        .filter((effect) => matchesTargetFilters(rootStore, cardModel, effect.target))
        .reduce((acc, curr) => {
        if (costReplacementShiftEffectPredicate(curr.effect)) {
            return acc + curr.calculateAmount();
        }
        return acc;
    }, 0);
    return result;
}
export function calculateCostModifier(rootStore, cardModel) {
    const continuousEffects = rootStore.continuousEffectStore.continuousEffects
        .filter((continuous) => continuous.isCostReplacementEffect(cardModel))
        .map((continuous) => continuous.effect);
    const filters = [
        (model) => !(model.isResolutionAbility ||
            model.isStaticTriggeredAbility ||
            model.isActivatedAbility) && model.hasCostReplacementEffect,
    ];
    // Doing like this as we calculate cost when the card is in hand
    const cardEffects = rootStore.effectStore
        .getAbilitiesForCard(cardModel, filters)
        .map((ability) => {
        return ability.effects.find((model) => costReplacementEffectPredicate(model.effect));
    })
        .filter(notEmptyPredicate);
    const allEffects = rootStore.cardStore.cardsInPlay
        .filter((card) => !card.isCard(cardModel))
        .flatMap((card) => card.getOwnEffects(filters))
        .filter((effect) => costReplacementEffectPredicate(effect.effect));
    const result = [...allEffects, ...continuousEffects, ...cardEffects]
        .filter((effect) => matchesTargetFilters(rootStore, cardModel, effect.target))
        .reduce((acc, curr) => {
        if (costReplacementEffectPredicate(curr.effect)) {
            return acc + curr.calculateAmount();
        }
        return acc;
    }, 0);
    return result;
}
//# sourceMappingURL=costResolver.js.map