import { exhaustiveCheck, notEmptyPredicate, } from "@lorcanito/lorcana-engine";
import { computeNumericOperator, } from "@lorcanito/lorcana-engine/store/resolvers/filterResolver";
// This is a workaround to avoid dead loops caused by recursive conditions
// Given the filter is done with a every function, we'll short circuit the evaluation
// See engine/store/resolver/README.md
const CONDITION_RANKING = {
    play: 2,
    hand: 3,
    damage: 4,
    resolution: 6,
    "during-turn": 8,
    player: 9,
    inkwell: 10,
    exerted: 11,
    "not-alone": 12,
    "played-songs": 13,
    "played-actions": 20,
    "char-is-at-location": 14,
    "chars-at-location": 16,
    "this-turn": 17,
    "first-time-move-to-location": 18,
    "no-character-has-quested": 19,
    "no-other-character-has-quested": 20,
    "player-lore-comparison": 21,
    // Dynamic filter, better keep them at the end
    clash: 50,
    attribute: 51,
    filter: 52,
    "have-strongest-character": 52,
};
// See engine/store/resolver/README.md
export function isSelfReferencingCondition(condition) {
    return CONDITION_RANKING[condition.type] < 50;
}
let callStackDepth = 0;
const MAX_DEPTH = 10;
export function isConditionMet(rootStore, sourceCard, conditions = []) {
    callStackDepth++;
    if (callStackDepth >= MAX_DEPTH) {
        console.log("Max call stack depth reached. Returning fallback.");
        callStackDepth--;
        return false;
    }
    try {
        if (!conditions.length) {
            return true;
        }
        return conditions
            .slice()
            .sort((a, b) => CONDITION_RANKING[a.type] - CONDITION_RANKING[b.type])
            .every((condition) => {
            switch (condition.type) {
                case "this-turn": {
                    const { value, negate, target, comparison, filters } = condition;
                    const player = target === "self"
                        ? sourceCard.ownerId
                        : rootStore.opponentPlayer(sourceCard.ownerId);
                    switch (value) {
                        case "has-challenged": {
                            const hasChallenged = rootStore.tableStore.getTable(player).turn?.challenges
                                ?.length;
                            return negate ? !hasChallenged : !!hasChallenged;
                        }
                        case "was-damaged": {
                            const tableDamages = Object.values(rootStore.tableStore.getTables())
                                .flatMap((table) => Object.keys(table.turn?.damages || {}))
                                .filter(notEmptyPredicate);
                            if (filters && comparison) {
                                const damagedThisTurnThatMatchesFilters = tableDamages
                                    .map((instanceId) => rootStore.cardStore.getCard(instanceId))
                                    .filter((card) => card?.matchesTargetFilter(filters, sourceCard.ownerId, sourceCard));
                                const meetComparison = computeNumericOperator(comparison, damagedThisTurnThatMatchesFilters.length, rootStore, sourceCard);
                                return negate ? !meetComparison : meetComparison;
                            }
                            const wasDamaged = tableDamages?.length;
                            return negate ? !wasDamaged : !!wasDamaged;
                        }
                        case "inked": {
                            const inkwellCards = rootStore.tableStore
                                .getTable(player)
                                .turn?.cardsMoved.filter((move) => move.to === "inkwell");
                            const wasInked = inkwellCards?.length;
                            return negate ? !wasInked : !!wasInked;
                        }
                        default: {
                            exhaustiveCheck(value);
                            return false;
                        }
                    }
                }
                case "first-time-move-to-location": {
                    const locationsEnteredDuringTurn = rootStore.tableStore.getTable(sourceCard.ownerId).turn?.locations;
                    if (!locationsEnteredDuringTurn) {
                        return true;
                    }
                    const enteredSourceLocation = locationsEnteredDuringTurn[sourceCard.instanceId];
                    return !enteredSourceLocation || enteredSourceLocation.length === 1;
                }
                case "no-character-has-quested": {
                    return !rootStore.tableStore.getTable(sourceCard.ownerId).turn
                        ?.quests?.length;
                }
                case "no-other-character-has-quested": {
                    return !rootStore.tableStore
                        .getTable(sourceCard.ownerId)
                        .turn?.quests?.some((quest) => quest !== sourceCard.instanceId);
                }
                case "player-lore-comparison": {
                    const { comparison } = condition;
                    const ownerId = sourceCard.ownerId;
                    const opponentId = rootStore.opponentPlayer(ownerId);
                    const playerLore = rootStore.tableStore.getTable(ownerId).lore || 0;
                    const opponentLore = rootStore.tableStore.getTable(opponentId).lore || 0;
                    return computeNumericOperator({ ...comparison, value: opponentLore }, playerLore, rootStore, sourceCard);
                    break;
                }
                case "player": {
                    const { player, attribute, comparison } = condition;
                    const playerId = player === "opponent"
                        ? rootStore.opponentPlayer(sourceCard.ownerId)
                        : sourceCard.ownerId;
                    switch (attribute) {
                        case "lore": {
                            const playerLore = rootStore.tableStore.getTable(playerId).lore || 0;
                            return computeNumericOperator(comparison, playerLore, rootStore, sourceCard);
                        }
                        default: {
                            exhaustiveCheck(attribute);
                            return false;
                        }
                    }
                }
                case "hand": {
                    const { player, amount, negate } = condition;
                    const playerId = player === "opponent"
                        ? rootStore.opponentPlayer(sourceCard.ownerId)
                        : sourceCard.ownerId;
                    const opponentPlayer = rootStore.opponentPlayer(playerId);
                    const playerHand = rootStore.tableStore.getPlayerZone(playerId, "hand")?.cards.length;
                    const opponentHand = rootStore.tableStore.getPlayerZone(opponentPlayer, "hand")?.cards.length;
                    let result;
                    if (typeof amount === "number") {
                        result =
                            rootStore.tableStore.getPlayerZone(playerId, "hand")?.cards
                                .length <= amount;
                    }
                    else {
                        switch (amount) {
                            case "eq": {
                                result = playerHand === opponentHand;
                                break;
                            }
                            case "gt": {
                                result = playerHand > opponentHand;
                                break;
                            }
                            case "gte": {
                                result = playerHand >= opponentHand;
                                break;
                            }
                            case "lt": {
                                result = playerHand < opponentHand;
                                break;
                            }
                            case "lte": {
                                result = playerHand <= opponentHand;
                                break;
                            }
                            default: {
                                exhaustiveCheck(amount);
                                return false;
                            }
                        }
                    }
                    return negate ? !result : result;
                }
                case "during-turn": {
                    return condition.value === "self"
                        ? sourceCard.ownerId === rootStore.turnPlayer
                        : sourceCard.ownerId !== rootStore.turnPlayer;
                }
                case "inkwell": {
                    const inkwell = rootStore.tableStore.getPlayerZone(sourceCard.ownerId, "inkwell")?.cards;
                    return inkwell?.length >= condition.amount;
                }
                case "exerted": {
                    return !sourceCard.ready;
                }
                case "not-alone": {
                    const cardsInPlay = rootStore.cardStore.getCardsByTargetFilter([
                        { filter: "zone", value: "play" },
                        { filter: "type", value: "character" },
                        { filter: "owner", value: sourceCard.ownerId },
                    ], rootStore.priorityPlayer, sourceCard);
                    return cardsInPlay.length > 1;
                }
                // TODO: improve this
                case "play": {
                    const cardsInPlay = rootStore.cardStore.cardsInPlay
                        .filter((card) => card.ownerId === sourceCard.ownerId)
                        .filter((card) => card.type === "character");
                    return computeNumericOperator(condition.comparison, cardsInPlay.length, rootStore, sourceCard);
                }
                case "damage": {
                    const { comparison } = condition;
                    return computeNumericOperator(comparison, sourceCard.damage, rootStore, sourceCard);
                }
                case "played-songs": {
                    const songPlayed = rootStore.tableStore
                        .getTable(sourceCard.ownerId)
                        .turn.cardsMoved.some((move) => move.to === "play" &&
                        move.card.type === "action" &&
                        move.card.characteristics.includes("song"));
                    // Check the value property, defaulting to true if not specified
                    const expectedValue = condition.value ?? true;
                    return songPlayed === expectedValue;
                }
                case "played-actions": {
                    const actionsPlayed = rootStore.tableStore
                        .getTable(sourceCard.ownerId)
                        .turn.cardsMoved.filter((move) => move.to === "play" && move.card.type === "action").length;
                    return computeNumericOperator(condition.comparison, actionsPlayed, rootStore, sourceCard);
                }
                case "resolution": {
                    const { value } = condition;
                    switch (value) {
                        case "bodyguard": {
                            console.warn("NOT IMPLEMENTED", value);
                            return false;
                        }
                        case "shift": {
                            return sourceCard.hasShift && sourceCard.meta.shifted;
                        }
                        default:
                            return false;
                    }
                }
                case "char-is-at-location": {
                    const { negate } = condition;
                    return negate
                        ? !sourceCard.meta.location
                        : !!sourceCard.meta.location;
                }
                case "chars-at-location": {
                    const { comparison, filters } = condition;
                    const charsAtLocation = sourceCard.getCardsAtLocation;
                    if (!filters) {
                        return computeNumericOperator(comparison, charsAtLocation.length, rootStore, sourceCard);
                    }
                    const filteredChars = charsAtLocation.filter((char) => char.matchesTargetFilter(filters, sourceCard.ownerId, sourceCard));
                    return computeNumericOperator(comparison, filteredChars.length, rootStore, sourceCard);
                }
                case "clash": {
                    const { filters, operator } = condition;
                    const opponentFilterLength = rootStore.cardStore.getCardsByTargetFilter([...filters, { filter: "owner", value: "opponent" }], undefined, undefined, undefined).length;
                    const selfFilterLength = rootStore.cardStore.getCardsByTargetFilter([...filters, { filter: "owner", value: "self" }], undefined, undefined, undefined).length;
                    const clashComparison = {
                        operator,
                        value: opponentFilterLength,
                    };
                    return computeNumericOperator(clashComparison, selfFilterLength, rootStore, sourceCard);
                }
                case "attribute": {
                    const { attribute, comparison } = condition;
                    switch (attribute) {
                        case "strength": {
                            return computeNumericOperator(comparison, sourceCard.strength, rootStore, sourceCard);
                        }
                        default: {
                            exhaustiveCheck(attribute);
                            return false;
                        }
                    }
                }
                case "filter": {
                    const { filters, comparison, negate, excludeSelf } = condition;
                    const length = rootStore.cardStore.getCardsByTargetFilter(filters, sourceCard.ownerId, sourceCard, excludeSelf).length;
                    const result = computeNumericOperator(comparison, length, rootStore, sourceCard);
                    return negate ? !result : result;
                }
                case "have-strongest-character": {
                    const cardModels = rootStore.cardStore.cardsInPlay.filter((card) => card.type === "character");
                    if (cardModels.length === 0) {
                        return false;
                    }
                    const reduceToStrongest = (strongest, card) => {
                        if (!strongest) {
                            return card;
                        }
                        return card.strength > strongest.strength ? card : strongest;
                    };
                    const strongestCard = cardModels
                        .filter((card) => card.ownerId === sourceCard.ownerId)
                        .reduce(reduceToStrongest, undefined);
                    const opponentsStrongest = cardModels
                        .filter((card) => card.ownerId !== sourceCard.ownerId)
                        .reduce(reduceToStrongest, undefined);
                    if (!(strongestCard || opponentsStrongest)) {
                        return false;
                    }
                    if (!strongestCard) {
                        return false;
                    }
                    if (!opponentsStrongest) {
                        return true;
                    }
                    return strongestCard.strength > opponentsStrongest.strength;
                }
                default: {
                    exhaustiveCheck(condition);
                    return false;
                }
            }
            return false;
        });
    }
    finally {
        callStackDepth--;
    }
}
//# sourceMappingURL=conditionResolver.js.map