import type { LorcanaDynamicValue as DynamicValue } from "~/game-engine/engines/lorcana/src/abilities/ability-types";
import type {
  LorcanaBaseKeywordAbility,
  LorcanaKeywordAbility,
} from "./keyword";

export interface SingerAbility extends LorcanaBaseKeywordAbility {
  keyword: "singer";
  value: number | DynamicValue;
}

export const singerAbility = (value: number): SingerAbility => ({
  type: "keyword",
  keyword: "singer",
  value,
  text: `**Singer** +${value} _(This character counts as cost ${value} to sing songs.)_`,
  effects: [], // Keyword abilities have empty effects by default
});

export const isSingerAbility = (
  ability?: LorcanaKeywordAbility,
): ability is SingerAbility =>
  ability?.type === "keyword" && ability?.keyword === "singer";
