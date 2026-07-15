import type { CharacterCard } from "@tcg/lorcana-types";

export const sleepySluggishKnight: CharacterCard = {
  abilities: [
    {
      id: "1k0-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
  ],
  cardNumber: 177,
  cardType: "character",
  classifications: ["Dreamborn", "Ally", "Knight", "Seven Dwarfs"],
  cost: 2,
  externalIds: {
    ravensburger: "c9ec3115210a0d6350a7df1c16405f550b05b3cd",
  },
  franchise: "Snow White",
  fullName: "Sleepy - Sluggish Knight",
  id: "1k0",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  name: "Sleepy",
  set: "005",
  strength: 0,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  version: "Sluggish Knight",
  willpower: 4,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// Export const sleepySluggishKnight: LorcanitoCharacterCard = {
//   Id: "zvc",
//   Name: "Sleepy",
//   Title: "Sluggish Knight",
//   Characteristics: ["dreamborn", "ally", "knight", "seven dwarfs"],
//   Text: "**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_",
//   Type: "character",
//   Abilities: [bodyguardAbility],
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 2,
//   Willpower: 4,
//   Strength: 0,
//   Lore: 1,
//   Illustrator: "Wouter Bruenel",
//   Number: 177,
//   Set: "SSK",
//   ExternalIds: {
//     TcgPlayer: 559664,
//   },
//   Rarity: "uncommon",
// };
//
