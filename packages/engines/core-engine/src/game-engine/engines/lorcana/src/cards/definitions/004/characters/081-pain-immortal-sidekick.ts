import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const painImmortalSidekick: LorcanaCharacterCardDefinition = {
  id: "yj2",
  name: "Pain",
  title: "Immortal Sidekick",
  characteristics: ["storyborn", "ally"],
  type: "character",
  flavour:
    "We totally took care of that thing you told us to do and definitely did not spend the day in Thebes ticketing chariots and stealing people's laundry.",
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 2,
  illustrator: "Oggy Christiansson",
  number: 81,
  set: "URR",
  rarity: "uncommon",
};
