import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theWardrobeBelleConfident: LorcanitoCharacterCardDefinition = {
  id: "qvy",

  name: "The Wardrobe",
  title: "Belle's Confidant",
  characteristics: ["dreamborn", "ally"],
  type: "character",
  flavour: "When you simply must have the hautest couture.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  illustrator: "Giulia Riva",
  number: 57,
  set: "TFC",
  rarity: "common",
};
