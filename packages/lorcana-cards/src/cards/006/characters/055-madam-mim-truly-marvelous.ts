import type { CharacterCard } from "@tcg/lorcana-types";

export const madamMimTrulyMarvelous: CharacterCard = {
  id: "182",
  cardType: "character",
  name: "Madam Mim",
  version: "Truly Marvelous",
  fullName: "Madam Mim - Truly Marvelous",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "006",
  text: "OH, BAT GIZZARDS 2 {I}, Choose and discard a card - Gain 1 lore.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 55,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a0a2f9d71d5c784fc33c185c98d4251eec671d83",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { youGainLore } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const madamMimTrulyMarvelous: LorcanitoCharacterCard = {
//   id: "eh8",
//   missingTestCase: true,
//   name: "Madam Mim",
//   title: "Truly Marvelous",
//   characteristics: ["storyborn", "villain", "sorcerer"],
//   text: "OH, BAT GIZZARDS 2 {I}, Choose and discard a card - Gain 1 lore.",
//   type: "character",
//   abilities: [
//     {
//       type: "activated",
//       costs: [
//         { type: "ink", amount: 2 },
//         {
//           type: "card",
//           action: "discard",
//           amount: 1,
//           filters: [
//             { filter: "zone", value: "hand" },
//             { filter: "owner", value: "self" },
//           ],
//         },
//       ],
//       effects: [youGainLore(1)],
//     },
//   ],
//   inkwell: false,
//   colors: ["amethyst"],
//   cost: 3,
//   strength: 2,
//   willpower: 3,
//   lore: 1,
//   illustrator: "Alice Pisoni",
//   number: 55,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 587972,
//   },
//   rarity: "super_rare",
// };
//
