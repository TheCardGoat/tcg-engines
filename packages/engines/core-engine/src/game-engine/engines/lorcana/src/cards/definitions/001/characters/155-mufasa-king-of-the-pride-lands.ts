import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const mufasaKingOfProudLands: LorcanitoCharacterCardDefinition = {
  id: "py9",
  reprints: ["adw"],

  name: "Mufasa",
  title: "King of the Pride Lands",
  characteristics: ["storyborn", "king", "mentor"],
  type: "character",
  flavour:
    "A king must care for all of the creatures in his kingdom, no matter their size.",
  inkwell: true,
  colors: ["sapphire"],
  cost: 6,
  strength: 4,
  willpower: 6,
  lore: 3,
  illustrator: "Luis Huerta",
  number: 155,
  set: "TFC",
  rarity: "common",
};
