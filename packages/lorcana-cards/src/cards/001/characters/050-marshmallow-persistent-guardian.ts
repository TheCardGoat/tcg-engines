import type { CharacterCard } from "@tcg/lorcana-types";

export const marshmallowPersistentGuardian: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "return-to-hand",
          target: "SELF",
        },
        type: "optional",
      },
      id: "it5-1",
      text: "**DURABLE** When this character is banished in a challenge, you may return this card to your hand.",
      type: "action",
    },
  ],
  cardNumber: 50,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 6,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Marshmallow - Persistent Guardian",
  id: "it5",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  name: "Marshmallow",
  set: "001",
  strength: 5,
  text: "**DURABLE** When this character is banished in a challenge, you may return this card to your hand.",
  version: "Persistent Guardian",
  willpower: 5,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { whenThisCharacterBanishedInAChallenge } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import { returnThisCardToHand } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const marshmallowPersistentGuardian: LorcanitoCharacterCard = {
//   Id: "it5",
//   Name: "Marshmallow",
//   Title: "Persistent Guardian",
//   Characteristics: ["storyborn", "ally"],
//   Text: "**DURABLE** When this character is banished in a challenge, you may return this card to your hand.",
//   Type: "character",
//   Abilities: [
//     WhenThisCharacterBanishedInAChallenge({
//       Name: "Durable",
//       Optional: true,
//       Text: "When this character is banished in a challenge, you may return this card to your hand.",
//       Effects: [returnThisCardToHand],
//     }),
//   ],
//   Flavour:
//     "Hey! We were just talking about you! All good things, all good things. −Olaf",
//   Colors: ["amethyst"],
//   Cost: 6,
//   Strength: 5,
//   Willpower: 5,
//   Lore: 1,
//   Illustrator: "Kendall Hale",
//   Number: 50,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 505955,
//   },
//   Rarity: "super_rare",
// };
//
