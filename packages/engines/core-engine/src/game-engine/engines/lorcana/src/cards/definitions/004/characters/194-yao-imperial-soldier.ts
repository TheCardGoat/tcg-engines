import { challengerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/challengerAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const yaoImperialSoldier: LorcanaCharacterCardDefinition = {
  id: "wch",
  name: "Yao",
  title: "Imperial Soldier",
  characteristics: ["storyborn", "ally"],
  text: "**Challenger +2** _(While challenging, this character gets +2 {S}.)_",
  type: "character",
  abilities: [challengerAbility(2)],
  flavour: "I'm gonna hit you so hard, it'll make your ancestors dizzy.",
  inkwell: true,
  colors: ["steel"],
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  illustrator: "Michela Cacciatore / Giulia Priori",
  number: 194,
  set: "URR",
  rarity: "common",
};
