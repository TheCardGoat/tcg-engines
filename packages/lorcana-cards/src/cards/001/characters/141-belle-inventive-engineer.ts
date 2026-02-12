import type { CharacterCard } from "@tcg/lorcana-types";

export const belleInventiveEngineer: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "play-card",
        from: "hand",
      },
      id: "vuf-1",
      text: "**TINKER** Whenever this character quests, you pay 1 {I} less for the next item you play this turn.",
      type: "action",
    },
  ],
  cardNumber: 141,
  cardType: "character",
  classifications: ["Hero", "Dreamborn", "Inventor", "Princess"],
  cost: 3,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Belle - Inventive Engineer",
  id: "vuf",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  name: "Belle",
  set: "001",
  strength: 2,
  text: "**TINKER** Whenever this character quests, you pay 1 {I} less for the next item you play this turn.",
  version: "Inventive Engineer",
  willpower: 3,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
//
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Export const belleInventive: LorcanitoCharacterCard = {
//   Id: "vuf",
//   Reprints: ["siv"],
//   Name: "Belle",
//   Title: "Inventive Engineer",
//   Characteristics: ["hero", "dreamborn", "inventor", "princess"],
//   Text: "**TINKER** Whenever this character quests, you pay 1 {I} less for the next item you play this turn.",
//   Type: "character",
//   Abilities: [
//     WheneverQuests({
//       Name: "Tinker",
//       Text: "Whenever this character quests, you pay 1 {I} less for the next item you play this turn.",
//       Effects: [
//         {
//           Type: "replacement",
//           Replacement: "cost",
//           Duration: "next",
//           Amount: 1,
//           Target: {
//             Type: "card",
//             Value: "all",
//             Filters: [{ filter: "type", value: "item" }],
//           },
//         },
//       ],
//     }),
//   ],
//   Flavour:
//     "A little ingenuity and a lot of heart will take you far in this world.",
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 3,
//   Strength: 2,
//   Willpower: 3,
//   Lore: 2,
//   Illustrator: "Gabriel Romero / Pix Smith",
//   Number: 141,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 492727,
//   },
//   Rarity: "uncommon",
// };
//
