import type { CharacterCard } from "@tcg/lorcana-types";

export const liShangValorousGeneral: CharacterCard = {
  id: "hga",
  cardType: "character",
  name: "Li Shang",
  version: "Valorous General",
  fullName: "Li Shang - Valorous General",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "004",
  text: "Shift: Discard a character card (You may discard a character card to play this on top of one of your characters named Li Shang.)\nLEAD THE CHARGE Your characters with 4 {S} or more get +1 {L}.",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 112,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3ee66a487e0da6e7e8f7e34d90b9a4c6ca3d5865",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const liShangValorousGeneral: LorcanitoCharacterCard = {
//   id: "wyb",
//   name: "Li Shang",
//   title: "Valorous General",
//   characteristics: ["hero", "floodborn"],
//   text: "**Shift: Discard a character card** _(You may discard a character card to play this on top of one of your characters named Li Shang.)_\n\n**LEAD THE CHARGE** Your characters with 4 {S} or more get +1 {L}.",
//   type: "character",
//   abilities: [
//     shiftAbility(
//       [
//         {
//           type: "card",
//           action: "discard",
//           amount: 1,
//           filters: [
//             { filter: "zone", value: "hand" },
//             { filter: "owner", value: "self" },
//             { filter: "type", value: "character" },
//           ],
//         },
//       ],
//       "Li Shang",
//       "**Shift: Discard a character card**",
//     ),
//     {
//       type: "static",
//       ability: "effects",
//       name: "Lead The Charge",
//       text: "Your characters with 4 {S} or more get +1 {L}.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "lore",
//           modifier: "add",
//           amount: 1,
//           duration: "static",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//               {
//                 filter: "attribute",
//                 value: "strength",
//                 comparison: { operator: "gte", value: 4 },
//               },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 3,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Nicola Saviori",
//   number: 112,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 547766,
//   },
//   rarity: "uncommon",
// };
//
