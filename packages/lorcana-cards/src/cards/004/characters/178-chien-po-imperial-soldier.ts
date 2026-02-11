import type { CharacterCard } from "@tcg/lorcana-types";

export const chienpoImperialSoldier: CharacterCard = {
  abilities: [
    {
      id: "1m9-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
  ],
  cardNumber: 178,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 5,
  externalIds: {
    ravensburger: "d1fd5839ad177cf9b28ff3c6336c8cb568683243",
  },
  franchise: "Mulan",
  fullName: "Chien-Po - Imperial Soldier",
  id: "1m9",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  name: "Chien-Po",
  set: "004",
  strength: 4,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  version: "Imperial Soldier",
  willpower: 7,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// Export const chienPoImperialSoldier: LorcanitoCharacterCard = {
//   Id: "ml5",
//   Name: "Chien-Po",
//   Title: "Imperial Soldier",
//   Characteristics: ["storyborn", "ally"],
//   Text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must chose one with Bodyguard if able.)_",
//   Type: "character",
//   Abilities: [bodyguardAbility],
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 5,
//   Strength: 4,
//   Willpower: 7,
//   Lore: 1,
//   Illustrator: "Michela Cacciatore / Giulia Priori",
//   Number: 178,
//   Set: "URR",
//   ExternalIds: {
//     TcgPlayer: 548194,
//   },
//   Rarity: "common",
// };
//
