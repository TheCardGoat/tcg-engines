import type { CharacterCard } from "@tcg/lorcana-types";

export const mulanImperialGeneral: CharacterCard = {
  id: "17b",
  cardType: "character",
  name: "Mulan",
  version: "Imperial General",
  fullName: "Mulan - Imperial General",
  inkType: ["ruby", "steel"],
  franchise: "Mulan",
  set: "007",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Mulan.)\nEvasive (Only characters with Evasive can challenge this character.)\nEXCEPTIONAL LEADER Whenever this character challenges another character, your other characters gain “This character can challenge ready characters” this turn.",
  cost: 7,
  strength: 5,
  willpower: 6,
  lore: 2,
  cardNumber: 141,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9c206f63c6f0526ce5aac53a49c9fe58909c52ee",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Princess"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import {
//   evasiveAbility,
//   shiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverChallengesAnotherChar } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const mulanImperialGeneral: LorcanitoCharacterCard = {
//   id: "m95",
//   name: "Mulan",
//   title: "Imperial General",
//   characteristics: ["floodborn", "hero", "princess"],
//   text: `Shift 5\nEvasive\nEXCEPTIONAL LEADER Whenever this character challenges another character, your other characters gain "This character can challenge ready characters" this turn.`,
//   type: "character",
//   abilities: [
//     shiftAbility(5, "Mulan"),
//     evasiveAbility,
//     wheneverChallengesAnotherChar({
//       name: "EXCEPTIONAL LEADER",
//       text: `Whenever this character challenges another character, your other characters gain "This character can challenge ready characters" this turn.`,
//       effects: [
//         {
//           type: "ability",
//           ability: "challenge_ready_chars",
//           modifier: "add",
//           duration: "turn",
//           until: true,
//           target: {
//             type: "card",
//             value: "all",
//             excludeSelf: true,
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//
//   colors: ["ruby", "steel"],
//   cost: 7,
//   strength: 5,
//   willpower: 6,
//   illustrator: "Jochem van Gool",
//   number: 141,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619486,
//   },
//   rarity: "super_rare",
//   lore: 2,
// };
//
