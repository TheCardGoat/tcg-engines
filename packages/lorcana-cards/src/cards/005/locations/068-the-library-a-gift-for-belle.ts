import type { LocationCard } from "@tcg/lorcana-types";

export const theLibraryAGiftForBelle: LocationCard = {
  id: "aw2",
  cardType: "location",
  name: "The Library",
  version: "A Gift for Belle",
  fullName: "The Library - A Gift for Belle",
  inkType: ["amethyst"],
  franchise: "Beauty and the Beast",
  set: "005",
  text: "LOST IN A BOOK Whenever a character is banished while here, you may draw a card.",
  cost: 3,
  moveCost: 1,
  lore: 0,
  cardNumber: 68,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "2740051e62c6c85db38c623243de3a6437a10a88",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoLocationCard } from "@lorcanito/lorcana-engine";
// import { gainAbilityWhileHere } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const theLibraryAGiftForBelle: LorcanitoLocationCard = {
//   id: "xz3",
//   name: "The Library",
//   title: "A Gift for Belle",
//   characteristics: ["location"],
//   text: "**LOST IN A BOOK** Whenever a character is banished while here, you may draw a card.",
//   type: "location",
//   abilities: [
//     gainAbilityWhileHere({
//       name: "Lost In a Book",
//       text: "Whenever a character is banished while here, you may draw a card.",
//       ability: whenThisCharacterBanished({
//         name: "Lost In a Book",
//         optional: true,
//         text: "Whenever a character is banished while here, you may draw a card.",
//         effects: [drawACard],
//       }),
//     }),
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 3,
//   willpower: 8,
//   lore: 1,
//   illustrator: "Roberto Gatto",
//   number: 68,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561302,
//   },
//   rarity: "uncommon",
//   moveCost: 1,
// };
//
