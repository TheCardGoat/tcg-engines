import type {
  AttributeEffect,
  DynamicAmount,
  StaticAbility,
} from "@lorcanito/lorcana-engine";
import type { StaticAbilityWithEffect } from "@lorcanito/lorcana-engine/abilities/abilities";
import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";

// Sample texts:
// While you have a character named Dolores Madrigal in play, this character gets +1 {L}.
// This character gets +1 {S} for each other character you have in play.
// For each location you have in play, this character gets +1 {L}.
// This character gets +1 {S} for each card in your hand.
// This character gets +1 {S} for each other Broom character you have in play.
// While you have 3 or more items in play, this location gets +2 {L}.
// Your characters named Stitch count as having +1 cost to sing songs.
// If you have a character here, you pay 2 {I} less to move a character of yours here.
// This character gets +1 {S} and +1 {W} for each item you have in play.
// This character gets +1 {L} for each item you have in play.
export function propertyStaticAbilities({
  name,
  text,
  conditions,
  attribute,
  amount,
  target = thisCharacter,
  modifier = "add",
}: {
  name: string;
  text: string;
  conditions?: StaticAbility["conditions"];
  attribute: AttributeEffect["attribute"];
  target?: AttributeEffect["target"];
  modifier?: AttributeEffect["modifier"];
  amount: number | DynamicAmount;
}): StaticAbilityWithEffect {
  const attributeEffect: AttributeEffect = {
    type: "attribute",
    attribute,
    amount,
    modifier,
    target,
  };

  return {
    type: "static",
    ability: "effects",
    name,
    text,
    effects: [attributeEffect],
    conditions,
  };
}
