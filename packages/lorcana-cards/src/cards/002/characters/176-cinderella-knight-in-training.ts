import type { CharacterCard } from "@tcg/lorcana-types";

export const cinderellaKnightInTraining: CharacterCard = {
  id: "8ex",
  cardType: "character",
  name: "Cinderella",
  version: "Knight in Training",
  fullName: "Cinderella - Knight in Training",
  inkType: ["steel"],
  franchise: "Cinderella",
  set: "002",
  text: "HAVE COURAGE When you play this character, you may draw a card, then choose and discard a card.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 176,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1e54202930de5a3bff06a70d10c2b29821631820",
  },
  abilities: [],
  classifications: ["Dreamborn", "Hero", "Princess", "Knight"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { youMayDrawThenChooseAndDiscard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const cinderellaKnightInTraining: LorcanitoCharacterCard = {
//   id: "y7h",
//   name: "Cinderella",
//   title: "Knight in Training",
//   characteristics: ["hero", "dreamborn", "princess", "knight"],
//   text: "**HAVE COURAGE** When you play this character, you may draw a card, then choose and discard a card.",
//   type: "character",
//   abilities: [
//     {
//       ...youMayDrawThenChooseAndDiscard,
//       name: "Have Courage",
//       text: "When you play this character, you may draw a card, then choose and discard a card.",
//     },
//   ],
//   flavour:
//     "She's always had the heart of a champion - now she'll have the skills, too.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   strength: 2,
//   willpower: 2,
//   lore: 1,
//   illustrator: "Grace Tran",
//   number: 176,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 521726,
//   },
//   rarity: "common",
// };
//
