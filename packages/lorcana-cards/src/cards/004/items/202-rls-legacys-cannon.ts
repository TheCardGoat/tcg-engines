import type { ItemCard } from "@tcg/lorcana-types";

export const rlsLegacysCannon: ItemCard = {
  id: "1rt",
  cardType: "item",
  name: "RLS Legacy's Cannon",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "004",
  text: "BA-BOOM! {E}, 2 {I}, Discard a card — Deal 2 damage to chosen character or location.",
  cost: 3,
  cardNumber: 202,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e3f387f2b59dcd08d2b328296fa4c6ef0dcb7867",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacterOrLocation } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const rlsLegacysCannon: LorcanitoItemCard = {
//   id: "etn",
//   missingTestCase: true,
//   name: "RLS Legacy's Cannon",
//   characteristics: ["item"],
//   text: "**BA-BOOM!** {E}, 2 {I}, Discard a card - Deal 2 damage to chosen character or location.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "BA-BOOM!",
//       costs: [
//         { type: "exert" },
//         {
//           type: "ink",
//           amount: 2,
//         },
//         {
//           type: "card",
//           amount: 1,
//           action: "discard",
//           filters: [
//             { filter: "owner", value: "self" },
//             { filter: "zone", value: "hand" },
//           ],
//         },
//       ],
//       text: "{E}, 2 {I}, Discard a card - Deal 2 damage to chosen character or location.",
//       effects: [
//         {
//           type: "damage",
//           amount: 2,
//           target: chosenCharacterOrLocation,
//         },
//       ],
//     },
//   ],
//   flavour:
//     "So help me, I'll use the ship's cannons to blast ya all to kingdom come!\n−John Silver",
//   colors: ["steel"],
//   cost: 3,
//   illustrator: "Luigi Aime",
//   number: 202,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 548537,
//   },
//   rarity: "rare",
// };
//
