import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const maleficentVengefulSorceress: LorcanitoCharacterCardDefinition = {
  id: "may",
  name: "Maleficent",
  title: "Vengeful Sorceress",
  characteristics: ["sorcerer", "storyborn", "villain"],
  type: "character",
  flavour:
    "Evidently my invitation was lost. How dreadful. Here, let me help with the decorations...",
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 2,
  illustrator: "Aris Zentelis",
  number: 54,
  set: "SSK",
  rarity: "common",
};
