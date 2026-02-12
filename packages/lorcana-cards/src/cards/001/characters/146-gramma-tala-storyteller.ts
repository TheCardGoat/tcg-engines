import type { CharacterCard } from "@tcg/lorcana-types";

export const grammaTalaStoryteller: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "put-into-inkwell",
          source: "this-card",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
        },
        type: "optional",
      },
      id: "n00-1",
      text: "**I WILL BE WITH YOU** When this character is banished, you may put this card into your inkwell facedown and exerted.",
      type: "action",
    },
  ],
  cardNumber: 146,
  cardType: "character",
  classifications: ["Storyborn", "Mentor"],
  cost: 2,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Gramma Tala - Storyteller",
  id: "n00",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  name: "Gramma Tala",
  set: "001",
  strength: 1,
  text: "**I WILL BE WITH YOU** When this character is banished, you may put this card into your inkwell facedown and exerted.",
  version: "Storyteller",
  willpower: 1,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import { putThisCardIntoYourInkwellExerted } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const grammaTalaStoryteller: LorcanitoCharacterCard = {
//   Id: "n00",
//
//   Name: "Gramma Tala",
//   Title: "Storyteller",
//   Characteristics: ["storyborn", "mentor"],
//   Text: "**I WILL BE WITH YOU** When this character is banished, you may put this card into your inkwell facedown and exerted.",
//   Type: "character",
//   Abilities: [
//     WhenThisCharacterBanished({
//       Name: "I Will Be With You",
//       Text: "When this character is banished, you may put this card into your inkwell facedown and exerted.",
//       Optional: true,
//       Effects: [putThisCardIntoYourInkwellExerted],
//     }),
//   ],
//   Flavour:
//     "Moana: Is there something you want to tell me?\nGramma Tala: Is there something you want to hear?",
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 2,
//   Strength: 1,
//   Willpower: 1,
//   Lore: 1,
//   Illustrator: "Filipe Laurentino",
//   Number: 146,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508842,
//   },
//   Rarity: "uncommon",
// };
//
