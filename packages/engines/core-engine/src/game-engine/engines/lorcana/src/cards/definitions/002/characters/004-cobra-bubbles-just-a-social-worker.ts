import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const cobraBubblesSimpleEducator: LorcanaCharacterCardDefinition = {
  id: "ygo",
  name: "Cobra Bubbles",
  title: "Just a Social Worker",
  characteristics: ["storyborn", "ally"],
  type: "character",
  flavour:
    "So if I understand correctly, your magic grimoire was washed away by a flood of magic ink?",
  inkwell: true,
  colors: ["amber"],
  cost: 7,
  strength: 5,
  willpower: 9,
  lore: 2,
  illustrator: "Jake Parker",
  number: 4,
  set: "ROF",
  rarity: "rare",
};
