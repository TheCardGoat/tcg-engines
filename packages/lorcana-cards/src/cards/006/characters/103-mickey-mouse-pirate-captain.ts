import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMousePirateCaptain: CharacterCard = {
  id: "adf",
  cardType: "character",
  name: "Mickey Mouse",
  version: "Pirate Captain",
  fullName: "Mickey Mouse - Pirate Captain",
  inkType: ["ruby"],
  set: "006",
  text: 'Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Mickey Mouse.)\nMARINER’S MIGHT Whenever this character quests, chosen Pirate character gets +2 {S} and gains "This character takes no damage from challenges" this turn.',
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 103,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "25626315d5e1fbf223d3c10f20336b464a7a2e7e",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Pirate", "Captain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { chosenPirateCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const mickeyMousePirateCaptain: LorcanitoCharacterCard = {
//   id: "ds9",
//   name: "Mickey Mouse",
//   title: "Pirate Captain",
//   characteristics: ["floodborn", "hero", "pirate", "captain"],
//   text: 'Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Mickey Mouse.)\nMARINER’S MIGHT Whenever this character quests, chosen Pirate character gets +2 {S} and gains "This character takes no damage from challenges" this turn.',
//   type: "character",
//   abilities: [
//     shiftAbility(3, "Mickey Mouse"),
//     wheneverQuests({
//       name: "Mariner’s Might",
//       text: 'Whenever this character quests, chosen Pirate character gets +2 {S} and gains "This character takes no damage from challenges" this turn.',
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 2,
//           modifier: "add",
//           duration: "turn",
//           target: chosenPirateCharacter,
//         },
//         {
//           type: "ability",
//           ability: "custom",
//           customAbility: {
//             type: "static",
//             ability: "effects",
//             effects: [
//               {
//                 type: "protection",
//                 from: "damage",
//                 as: "attacker",
//                 target: {
//                   type: "card",
//                   value: "all",
//                   filters: [
//                     { filter: "type", value: "character" },
//                     { filter: "zone", value: "play" },
//                   ],
//                 },
//               },
//             ],
//           },
//           modifier: "add",
//           duration: "turn",
//           target: chosenPirateCharacter,
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 5,
//   strength: 4,
//   willpower: 4,
//   lore: 2,
//   illustrator: "Koni",
//   number: 103,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 593027,
//   },
//   rarity: "super_rare",
// };
//
