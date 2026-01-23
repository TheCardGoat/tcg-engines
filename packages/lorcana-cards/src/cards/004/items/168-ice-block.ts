import type { ItemCard } from "@tcg/lorcana-types";

export const iceBlock: ItemCard = {
  id: "ssh",
  cardType: "item",
  name: "Ice Block",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "004",
  text: "CHILLY LABOR {E} — Chosen character gets -1 {S} this turn.",
  cost: 1,
  cardNumber: 168,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "67c3a9d35138ced621a95e5ffb3c11d66ec99f27",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const iceBlock: LorcanitoItemCard = {
//   id: "i2i",
//   missingTestCase: true,
//   name: "Ice Block",
//   characteristics: ["item"],
//   text: "**CHILLY LABOR** {E} − Chosen character gets -1 {S} this turn.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       costs: [{ type: "exert" }],
//       name: "Chilly Labor",
//       text: "{E} − Chosen character gets -1 {S} this turn.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 1,
//           modifier: "subtract",
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   flavour: "Frozen ink can be harvested and processed to many useful ends.",
//   colors: ["sapphire"],
//   cost: 1,
//   illustrator: "Gregor Krysinski",
//   number: 168,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550615,
//   },
//   rarity: "common",
// };
//
