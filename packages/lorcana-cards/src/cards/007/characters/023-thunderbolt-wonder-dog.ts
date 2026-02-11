import type { CharacterCard } from "@tcg/lorcana-types";

export const thunderboltWonderDog: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "18d-1",
      keyword: "Shift",
      text: "Puppy Shift 3",
      type: "keyword",
    },
    {
      id: "18d-2",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
  ],
  cardNumber: 23,
  cardType: "character",
  classifications: ["Floodborn", "Hero"],
  cost: 5,
  externalIds: {
    ravensburger: "9ff1e3265aaa35ad585e9111ab61f6c0c7b2db71",
  },
  franchise: "101 Dalmatians",
  fullName: "Thunderbolt - Wonder Dog",
  id: "18d",
  inkType: ["amber", "sapphire"],
  inkable: true,
  lore: 2,
  name: "Thunderbolt",
  set: "007",
  strength: 3,
  text: "Puppy Shift 3 (You may pay 3 {I} to play this on top of one of your Puppy characters.)\nBodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  version: "Wonder Dog",
  willpower: 7,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import {
//   BodyguardAbility,
//   ShiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const thunderboltWonderDog: LorcanitoCharacterCard = {
//   Id: "e5x",
//   Name: "Thunderbolt",
//   Title: "Wonder Dog",
//   Characteristics: ["floodborn", "hero"],
//   Text: "Puppy Shift 3 (You may pay 3 {I} to play this on top of one of your Puppy characters.)\nBodyguard ",
//   Type: "character",
//   Abilities: [shiftAbility(3, "puppy"), bodyguardAbility],
//   Inkwell: true,
//
//   Colors: ["amber", "sapphire"],
//   Cost: 5,
//   Strength: 3,
//   Willpower: 7,
//   Illustrator: "Max Grecke",
//   Number: 23,
//   Set: "007",
//   ExternalIds: {
//     TcgPlayer: 619418,
//   },
//   Rarity: "uncommon",
//   Lore: 2,
// };
//
