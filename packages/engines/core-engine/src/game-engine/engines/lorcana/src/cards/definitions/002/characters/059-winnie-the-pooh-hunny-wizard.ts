import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const winnieThePoohHunnyWizard: LorcanitoCharacterCardDefinition = {
  id: "nkw",
  reprints: ["emh"],

  name: "Winnie The Pooh",
  title: "Hunny Wizard",
  characteristics: ["hero", "dreamborn", "sorcerer"],
  type: "character",
  flavour:
    "He’d always felt a kinship with honey. They were both golden, and sweet, and likely to end up in sticky situations.",
  inkwell: true,
  colors: ["amethyst"],
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  illustrator: "John Loren",
  number: 59,
  set: "ROF",
  rarity: "common",
};
