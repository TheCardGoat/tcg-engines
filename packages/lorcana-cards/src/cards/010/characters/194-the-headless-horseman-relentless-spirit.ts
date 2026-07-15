import type { CharacterCard } from "@tcg/lorcana-types";

export const theHeadlessHorsemanRelentlessSpirit: CharacterCard = {
  abilities: [
    {
      id: "i51-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
  ],
  cardNumber: 194,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 4,
  externalIds: {
    ravensburger: "4160bece2c94394d46717dbd1fb2880098079cd6",
  },
  franchise: "Sleepy Hollow",
  fullName: "The Headless Horseman - Relentless Spirit",
  id: "i51",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  name: "The Headless Horseman",
  set: "010",
  strength: 4,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  version: "Relentless Spirit",
  willpower: 4,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine";
// Import { bodyguardAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
//
// Export const theHeadlessHorsemanRelentlessSpirit: LorcanitoCharacterCard = {
//   Id: "cbk",
//   Name: "The Headless Horseman",
//   Title: "Relentless Spirit",
//   Characteristics: ["storyborn", "villain"],
//   Text: "Bodyguard",
//   Type: "character",
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 4,
//   Strength: 4,
//   Willpower: 4,
//   Illustrator: "Cristian Romero",
//   Number: 194,
//   Set: "010",
//   ExternalIds: {
//     TcgPlayer: 660017,
//   },
//   Rarity: "common",
//   Abilities: [bodyguardAbility],
//   Lore: 1,
// };
//
