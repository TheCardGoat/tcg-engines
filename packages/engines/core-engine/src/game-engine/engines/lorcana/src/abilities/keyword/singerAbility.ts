import type {
  LorcanaDynamicValue as DynamicValue,
  LorcanaAbilityDuration,
} from "../new-abilities";
import type { LorcanaKeywordAbility } from "./keyword";

export interface SingerAbility extends LorcanaKeywordAbility {
  keyword: "singer";
  value: number | DynamicValue;
}

export const singerAbility = (value: number): SingerAbility => ({
  type: "keyword",
  keyword: "singer",
  value,
  text: `**Singer** +${value} _(This character counts as cost ${value} to sing songs.)_`,
});

export const isSingerAbility = (
  ability?: LorcanaKeywordAbility,
): ability is SingerAbility =>
  ability?.type === "keyword" && ability?.keyword === "singer";
