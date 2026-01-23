import type { CharacterCard } from "@tcg/lorcana-types";

export const princePhillipDragonslayer: CharacterCard = {
  id: "152",
  cardType: "character",
  name: "Prince Phillip",
  version: "Dragonslayer",
  fullName: "Prince Phillip - Dragonslayer",
  inkType: ["amber"],
  franchise: "Sleeping Beauty",
  set: "001",
  text: "HEROISM When this character challenges and is banished, you may banish the challenged character.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 16,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9597388eb1ea9c907abbbf2dda9fea8216bc575b",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Prince"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { whenThisCharChallengesAndIsBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const princePhillipDragonSlayer: LorcanitoCharacterCard = {
//   id: "u23",
//   name: "Prince Phillip",
//   title: "Dragonslayer",
//   characteristics: ["hero", "storyborn", "prince"],
//   text: "**HEROISM** When this character challenges and is banished, you may banish the challenged character.",
//   type: "character",
//   abilities: [
//     whenThisCharChallengesAndIsBanished({
//       name: "HEROISM",
//       text: "When this character challenges and is banished, you may banish the challenged character.",
//       effects: [
//         {
//           type: "banish",
//           target: {
//             type: "card",
//             value: "all",
//             filters: [{ filter: "challenge", value: "defender" }],
//           },
//         },
//       ],
//     }),
//   ],
//   flavour:
//     "The road to true love may be barred by still many more dangers, which you alone will have to face. −Flora",
//   colors: ["amber"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Philipp Kruse",
//   number: 16,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 505946,
//   },
//   rarity: "uncommon",
// };
//
