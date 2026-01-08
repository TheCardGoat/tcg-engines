import type { CharacterCard } from "@tcg/lorcana-types";

export const edHystericalPartygoer: CharacterCard = {
  id: "q6u",
  cardType: "character",
  name: "Ed",
  version: "Hysterical Partygoer",
  fullName: "Ed - Hysterical Partygoer",
  inkType: ["emerald"],
  franchise: "Lion King",
  set: "005",
  text: "ROWDY GUEST Damaged characters can't challenge this character.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 3,
  cardNumber: 81,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5e6406aaa374d7b2bc273392407785819a729b39",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally", "Hyena"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const edHystericalPartygoer: LorcanitoCharacterCard = {
//   id: "tsa",
//   missingTestCase: true,
//   name: "Ed",
//   title: "Hysterical Partygoer",
//   characteristics: ["storyborn", "ally", "hyena"],
//   text: "**ROWDY GUEST** Damaged characters can’t challenge this character.",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       name: "Rowdy Guest",
//       text: "Damaged characters can’t challenge this character.",
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
//                 filter: "status",
//                 value: "damage",
//                 comparison: { operator: "gte", value: 1 },
//               },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "As far as he’s concerned, there’s no such thing as bad taste.",
//   colors: ["emerald"],
//   cost: 4,
//   strength: 2,
//   willpower: 4,
//   lore: 3,
//   illustrator: "Stefano Spagnuolo",
//   number: 81,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 559626,
//   },
//   rarity: "uncommon",
// };
//
