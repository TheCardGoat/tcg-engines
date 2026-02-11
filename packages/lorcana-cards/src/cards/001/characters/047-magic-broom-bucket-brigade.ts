import type { CharacterCard } from "@tcg/lorcana-types";

export const magicBroomBucketBrigade: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "play-card",
        from: "hand",
      },
      id: "zyc-1",
      text: "**SWEEP** When you play this character, you may shuffle a card from any discard into its player",
      type: "action",
    },
  ],
  cardNumber: 47,
  cardType: "character",
  classifications: ["Dreamborn", "Broom"],
  cost: 2,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Magic Broom - Bucket Brigade",
  id: "zyc",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  name: "Magic Broom",
  set: "001",
  strength: 2,
  text: "**SWEEP** When you play this character, you may shuffle a card from any discard into its player",
  version: "Bucket Brigade",
  willpower: 2,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const magicBroomBucketBrigade: LorcanitoCharacterCard = {
//   Id: "zyc",
//   Name: "Magic Broom",
//   Title: "Bucket Brigade",
//   Characteristics: ["dreamborn", "broom"],
//   Text: "**SWEEP** When you play this character, you may shuffle a card from any discard into its player's deck.",
//   Type: "character",
//   Abilities: [
//     WhenYouPlayThisCharAbility({
//       Type: "resolution",
//       Optional: true,
//       Name: "SWEEP",
//       Text: "When you play this character, you may shuffle a card from any discard into its player's deck.",
//       Effects: [
//         {
//           Type: "shuffle",
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [{ filter: "zone", value: "discard" }],
//           },
//         },
//       ],
//     }),
//   ],
//   Flavour:
//     "In the immense story-forge known as the Great Illuminary, there is always work to be done.",
//   Inkwell: true,
//   Colors: ["amethyst"],
//   Cost: 2,
//   Strength: 2,
//   Willpower: 2,
//   Lore: 1,
//   Illustrator: "Dav Augereau / Guykua Ruva",
//   Number: 47,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 493477,
//   },
//   Rarity: "common",
// };
//
