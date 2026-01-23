import type { CharacterCard } from "@tcg/lorcana-types";

export const jasmineRoyalSeafarer: CharacterCard = {
  id: "1pj",
  cardType: "character",
  name: "Jasmine",
  version: "Royal Seafarer",
  fullName: "Jasmine - Royal Seafarer",
  inkType: ["emerald"],
  franchise: "Aladdin",
  set: "006",
  text: "BY ORDER OF THE PRINCESS When you play this character, choose one: \n* Exert chosen damaged character. \n* Chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 70,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ddd60bc122f1c34cf707e969a06f3117df19f03f",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   chosenCharacter,
//   chosenDamagedCharacter,
//   chosenOpposingCharacter,
// } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const jasmineRoyalSeafarer: LorcanitoCharacterCard = {
//   id: "k7b",
//   missingTestCase: true,
//   name: "Jasmine",
//   title: "Royal Seafarer",
//   characteristics: ["storyborn", "hero", "princess"],
//   text: "BY ORDER OF THE PRINCESS When you play this character, choose one: \n* Exert chosen damaged character. \n* Chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "By Order of the Princess",
//       text: "When you play this character, choose one: \n* Exert chosen damaged character. \n* Chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
//       effects: [
//         {
//           type: "modal",
//           // TODO: Get rid of target
//           target: chosenCharacter,
//           modes: [
//             {
//               id: "1",
//               text: "Exert chosen damaged character.",
//               effects: [
//                 {
//                   type: "exert",
//                   exert: true,
//                   target: chosenDamagedCharacter,
//                 },
//               ],
//             },
//             {
//               id: "2",
//               text: "Chosen opposing character gains Reckless during their next turn.",
//               effects: [
//                 {
//                   type: "ability",
//                   ability: "reckless",
//                   modifier: "add",
//                   duration: "next_turn",
//                   target: chosenOpposingCharacter,
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 3,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Seda Coskun",
//   number: 70,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 586172,
//   },
//   rarity: "rare",
// };
//
