import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const fairyGodmotherHereToHelp: LorcanitoCharacterCardDefinition = {
  id: "foy",

  name: "Fairy Godmother",
  title: "Here to Help",
  characteristics: ["storyborn", "ally", "fairy"],
  type: "character",
  flavour:
    "Use a humdrum spell, and you'll end up with humdrum magic. I like my magic to have something special!",
  inkwell: true,
  colors: ["amethyst"],
  cost: 5,
  strength: 3,
  willpower: 7,
  lore: 2,
  illustrator: "Hedvig Häggman-Sund",
  number: 40,
  set: "ROF",
  rarity: "uncommon",
};
