import type { CharacterCard } from "@tcg/lorcana-types";

export const pennyBoltsPerson: CharacterCard = {
  id: "i2f",
  cardType: "character",
  name: "Penny",
  version: "Bolt's Person",
  fullName: "Penny - Bolt's Person",
  inkType: ["amber", "steel"],
  franchise: "Bolt",
  set: "007",
  text: "ENDURING LOYALTY When you play this character, you may remove up to 2 damage from chosen character and they gain Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  cardNumber: 21,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "411deec2bc09d6d9bad7ac874b976b9ef4264678",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const pennyBoltsPerson: LorcanitoCharacterCard = {
//   id: "tmn",
//   name: "Penny",
//   title: "Bolt's Person",
//   characteristics: ["storyborn", "ally"],
//   text: "ENDURING LOYALTY When you play this character, you may remove up to 2 damage from chosen character and they gain Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "ENDURING LOYALTY",
//       text: "When you play this character, you may remove up to 2 damage from chosen character and they gain Resist +1 until the start of your next turn.",
//       optional: true,
//       effects: [
//         {
//           type: "heal",
//           amount: 2,
//           upTo: true,
//           target: chosenCharacter,
//         },
//         {
//           type: "ability",
//           ability: "resist",
//           modifier: "add",
//           amount: 1,
//           duration: "next_turn",
//           until: true,
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//
//   colors: ["amber", "steel"],
//   cost: 2,
//   strength: 1,
//   willpower: 2,
//   illustrator: "Aisha Durrgambetova",
//   number: 21,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619416,
//   },
//   rarity: "uncommon",
//   lore: 2,
// };
//
