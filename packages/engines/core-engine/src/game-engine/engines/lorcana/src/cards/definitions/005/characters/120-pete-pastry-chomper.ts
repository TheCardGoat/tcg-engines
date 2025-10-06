import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const petePastryChomper: LorcanaCharacterCardDefinition = {
  id: "yv6",
  name: "Pete",
  title: "Pastry Chomper",
  characteristics: ["storyborn", "villain"],
  type: "character",
  flavour:
    "His half-baked scheme to whisk away the food almost worked. But in the end, he got his just desserts.",
  inkwell: true,
  colors: ["ruby"],
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  illustrator: "Gaku Kumatori",
  number: 120,
  set: "SSK",
  rarity: "common",
};
