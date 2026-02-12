import type { CharacterCard } from "@tcg/lorcana-types";

export const joshuaSweetTheDoctor: CharacterCard = {
  abilities: [
    {
      id: "1qp-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
  ],
  cardNumber: 5,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "e1f557b29f945126b59c4ccace8ec9ba4c9e013a",
  },
  franchise: "Atlantis",
  fullName: "Joshua Sweet - The Doctor",
  id: "1qp",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  name: "Joshua Sweet",
  set: "003",
  strength: 1,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  version: "The Doctor",
  willpower: 5,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// Export const joshuaSweetTheDoctor: LorcanitoCharacterCard = {
//   Id: "xtr",
//   MissingTestCase: true,
//   Name: "Joshua Sweet",
//   Title: "The Doctor",
//   Characteristics: ["storyborn", "ally"],
//   Text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_",
//   Type: "character",
//   Abilities: [bodyguardAbility],
//   Flavour:
//     "Heading out to the Inklands? Come on back if youu need patching up.",
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 4,
//   Strength: 1,
//   Willpower: 5,
//   Lore: 2,
//   Illustrator: "Jeanne Plounevez",
//   Number: 5,
//   Set: "ITI",
//   ExternalIds: {
//     TcgPlayer: 537753,
//   },
//   Rarity: "common",
// };
//
