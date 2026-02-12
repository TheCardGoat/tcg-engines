import type { CharacterCard } from "@tcg/lorcana-types";

export const arielOnHumanLegs: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "restriction",
        restriction: "cant-sing",
        target: "SELF",
      },
      id: "2c9-1",
      name: "VOICELESS",
      text: "VOICELESS This character can't {E} to sing songs.",
      type: "static",
    },
  ],
  cardNumber: 1,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 4,
  externalIds: {
    ravensburger: "086f72176bc2fbb2a19898745a8218e1fe826c00",
  },
  franchise: "Little Mermaid",
  fullName: "Ariel - On Human Legs",
  id: "2c9",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  name: "Ariel",
  set: "001",
  strength: 3,
  text: "VOICELESS This character can't {E} to sing songs.",
  version: "On Human Legs",
  willpower: 4,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { voicelessAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const arielOnHumanLegs: LorcanitoCharacterCard = {
//   Id: "d6b",
//   Name: "Ariel",
//   Title: "On Human Legs",
//   Characteristics: ["hero", "storyborn", "princess"],
//   Text: "**VOICELESS** This character can't {E} to sing songs.",
//   Type: "character",
//   Abilities: [voicelessAbility],
//   Flavour: '". . ."',
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 4,
//   Strength: 3,
//   Willpower: 4,
//   Lore: 2,
//   Illustrator: "Matthew Robert Davies",
//   Number: 1,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 494102,
//   },
//   Rarity: "uncommon",
// };
//
