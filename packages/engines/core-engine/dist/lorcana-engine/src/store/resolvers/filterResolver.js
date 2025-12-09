import { isDynamicAmount } from "@lorcanito/lorcana-engine/effects/effectTypes";
import { exhaustiveCheck } from "@lorcanito/lorcana-engine/lib/exhaustiveCheck";
import { calculateDynamicAmount } from "@lorcanito/lorcana-engine/store/resolvers/dynamicAmount";
// This is a workaround to avoid dead loops caused by recursive filters
// Given the filter is done with a every function, we'll short circuit the evaluation
// See engine/store/resolver/README.md
const FILTER_RANKING = {
    instanceId: 0,
    "name-a-card": 1,
    type: 2,
    characteristics: 3,
    zone: 4,
    owner: 5,
    status: 6,
    location: 7,
    challenge: 8,
    source: 9,
    sing: 10,
    "top-deck": 11,
    "was-challenged": 12,
    trigger: 13,
    publicId: 14,
    // Dynamic filter, better keep them at the end
    attribute: 50,
    turn: 51,
    can: 52,
    ability: 53,
};
// See engine/store/resolver/README.md
export function isSelfReferencingFilter(filter) {
    switch (filter.filter) {
        case "attribute":
        case "ability":
        case "turn":
        case "can":
            return true;
        case "was-challenged":
        case "location":
        case "challenge":
        case "sing":
        case "source":
        case "instanceId":
        case "publicId":
        case "top-deck":
        case "owner":
        case "name-a-card":
        case "status":
        case "zone":
        case "characteristics":
        case "type":
        case "trigger":
            return false;
        default: {
            exhaustiveCheck(filter);
            return false;
        }
    }
}
let callStackDepth = 0;
const MAX_DEPTH = 10;
export function createTargetFiltersPredicate(store, player, activeFilters, source, excludeSelf, params) {
    const playerId = player || store.activePlayer;
    // Given how code is currently structured, make sure "heavy to compute" filters are at the end.
    // This helps with performance as we can skip the filter if the card doesn't match the previous ones.
    function predicate(card) {
        callStackDepth++;
        if (callStackDepth >= MAX_DEPTH) {
            console.log("Max call stack depth reached. Returning fallback.");
            callStackDepth--;
            return false;
        }
        try {
            // TODO: If we change this semantic to ALL cards instead of no cards, search for occurences and update them
            // or else drag&drop will break
            // No filters means no cards
            if (!activeFilters || activeFilters.length === 0) {
                return false;
            }
            if (card.meta.shifted && card.instanceId === card.meta.shifted) {
                return false;
            }
            if (excludeSelf && source && card.instanceId === source.instanceId) {
                return false;
            }
            return activeFilters
                .slice()
                .sort((a, b) => FILTER_RANKING[a.filter] - FILTER_RANKING[b.filter])
                .every((filter) => {
                const lorcanitoCard = card.lorcanitoCard;
                const activeFilter = filter.filter;
                if (card.meta.shifter) {
                    return false;
                }
                switch (activeFilter) {
                    case "zone": {
                        const { value } = filter;
                        if (Array.isArray(value)) {
                            return value.includes(card.zone);
                        }
                        return value === card.zone;
                    }
                    case "owner": {
                        const { value } = filter;
                        return filterByOwner(value, playerId, card);
                    }
                    case "status": {
                        const { value, negate } = filter;
                        let result = false;
                        if (value === "damage" && "comparison" in filter) {
                            result = computeNumericOperator(filter.comparison, card.meta.damage || 0, store, source);
                        }
                        else {
                            switch (value) {
                                case "damage": {
                                    // This is already being handled by the numeric comparison above
                                    result = !!card.meta?.damage;
                                    break;
                                }
                                case "at-location": {
                                    result = card.isAtAnyLocation();
                                    break;
                                }
                                case "ready": {
                                    result = card.ready;
                                    break;
                                }
                                case "exerted": {
                                    result = !card.ready;
                                    break;
                                }
                                case "dry": {
                                    result = !card.meta?.playedThisTurn;
                                    break;
                                }
                                case "damaged": {
                                    result = !!card.meta?.damage;
                                    break;
                                }
                                case "has-card-under": {
                                    result = !!card.meta.shifted;
                                    break;
                                }
                                default: {
                                    exhaustiveCheck(value);
                                    result = false;
                                }
                            }
                        }
                        return negate ? !result : result;
                    }
                    case "type": {
                        const { value, negate } = filter;
                        let result = false;
                        if (Array.isArray(value)) {
                            result = filter.value.includes(lorcanitoCard?.type);
                        }
                        else {
                            result = value === lorcanitoCard?.type;
                        }
                        return negate ? !result : result;
                    }
                    case "characteristics": {
                        const { value, conjunction, negate } = filter;
                        return negate
                            ? !filterByCharacteristics(value, card, conjunction)
                            : filterByCharacteristics(value, card, conjunction);
                    }
                    case "source": {
                        const { value } = filter;
                        if (!source) {
                            console.warn("Source not found, this is likely a mistake", filter);
                            return false;
                        }
                        switch (value) {
                            case "other": {
                                return card.instanceId !== source.instanceId;
                            }
                            case "self": {
                                return card.instanceId === source.instanceId;
                            }
                            case "trigger": {
                                return false;
                            }
                            case "target": {
                                return !!params?.targets?.find((target) => target.instanceId === card.instanceId);
                            }
                            default: {
                                exhaustiveCheck(value);
                                return false;
                            }
                        }
                    }
                    case "location": {
                        if (filter.value === "source") {
                            return card.isAtLocation(source);
                        }
                        console.warn("Location filter not implemented");
                        return false;
                    }
                    case "instanceId": {
                        const { value } = filter;
                        if (Array.isArray(value)) {
                            return value.includes(card.instanceId);
                        }
                        const found = store.cardStore.getCard(value);
                        return card.instanceId === found?.instanceId;
                    }
                    case "publicId": {
                        const { value } = filter;
                        return card.publicId === value;
                    }
                    case "challenge": {
                        const { value } = filter;
                        const attackerId = store.stateMachineStore.challengeState?.attacker;
                        const defenderId = store.stateMachineStore.challengeState?.defender;
                        switch (value) {
                            case "defender": {
                                return card.instanceId === defenderId;
                            }
                            case "attacker": {
                                return card.instanceId === attackerId;
                            }
                            default: {
                                exhaustiveCheck(value);
                                return false;
                            }
                        }
                    }
                    case "trigger": {
                        console.warn("NOT IMPLEMENTED");
                        console.log("Trigger filter should have been replaced by instanceId filter");
                        return false;
                    }
                    case "sing": {
                        const currentSingers = store.stateMachineStore?.playCardState?.params?.singers;
                        if (currentSingers) {
                            return currentSingers.includes(card.instanceId);
                        }
                        console.warn("NOT IMPLEMENTED");
                        console.log("Sing filter should have been replaced by instanceId filter");
                        return false;
                    }
                    case "top-deck": {
                        const { value } = filter;
                        const targetPlayer = value === "self" ? playerId : store.opponentPlayer(playerId);
                        const topCard = store.tableStore.getTopDeckCard(targetPlayer);
                        return topCard?.instanceId === card.instanceId;
                    }
                    case "was-challenged": {
                        let found = false;
                        // TODO: This could be the table of the active player actually
                        store.tableStore.getTables().forEach((table) => {
                            table.turn.challenges.forEach((challenge) => {
                                if (challenge.defender.instanceId === card.instanceId) {
                                    console.log(challenge.defender.fullName);
                                    found = true;
                                }
                            });
                        });
                        return found;
                    }
                    case "name-a-card": {
                        if (filter.value === "name" && filter.comparison) {
                            return filterByAttribute("name", filter.comparison, store, card, false);
                        }
                        console.error("This filter should have been replaced before getting here");
                        return false;
                    }
                    case "ability": {
                        const { value, negate } = filter;
                        return negate ? !card.hasAbility(value) : card.hasAbility(value);
                    }
                    case "attribute": {
                        const { value, ignoreBonuses } = filter;
                        if (value === "inkwell") {
                            //TODO: implement ignore bonus, for the weird case of having hiddenInkCastersInPlay in play
                            return card.inkwell === filter.comparison;
                        }
                        return filterByAttribute(value, filter.comparison, store, card, ignoreBonuses);
                    }
                    case "can": {
                        const { value } = filter;
                        if (!source) {
                            console.warn("Something is wrong, source must be present");
                            return false;
                        }
                        switch (value) {
                            case "challenge": {
                                return source.canChallenge(card);
                            }
                            case "shift": {
                                return source.canShiftInto(card);
                            }
                            case "sing_song": {
                                return card.canSingASong(source);
                            }
                            case "sing": {
                                return card.canSing;
                            }
                            default: {
                                exhaustiveCheck(value);
                                return false;
                            }
                        }
                    }
                    case "turn": {
                        const { value, targetFilter, comparison } = filter;
                        const table = store.tableStore.getTable(source?.ownerId);
                        if (!table) {
                            return false;
                        }
                        switch (value) {
                            case "played": {
                                const cardsMoved = table.turn.cardsMoved.filter((move) => move.to === "play" &&
                                    card.matchesTargetFilter(targetFilter, source?.ownerId, source)).length;
                                return computeNumericOperator(comparison, cardsMoved, store, source);
                            }
                            case "inkwell": {
                                const cardsMoved = table.turn.cardsMoved.filter((move) => move.to === "inkwell" &&
                                    card.matchesTargetFilter(targetFilter, source?.ownerId, source)).length;
                                return computeNumericOperator(comparison, cardsMoved, store, source);
                            }
                            case "challenge": {
                                const challengesThisTurnMatchingFilter = table.turn.challenges.filter((challenge) => {
                                    console.log({
                                        card: card.fullName,
                                        attacker: challenge.attacker.fullName,
                                        defender: challenge.defender.fullName,
                                        targetFilter: JSON.stringify(targetFilter),
                                    });
                                    return (challenge.attacker.matchesTargetFilter(targetFilter, source?.ownerId, source) ||
                                        challenge.defender.matchesTargetFilter(targetFilter, source?.ownerId, source));
                                }).length;
                                return computeNumericOperator(comparison, challengesThisTurnMatchingFilter, store, source);
                            }
                            default: {
                                exhaustiveCheck(value);
                                return false;
                            }
                        }
                    }
                    default: {
                        exhaustiveCheck(activeFilter);
                        return false;
                    }
                }
            });
        }
        finally {
            callStackDepth--;
        }
    }
    return predicate;
}
export function filterByOwner(value, playerId, card) {
    if (value === "opponent") {
        return card.ownerId !== playerId;
    }
    if (value === "self") {
        return card.ownerId === playerId;
    }
    return value === card.ownerId;
}
export function isStringComparison(comparison) {
    return (typeof comparison.value === "string" ||
        (Array.isArray(comparison.value) && typeof comparison.value[0] === "string"));
}
export function isNumericComparison(comparison) {
    return typeof comparison.value === "number";
}
export function filterByAttribute(value, comparison, store, card, ignoreBonuses) {
    if (!card) {
        return false;
    }
    if (value === "instanceId") {
        if (isStringComparison(comparison)) {
            if (Array.isArray(comparison.value)) {
                return comparison.value.includes(card.instanceId);
            }
            return comparison.value === card.instanceId;
        }
        return false;
    }
    const attribute = ignoreBonuses && card ? card.lorcanitoCard[value] : card[value];
    if (isStringComparison(comparison) && typeof attribute === "string") {
        if (Array.isArray(comparison.value)) {
            return comparison.value.some((name) => {
                return name.toLocaleLowerCase() === attribute.toLocaleLowerCase();
            });
        }
        return (comparison.value.toLocaleLowerCase() === attribute.toLocaleLowerCase());
    }
    if (isNumericComparison(comparison) && typeof attribute === "number") {
        return computeNumericOperator(comparison, attribute, store, card);
    }
    return false;
}
function filterByCharacteristics(value, card, conjunction = "and") {
    if (!card) {
        return false;
    }
    if (conjunction === "and") {
        return value.every((characteristic) => {
            return card.lorcanitoCard.characteristics?.includes(characteristic);
        });
    }
    if (conjunction === "or") {
        return value.some((characteristic) => {
            return card.lorcanitoCard.characteristics?.includes(characteristic);
        });
    }
    return false;
}
export function computeNumericOperator(numericComparison, numericValueToCompare, rootStore, source, targets = []) {
    const operator = numericComparison.operator;
    const valueToCompare = isDynamicAmount(numericValueToCompare)
        ? calculateDynamicAmount(numericValueToCompare, rootStore, targets, source)
        : numericValueToCompare;
    const comparisonValue = isDynamicAmount(numericComparison.value)
        ? calculateDynamicAmount(numericComparison.value, rootStore, targets, source)
        : numericComparison.value;
    switch (operator) {
        case "eq": {
            return valueToCompare === comparisonValue;
        }
        case "gt": {
            return valueToCompare > comparisonValue;
        }
        case "gte": {
            return valueToCompare >= comparisonValue;
        }
        case "lt": {
            return valueToCompare < comparisonValue;
        }
        case "lte": {
            return valueToCompare <= comparisonValue;
        }
        default: {
            exhaustiveCheck(operator);
            return false;
        }
    }
}
//# sourceMappingURL=filterResolver.js.map