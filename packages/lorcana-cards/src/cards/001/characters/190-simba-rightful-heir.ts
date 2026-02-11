import type { CharacterCard } from "@tcg/lorcana-types";

export const simbaRightfulHeir: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      id: "ac0-1",
      text: "**I KNOW WHAT I HAVE TO DO** During your turn, whenever this character banishes another character in a challenge, you gain 1 lore.",
      type: "action",
    },
  ],
  cardNumber: 190,
  cardType: "character",
  classifications: ["Hero", "Storyborn", "Prince"],
  cost: 5,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Simba - Rightful Heir",
  id: "ac0",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  name: "Simba",
  set: "001",
  strength: 3,
  text: "**I KNOW WHAT I HAVE TO DO** During your turn, whenever this character banishes another character in a challenge, you gain 1 lore.",
  version: "Rightful Heir",
  willpower: 5,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { wheneverBanishesAnotherCharacterInChallenge } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const simbaRightfulHeir: LorcanitoCharacterCard = {
//   Id: "ac0",
//   Name: "Simba",
//   Title: "Rightful Heir",
//   Characteristics: ["hero", "storyborn", "prince"],
//   Text: "**I KNOW WHAT I HAVE TO DO** During your turn, whenever this character banishes another character in a challenge, you gain 1 lore.",
//   Type: "character",
//   Abilities: [
//     WheneverBanishesAnotherCharacterInChallenge({
//       Name: "I Know What I Have To Do",
//       Text: "During your turn, whenever this character banishes another character in a challenge, you gain 1 lore.",
//       Effects: [
//         {
//           Type: "lore",
//           Amount: 1,
//           Modifier: "add",
//           Target: {
//             Type: "player",
//             Value: "self",
//           },
//         },
//       ],
//     }),
//   ],
//   Flavour: "I can't hide anymore. It's time to accept my destiny.",
//   Colors: ["steel"],
//   Cost: 5,
//   Strength: 3,
//   Willpower: 5,
//   Lore: 2,
//   Illustrator: "Cookie",
//   Number: 190,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508941,
//   },
//   Rarity: "uncommon",
// };
//
