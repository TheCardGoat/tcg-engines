import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseWideeyedDiver: CharacterCard = {
  id: "974",
  cardType: "character",
  name: "Minnie Mouse",
  version: "Wide-Eyed Diver",
  fullName: "Minnie Mouse - Wide-Eyed Diver",
  inkType: ["ruby"],
  set: "002",
  franchise: "Mickey and Friends",
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Minnie Mouse.)\nEvasive (Only characters with Evasive can challenge this character.)\nUNDERSEA ADVENTURE Whenever you play a second action in a turn, this character gets +2 {L} this turn.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 114,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "21266db7b36d71ffdf1724077c586bfa8a5b870e",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   evasiveAbility,
//   shiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const minnieMouseWideEyedDiver: LorcanitoCharacterCard = {
//   id: "whf",
//   name: "Minnie Mouse",
//   title: "Wide-Eyed Diver",
//   characteristics: ["hero", "floodborn"],
//   text: "**Shift** 2\n\n**Evasive**\n\n**UNDERSEA ADVENTURE** Whenever you play a second action in a turn, this character gets +2 {L} this turn.",
//   type: "character",
//   abilities: [
//     shiftAbility(2, "minnie mouse"),
//     evasiveAbility,
//     wheneverPlays({
//       name: "Undersea Adventure",
//       text: "Whenever you play a second action in a turn, this character gets +2 {L} this turn.",
//       triggerTarget: {
//         type: "card",
//         value: 1,
//         filters: [
//           { filter: "type", value: "action" },
//           { filter: "owner", value: "self" },
//           {
//             filter: "turn",
//             value: "played",
//             targetFilter: [{ filter: "type", value: "action" }],
//             comparison: { operator: "eq", value: 2 },
//           },
//         ],
//       },
//       effects: [
//         {
//           type: "attribute",
//           attribute: "lore",
//           amount: 2,
//           modifier: "add",
//           duration: "static",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [{ filter: "source", value: "self" }],
//           },
//         },
//       ],
//     }),
//   ],
//   flavour: "Look at this stuff, isn't it neat?",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 4,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Bill Robinson",
//   number: 114,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 519169,
//   },
//   rarity: "rare",
// };
//
