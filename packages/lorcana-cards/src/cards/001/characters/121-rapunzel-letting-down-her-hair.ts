import type { CharacterCard } from "@tcg/lorcana-types";

export const rapunzelLettingDownHerHair: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        target: "EACH_OPPONENT",
        type: "lose-lore",
      },
      id: "eqs-1",
      text: "**TANGLE** When you play this character, each opponent loses 1 lore.",
      type: "action",
    },
  ],
  cardNumber: 121,
  cardType: "character",
  classifications: ["Hero", "Dreamborn", "Princess"],
  cost: 6,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Rapunzel - Letting Down Her Hair",
  id: "eqs",
  inkType: ["ruby"],
  inkable: true,
  lore: 2,
  name: "Rapunzel",
  set: "001",
  strength: 5,
  text: "**TANGLE** When you play this character, each opponent loses 1 lore.",
  version: "Letting Down Her Hair",
  willpower: 4,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import type { LoreEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// Export const rapunzelLettingHerHairDown: LorcanitoCharacterCard = {
//   Id: "eqs",
//   Reprints: ["aq6"],
//
//   Name: "Rapunzel",
//   Title: "Letting Down Her Hair",
//   Characteristics: ["hero", "dreamborn", "princess"],
//   Text: "**TANGLE** When you play this character, each opponent loses 1 lore.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisCharAbility({
//       Type: "resolution",
//       Name: "Tangle",
//       Text: "When you play this character, each opponent loses 1 lore.",
//       Effects: [
//         {
//           Type: "lore",
//           Modifier: "subtract",
//           Amount: 1,
//           Target: {
//             Type: "player",
//             Value: "opponent",
//           },
//         } as LoreEffect,
//       ],
//     }),
//   ],
//   Flavour: "Who are you? And how did you find me?",
//   Colors: ["ruby"],
//   Cost: 6,
//   Strength: 5,
//   Willpower: 4,
//   Lore: 2,
//   Illustrator: "Clio Wolfensberger",
//   Number: 121,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 502011,
//   },
//   Rarity: "uncommon",
// };
//
