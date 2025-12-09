/**
 * Card type definitions for One Piece TCG
 * Based on the comprehensive One Piece card information system
 */
// Card creation helpers
export const createLeaderCard = (base) => ({
    ...base,
    category: "leader",
});
export const createCharacterCard = (base) => ({
    ...base,
    category: "character",
});
export const createEventCard = (base) => ({
    ...base,
    category: "event",
});
export const createStageCard = (base) => ({
    ...base,
    category: "stage",
});
export const createDonCard = (base) => ({
    ...base,
    category: "don",
    colors: [],
});
// Type guards for card categories
export const isLeaderCard = (card) => {
    return card.category === "leader";
};
export const isCharacterCard = (card) => {
    return card.category === "character";
};
export const isEventCard = (card) => {
    return card.category === "event";
};
export const isStageCard = (card) => {
    return card.category === "stage";
};
export const isDonCard = (card) => {
    return card.category === "don";
};
// Card validation helpers
export const hasColor = (card, color) => {
    return card.colors.includes(color);
};
export const isMulticolor = (card) => {
    return card.colors.length > 1;
};
export const canPlayInDeck = (card, leaderColors) => {
    if (card.category === "leader" || card.category === "don") {
        return false; // Leaders and DON!! cards are not in the deck
    }
    // Card must have at least one color in common with leader
    return card.colors.some((color) => leaderColors.includes(color));
};
export const hasKeyword = (card, keyword) => {
    return card.text?.toLowerCase().includes(keyword.toLowerCase());
};
// Combat-related helpers
export const canAttack = (card) => {
    return card.category === "leader" || card.category === "character";
};
export const canBlock = (card) => {
    return card.category === "character" && hasKeyword(card, "blocker");
};
export const hasRush = (card) => {
    return hasKeyword(card, "rush");
};
export const hasDoubleAttack = (card) => {
    return hasKeyword(card, "double attack");
};
export const hasBanish = (card) => {
    return hasKeyword(card, "banish");
};
//# sourceMappingURL=cardTypes.js.map