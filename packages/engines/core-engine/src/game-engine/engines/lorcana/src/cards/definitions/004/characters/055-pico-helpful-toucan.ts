import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const picoHelpfulToucan: LorcanitoCharacterCardDefinition = {
  id: "xxo",
  name: "Pico",
  title: "Helpful Toucan",
  characteristics: ["storyborn", "ally"],
  type: "character",
  flavour:
    "He spotted a mysterious glow in the mountains nearby. Could it be the missing piece of the prophecy?",
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  illustrator: "Hadjie Joos",
  number: 55,
  set: "URR",
  rarity: "common",
};
