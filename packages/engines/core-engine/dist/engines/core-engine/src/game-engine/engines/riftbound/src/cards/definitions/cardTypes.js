/**
 * Card type definitions for Riftbound TCG
 * Based on the comprehensive rules analysis covering all card categories
 */
// Type guards for card categories
export const isUnitCard = (card) => card.type === "unit";
export const isGearCard = (card) => card.type === "gear";
export const isSpellCard = (card) => card.type === "spell";
export const isRuneCard = (card) => card.type === "rune";
export const isBattlefieldCard = (card) => card.type === "battlefield";
export const isLegendCard = (card) => card.type === "legend";
export const isTokenCard = (card) => "isToken" in card && card.isToken === true;
// Helper functions for card properties
export const isMainDeckCard = (card) => card.type === "unit" || card.type === "gear" || card.type === "spell";
export const isPermanent = (card) => card.type === "unit" || card.type === "gear";
export const isChampionUnit = (card) => isUnitCard(card) && card.isChampion === true;
export const isSignatureCard = (card) => isUnitCard(card) && card.isSignature === true;
export const hasKeyword = (card, keyword) => {
    if (!("keywords" in card))
        return false;
    return card.keywords.includes(keyword); // TODO: Fix type mismatch
};
export const getBaseCost = (card) => ({
    energy: card.energyCost,
    power: card.powerCost,
});
//# sourceMappingURL=cardTypes.js.map