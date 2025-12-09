/**
 * Generic type definitions that extend the core engine for One Piece TCG
 * These types integrate with the CoreEngine framework
 */
// Game-specific validation helpers
export const isValidZone = (zone) => {
    const validZones = [
        "deck",
        "hand",
        "donDeck",
        "costArea",
        "lifeArea",
        "trash",
        "leaderArea",
        "characterArea",
        "stageArea",
    ];
    return validZones.includes(zone);
};
export const isValidCardCategory = (category) => {
    const validCategories = [
        "leader",
        "character",
        "event",
        "stage",
        "don",
    ];
    return validCategories.includes(category);
};
export const isValidColor = (color) => {
    const validColors = [
        "red",
        "green",
        "blue",
        "purple",
        "black",
        "yellow",
    ];
    return validColors.includes(color);
};
export const isValidAttribute = (attribute) => {
    const validAttributes = [
        "slash",
        "strike",
        "ranged",
        "special",
        "wisdom",
    ];
    return validAttributes.includes(attribute);
};
// Zone capacity validation
export const getZoneCapacity = (zone) => {
    switch (zone) {
        case "characterArea":
            return 5; // Max 5 Character cards
        case "stageArea":
            return 1; // Max 1 Stage card
        case "leaderArea":
            return 1; // Exactly 1 Leader card
        case "donDeck":
            return 10; // Exactly 10 DON!! cards
        case "deck":
            return 50; // Exactly 50 cards
        default:
            return null; // No limit
    }
};
// Zone visibility helpers
export const getZoneVisibility = (zone) => {
    switch (zone) {
        case "hand":
            return "private"; // Only owner can see
        case "deck":
        case "donDeck":
            return "secret"; // No one can see order/contents
        case "lifeArea":
            return "secret"; // Face-down, no one can see
        default:
            return "public"; // Everyone can see
    }
};
// Zone ordering helpers
export const isZoneOrdered = (zone) => {
    return zone === "deck" || zone === "donDeck" || zone === "lifeArea";
};
//# sourceMappingURL=one-piece-generic-types.js.map