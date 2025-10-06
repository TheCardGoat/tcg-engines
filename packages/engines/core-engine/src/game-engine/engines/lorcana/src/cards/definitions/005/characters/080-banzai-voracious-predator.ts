import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const banzaiVoraciousPredator: LorcanitoCharacterCardDefinition = {
  id: "q8r",
  name: "Banzai",
  title: "Gluttonous Predator",
  characteristics: ["storyborn", "ally", "hyena"],
  type: "character",
  flavour: "He will never turn down a quick bite before dinner.",
  colors: ["emerald"],
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 2,
  illustrator: "Otto Paredes",
  number: 80,
  set: "SSK",
  rarity: "rare",
};
