import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const archimedsHighlyEducatedOwl: LorcanitoCharacterCardDefinition = {
  id: "doy",

  name: "Archimedes",
  title: "Highly Educated Owl",
  characteristics: ["dreamborn", "ally"],
  type: "character",
  flavour:
    "Flying is not merely some crude, mechanical process. It is a delicate art. Purely aesthetic. Poetry of motion. And the best way to learn it is to do it!",
  inkwell: true,
  colors: ["amethyst"],
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  illustrator: "Kendall Hale",
  number: 36,
  set: "TFC",
  rarity: "common",
};
