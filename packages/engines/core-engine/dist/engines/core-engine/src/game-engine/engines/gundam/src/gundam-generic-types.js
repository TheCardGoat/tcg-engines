/**
 * # Gundam TCG Generic Type Definitions
 *
 * This module defines the game-specific types for Gundam TCG that extend
 * the CoreEngine's generic type system with Gundam-specific properties.
 */
/**
 * Type validation helpers for runtime type checking
 */
export const isGundamCardFilter = (filter) => {
    if (!filter || typeof filter !== "object")
        return false;
    // Check if it has any Gundam-specific properties
    const gundamProperties = [
        "cardType",
        "color",
        "cost",
        "deploymentZone",
        "canDeploy",
        "isPaired",
        "isExerted",
        "attack",
        "defense",
        "hasKeyword",
        "hasAbility",
        "canPairWith",
        "pairedWith",
        "playableThisTurn",
        "activatedThisTurn",
    ];
    return gundamProperties.some((prop) => filter[prop] !== undefined);
};
export const isGundamPlayerState = (state) => {
    if (!state || typeof state !== "object")
        return false;
    return (typeof state.id === "string" &&
        typeof state.name === "string" &&
        Array.isArray(state.turnHistory) &&
        state.zones &&
        typeof state.zones === "object");
};
//# sourceMappingURL=gundam-generic-types.js.map