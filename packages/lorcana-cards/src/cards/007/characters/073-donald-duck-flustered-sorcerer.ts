import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckFlusteredSorcerer: CharacterCard = {
  id: "1ka",
  cardType: "character",
  name: "Donald Duck",
  version: "Flustered Sorcerer",
  fullName: "Donald Duck - Flustered Sorcerer",
  inkType: ["amethyst"],
  set: "007",
  text: "OBFUSCATE! Opponents need 25 lore to win the game.",
  cost: 7,
  strength: 5,
  willpower: 6,
  lore: 3,
  cardNumber: 73,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "cae01bd2d9f60d9971fe8c99a827aad146425783",
  },
  abilities: [],
  classifications: ["Dreamborn", "Ally", "Sorcerer"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { metaAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const donaldDuckFlusteredSorcerer: LorcanitoCharacterCard = {
//   id: "evp",
//   name: "Donald Duck",
//   title: "Flustered Sorcerer",
//   characteristics: ["dreamborn", "ally", "sorcerer"],
//   text: "OBFUSCATE! Opponents need 25 lore to win the game.",
//   type: "character",
//   abilities: [
//     metaAbility({
//       name: "OBFUSCATE!",
//       text: "Opponents need 25 lore to win the game.",
//     }),
//   ],
//   inkwell: false,
//   colors: ["amethyst"],
//   cost: 7,
//   strength: 5,
//   willpower: 6,
//   illustrator: "Eric Weik",
//   number: 73,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619445,
//   },
//   rarity: "legendary",
//   lore: 3,
// };
//
