import type { CharacterCard } from "@tcg/lorcana-types";

export const tiggerOneOfAKind: CharacterCard = {
  id: "1ns",
  cardType: "character",
  name: "Tigger",
  version: "One of a Kind",
  fullName: "Tigger - One of a Kind",
  inkType: ["ruby"],
  franchise: "Winnie the Pooh",
  set: "002",
  text: "ENERGETIC Whenever you play an action, this character gets +2 {S} this turn.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 127,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d777770ea1c3e9501c20b77a65e2cfcce67bd0d6",
  },
  abilities: [],
  classifications: ["Dreamborn", "Tigger"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// export const tiggerOneOfAKind: LorcanitoCharacterCard = {
//   id: "gaw",
//   name: "Tigger",
//   title: "One of a Kind",
//   characteristics: ["dreamborn", "tigger"],
//   text: "**ENERGETIC** Whenever you play an action, this character gets +2 {S} this turn.",
//   type: "character",
//   abilities: [
//     wheneverPlays({
//       name: "Enegetic",
//       text: "Whenever you play an action, this character gets +2 {S} this turn.",
//       triggerTarget: {
//         type: "card",
//         value: 1,
//         filters: [
//           { filter: "type", value: "action" },
//           { filter: "characteristics", value: ["action"] },
//           { filter: "owner", value: "self" },
//         ],
//       },
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 2,
//           modifier: "add",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [{ filter: "source", value: "self" }],
//           },
//         },
//       ],
//     }),
//   ],
//   flavour: "Bouncing in to save the day!",
//   inkwell: true,
//   colors: ["ruby"],
//   cost: 3,
//   strength: 3,
//   willpower: 3,
//   lore: 1,
//   illustrator: "P. Gaylord / L. Giammichele",
//   number: 127,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 524189,
//   },
//   rarity: "common",
// };
//
