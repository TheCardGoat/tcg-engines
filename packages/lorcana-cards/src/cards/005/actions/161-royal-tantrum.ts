import type { ActionCard } from "@tcg/lorcana-types";

export const royalTantrum: ActionCard = {
  id: "96v",
  cardType: "action",
  name: "Royal Tantrum",
  inkType: ["sapphire"],
  franchise: "Robin Hood",
  set: "005",
  text: "Banish any number of your items, then draw a card for each item banished this way.",
  cost: 4,
  cardNumber: 161,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "211fa6f2c714f9c7c38c603759096a5a87b2f7c3",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const royalTantrum: LorcanitoActionCard = {
//   id: "v3q",
//   name: "Royal Tantrum",
//   characteristics: ["action"],
//   text: "Banish any number of your items, then draw a card for each item banished this way.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "banish",
//           forEach: [drawACard],
//           target: {
//             type: "card",
//             value: 99,
//             upTo: true,
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "item" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "I am King! King! King!",
//   colors: ["sapphire"],
//   cost: 4,
//   illustrator: "Michela Cacciatore / Giulia Riva",
//   number: 161,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 560510,
//   },
//   rarity: "rare",
// };
//
