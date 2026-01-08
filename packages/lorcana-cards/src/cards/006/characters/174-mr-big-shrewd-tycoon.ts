import type { CharacterCard } from "@tcg/lorcana-types";

export const mrBigShrewdTycoon: CharacterCard = {
  id: "1lm",
  cardType: "character",
  name: "Mr. Big",
  version: "Shrewd Tycoon",
  fullName: "Mr. Big - Shrewd Tycoon",
  inkType: ["steel"],
  franchise: "Zootropolis",
  set: "006",
  text: "REPUTATION This character can't be challenged by characters with 2 {S} or more.",
  cost: 4,
  strength: 1,
  willpower: 1,
  lore: 3,
  cardNumber: 174,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "cfadaa4f1260ce978c286c033244ecbd996c65ac",
  },
  abilities: [],
  classifications: ["Storyborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const mrBigShrewdTycoon: LorcanitoCharacterCard = {
//   id: "ic8",
//   missingTestCase: true,
//   name: "Mr. Big",
//   title: "Shrewd Tycoon",
//   characteristics: ["storyborn"],
//   text: "REPUTATION This character can't be challenged by characters with 2 {S} or more.",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       ability: "effects",
//       name: "Reputation",
//       text: "This character can't be challenged by characters with 2 {S} or more.",
//       effects: [
//         {
//           type: "restriction",
//           restriction: "be-challenged",
//           target: thisCharacter,
//           challengerFilters: [
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "play" },
//             {
//               filter: "attribute",
//               value: "strength",
//               comparison: { operator: "gte", value: 2 },
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   inkwell: false,
//   colors: ["steel"],
//   cost: 4,
//   strength: 1,
//   willpower: 1,
//   lore: 3,
//   illustrator: "Federico Maria Caglioni",
//   number: 174,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 593029,
//   },
//   rarity: "rare",
// };
//
