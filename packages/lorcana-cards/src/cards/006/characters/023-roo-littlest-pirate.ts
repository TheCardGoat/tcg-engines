import type { CharacterCard } from "@tcg/lorcana-types";

export const rooLittlestPirate: CharacterCard = {
  id: "q64",
  cardType: "character",
  name: "Roo",
  version: "Littlest Pirate",
  fullName: "Roo - Littlest Pirate",
  inkType: ["amber"],
  franchise: "Winnie the Pooh",
  set: "006",
  text: "I'M A PIRATE TOO! When you play this character, you may give chosen character -2 {S} until the start of your next turn.",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 23,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5e51d257d6b1fcde2adb3b7b91d7893fe3916c21",
  },
  abilities: [],
  classifications: ["Dreamborn", "Ally", "Pirate"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const rooLittlestPirate: LorcanitoCharacterCard = {
//   id: "n3v",
//   missingTestCase: true,
//   name: "Roo",
//   title: "Littlest Pirate",
//   characteristics: ["dreamborn", "ally", "pirate"],
//   text: "I'M A PIRATE TOO! When you play this character, you may give chosen character -2 {S} until the start of your next turn.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "I'm a Pirate Too",
//       text: "When you play this character, you may give chosen character -2 {S} until the start of your next turn.",
//       optional: true,
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 2,
//           modifier: "subtract",
//           duration: "next_turn",
//           until: true,
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   strength: 1,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Gianluca Barone",
//   number: 23,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 587967,
//   },
//   rarity: "common",
// };
//
