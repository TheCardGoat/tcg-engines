import type { ActionCard } from "@tcg/lorcana-types";

export const theIslandsIPulledFromTheSea: ActionCard = {
  id: "pm0",
  cardType: "action",
  name: "The Islands I Pulled from the Sea",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "006",
  text: "Search your deck for a location card, reveal that card to all players, and put it into your hand. Then, shuffle your deck.",
  actionSubtype: "song",
  cost: 3,
  cardNumber: 130,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5c4e5d5a2a02a6032d8112a3e0f6e3d89ae1a904",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const theIslandsIPulledFromTheSea: LorcanitoActionCard = {
//   id: "bnu",
//   missingTestCase: true,
//   name: "The Islands I Pulled From The Sea",
//   characteristics: ["action", "song"],
//   text: "(A character with cost 3 or more can {E} to sing this song for free.)\nSearch your deck for a location card, reveal that card to all players, and put it into your hand. Then, shuffle your deck.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "shuffle-deck",
//           target: self,
//         },
//         {
//           type: "move",
//           to: "hand",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "zone", value: "deck" },
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "location" },
//             ],
//           },
//           forEach: [
//             {
//               type: "reveal",
//               target: {
//                 type: "card",
//                 value: 1,
//                 filters: [
//                   { filter: "owner", value: "self" },
//                   { filter: "type", value: "location" },
//                 ],
//               },
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   inkwell: false,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 0,
//   illustrator: "Wietse Treurniet",
//   number: 130,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 591984,
//   },
//   rarity: "uncommon",
// };
//
