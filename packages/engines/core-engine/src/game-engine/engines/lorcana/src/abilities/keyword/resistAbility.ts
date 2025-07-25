import type {
  LorcanaDynamicValue as DynamicValue,
  LorcanaAbilityDuration,
} from "../new-abilities";
import type { LorcanaKeywordAbility } from "./keyword";

// 10.6. Resist
// 10.6.1. The Resist keyword represents a static ability that creates a replacement effect. Resist +N means "If damage would be dealt to this character or location, the character or location is dealt that much damage minus N instead." Because this is a +N ability, this stacks with other Resist effects.
// 10.6.2. The standard reminder text for a character with Resist is "(Damage dealt to this character is reduced by N.)" The standard reminder text for a location with Resist is "(Damage dealt to this location is reduced by N.)"
// 10.6.3. If damage dealt to this character or location is reduced to 0, no damage is considered to have been dealt.
export interface ResistAbility extends LorcanaKeywordAbility {
  type: "keyword";
  keyword: "resist";
  value: number | DynamicValue;
  duration?: LorcanaAbilityDuration; // Optional duration for resist, if it is permanent
}

export const resistAbility = (
  value: number | DynamicValue,
  duration?: LorcanaAbilityDuration,
): ResistAbility => {
  return {
    type: "keyword",
    keyword: "resist",
    value: value,
    duration: duration,
    text: `**Resist** +${value} _(Damage dealt to this character is reduced by ${value}.)_`,
  };
};

export const isResistAbility = (
  ability?: LorcanaKeywordAbility,
): ability is ResistAbility =>
  ability?.type === "keyword" && ability?.keyword === "resist";
