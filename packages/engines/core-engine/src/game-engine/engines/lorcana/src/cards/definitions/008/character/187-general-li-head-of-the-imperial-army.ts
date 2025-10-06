import { resistAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/resistAbility";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const generalLiHeadOfTheImperialArmy: LorcanaCharacterCardDefinition = {
  id: "r6f",
  name: "General Li",
  title: "Head of the Imperial Army",
  characteristics: ["storyborn", "mentor"],
  text: "Resist +1 ",
  type: "character",
  abilities: [resistAbility(1)],
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 2,
  willpower: 4,
  illustrator: "Kendall Hale",
  number: 187,
  set: "008",
  rarity: "uncommon",
  lore: 1,
};
