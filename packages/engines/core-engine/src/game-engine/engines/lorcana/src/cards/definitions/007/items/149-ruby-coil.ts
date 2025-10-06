import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
import { rubyCoilAbility } from "~/game-engine/engines/lorcana/src/cards/definitions/007/abilities";

export const rubyCoil: LorcanaItemCardDefinition = {
  id: "y74",
  name: "Ruby Coil",
  characteristics: ["item"],
  text: "CRIMSON SPARK During your turn, whenever a card is put into your inkwell, chosen character gets +2 {S} this turn.",
  type: "item",
  abilities: [rubyCoilAbility],
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  illustrator: "Francesco Colucci",
  number: 149,
  set: "007",
  rarity: "uncommon",
};
