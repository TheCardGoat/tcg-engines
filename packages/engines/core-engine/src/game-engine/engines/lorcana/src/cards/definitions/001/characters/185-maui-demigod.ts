import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mauiDemiGod: LorcanitoCharacterCardDefinition = {
  id: "ehe",
  name: "Maui",
  title: "Demigod",
  characteristics: ["hero", "storyborn", "deity"],
  type: "character",
  flavour:
    "When the gods gift you a boat, you take it. The boat's owner is optional.",
  inkwell: true,
  colors: ["steel"],
  cost: 8,
  strength: 8,
  willpower: 8,
  lore: 3,
  illustrator: "Isaiah Mesq",
  number: 185,
  set: "TFC",
  rarity: "rare",
};
