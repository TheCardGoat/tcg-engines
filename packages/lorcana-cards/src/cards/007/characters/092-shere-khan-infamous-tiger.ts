import type { CharacterCard } from "@tcg/lorcana-types";

export const shereKhanInfamousTiger: CharacterCard = {
  id: "1r2",
  cardType: "character",
  name: "Shere Khan",
  version: "Infamous Tiger",
  fullName: "Shere Khan - Infamous Tiger",
  inkType: ["emerald"],
  franchise: "Jungle Book",
  set: "007",
  text: "WHAT A PITY When you play this character, discard your hand.",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 4,
  cardNumber: 92,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e5c04a374746e0b16d522ecd3804b6024ae6ad38",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { discardYourHand } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const shereKhanInfamousTiger: LorcanitoCharacterCard = {
//   id: "gmw",
//   name: "Shere Khan",
//   title: "Infamous Tiger",
//   characteristics: ["storyborn", "villain"],
//   text: "IT IS REGRETTABLE When you play this character, discard your hand.",
//   type: "character",
//   abilities: [
//     {
//       type: "resolution",
//       name: "IT IS REGRETTABLE",
//       text: "When you play this character, discard your hand.",
//       optional: false,
//
//       effects: [discardYourHand],
//     },
//   ],
//   inkwell: false,
//   colors: ["emerald"],
//   cost: 4,
//   strength: 4,
//   willpower: 4,
//   illustrator: "Stefano Zanchi",
//   number: 92,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619455,
//   },
//   rarity: "rare",
//   lore: 4,
// };
//
