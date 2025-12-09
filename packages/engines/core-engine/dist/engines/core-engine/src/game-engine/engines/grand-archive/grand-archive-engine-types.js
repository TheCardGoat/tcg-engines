/**
 * Grand Archive Engine Type Definitions
 *
 * Comprehensive type system for Grand Archive TCG implementation
 * Based on Grand Archive Comprehensive Rules v1.1.3
 */
// =============================================================================
// Runtime Type Guards
// =============================================================================
/**
 * Type guard for Grand Archive card filters
 */
export const isGrandArchiveCardFilter = (filter) => {
    if (!filter || typeof filter !== "object")
        return false;
    const grandArchiveProperties = [
        "cardType",
        "element",
        "supertype",
        "reserveCost",
        "memoryCost",
        "power",
        "life",
        "durability",
        "level",
        "speed",
        "hasKeyword",
        "championClass",
        "isUnique",
        "isRegalia",
    ];
    return grandArchiveProperties.some((prop) => filter[prop] !== undefined);
};
/**
 * Type guard for Grand Archive player state
 */
export const isGrandArchivePlayerState = (state) => {
    if (!state || typeof state !== "object")
        return false;
    return (typeof state.id === "string" &&
        typeof state.name === "string" &&
        Array.isArray(state.championLineage) &&
        typeof state.championLevel === "number" &&
        state.availableElements instanceof Set &&
        typeof state.hasMaterialized === "boolean" &&
        Array.isArray(state.turnActions) &&
        typeof state.counters === "object");
};
/**
 * Type guard for Grand Archive game state
 */
export const isGrandArchiveGameState = (state) => {
    if (!state || typeof state !== "object")
        return false;
    const validSegments = [
        "startingAGame",
        "duringGame",
        "endGame",
    ];
    const validPhases = [
        "wakeUpPhase",
        "materializePhase",
        "recollectionPhase",
        "drawPhase",
        "mainPhase",
        "endPhase",
        "combatPhase",
    ];
    return (validSegments.includes(state.currentSegment) &&
        validPhases.includes(state.currentPhase) &&
        Array.isArray(state.effectsStack) &&
        state.passedPlayers instanceof Set);
};
//# sourceMappingURL=grand-archive-engine-types.js.map