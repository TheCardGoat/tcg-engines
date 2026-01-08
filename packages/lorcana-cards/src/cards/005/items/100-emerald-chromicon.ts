import type { ItemCard } from "@tcg/lorcana-types";

export const emeraldChromicon: ItemCard = {
  id: "1sl",
  cardType: "item",
  name: "Emerald Chromicon",
  inkType: ["emerald"],
  franchise: "Lorcana",
  set: "005",
  text: "EMERALD LIGHT During opponents' turns, whenever one of your characters is banished, you may return chosen character to their player's hand.",
  cost: 3,
  cardNumber: 100,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e8d2c7ee84a66e7cf0184644c8a27abafeef32a3",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYourOtherCharactersIsBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const emeraldChromiconItem: LorcanitoItemCard = {
//   id: "ewm",
//   name: "Emerald Chromicon",
//   characteristics: ["item"],
//   text: "**EMERALD LIGHT** During opponents’ turns, whenever one of your characters is banished, you may return chosen character to their player’s hand.",
//   type: "item",
//   abilities: [
//     whenYourOtherCharactersIsBanished({
//       name: "Emerald Light",
//       text: "During opponents’ turns, whenever one of your characters is banished, you may return chosen character to their player’s hand.",
//       optional: true,
//       conditions: [
//         {
//           type: "during-turn",
//           value: "opponent",
//         },
//       ],
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: chosenCharacter,
//         },
//       ],
//     }),
//   ],
//   flavour: "Trust in the winds of change.\n–Inscription",
//   colors: ["emerald"],
//   cost: 3,
//   illustrator: "Dustin Panzino",
//   number: 100,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 560098,
//   },
//   rarity: "uncommon",
// };
//
