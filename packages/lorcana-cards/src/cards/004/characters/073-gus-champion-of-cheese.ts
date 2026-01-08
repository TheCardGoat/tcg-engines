import type { CharacterCard } from "@tcg/lorcana-types";

export const gusChampionOfCheese: CharacterCard = {
  id: "1e3",
  cardType: "character",
  name: "Gus",
  version: "Champion of Cheese",
  fullName: "Gus - Champion of Cheese",
  inkType: ["emerald"],
  franchise: "Cinderella",
  set: "004",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 73,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "b525404fa16e5dc8261c66f987b27e303bfa5980",
  },
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const gusChampionOfCheese: LorcanitoCharacterCard = {
//   id: "zja",
//   name: "Gus",
//   title: "Champion of Cheese",
//   characteristics: ["storyborn", "ally"],
//   type: "character",
//   flavour: "You can always rely on him when it comes to cheese.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Maddie Shilt",
//   number: 73,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549680,
//   },
//   rarity: "common",
// };
//
