import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const kingCandySovereignOfSugar: LorcanitoCharacterCardDefinition = {
  id: "v25",
  name: "King Candy",
  title: "Sovereign of Sugar",
  characteristics: ["storyborn", "villain", "king"],
  type: "character",
  flavour:
    "My sweet subjects, I can without a pinch of hesitation assure you that I have never been so happy.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Ottis Perdue",
  number: 137,
  set: "SSK",
  rarity: "common",
};
