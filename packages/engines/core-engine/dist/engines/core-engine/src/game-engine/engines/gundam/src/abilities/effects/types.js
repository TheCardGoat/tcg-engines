export const isPlayerRestrictionEffect = (effect) => effect.type === "player-restriction";
export const isAttributeEffect = (effect) => effect.type === "attribute";
export const isContinuousEffect = (effect) => {
    return isAttributeEffect(effect) || isPlayerRestrictionEffect(effect);
};
//# sourceMappingURL=types.js.map