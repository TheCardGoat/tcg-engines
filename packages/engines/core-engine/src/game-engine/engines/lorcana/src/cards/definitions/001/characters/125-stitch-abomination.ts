import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const stitchAbomination: LorcanaCharacterCardDefinition = {
  id: "jhe",

  name: "Stitch",
  title: "Abomination",
  characteristics: ["hero", "alien", "storyborn"],
  type: "character",
  flavour:
    "His destructive programming is taking effect. He will be irresistibly drawn to large cities, where he will back up sewers, reverse street signs, and steal everyone's left shoe. \n−Jumba Jookiba",
  inkwell: true,
  colors: ["ruby"],
  cost: 6,
  strength: 4,
  willpower: 6,
  lore: 3,
  illustrator: "Bill Robinson",
  number: 125,
  set: "TFC",
  rarity: "rare",
};
