import type { CharacterCard } from "@tcg/lorcana-types";

export const heiheiExpandedConsciousness: CharacterCard = {
  id: "quw",
  cardType: "character",
  name: "Heihei",
  version: "Expanded Consciousness",
  fullName: "Heihei - Expanded Consciousness",
  inkType: ["sapphire", "steel"],
  franchise: "Moana",
  set: "007",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Heihei.)\nResist +1 (Damage dealt to this character is reduced by 1.)\nCLEAR YOUR MIND When you play this character, put all cards from your hand into your inkwell facedown and exerted.",
  cost: 5,
  strength: 1,
  willpower: 5,
  lore: 2,
  cardNumber: 163,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "60cce29a8b123e85708a10c1bc80278325d99446",
  },
  abilities: [],
  classifications: ["Floodborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   resistAbility,
//   shiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const heiheiExpandedConsciousness: LorcanitoCharacterCard = {
//   id: "puo",
//   name: "Heihei",
//   title: "Expanded Consciousness",
//   characteristics: ["floodborn", "ally"],
//   text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Heihei.)\nResist +1\nCLEAR YOUR MIND When you play this character, put all cards from your hand into your inkwell facedown and exerted.",
//   type: "character",
//   abilities: [
//     shiftAbility(3, "Heihei"),
//     resistAbility(1),
//     whenYouPlayThis({
//       name: "CLEAR YOUR MIND",
//       text: "When you play this character, put all cards from your hand into your inkwell facedown and exerted.",
//       effects: [
//         {
//           type: "move",
//           to: "inkwell",
//           exerted: true,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "zone", value: "hand" },
//               { filter: "owner", value: "self" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 5,
//   strength: 1,
//   willpower: 5,
//   illustrator: "Maxine Vee",
//   number: 163,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619500,
//   },
//   rarity: "uncommon",
//   lore: 2,
// };
//
