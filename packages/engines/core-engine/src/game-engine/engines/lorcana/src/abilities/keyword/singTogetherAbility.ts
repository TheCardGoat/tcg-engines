import type { LorcanaDynamicValue as DynamicValue } from "../new-abilities";
import type { LorcanaKeywordAbility } from "./keyword";

// 10.10.Sing Together
// 10.10.1. The Sing Together keyword represents a static ability that allows a player to pay an alternate cost to sing a song with 1 or more of their characters. Sing Together N means "Instead of paying the ink cost of this card, you can {E} a number of your or your teammates' characters with total ink cost N or greater to play this card without paying its ink cost."
// 10.10.2. The standard reminder text for Sing Together is "(Any number of your or your teammates' characters with total cost N or more may {E} to sing this song for free.)"
// 10.10.3. When playing a song using Sing Together, add the ink costs of one or more of your ready characters together. If the total meets or exceeds the cost listed for Sing Together, the character or characters can sing the song.
// 10.10.4.When a character sings a song with Sing Together, any triggered abilities on it that have the condition "Whenever this character sings a song" occur when the trigger condition is met.
export interface SingTogetherAbility extends LorcanaKeywordAbility {
  keyword: "sing-together";
  value: number | DynamicValue;
}

export const singerTogetherAbility = (value: number): SingTogetherAbility => {
  return {
    type: "keyword",
    keyword: "sing-together",
    value: value,
    text: `**Sing Together** ${value} _(Any number of your of your teammates' characters with total cost ${value} or more may {E} to sing this song for free.)_`,
  };
};

export const isSingTogetherAbility = (
  ability?: LorcanaKeywordAbility,
): ability is SingTogetherAbility =>
  ability?.type === "keyword" && ability?.keyword === "sing-together";
