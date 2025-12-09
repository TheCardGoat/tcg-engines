import { exhaustiveCheck, } from "@lorcanito/lorcana-engine";
import { isDynamicAmount } from "@lorcanito/lorcana-engine/effects/effectTypes";
export function resolveAmount(effectModel, rootStore, targets = []) {
    const amount = calculateAmount(effectModel, rootStore, targets);
    const rawEffect = effectModel.effect || {};
    const amountMultiplier = calculateAmountMultiplier(
    // @ts-ignore
    rawEffect && "amount" in rawEffect ? rawEffect.amount : undefined);
    const effect = rawEffect;
    if ("modifier" in effect) {
        switch (effect.modifier) {
            case "add": {
                return amount * amountMultiplier;
            }
            case "subtract": {
                return -amount * amountMultiplier;
            }
        }
    }
    return amount * amountMultiplier;
}
function calculateAmountMultiplier(amount) {
    if (!amount || typeof amount === "number") {
        return 1;
    }
    return amount?.filterMultiplier || 1;
}
function calculateAmount(effectModel, rootStore, targets = []) {
    if (!("amount" in effectModel.effect)) {
        return 0;
    }
    const effectAmount = effectModel.effect.amount;
    if (!effectAmount) {
        return 0;
    }
    if (typeof effectAmount === "number") {
        return effectAmount;
    }
    if (isDynamicAmount(effectAmount)) {
        return calculateDynamicAmount(effectAmount, rootStore, targets, effectModel.source);
    }
    if (typeof effectAmount === "number") {
        return effectAmount;
    }
    console.error("No amount found ");
    return 0;
}
// TODO: Calculate dynamic amount does not know about trigger context, making it hard to create a dynamic amount based on triggers
// TODO: THIS IS NOT FULLY IMPLEMENTED
export function calculateDynamicAmount(dynamicAmount, rootStore, targets = [], source, effectTarget) {
    if (typeof dynamicAmount === "number") {
        return dynamicAmount;
    }
    const { amount, filters, difference, targetFilterReducer, 
    // TODO: The variables below are being used in resolveAmount
    // We should move everythign to thing function
    // I'm not doing now because I'm already working on this effeect for 3 hours and I havee to stop
    // Don't blame me
    dynamic, getAmountFromTrigger, filterMultiplier, excludeSelf, sourceAttribute, targetLocation, } = dynamicAmount;
    if (targetLocation) {
        // TODO: Currently we only calculate dynamic amount for the first target
        const target = targets[0];
        const location = target?.getLocation;
        if (!(target && location)) {
            rootStore.debug({
                message: "No target found for effect",
                amount: JSON.stringify(dynamicAmount),
                targets: JSON.stringify(targets.map((t) => t.name)),
                location: JSON.stringify(location || {}),
            });
            return 0;
        }
        switch (targetLocation.attribute) {
            case "lore": {
                return location.lore;
            }
            default: {
                exhaustiveCheck(targetLocation.attribute);
                return 0;
            }
        }
    }
    if (dynamicAmount.target) {
        // TODO: Currently we only calculate dynamic amount for the first target
        const target = targets[0];
        if (!target) {
            rootStore.debug("No target found for effect", JSON.stringify(dynamicAmount));
            return 0;
        }
        switch (dynamicAmount.target.attribute) {
            case "strength": {
                return target.strength;
            }
            case "lore": {
                return target.lore;
            }
            case "damage": {
                return target.meta.damage || 0;
            }
            case "cost": {
                return target.cost;
            }
            default: {
                exhaustiveCheck(dynamicAmount.target.attribute);
                return 0;
            }
        }
    }
    if (sourceAttribute && source) {
        switch (sourceAttribute) {
            case "strength": {
                return source.strength;
            }
            case "lore": {
                return source.lore;
            }
            case "damage": {
                return source.meta.damage || 0;
            }
            case "chars-at-location": {
                return source.charactersAtLocation.length;
            }
            default: {
                exhaustiveCheck(sourceAttribute);
                return 0;
            }
        }
    }
    if (filters && filters.length) {
        const responder = source?.ownerId;
        const instanceId = source?.instanceId;
        if (!(responder && instanceId)) {
            console.error("Unable to calculate amount");
            return 0;
        }
        const filter = rootStore.cardStore.getCardsByTargetFilter(filters, responder, source, effectTarget?.excludeSelf || excludeSelf);
        if (difference) {
            if (typeof difference === "number") {
                return Math.abs(filter.length - difference);
            }
            const differenceFilter = rootStore.cardStore
                .getCardsByTargetFilter(difference, responder, source)
                // TODO: This is a hack to avoid filtering the card itself
                // Re work this to avoid this hack
                .filter((card) => card.instanceId !== instanceId);
            return filter.length - differenceFilter.length > 0
                ? filter.length - differenceFilter.length
                : 0;
        }
        if (targetFilterReducer === "damage") {
            return filter.reduce((acc, card) => acc + card.damage, 0);
        }
        return filter.length;
    }
    if (amount) {
        return amount;
    }
    console.warn("No amount found ");
    return 0;
}
//# sourceMappingURL=dynamicAmount.js.map