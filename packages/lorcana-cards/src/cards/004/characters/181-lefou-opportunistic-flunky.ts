import type { CharacterCard } from "@tcg/lorcana-types";

export const lefouOpportunisticFlunky: CharacterCard = {
  id: "1x0",
  cardType: "character",
  name: "LeFou",
  version: "Opportunistic Flunky",
  fullName: "LeFou - Opportunistic Flunky",
  inkType: ["steel"],
  franchise: "Beauty and the Beast",
  set: "004",
  text: "I LEARNED FROM THE BEST During your turn, you may play this character for free if an opposing character was banished in a challenge this turn.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 181,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f8c32f163faec632f2671c22514b26af31b45646",
  },
  abilities: [],
  classifications: ["Dreamborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const lefouOpportunisticFlunky: LorcanitoCharacterCard = {
//   id: "at9",
//   name: "Lefou",
//   title: "Opportunistic Flunky",
//   characteristics: ["dreamborn", "ally"],
//   text: "**I LEARNED FROM THE BEST** During your turn, you may play this character for free if an opposing character was banished in a challenge this turn.",
//   type: "character",
//   abilities: [
//     {
//       type: "static",
//       conditions: [
//         {
//           type: "during-turn",
//           value: "self",
//         },
//         {
//           type: "this-turn",
//           value: "has-challenged",
//           target: "self",
//         },
//       ],
//       ability: "effects",
//       name: "I Learned From The Best",
//       text: "During your turn, you may play this character for free if an opposing character was banished in a challenge this turn.",
//       effects: [
//         {
//           type: "replacement",
//           replacement: "cost",
//           duration: "static",
//           amount: 3,
//           target: thisCharacter,
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Kendall Hale",
//   number: 181,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549559,
//   },
//   rarity: "rare",
// };
//
