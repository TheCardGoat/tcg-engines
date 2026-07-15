import type { CharacterCard } from "@tcg/lorcana-types";

export const simbaProtectiveCub: CharacterCard = {
  abilities: [
    {
      id: "rvm-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
  ],
  cardNumber: 20,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Prince"],
  cost: 2,
  externalIds: {
    ravensburger: "6479a6ae550768c207018562ce6f687ec41e7c86",
  },
  franchise: "Lion King",
  fullName: "Simba - Protective Cub",
  id: "rvm",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  name: "Simba",
  set: "001",
  strength: 2,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  version: "Protective Cub",
  willpower: 3,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const simbaProtectiveCub: LorcanitoCharacterCard = {
//   Id: "z0z",
//   Name: "Simba",
//   Title: "Protective Cub",
//   Characteristics: ["hero", "storyborn", "prince"],
//   Text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_",
//   Type: "character",
//   Abilities: [bodyguardAbility],
//   Flavour: "Courage comes in all sizes.",
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 2,
//   Strength: 2,
//   Willpower: 3,
//   Lore: 1,
//   Illustrator: "Filipe Laurentino",
//   Number: 20,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 503356,
//   },
//   Rarity: "common",
// };
//
