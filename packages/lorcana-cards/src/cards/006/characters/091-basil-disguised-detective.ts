import type { CharacterCard } from "@tcg/lorcana-types";

export const basilDisguisedDetective: CharacterCard = {
  id: "fop",
  cardType: "character",
  name: "Basil",
  version: "Disguised Detective",
  fullName: "Basil - Disguised Detective",
  inkType: ["emerald"],
  franchise: "Great Mouse Detective",
  set: "006",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Basil.)\nTWISTS AND TURNS During your turn, whenever a card is put into your inkwell, you may pay 1 {I} to have chosen opponent choose and discard a card.",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 91,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3888d0922245bc3a1bdc014b65a50848f7973819",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero", "Detective"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { wheneverACardIsPutIntoYourInkwell } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const basilDisguisedDetective: LorcanitoCharacterCard = {
//   id: "pwe",
//   name: "Basil",
//   title: "Disguised Detective",
//   characteristics: ["floodborn", "hero", "detective"],
//   text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Basil.)\nTWISTS AND TURNS During your turn, whenever a card is put into your inkwell, you may pay 1 {I} to have chosen opponent choose and discard a card.",
//   type: "character",
//   abilities: [
//     shiftAbility(4, "Basil"),
//     wheneverACardIsPutIntoYourInkwell({
//       name: "Twists and Turns",
//       text: "During your turn, whenever a card is put into your inkwell, you may pay 1 {I} to have chosen opponent choose and discard a card.",
//       costs: [{ type: "ink", amount: 1 }],
//       conditions: [duringYourTurn],
//       optional: true,
//       effects: [
//         {
//           type: "create-layer-for-player",
//           target: { type: "player", value: "opponent" },
//           layer: {
//             responder: "opponent",
//             type: "resolution",
//             optional: false,
//             effects: [
//               {
//                 type: "discard",
//                 amount: 1,
//                 target: {
//                   type: "card",
//                   value: 1,
//                   filters: [
//                     { filter: "zone", value: "hand" },
//                     { filter: "owner", value: "self" },
//                   ],
//                 },
//               },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 6,
//   strength: 4,
//   willpower: 5,
//   lore: 2,
//   illustrator: "Stefano Spagnuolo",
//   number: 91,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 591993,
//   },
//   rarity: "uncommon",
// };
//
