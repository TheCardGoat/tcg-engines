import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const magicBroomLivelySweeper: LorcanaCharacterCardDefinition = {
  id: "hxg",
  name: "Magic Broom",
  title: "Lively Sweeper",
  characteristics: ["dreamborn", "broom"],
  type: "character",
  flavour: "Clean like nothing happened.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  illustrator: "Rudy Hill",
  number: 49,
  set: "URR",
  rarity: "common",
};
