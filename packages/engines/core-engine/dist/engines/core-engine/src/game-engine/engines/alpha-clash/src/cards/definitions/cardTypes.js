/**
 * Card type definitions for Alpha Clash TCG
 *
 * Defines TypeScript interfaces for all Alpha Clash card types:
 * - Contender: Each player's main character with starting health
 * - Clash: Combat units that can attack and obstruct
 * - Accessory: Traps (face-down) and Weapons (attachments)
 * - Action: Spells with timing restrictions (Basic, Quick, Clash Buff)
 * - Clashground: Field effects (only one active at a time)
 */
/**
 * Type guards for card types
 */
export const isContenderCard = (card) => {
    return card.type === "contender";
};
export const isClashCard = (card) => {
    return card.type === "clash";
};
export const isAccessoryCard = (card) => {
    return card.type === "accessory";
};
export const isTrap = (card) => {
    return isAccessoryCard(card) && card.subtype === "trap";
};
export const isWeapon = (card) => {
    return isAccessoryCard(card) && card.subtype === "weapon";
};
export const isActionCard = (card) => {
    return card.type === "action";
};
export const isBasicAction = (card) => {
    return isActionCard(card) && card.subtype === "basic";
};
export const isQuickAction = (card) => {
    return isActionCard(card) && card.subtype === "quick";
};
export const isClashBuff = (card) => {
    return isActionCard(card) && card.subtype === "clash-buff";
};
export const isClashgroundCard = (card) => {
    return card.type === "clashground";
};
/**
 * Utility functions for card properties
 */
export const getCardCost = (card) => {
    return card.cost || 0;
};
export const getCardColors = (card) => {
    return card.colors || [];
};
export const hasKeyword = (card, keyword) => {
    return card.keywords?.includes(keyword);
};
export const hasAffiliation = (card, affiliation) => {
    return card.affiliations?.includes(affiliation);
};
export const isColorless = (card) => {
    return card.colors.length === 0 || card.colors.includes("colorless");
};
export const isMulticolored = (card) => {
    return card.colors.length > 1 && !card.colors.includes("colorless");
};
/**
 * Combat-related utility functions
 */
export const canAttack = (card) => {
    return isClashCard(card) || isContenderCard(card);
};
export const canObstruct = (card) => {
    return isClashCard(card);
};
export const getAttackValue = (card) => {
    if (isClashCard(card) || isContenderCard(card)) {
        return card.attack;
    }
    return 0;
};
export const getDefenseValue = (card) => {
    if (isClashCard(card) || isContenderCard(card)) {
        return card.defense;
    }
    return 0;
};
export const getHealthValue = (card) => {
    if (isContenderCard(card)) {
        return card.startingHealth;
    }
    return 0;
};
//# sourceMappingURL=cardTypes.js.map