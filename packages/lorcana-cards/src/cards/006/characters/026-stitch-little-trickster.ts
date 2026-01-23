import type { CharacterCard } from "@tcg/lorcana-types";

export const stitchLittleTrickster: CharacterCard = {
  id: "kka",
  cardType: "character",
  name: "Stitch",
  version: "Little Trickster",
  fullName: "Stitch - Little Trickster",
  inkType: ["emerald"],
  franchise: "Lilo and Stitch",
  set: "006",
  text: "NEED A HAND? 1 {I} - This character gets +1 {S} this turn.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 26,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4a1ce95842e7ea160a11b6ffde6bb3bdf2594794",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Alien"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// // TODO: Once the set is released, we organize the cards by set and type
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// import { thisCharacterGetsStrength } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const stitchLittleTrickster: LorcanitoCharacterCard = {
//   id: "usr",
//   name: "Stitch",
//   title: "Little Trickster",
//   characteristics: ["storyborn", "hero", "alien"],
//   text: "NEED A HAND? 1 {I} - This character gets +1 {S} this turn.",
//   type: "character",
//   abilities: [
//     {
//       type: "activated",
//       costs: [{ type: "ink", amount: 1 }],
//       effects: [thisCharacterGetsStrength(1)],
//     },
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   strength: 1,
//   willpower: 3,
//   lore: 1,
//   illustrator: "César Vergara",
//   number: 26,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 592007,
//   },
//   rarity: "common",
// };
//
