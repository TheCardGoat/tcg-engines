import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const rayaWarriorOfKumandra: LorcanitoCharacterCardDefinition = {
  id: "goj",
  name: "Raya",
  title: "Warrior of Kumandra",
  characteristics: ["hero", "storyborn", "princess"],
  type: "character",
  flavour: "My ba dreams of a united Kumandra. I fight to honor that dream.",
  inkwell: true,
  colors: ["ruby"],
  cost: 4,
  strength: 5,
  willpower: 3,
  lore: 1,
  illustrator: "Matthew Robert Davies",
  number: 124,
  set: "ROF",
  rarity: "uncommon",
};
