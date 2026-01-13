import type { CharacterCard } from "@tcg/lorcana-types";

export const honeyLemonChemicalGenius: CharacterCard = {
  id: "q86",
  cardType: "character",
  name: "Honey Lemon",
  version: "Chemical Genius",
  fullName: "Honey Lemon - Chemical Genius",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "006",
  text: "HERE'S THE BEST PART When you play this character, you may pay 2 {I} to have each opponent choose and discard a card.",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 2,
  cardNumber: 74,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5e86a95c6d5233fcd709d4134f62d1bdc511f8d1",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Inventor"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { opponent } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const honeyLemonChemicalGenius: LorcanitoCharacterCard = {
//   id: "rl9",
//   missingTestCase: true,
//   name: "Honey Lemon",
//   title: "Chemical Genius",
//   characteristics: ["hero", "storyborn", "inventor"],
//   text: "**HERE'S THE BEST PART** When you play this character, you may pay 2 {I} to have each opponent choose and discard a card.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       optional: true,
//       costs: [{ type: "ink", amount: 2 }],
//       name: "HERE'S THE BEST PART",
//       text: "When you play this character, you may pay 2 {I} to have each opponent choose and discard a card.",
//       effects: [
//         {
//           type: "create-layer-for-player",
//           target: opponent,
//           layer: {
//             type: "resolution",
//             name: "Here's the Best Part",
//             text: "Choose and discard a card.",
//             responder: "self",
//             effects: [
//               {
//                 type: "discard",
//                 amount: 1,
//                 target: {
//                   type: "card",
//                   value: 1,
//                   filters: [
//                     { filter: "zone", value: "hand" },
//                     { filter: "owner", value: "self" },
//                   ],
//                 },
//               },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "You're going to love this!",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   strength: 1,
//   willpower: 1,
//   lore: 2,
//   illustrator: "Aristidis Zentelis",
//   number: 74,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 578178,
//   },
//   rarity: "uncommon",
// };
//
