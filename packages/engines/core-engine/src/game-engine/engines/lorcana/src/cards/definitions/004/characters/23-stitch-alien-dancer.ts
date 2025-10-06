import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const stitchAlienDancer: LorcanaCharacterCardDefinition = {
  id: "hq5",
  reprints: ["g0k"],
  name: "Stitch",
  title: "Alien Dancer",
  characteristics: ["hero", "alien", "storyborn"],
  type: "character",
  flavour:
    "Moving to the beat of the music, he begins to understand the true meaning of ohana and his place in the family he has found.",
  inkwell: true,
  colors: ["amber"],
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  illustrator: "Aisha Durmagambetova",
  number: 23,
  set: "URR",
  rarity: "common",
};
