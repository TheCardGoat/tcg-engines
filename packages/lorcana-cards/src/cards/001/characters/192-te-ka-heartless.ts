import type { CharacterCard } from "@tcg/lorcana-types";

export const teKaHeartless: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      id: "pfr-1",
      text: "**SEEK THE HEART** During your turn, whenever this character banishes another character in a challenge, you gain 2 lore.",
      type: "action",
    },
  ],
  cardNumber: 192,
  cardType: "character",
  classifications: ["Dreamborn", "Villain", "Deity"],
  cost: 6,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Te Ka - Heartless",
  id: "pfr",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  name: "Te Ka",
  set: "001",
  strength: 5,
  text: "**SEEK THE HEART** During your turn, whenever this character banishes another character in a challenge, you gain 2 lore.",
  version: "Heartless",
  willpower: 5,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { wheneverBanishesAnotherCharacterInChallenge } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const teKaHeartless: LorcanitoCharacterCard = {
//   Id: "pfr",
//   Name: "Te Ka",
//   Title: "Heartless",
//   Characteristics: ["dreamborn", "villain", "deity"],
//   Text: "**SEEK THE HEART** During your turn, whenever this character banishes another character in a challenge, you gain 2 lore.",
//   Type: "character",
//   Abilities: [
//     WheneverBanishesAnotherCharacterInChallenge({
//       Effects: [
//         {
//           Type: "lore",
//           Amount: 2,
//           Modifier: "add",
//           Target: self,
//         },
//       ],
//     }),
//   ],
//   Flavour: "Maui: Ever defeat a lava monster? \nMoana: No. Have you?",
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 6,
//   Strength: 5,
//   Willpower: 5,
//   Lore: 2,
//   Illustrator: "Andrew Trabbold",
//   Number: 192,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508954,
//   },
//   Rarity: "legendary",
// };
//
