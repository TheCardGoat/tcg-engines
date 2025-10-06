import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const argesTheCyclops: LorcanaCharacterCardDefinition = {
  id: "gam",
  name: "Arges",
  title: "The Cyclops",
  characteristics: ["storyborn", "titan"],
  type: "character",
  flavour:
    "Looks like you got some big feelings there, buddy−let's stomp 'em out!",
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  strength: 4,
  willpower: 1,
  lore: 1,
  illustrator: "Alice Pisoni",
  number: 173,
  set: "URR",
  rarity: "common",
};
