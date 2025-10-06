import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const aladdinCorneredSwordman: LorcanitoCharacterCardDefinition = {
  id: "izd",
  name: "Aladdin",
  title: "Cornered Swordsman",
  characteristics: ["hero", "storyborn"],
  type: "character",
  flavour: "Oh ho! So the street rat found a sword and a backbone! \n−Razoul",
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 2,
  illustrator: "Randy Bishop",
  number: 171,
  set: "TFC",
  rarity: "common",
};
