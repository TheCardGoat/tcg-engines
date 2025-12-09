/**
 * Type definitions for Alpha Clash TCG engine
 *
 * Alpha Clash is a 2+ player TCG with:
 * - 5 colors: white, blue, black, red, green
 * - 9 zones: Contender, Clash, Clashground, Accessory, Resource, Oblivion, Standby, hand, deck
 * - 5 card types: Contender, Clash, Accessory, Action, Clashground
 * - 6-step clash phase system
 */
/**
 * Runtime type validation helpers
 */
export const isAlphaClashCardFilter = (filter) => {
    if (!filter || typeof filter !== "object")
        return false;
    const alphaClashProperties = [
        "cardType",
        "subtype",
        "color",
        "cost",
        "zone",
        "status",
        "attack",
        "defense",
        "health",
        "hasKeyword",
        "affiliation",
        "rarity",
        "canPlay",
        "canActivate",
        "canAttack",
        "canObstruct",
        "set",
        "owner",
        "controller",
        "hasDamage",
        "damageType",
    ];
    return alphaClashProperties.some((prop) => filter[prop] !== undefined);
};
export const isAlphaClashPlayerState = (state) => {
    if (!state || typeof state !== "object")
        return false;
    return (typeof state.id === "string" &&
        typeof state.name === "string" &&
        state.zones &&
        typeof state.zones === "object" &&
        Array.isArray(state.turnHistory));
};
export const isAlphaClashGameState = (state) => {
    if (!state || typeof state !== "object")
        return false;
    return (typeof state === "object" &&
        (state.currentPhase === undefined || typeof state.currentPhase === "string"));
};
//# sourceMappingURL=alpha-clash-engine-types.js.map