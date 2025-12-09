export const staticEffectAbilityPredicate = (ability) => staticAbilityPredicate(ability) && ability.ability === "effects";
export const gainStaticAbilityPredicate = (ability) => ability?.type === "static" && ability.ability === "gain-ability";
export const restrictionStaticAbilityPredicate = (ability) => staticAbilityPredicate(ability) && ability?.ability === "restriction";
export const alternateCostAbilityPredicate = (ability) => staticAbilityPredicate(ability) &&
    ability?.ability === "meta" &&
    "alternativeCosts" in ability;
export const playerRestrictionPredicate = (ability) => ability?.type === "static" && ability.ability === "player-restriction";
// TODO: I should probably get rid of this type of effect, it just complicate things
export const singleEffectAbility = (ability) => "effect" in (ability || {});
// TODO: there's static abilities with only effects
export const staticAbilityPredicate = (ability) => {
    if (!ability || typeof ability !== "object") {
        return false;
    }
    if (!("type" in ability)) {
        return false;
    }
    return ability?.type === "static";
};
export const singerStaticAbilityPredicate = (ability) => staticAbilityPredicate(ability) && ability.ability === "singer";
export const staticTriggeredAbilityPredicate = (ability) => ability?.type === "static-triggered";
export const delayedTriggeredAbilityPredicate = (ability) => ability?.type === "floating-triggered";
export const challengerAbilityPredicate = (ability) => staticAbilityPredicate(ability) && ability.ability === "challenger";
export const reverseChallengerAbilityPredicate = (ability) => staticAbilityPredicate(ability) && ability.ability === "reverse-challenger";
export const recklessAbilityPredicate = (ability) => staticAbilityPredicate(ability) && ability.ability === "reckless";
export const singerAbilityPredicate = (ability) => staticAbilityPredicate(ability) && ability.ability === "singer";
export const metaAbilityPredicate = (ability) => staticAbilityPredicate(ability) && ability.ability === "meta";
export const voicelessAbilityPredicate = (ability) => staticAbilityPredicate(ability) && ability.ability === "voiceless";
export const evasiveAbilityPredicate = (ability) => staticAbilityPredicate(ability) && ability.ability === "evasive";
export const wardAbilityPredicate = (ability) => staticAbilityPredicate(ability) && ability.ability === "ward";
export const vanishAbilityPredicate = (ability) => staticAbilityPredicate(ability) && ability.ability === "vanish";
export const shiftAbilityPredicate = (ability) => {
    return staticAbilityPredicate(ability) && ability.ability === "shift";
};
export const bodyguardAbilityPredicate = (ability) => staticAbilityPredicate(ability) && ability.ability === "bodyguard";
export const supportAbilityPredicate = (ability) => staticAbilityPredicate(ability) && ability.ability === "support";
export const singTogetherAbilityPredicate = (ability) => staticAbilityPredicate(ability) && ability.ability === "sing-together";
export const resistAbilityPredicate = (ability) => staticAbilityPredicate(ability) && ability.ability === "resist";
export const protectorAbilityPredicate = (ability) => staticAbilityPredicate(ability) && ability.ability === "protector";
export const rushAbilityPredicate = (ability) => staticAbilityPredicate(ability) && ability.ability === "rush";
export const resolutionAbilityPredicate = (ability) => ability?.type === "resolution";
export const activatedAbilityPredicate = (ability) => ability?.type === "activated";
export const cardCostPredicate = (cost) => cost?.type === "card";
export function notEmptyPredicate(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=abilityTypeGuards.js.map