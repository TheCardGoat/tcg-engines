/**
 * # Lorcana TCG Generic Type Definitions
 *
 * This module defines the game-specific types for Lorcana TCG that extend
 * the CoreEngine's generic type system with Lorcana-specific properties.
 */
/**
 * Type validation helpers for runtime type checking
 */
export const isLorcanaCardFilter = (filter) => {
    if (!filter || typeof filter !== "object")
        return false;
    // Check if it has any Lorcana-specific properties
    const lorcanaProperties = [
        "cost",
        "ink",
        "inkable",
        "strength",
        "willpower",
        "lore",
        "exerted",
        "damaged",
        "banished",
        "cardType",
        "hasKeyword",
        "abilities",
        "canQuest",
        "canChallenge",
        "canSing",
        "canBePlayed",
        "moveCost",
        "canTarget",
        "attachedTo",
        "playedThisTurn",
        "questedThisTurn",
        "challengedThisTurn",
        "set",
        "rarity",
        "nameContains",
        "textContains",
    ];
    return lorcanaProperties.some((prop) => filter[prop] !== undefined);
};
export const isLorcanaPlayerState = (state) => {
    if (!state || typeof state !== "object")
        return false;
    return (typeof state.id === "string" &&
        typeof state.name === "string" &&
        typeof state.lore === "number" &&
        typeof state.ink === "number");
};
//# sourceMappingURL=lorcana-generic-types.js.map