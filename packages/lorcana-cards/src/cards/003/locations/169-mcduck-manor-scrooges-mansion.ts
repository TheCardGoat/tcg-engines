import type { LocationCard } from "@tcg/lorcana-types";

export const mcduckManorScroogesMansion: LocationCard = {
  id: "12h",
  cardType: "location",
  name: "McDuck Manor",
  version: "Scrooge's Mansion",
  fullName: "McDuck Manor - Scrooge's Mansion",
  inkType: ["sapphire"],
  franchise: "Ducktales",
  set: "003",
  cost: 4,
  moveCost: 1,
  lore: 0,
  cardNumber: 169,
  inkable: true,
  vanilla: true,
  externalIds: {
    ravensburger: "8aa9251dcc86028d39e3e81f85533171539598da",
  },
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
//
// export const mcduckManorScroogesMansion: LorcanitoLocationCard = {
//   id: "qyj",
//   name: "McDuck Manor",
//   title: "Scrooge's Mansion",
//   characteristics: ["location"],
//   type: "location",
//   flavour: "It's only the coolest home in Lorcana! \n–Webby Vanderquack",
//   inkwell: true,
//   colors: ["sapphire"],
//   willpower: 9,
//   lore: 2,
//   illustrator: "Alex Accorsi",
//   number: 169,
//   cost: 4,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 539104,
//   },
//   rarity: "common",
//   moveCost: 1,
// };
//
