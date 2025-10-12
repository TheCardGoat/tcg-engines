import { challengerAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const priceEricDashingAndBrave: LorcanaCharacterCardDefinition = {
  id: "omx",
  reprints: ["rfl"],

  name: "Prince Eric",
  title: "Dashing and Brave",
  characteristics: ["hero", "storyborn", "prince"],
  text: "**Challenger** +2 _(While challenging, this character gets +2 {S}.)_",
  type: "character",
  abilities: [challengerAbility(2)],
  flavour: "I lost her once! I'm not gonna lose her again!",
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  illustrator: "Cristian Romero",
  number: 187,
  set: "TFC",
  rarity: "common",
};
