import type { CharacterCard } from "@tcg/lorcana-types";

export const sisuEmpoweredSibling: CharacterCard = {
  id: "1q9",
  cardType: "character",
  name: "Sisu",
  version: "Empowered Sibling",
  fullName: "Sisu - Empowered Sibling",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "004",
  text: "Shift 6 (You may pay 6 {I} to play this on top of one of your characters named Sisu.)\nI GOT THIS! When you play this character, banish all opposing characters with 2 {S} or less.",
  cost: 8,
  strength: 5,
  willpower: 4,
  lore: 3,
  cardNumber: 125,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e06b6bded6dddec463efd1631f0f3855a2a886ca",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Deity", "Dragon"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const sisuEmpoweredSibling: LorcanitoCharacterCard = {
//   id: "vbb",
//   name: "Sisu",
//   title: "Empowered Sibling",
//   characteristics: ["hero", "floodborn", "dragon", "deity"],
//   text: "**Shift** 6 _You may pay 6 {I} to play this on top of one of your characters named Sisu.)_\n\n\n**I GOT THIS!** When you play this character, banish all opposing characters with 2 {S} or less.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "I GOT THIS!",
//       text: "When you play this character, banish all opposing characters with 2 {S} or less.",
//       effects: [
//         {
//           type: "banish",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "type", value: "character" },
//               { filter: "owner", value: "opponent" },
//               {
//                 filter: "attribute",
//                 value: "strength",
//                 comparison: { operator: "lte", value: 2 },
//               },
//             ],
//           },
//         },
//       ],
//     },
//     shiftAbility(6, "Sisu"),
//   ],
//   colors: ["ruby"],
//   cost: 8,
//   strength: 5,
//   willpower: 4,
//   lore: 3,
//   illustrator: "Grace Tran",
//   number: 125,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550601,
//   },
//   rarity: "legendary",
// };
//
