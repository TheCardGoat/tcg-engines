import type { CharacterCard } from "@tcg/lorcana-types";

export const mittensSassyStreetCat: CharacterCard = {
  id: "et6",
  cardType: "character",
  name: "Mittens",
  version: "Sassy Street Cat",
  fullName: "Mittens - Sassy Street Cat",
  inkType: ["amber"],
  franchise: "Bolt",
  set: "007",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nNO THANKS NECESSARY Once during your turn, whenever a card is put into your inkwell, your other characters with Bodyguard get +1 {L} this turn.",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 9,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3560af4d94b66ca33fed2fa534f5c8ee97513428",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { wheneverACardIsPutIntoYourInkwell } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const mittensSassyStreetCat: LorcanitoCharacterCard = {
//   id: "cf8",
//   name: "Mittens",
//   title: "Sassy Street Cat",
//   characteristics: ["dreamborn", "ally"],
//   text: "Bodyguard\nNO THANKS NECESSARY Once during your turn, whenever a card is put into your inkwell, your other characters with Bodyguard get +1 {L} this turn.",
//   type: "character",
//   abilities: [
//     bodyguardAbility,
//     wheneverACardIsPutIntoYourInkwell({
//       name: "NO THANKS NECESSARY",
//       text: "Once during your turn, whenever a card is put into your inkwell, your other characters with Bodyguard get +1 {L} this turn.",
//       oncePerTurn: true,
//       conditions: [duringYourTurn],
//       effects: [
//         {
//           type: "attribute",
//           attribute: "lore",
//           modifier: "add",
//           duration: "turn",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//               { filter: "source", value: "other" },
//               { filter: "ability", value: "bodyguard" },
//             ],
//           },
//           amount: 1,
//         },
//       ],
//     }),
//   ],
//   inkwell: false,
//   colors: ["amber"],
//   cost: 5,
//   strength: 4,
//   willpower: 5,
//   illustrator: "Brian Weisz",
//   number: 9,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618159,
//   },
//   rarity: "rare",
//   lore: 2,
// };
//
