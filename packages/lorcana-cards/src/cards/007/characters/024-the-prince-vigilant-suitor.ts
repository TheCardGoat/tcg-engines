import type { CharacterCard } from "@tcg/lorcana-types";

export const thePrinceVigilantSuitor: CharacterCard = {
  abilities: [
    {
      id: "ot0-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
  ],
  cardNumber: 24,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Prince"],
  cost: 2,
  externalIds: {
    ravensburger: "5966f7b1df7bd6ef309aa7694d0a45d89624c970",
  },
  franchise: "Snow White",
  fullName: "The Prince - Vigilant Suitor",
  id: "ot0",
  inkType: ["amber"],
  inkable: false,
  lore: 1,
  name: "The Prince",
  set: "007",
  strength: 0,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  version: "Vigilant Suitor",
  willpower: 5,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const thePrinceChallengerOfTheRise: LorcanitoCharacterCard = {
//   Id: "yba",
//   Name: "The Prince",
//   Title: "Vigilant Suitor",
//   Characteristics: ["storyborn", "hero", "prince"],
//   Text: "Bodyguard ",
//   Type: "character",
//   Abilities: [bodyguardAbility],
//   Inkwell: false,
//   Colors: ["amber"],
//   Cost: 2,
//   Strength: 0,
//   Willpower: 5,
//   Illustrator: "João Moura",
//   Number: 24,
//   Set: "007",
//   ExternalIds: {
//     TcgPlayer: 619419,
//   },
//   Rarity: "uncommon",
//   Lore: 1,
// };
//
