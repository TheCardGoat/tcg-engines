import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const yzmaWithoutBeautySleep: LorcanaCharacterCardDefinition = {
  id: "doq",
  name: "Yzma",
  title: "Without Beauty Sleep",
  characteristics: ["sorcerer", "storyborn", "villain"],
  type: "character",
  flavour:
    "Yzma: Llamas! All I see when I close my eyes is llamas!\nKronk: Weird. I just saw one in the flood. Poor little guy.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  illustrator: "Pablo Hidalgo",
  number: 61,
  set: "ROF",
  rarity: "uncommon",
};
