import type { ActionCard } from "@tcg/lorcana-types";

export const magicalManeuvers: ActionCard = {
  id: "1nx",
  cardType: "action",
  name: "Magical Maneuvers",
  inkType: ["amethyst"],
  franchise: "Sleeping Beauty",
  set: "007",
  text: "Return chosen character of yours to your hand. Exert chosen character.",
  cost: 2,
  cardNumber: 80,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d587c3f09f6a2381566ef6cc840935c84c29d8dc",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
// import {
//   chosenCharacter,
//   chosenCharacterOfYours,
// } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const magicalManeuvers: LorcanitoActionCard = {
//   id: "y05",
//   name: "Magical Maneuvers",
//   characteristics: ["action"],
//   text: "Return chosen character of yours to your hand. Exert chosen character.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       text: " Exert chosen character.",
//       resolveEffectsIndividually: true,
//       effects: [
//         {
//           type: "exert",
//           exert: true,
//           target: chosenCharacter,
//         },
//       ],
//     },
//     {
//       type: "resolution",
//       text: "Return chosen character of yours to your hand.",
//       resolveEffectsIndividually: true,
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: chosenCharacterOfYours,
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   illustrator: "Jennifer Wu",
//   number: 80,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 618702,
//   },
//   rarity: "uncommon",
// };
//
