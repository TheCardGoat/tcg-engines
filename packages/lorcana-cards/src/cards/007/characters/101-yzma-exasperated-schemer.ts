import type { CharacterCard } from "@tcg/lorcana-types";

export const yzmaExasperatedSchemer: CharacterCard = {
  id: "5wn",
  cardType: "character",
  name: "Yzma",
  version: "Exasperated Schemer",
  fullName: "Yzma - Exasperated Schemer",
  inkType: ["emerald"],
  franchise: "Emperors New Groove",
  set: "007",
  text: "HOW SHALL I DO IT? When you play this character, you may draw a card, then choose and discard a card.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 101,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1549f70d69d265a807a772bbb979f346c7040f6a",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { youMayDrawThenChooseAndDiscard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const yzmaExasperatedSchemer: LorcanitoCharacterCard = {
//   id: "zls",
//   name: "Yzma",
//   title: "Exasperated Schemer",
//   characteristics: ["storyborn", "villain", "sorcerer"],
//   text: "HOW SHALL I DO IT? When you play this character, you may draw a card, then choose and discard a card.",
//   type: "character",
//   abilities: [
//     {
//       ...youMayDrawThenChooseAndDiscard,
//       name: "HOW SHALL I DO IT?",
//       text: "When you play this character, you may draw a card, then choose and discard a card.",
//     },
//   ],
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   strength: 2,
//   willpower: 2,
//   illustrator: "Mel Milton",
//   number: 101,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619459,
//   },
//   rarity: "common",
//   lore: 1,
// };
//
