import type { CharacterCard } from "@tcg/lorcana-types";

export const trampEnterprisingDog: CharacterCard = {
  id: "dfs",
  cardType: "character",
  name: "Tramp",
  version: "Enterprising Dog",
  fullName: "Tramp - Enterprising Dog",
  inkType: ["emerald"],
  franchise: "Lady and the Tramp",
  set: "007",
  text: "HEY, PIDGE If you have a character named Lady in play, you pay 1 {I} less to play this character.\nNO TIME FOR WISECRACKS When you play this character, chosen character of yours gets +1 {S} this turn for each other character you have in play.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 110,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "306f19dbca99cea365477d3efb8420831ab5d23c",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { ifYouHaveCharacterNamed } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import {
//   whenYouPlayThisCharacter,
//   whenYouPlayThisForEachYouPayLess,
// } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { getStrengthThisTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const trampEnterprisingDog: LorcanitoCharacterCard = {
//   id: "dxj",
//   name: "Tramp",
//   title: "Enterprising Dog",
//   characteristics: ["storyborn", "hero"],
//   type: "character",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   strength: 1,
//   willpower: 3,
//   illustrator: "Amanda MacFarlane",
//   number: 110,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618162,
//   },
//   rarity: "rare",
//   lore: 1,
//   text: "HEY, PIDGE If you have a character named Lady in play, you pay 1 {I} less to play this character.\nNO TIME FOR WISECRACKS When you play this character, chosen character of yours gets +1 {S} this turn for each other character you have in play.",
//   abilities: [
//     whenYouPlayThisForEachYouPayLess({
//       name: "Hey, Pidge",
//       text: "If you have a character named Lady in play, you pay 1 {I} less to play this character.",
//       amount: 1,
//       conditions: [ifYouHaveCharacterNamed("Lady")],
//     }),
//     whenYouPlayThisCharacter({
//       name: "No Time for Wisecracks",
//       text: "When you play this character, chosen character of yours gets +1 {S} this turn for each other character you have in play.",
//       effects: [
//         {
//           ...getStrengthThisTurn(
//             {
//               dynamic: true,
//               filters: [
//                 { filter: "type", value: "character" },
//                 { filter: "zone", value: "play" },
//                 { filter: "owner", value: "self" },
//                 { filter: "source", value: "other" },
//               ],
//             },
//             chosenCharacter,
//           ),
//           resolveAmountBeforeCreatingLayer: true,
//         },
//       ],
//     }),
//   ],
// };
//
