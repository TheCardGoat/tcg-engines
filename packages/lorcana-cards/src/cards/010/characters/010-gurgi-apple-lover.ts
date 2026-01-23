import type { CharacterCard } from "@tcg/lorcana-types";

export const gurgiAppleLover: CharacterCard = {
  id: "1pr",
  cardType: "character",
  name: "Gurgi",
  version: "Apple Lover",
  fullName: "Gurgi - Apple Lover",
  inkType: ["amber"],
  franchise: "Black Cauldron",
  set: "010",
  text: "HAPPY DAY When you play this character, you may remove up to 2 damage from chosen character.",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 10,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "de9420fae42d1c05568f9e37cdeae27e27a78cd2",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
//
// export const gurgiAppleLover: LorcanitoCharacterCard = {
//   id: "sqe",
//   name: "Gurgi",
//   title: "Apple Lover",
//   characteristics: ["storyborn", "ally"],
//   text: "HAPPY DAY When you play this character, you may remove up to 2 damage from chosen character.",
//   type: "character",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   strength: 2,
//   willpower: 3,
//   illustrator: "McKay Anderson",
//   number: 10,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658290,
//   },
//   rarity: "common",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "heal",
//           amount: 2,
//           upTo: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               {
//                 filter: "type",
//                 value: "character",
//               },
//               {
//                 filter: "zone",
//                 value: "play",
//               },
//             ],
//           },
//         },
//       ],
//       resolveEffectsIndividually: false,
//       dependentEffects: false,
//       text: "you may remove up to 2 damage from chosen character.",
//     },
//   ],
//   lore: 1,
// };
//
