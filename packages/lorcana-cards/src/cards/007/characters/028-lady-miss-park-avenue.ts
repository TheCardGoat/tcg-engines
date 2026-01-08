import type { CharacterCard } from "@tcg/lorcana-types";

export const ladyMissParkAvenue: CharacterCard = {
  id: "188",
  cardType: "character",
  name: "Lady",
  version: "Miss Park Avenue",
  fullName: "Lady - Miss Park Avenue",
  inkType: ["amber", "emerald"],
  franchise: "Lady and the Tramp",
  set: "007",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Lady.)\nSOMETHING WONDERFUL When you play this character, you may return up to 2 character cards with cost 2 or less each from your discard to your hand.",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 28,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9f61c69f6fd196f8a513e41f12c5e1940c07dc32",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const ladyMissParkAvenue: LorcanitoCharacterCard = {
//   id: "r02",
//   name: "Lady",
//   title: "Miss Park Avenue",
//   characteristics: ["floodborn", "hero"],
//   text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Lady.)\nSOMETHING WONDERFUL When you play this character, you may return up to 2 character cards with cost 2 or less each from your discard to your hand.",
//   type: "character",
//   abilities: [
//     shiftAbility(3, "Lady"),
//     whenYouPlayThis({
//       name: "Miss Park Avenue",
//       text: "When you play this character, you may return up to 2 character cards with cost 2 or less each from your discard to your hand.",
//       optional: true,
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: {
//             type: "card",
//             upTo: true,
//             value: 2,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "discard" },
//               { filter: "owner", value: "self" },
//               {
//                 filter: "attribute",
//                 value: "cost",
//                 comparison: { operator: "lte", value: 2 },
//               },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   inkwell: false,
//   colors: ["amber", "emerald"],
//   cost: 5,
//   strength: 4,
//   willpower: 4,
//   illustrator: "João Moura",
//   number: 28,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618265,
//   },
//   rarity: "super_rare",
//   lore: 2,
// };
//
