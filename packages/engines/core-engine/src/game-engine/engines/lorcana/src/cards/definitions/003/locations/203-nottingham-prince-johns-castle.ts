import type { LorcanaLocationCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const nottinghamPrinceJohnsCastle: LorcanaLocationCardDefinition = {
  id: "jc5",
  type: "location",
  name: "Nottingham",
  title: "Prince John's Castle",
  characteristics: ["location"],
  flavour:
    "Sir Hiss: I say, ssssire, your mother's castle would be the perfect place to bring our plan to life! \nPrince John: Mummy!",
  inkwell: true,
  colors: ["steel"],
  cost: 2,
  willpower: 6,
  lore: 1,
  moveCost: 1,
  illustrator: "Bryn Jones",
  number: 203,
  set: "ITI",
  rarity: "common",
};
