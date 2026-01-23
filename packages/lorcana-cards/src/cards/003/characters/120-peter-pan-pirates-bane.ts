import type { CharacterCard } from "@tcg/lorcana-types";

export const peterPanPiratesBane: CharacterCard = {
  id: "uwt",
  cardType: "character",
  name: "Peter Pan",
  version: "Pirate's Bane",
  fullName: "Peter Pan - Pirate's Bane",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "003",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Peter Pan.)\nEvasive (Only characters with Evasive can challenge this character.)\nYOU'RE NEXT! Whenever he challenges a Pirate character, this character takes no damage from the challenge.",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 120,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6f685f0a2a2fbce4b5ece504fc70f70dc4bae551",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   evasiveAbility,
//   shiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const peterPanPiratesBane: LorcanitoCharacterCard = {
//   id: "wzh",
//   missingTestCase: true,
//   name: "Peter Pan",
//   title: "Pirate's Bane",
//   characteristics: ["hero", "floodborn"],
//   text: "**Shift** 4 _(You may pay 4 ink to play this on top of one of your characters named Peter Pan.)_\n\n\n**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n\n**YOU'RE NEXT!** Whenever he challenges a Pirate character, this character takes no damage from the challenge.",
//   type: "character",
//   abilities: [
//     shiftAbility(4, "peter pan"),
//     evasiveAbility,
//     {
//       type: "static",
//       name: "You're Next!",
//       text: "Whenever he challenges a Pirate character, this character takes no damage from the challenge.",
//       ability: "effects",
//       effects: [
//         {
//           type: "protection",
//           from: "damage",
//           as: "attacker",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//               {
//                 filter: "characteristics",
//                 value: ["pirate"],
//               },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 5,
//   strength: 4,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Kuya Jaypi",
//   number: 120,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 538227,
//   },
//   rarity: "rare",
// };
//
