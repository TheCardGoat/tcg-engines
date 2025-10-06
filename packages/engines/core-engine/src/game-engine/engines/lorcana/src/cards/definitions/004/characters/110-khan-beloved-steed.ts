import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const khanBelovedSteed: LorcanaCharacterCardDefinition = {
  id: "e8z",
  name: "Khan",
  title: "Beloved Steed",
  characteristics: ["storyborn", "ally"],
  type: "character",
  flavour:
    "As silent as a shadow and faster than the wind: brave Khan, the mightiest stallion.",
  inkwell: true,
  colors: ["ruby"],
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  illustrator: "Nicholas Kole",
  number: 110,
  set: "URR",
  rarity: "uncommon",
};
