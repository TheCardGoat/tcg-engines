import type { CharacterCard } from "@tcg/lorcana-types";

export const tritonChampionOfAtlantica: CharacterCard = {
  id: "1vc",
  cardType: "character",
  name: "Triton",
  version: "Champion of Atlantica",
  fullName: "Triton - Champion of Atlantica",
  inkType: ["sapphire"],
  franchise: "Little Mermaid",
  set: "004",
  text: "Shift 6 (You may pay 6 {I} to play this on top of one of your characters named Triton.)\nIMPOSING PRESENCE Opposing characters get -1 {S} for each location you have in play.",
  cost: 9,
  strength: 7,
  willpower: 9,
  lore: 3,
  cardNumber: 158,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f2fe9fa097286b7fd01ef42ad1ab79f945b35dd5",
  },
  abilities: [],
  classifications: ["Floodborn", "King"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { opposingCharacters } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const tritonChampionOfAtlantica: LorcanitoCharacterCard = {
//   id: "igf",
//   missingTestCase: true,
//   name: "Triton",
//   title: "Champion of Atlantica",
//   characteristics: ["floodborn", "king"],
//   text: "**Shift** 6 _You may pay 6 {I} to play this on top of one of your characters named Triton.)_\n\n\n**IMPOSING PRESENCE** Opposing characters get -1 {S} for each location you have in play.",
//   type: "character",
//   abilities: [
//     shiftAbility(6, "Triton"),
//     {
//       type: "static",
//       ability: "effects",
//       name: "Imposing Presence",
//       text: "Opposing characters get -1 {S} for each location you have in play.",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: {
//             dynamic: true,
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "zone", value: "play" },
//               { filter: "type", value: "location" },
//             ],
//           },
//           modifier: "subtract",
//           target: opposingCharacters,
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 9,
//   strength: 7,
//   willpower: 9,
//   lore: 3,
//   illustrator: "Erin Shin",
//   number: 158,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550611,
//   },
//   rarity: "legendary",
// };
//
