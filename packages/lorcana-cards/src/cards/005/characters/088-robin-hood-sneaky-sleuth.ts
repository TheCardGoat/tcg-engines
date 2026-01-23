import type { CharacterCard } from "@tcg/lorcana-types";

export const robinHoodSneakySleuth: CharacterCard = {
  id: "qao",
  cardType: "character",
  name: "Robin Hood",
  version: "Sneaky Sleuth",
  fullName: "Robin Hood - Sneaky Sleuth",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "005",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Robin Hood.)\nCLEVER PLAN This character gets +1 {L} for each opposing damaged character in play.",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 1,
  cardNumber: 88,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5ec6356f453925f30d4ba08d072c6193045d6291",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const robinHoodSneakySleuth: LorcanitoCharacterCard = {
//   id: "d17",
//   missingTestCase: true,
//   name: "Robin Hood",
//   title: "Sneaky Sleuth",
//   characteristics: ["hero", "floodborn"],
//   text: "**Shift** 3 _(You may pay 3 {I} to play this on top of one of your characters named Robin Hood.)_ **CLEVER PLAN** This character gets +1 {L} for each opposing damaged character in play._ **",
//   type: "character",
//   abilities: [
//     shiftAbility(3, "Robin Hood"),
//     {
//       type: "static",
//       ability: "effects",
//       name: "Clever Plan",
//       text: "This character gets +1 {L} for each opposing damaged character in play.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "lore",
//           amount: {
//             dynamic: true,
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "type", value: "character" },
//               {
//                 filter: "status",
//                 value: "damage",
//                 comparison: { operator: "gte", value: 1 },
//               },
//               { filter: "owner", value: "opponent" },
//             ],
//           },
//           modifier: "add",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [{ filter: "source", value: "self" }],
//           },
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 5,
//   strength: 3,
//   willpower: 5,
//   lore: 1,
//   illustrator: "Nicholas Kole",
//   number: 88,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 559159,
//   },
//   rarity: "uncommon",
// };
//
