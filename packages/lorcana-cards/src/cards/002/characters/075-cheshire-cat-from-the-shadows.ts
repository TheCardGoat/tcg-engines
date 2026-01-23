import type { CharacterCard } from "@tcg/lorcana-types";

export const cheshireCatFromTheShadows: CharacterCard = {
  id: "14g",
  cardType: "character",
  name: "Cheshire Cat",
  version: "From the Shadows",
  fullName: "Cheshire Cat - From the Shadows",
  inkType: ["emerald"],
  franchise: "Alice in Wonderland",
  set: "002",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Cheshire Cat.)\nEvasive (Only characters with Evasive can challenge this character.)\nWICKED SMILE {E} — Banish chosen damaged character.",
  cost: 8,
  strength: 5,
  willpower: 6,
  lore: 2,
  cardNumber: 75,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "91da2e177e44b0cdfd1e446b5b8aabb79e2ebafb",
  },
  abilities: [],
  classifications: ["Floodborn"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   evasiveAbility,
//   shiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const cheshireCatFromTheShadows: LorcanitoCharacterCard = {
//   id: "ebw",
//
//   name: "Cheshire Cat",
//   title: "From the Shadows",
//   characteristics: ["floodborn"],
//   text: "**Shift** 5 _You may pay 5 {I} to play this on top of one of your characters named Cheshire Cat.)_\n\n**Evasive** (_Only characters with Evasive can challenge this character._)\n\n**WICKED SMILE** {E} − Banish chosen damaged character.",
//   type: "character",
//   abilities: [
//     shiftAbility(5, "cheshire cat"),
//     evasiveAbility,
//     {
//       type: "activated",
//       name: "Wicked Smile",
//       text: "{E} − Banish chosen damaged character.",
//       optional: false,
//       costs: [{ type: "exert" }],
//       effects: [
//         {
//           type: "banish",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 8,
//   strength: 5,
//   willpower: 6,
//   lore: 2,
//   illustrator: "Jeff Murchie",
//   number: 75,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 526613,
//   },
//   rarity: "super_rare",
// };
//
