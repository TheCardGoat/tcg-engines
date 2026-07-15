import type { CharacterCard } from "@tcg/lorcana-types";

export const rajahDevotedProtector: CharacterCard = {
  abilities: [
    {
      id: "1gk-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
  ],
  cardNumber: 6,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "05432111c47bf28eb52d76930eb2c603642d13e9",
  },
  franchise: "Aladdin",
  fullName: "Rajah - Devoted Protector",
  id: "1gk",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  name: "Rajah",
  set: "010",
  strength: 3,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  version: "Devoted Protector",
  willpower: 4,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// Export const rajahDevotedProtector: LorcanitoCharacterCard = {
//   Id: "fbf",
//   Name: "Rajah",
//   Title: "Devoted Protector",
//   Characteristics: ["storyborn", "ally"],
//   Text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
//   Type: "character",
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 3,
//   Strength: 3,
//   Willpower: 4,
//   Illustrator: "Andrea Femerstrand",
//   Number: 6,
//   Set: "010",
//   ExternalIds: {
//     TcgPlayer: 659444,
//   },
//   Rarity: "common",
//   Abilities: [bodyguardAbility],
//   Lore: 1,
// };
//
