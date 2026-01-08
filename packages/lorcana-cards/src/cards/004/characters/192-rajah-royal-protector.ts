import type { CharacterCard } from "@tcg/lorcana-types";

export const rajahRoyalProtector: CharacterCard = {
  id: "f6t",
  cardType: "character",
  name: "Rajah",
  version: "Royal Protector",
  fullName: "Rajah - Royal Protector",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "004",
  text: "STEADY GAZE While you have no cards in your hand, characters with cost 4 or less can't challenge this character.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 192,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "36be3bec8183584cb53505ad713a85eb409bbbf4",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const rajahRoyalProtector: LorcanitoCharacterCard = {
//   id: "sf3",
//   missingTestCase: true,
//   name: "Rajah",
//   title: "Royal Protector",
//   characteristics: ["storyborn", "ally"],
//   text: "**STEADY GAZE** While you have no cards in your hand, characters with cost 4 or less can't challenge this character.",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       name: "Steady Gaze",
//       text: "While you have no cards in your hand, characters with cost 4 or less can't challenge this character.",
//       conditions: [{ type: "hand", amount: 0, player: "self" }],
//       ability: "effects",
//       effects: [
//         {
//           type: "protection",
//           from: "challenge",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               {
//                 filter: "attribute",
//                 value: "cost",
//                 comparison: { operator: "lte", value: 4 },
//               },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "As regal as his namesake and just as powerful.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 4,
//   strength: 3,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Sandara Tang",
//   number: 192,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 547779,
//   },
//   rarity: "rare",
// };
//
