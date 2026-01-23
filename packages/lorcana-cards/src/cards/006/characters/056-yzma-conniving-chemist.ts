import type { CharacterCard } from "@tcg/lorcana-types";

export const yzmaConnivingChemist: CharacterCard = {
  id: "3p7",
  cardType: "character",
  name: "Yzma",
  version: "Conniving Chemist",
  fullName: "Yzma - Conniving Chemist",
  inkType: ["amethyst"],
  franchise: "Emperors New Groove",
  set: "006",
  text: "FEEL THE POWER {E} - If you have fewer than 3 cards in your hand, draw until you have 3 cards in your hand.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 56,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0d5611559055a8c3782f6db74f2c9ab14e5d8dcf",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { drawCardsUntilYouHaveXCardsInHand } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const yzmaConnivingChemist: LorcanitoCharacterCard = {
//   id: "fsf",
//   name: "Yzma",
//   title: "Conniving Chemist",
//   characteristics: ["sorcerer", "storyborn", "villain"],
//   text: "**FEEL THE POWER** {E} – _If you have fewer than 3 cards in your hand, draw until you have 3 cards in your hand._",
//   type: "character",
//   abilities: [
//     {
//       type: "activated",
//       costs: [{ type: "exert" }],
//       conditions: [
//         {
//           type: "filter",
//           filters: [
//             { filter: "zone", value: "hand" },
//             { filter: "owner", value: "self" },
//           ],
//           comparison: { operator: "lt", value: 3 },
//         },
//       ],
//       name: "FEEL THE POWER",
//       text: "If you have fewer than 3 cards in your hand, draw until you have 3 cards in your hand._",
//       effects: [drawCardsUntilYouHaveXCardsInHand(3)],
//     },
//   ],
//   flavour: "One of these has got to work. Let's see what happens.",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 4,
//   strength: 3,
//   willpower: 3,
//   lore: 2,
//   illustrator: "Jared Mathews",
//   number: 56,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 578174,
//   },
//   rarity: "legendary",
// };
//
