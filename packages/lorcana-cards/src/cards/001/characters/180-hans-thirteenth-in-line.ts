import type { CharacterCard } from "@tcg/lorcana-types";

export const hansThirteenthInLine: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "deal-damage",
          amount: 1,
          target: "CHOSEN_CHARACTER",
        },
        type: "optional",
      },
      id: "1ro-1",
      name: "STAGE A LITTLE ACCIDENT",
      text: "STAGE A LITTLE ACCIDENT Whenever this character quests, you may deal 1 damage to chosen character.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 180,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Prince"],
  cost: 4,
  externalIds: {
    ravensburger: "e57dd5df690f5083848c5ffe191627af870b3985",
  },
  franchise: "Frozen",
  fullName: "Hans - Thirteenth in Line",
  id: "1ro",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  name: "Hans",
  set: "001",
  strength: 3,
  text: "STAGE A LITTLE ACCIDENT Whenever this character quests, you may deal 1 damage to chosen character.",
  version: "Thirteenth in Line",
  willpower: 3,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const hansThirteenthInLine: LorcanitoCharacterCard = {
//   Id: "p2r",
//   Name: "Hans",
//   Title: "Thirteenth in Line",
//   Characteristics: ["storyborn", "villain", "prince"],
//   Text: "**STAGE LITTLE ACCIDENT** Whenever this character quests, you may deal 1 damage to chosen character.",
//   Type: "character",
//   Abilities: [
//     WheneverQuests({
//       Name: "STAGE LITTLE ACCIDENT",
//       Text: "Whenever this character quests, you may deal 1 damage to chosen character.",
//       Optional: true,
//       Effects: [
//         {
//           Type: "damage",
//           Amount: 1,
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
//   Flavour: "Tired of being last, he decided to cut the line.",
//   Inkwell: true,
//   Colors: ["steel"],
//   Cost: 4,
//   Strength: 3,
//   Willpower: 3,
//   Lore: 2,
//   Illustrator: "Kendall Hale",
//   Number: 180,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 506823,
//   },
//   Rarity: "super_rare",
// };
//
