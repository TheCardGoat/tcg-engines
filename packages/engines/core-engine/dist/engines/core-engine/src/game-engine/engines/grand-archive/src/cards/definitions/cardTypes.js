/**
 * Grand Archive Card Type Definitions
 *
 * Comprehensive TypeScript interfaces for all Grand Archive card types
 * Based on Grand Archive Comprehensive Rules and game mechanics
 */
/**
 * Type guard functions for card types
 */
export const isChampionCard = (card) => {
    return card.type === "champion";
};
export const isAllyCard = (card) => {
    return card.type === "ally";
};
export const isActionCard = (card) => {
    return card.type === "action";
};
export const isAttackCard = (card) => {
    return card.type === "attack";
};
export const isItemCard = (card) => {
    return card.type === "item";
};
export const isWeaponCard = (card) => {
    return card.type === "weapon";
};
export const isDomainCard = (card) => {
    return card.type === "domain";
};
export const isPhantasiaCard = (card) => {
    return card.type === "phantasia";
};
/**
 * Utility functions for card properties
 */
export const getCardCost = (card) => {
    return card.reserveCost || card.memoryCost || 0;
};
export const hasKeyword = (card, keyword) => {
    return card.keywords?.includes(keyword);
};
export const hasSubtype = (card, subtype) => {
    return card.subtypes?.includes(subtype);
};
export const hasSupertype = (card, supertype) => {
    return card.supertypes?.includes(supertype);
};
export const isRegalia = (card) => {
    return hasSupertype(card, "regalia");
};
export const isUnique = (card) => {
    return hasSupertype(card, "unique");
};
/**
 * Card stat accessors with type safety
 */
export const getCardPower = (card) => {
    if (isAllyCard(card) || isAttackCard(card) || isWeaponCard(card)) {
        return card.power;
    }
    return undefined;
};
export const getCardLife = (card) => {
    if (isChampionCard(card) || isAllyCard(card)) {
        return card.life;
    }
    return undefined;
};
export const getCardDurability = (card) => {
    if (isWeaponCard(card)) {
        return card.durability;
    }
    if (isItemCard(card) || isDomainCard(card)) {
        return card.durability;
    }
    return undefined;
};
export const getCardLevel = (card) => {
    if (isChampionCard(card)) {
        return card.level;
    }
    return undefined;
};
/**
 * Card filtering utilities
 */
export const filterCardsByType = (cards, type) => {
    return cards.filter((card) => card.type === type);
};
export const filterCardsByElement = (cards, element) => {
    return cards.filter((card) => card.element === element);
};
export const filterCardsByImplemented = (cards, implemented = true) => {
    return cards.filter((card) => card.implemented === implemented);
};
//# sourceMappingURL=cardTypes.js.map