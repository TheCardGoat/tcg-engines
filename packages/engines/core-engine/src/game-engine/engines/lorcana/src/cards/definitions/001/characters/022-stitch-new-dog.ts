import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const stichtNewDog: LorcanitoCharacterCardDefinition = {
  id: "wk8",

  name: "Stitch",
  title: "New Dog",
  characteristics: ["hero", "alien", "storyborn"],
  type: "character",
  flavour:
    "Lilo: „David! I got a new dog! David: „Auwe! . . . You sure it‘s a dog? Lilo: „Uh-huh. He used to be a collie before he got\rran over.",
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Alex Accorsi",
  number: 22,
  set: "TFC",
  rarity: "common",
};
