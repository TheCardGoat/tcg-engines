import type { CharacterCard } from "@tcg/lorcana-types";

export const pinocchioOnTheRun: CharacterCard = {
  id: "186",
  cardType: "character",
  name: "Pinocchio",
  version: "On the Run",
  fullName: "Pinocchio - On the Run",
  inkType: ["amethyst"],
  franchise: "Pinocchio",
  set: "002",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Pinocchio.)\nLISTEN TO YOUR CONSCIENCE When you play this character, you may return chosen character or item with cost 3 or less to their player's hand.",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 57,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9f2f8c38e0d5bc874368f36fa428ddb654ec140d",
  },
  abilities: [],
  classifications: ["Floodborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// export const pinocchioOnTheRun: LorcanitoCharacterCard = {
//   id: "juq",
//
//   name: "Pinocchio",
//   title: "On the Run",
//   characteristics: ["hero", "floodborn"],
//   text: "**Shift** 3 (_You may pay 3 {I} to play this on top of one of your characters named Pinocchio._)\n**LISTEN TO YOUR CONSCIENCE** When you play this character, you may return chosen character or item with cost 3 or less to their player's hand.",
//   type: "character",
//   abilities: [
//     shiftAbility(3, "pinocchio"),
//     {
//       type: "resolution",
//       optional: true,
//       name: "LISTEN TO YOUR CONSCIENCE",
//       text: "When you play this character, you may return chosen character or item with cost 3 or less to their player's hand.",
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: ["character", "item"] },
//               { filter: "zone", value: "play" },
//               {
//                 filter: "attribute",
//                 value: "cost",
//                 comparison: { operator: "lte", value: 3 },
//               },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "He raced into the Inklands without a thought.",
//   colors: ["amethyst"],
//   cost: 5,
//   strength: 3,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Isaiah Mesq",
//   number: 57,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527626,
//   },
//   rarity: "uncommon",
// };
//
