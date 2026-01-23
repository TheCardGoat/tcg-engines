import type { CharacterCard } from "@tcg/lorcana-types";

export const webbyVanderquackJuniorProspector: CharacterCard = {
  id: "y1i",
  cardType: "character",
  name: "Webby Vanderquack",
  version: "Junior Prospector",
  fullName: "Webby Vanderquack - Junior Prospector",
  inkType: ["emerald"],
  franchise: "Ducktales",
  set: "010",
  text: "Shift 2 {I} (You may pay 2 {I} to play this on top of one of your characters named Webby Vanderquack.)\nWard\nWORK SMARTER Whenever this character quests, if an opponent has more cards in their inkwell than you, you may put the top card of your deck into your inkwell facedown and exerted.",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  cardNumber: 93,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7ab0ed76635e58a4c34c39be26bf83aa674be0c4",
  },
  abilities: [],
  classifications: ["Floodborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import {
//   shiftAbility,
//   wardAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import { putTopCardOfYourDeckIntoYourInkwellExerted } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const webbyVanderquackJuniorProspector: LorcanitoCharacterCard = {
//   id: "ko2",
//   name: "Webby Vanderquack",
//   title: "Junior Prospector",
//   characteristics: ["floodborn", "ally"],
//   text: "Shift 2 {I} (You may pay 2 {I} to play this on top of one of your characters named Webby Vanderquack.)\nWard\nWORK SMARTER Whenever this character quests, if an opponent has more cards in their inkwell than you, you may put the top card of your deck into your inkwell facedown and exerted.",
//   type: "character",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 4,
//   strength: 2,
//   willpower: 4,
//   illustrator: "Jon Denski / Hayley Evans",
//   number: 93,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 660172,
//   },
//   rarity: "legendary",
//   abilities: [
//     shiftAbility(2, "webby"),
//     wardAbility,
//     wheneverQuests({
//       name: "Work Smarter",
//       text: "Whenever this character quests, if an opponent has more cards in their inkwell than you, you may put the top card of your deck into your inkwell facedown and exerted.",
//       optional: true,
//       conditions: [
//         {
//           type: "filter",
//           filters: [
//             { filter: "owner", value: "opponent" },
//             { filter: "zone", value: "inkwell" },
//           ],
//           comparison: {
//             operator: "gt",
//             value: {
//               dynamic: true,
//               filters: [
//                 { filter: "owner", value: "self" },
//                 { filter: "zone", value: "inkwell" },
//               ],
//             },
//           },
//         },
//       ],
//       effects: [putTopCardOfYourDeckIntoYourInkwellExerted],
//     }),
//   ],
//   lore: 2,
// };
//
