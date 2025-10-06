import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const daisyDuckLovelyLady: LorcanaCharacterCardDefinition = {
  id: "zvg",
  name: "Daisy Duck",
  title: "Lovely Lady",
  characteristics: ["dreamborn", "ally"],
  type: "character",
  flavour:
    "Sweet Dasiy, the fairest duck I ever met \nEach flaxen lock a rush of flowing gold \nHer bill the color of summer sunset \nExquisite plumes, a wonder to behold",
  inkwell: true,
  colors: ["amber"],
  cost: 1,
  strength: 1,
  willpower: 3,
  lore: 1,
  illustrator: "Stefano Zanchi",
  number: 6,
  set: "URR",
  rarity: "uncommon",
};
