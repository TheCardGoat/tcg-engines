import type { CharacterCard } from "@tcg/lorcana-types";

export const missBiancaUnwaveringAgent: CharacterCard = {
  id: "jeo",
  cardType: "character",
  name: "Miss Bianca",
  version: "Unwavering Agent",
  fullName: "Miss Bianca - Unwavering Agent",
  inkType: ["steel"],
  franchise: "Rescuers",
  set: "007",
  text: "HAVE A LITTLE FAITH If you have an Ally character in play, you pay 2 {I} less to play this character.",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 1,
  cardNumber: 195,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "45f268b2214fbccf3540a2e7412282b75f6885a1",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const missBiancaIndefectibleAgent: LorcanitoCharacterCard = {
//   id: "atj",
//   name: "Miss Bianca",
//   title: "Unwavering Agent",
//   characteristics: ["dreamborn", "hero"],
//   text: "KEEP HOPE Playing this character costs you 2 {I} less if you have an Ally character in play.",
//   type: "character",
//   abilities: [
//     whenYouPlayThisForEachYouPayLess({
//       name: "Keep Hope",
//       text: "Playing this character costs you 2 {I} less if you have an Ally character in play.",
//       amount: 2,
//       conditions: [
//         {
//           type: "filter",
//           comparison: {
//             operator: "gte",
//             value: 1,
//           },
//           filters: [
//             { filter: "type", value: "character" },
//             { filter: "zone", value: "play" },
//             { filter: "owner", value: "self" },
//             { filter: "characteristics", value: ["ally"] },
//           ],
//         },
//       ],
//     }),
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 6,
//   strength: 5,
//   willpower: 5,
//   illustrator: "Maria Dresden",
//   number: 195,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619520,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
