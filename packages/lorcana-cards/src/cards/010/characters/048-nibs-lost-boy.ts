import type { CharacterCard } from "@tcg/lorcana-types";

export const nibsLostBoy: CharacterCard = {
  id: "1ar",
  cardType: "character",
  name: "Nibs",
  version: "Lost Boy",
  fullName: "Nibs - Lost Boy",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "010",
  text: "LOOK WHO'S BACK When this character is banished in a challenge, return this card to your hand.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 48,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a88d8cf7ffba8d2838430c343d109ca60f006c2b",
  },
  abilities: [],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { whenThisCharacterBanishedInAChallenge } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const nibsLostBoy: LorcanitoCharacterCard = {
//   id: "qfp",
//   name: "Nibs",
//   title: "Lost Boy",
//   characteristics: ["storyborn", "ally"],
//   text: "LOOK WHO'S BACK When this character is banished in a challenge, return this card to your hand.",
//   type: "character",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   illustrator: "Isabella Ceravolo",
//   number: 48,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 658335,
//   },
//   rarity: "uncommon",
//   abilities: [
//     whenThisCharacterBanishedInAChallenge({
//       name: "LOOK WHO'S BACK",
//       text: "When this character is banished in a challenge, return this card to your hand.",
//       effects: [
//         {
//           type: "move",
//           to: "hand",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [{ filter: "source", value: "self" }],
//           },
//         },
//       ],
//     }),
//   ],
//   lore: 2,
// };
//
