export const attributeEffectPredicate = (effect) => effect?.type === "attribute";
export const modalEffectPredicate = (effect) => effect?.type === "modal";
export const strengthEffectPredicate = (effect) => attributeEffectPredicate(effect) && effect.attribute === "strength";
export const moveCostEffectPredicate = (effect) => attributeEffectPredicate(effect) && effect.attribute === "moveCost";
export const costEffectPredicate = (effect) => attributeEffectPredicate(effect) && effect.attribute === "cost";
export const willPowerEffectPredicate = (effect) => attributeEffectPredicate(effect) && effect.attribute === "willpower";
export const singCostEffectPredicate = (effect) => attributeEffectPredicate(effect) && effect.attribute === "singCost";
export const loreEffectPredicate = (effect) => attributeEffectPredicate(effect) && effect.attribute === "lore";
export const targetConditionalEffectPredicate = (effect) => effect?.type === "target-conditional";
export const scryEffectPredicate = (effect) => effect?.type === "scry";
export const replacementEffectPredicate = (effect) => effect?.type === "replacement";
export const costReplacementEffectPredicate = (effect) => replacementEffectPredicate(effect) && effect.replacement === "cost";
export const costReplacementShiftEffectPredicate = (effect) => replacementEffectPredicate(effect) && effect.replacement === "shift";
export const protectionEffectPredicate = (effect) => effect?.type === "protection";
export const damageProtectionEffectPredicate = (effect) => effect?.type === "protection" && effect.from === "damage";
export const restrictionEffectPredicate = (effect) => effect?.type === "restriction";
export const questRestrictionEffectPredicate = (effect) => restrictionEffectPredicate(effect) && effect.restriction === "quest";
export const damageRemovalRestrictionEffectPredicate = (effect) => restrictionEffectPredicate(effect) && effect.restriction === "damage-removal";
export const damageDealtRestrictionEffectPredicate = (effect) => restrictionEffectPredicate(effect) && effect.restriction === "damage-dealt";
export const additionalInkwellEffectPredicate = (effect) => effect?.type === "additional-inkwell";
export const challengeRestrictionEffectPredicate = (effect) => effect?.type === "restriction" && effect.restriction === "challenge";
export const challengeCharactersRestrictionEffectPredicate = (effect) => effect?.type === "restriction" &&
    effect.restriction === "challenge-characters";
export const beChallengedRestrictionEffectPredicate = (effect) => effect?.type === "restriction" && effect.restriction === "be-challenged";
export const readyAtStartOfTurnEffectPredicate = (effect) => effect?.type === "restriction" &&
    effect.restriction === "ready-at-start-of-turn";
export const playActionCardsRestrictionEffectPredicate = (effect) => effect?.type === "player-restriction" &&
    effect.restriction === "play-action-cards";
export const gainLoreRestrictionEffectPredicate = (effect) => effect?.type === "player-restriction" && effect.restriction === "gain-lore";
export const damageEffectPredicate = (effect) => effect?.type === "damage";
export const discardEffectPredicate = (effect) => effect?.type === "discard";
export const isDynamicAmount = (amount) => amount.dynamic;
export const isDiscardCost = (cost) => cost?.type === "card" && cost.action === "discard";
//# sourceMappingURL=effectTypes.js.map