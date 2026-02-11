import type { CharacterCard } from "@tcg/lorcana-types";

export const ladyKluckProtectiveConfidant: CharacterCard = {
  abilities: [
    {
      id: "18v-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
    {
      id: "18v-2",
      keyword: "Ward",
      text: "Ward",
      type: "keyword",
    },
  ],
  cardNumber: 172,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 5,
  externalIds: {
    ravensburger: "a1c520968878a4659e2e5283c4bb522936f0fa60",
  },
  franchise: "Robin Hood",
  fullName: "Lady Kluck - Protective Confidant",
  id: "18v",
  inkType: ["sapphire", "steel"],
  inkable: true,
  lore: 1,
  name: "Lady Kluck",
  set: "007",
  strength: 2,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nWard (Opponents can’t choose this character except to challenge.)",
  version: "Protective Confidant",
  willpower: 7,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import {
//   BodyguardAbility,
//   WardAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const ladyKluckProtectiveConfidant: LorcanitoCharacterCard = {
//   Id: "m5f",
//   Name: "Lady Kluck",
//   Title: "Protective Confidant",
//   Characteristics: ["storyborn", "ally"],
//   Text: "Bodyguard\nWard",
//   Type: "character",
//   Abilities: [bodyguardAbility, wardAbility],
//   Inkwell: true,
//
//   Colors: ["sapphire", "steel"],
//   Cost: 5,
//   Strength: 2,
//   Willpower: 7,
//   Illustrator: "Mariana Moreno",
//   Number: 172,
//   Set: "007",
//   ExternalIds: {
//     TcgPlayer: 618146,
//   },
//   Rarity: "uncommon",
//   Lore: 1,
// };
//
