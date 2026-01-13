import type { ItemCard } from "@tcg/lorcana-types";

export const luckyDime: ItemCard = {
  id: "ue6",
  cardType: "item",
  name: "Lucky Dime",
  inkType: ["sapphire"],
  franchise: "Ducktales",
  set: "003",
  text: "NUMBER ONE {E}, 2 {I} — Choose a character of yours and gain lore equal to their {L}.",
  cost: 7,
  cardNumber: 165,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6d8acbfa2c88c40a18a277b2a9ba61ba059ab1a3",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacterOfYours } from "@lorcanito/lorcana-engine/abilities/target";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const luckyDime: LorcanitoItemCard = {
//   id: "r2f",
//   name: "Lucky Dime",
//   characteristics: ["item"],
//   text: "**NUMBER ONE** {E}, 2 {I} − Choose a character of yours and gain lore equal to their {L}.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "Number one",
//       text: "{E}, 2 {I} − Choose a character of yours and gain lore equal to their {L}.",
//       optional: false,
//       costs: [{ type: "exert" }, { type: "ink", amount: 2 }],
//       effects: [
//         {
//           type: "from-target-card-to-target-player",
//           player: "card-owner",
//           target: chosenCharacterOfYours,
//           effects: [
//             {
//               type: "lore",
//               modifier: "add",
//               target: self,
//               amount: {
//                 dynamic: true,
//                 target: { attribute: "lore" },
//               },
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   flavour: "This one simple coin changed Scrooge's life forever.",
//   colors: ["sapphire"],
//   cost: 7,
//   illustrator: "Leonardo Giammichele",
//   number: 165,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 536272,
//   },
//   rarity: "legendary",
// };
//
