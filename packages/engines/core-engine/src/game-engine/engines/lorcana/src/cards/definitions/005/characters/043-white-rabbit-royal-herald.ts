import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const whiteRabbitRoyalHerald: LorcanitoCharacterCardDefinition = {
  id: "xbh",
  name: "White Rabbit",
  title: "Royal Herald",
  characteristics: ["storyborn", "ally"],
  type: "character",
  flavour:
    '"Oh me, oh my! Did a piece just fall off the Illuminary?! I’ve got to tell someone before it’s too late, late, late!"',
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  illustrator: "James C Mulligan",
  number: 43,
  set: "SSK",
  rarity: "common",
};
