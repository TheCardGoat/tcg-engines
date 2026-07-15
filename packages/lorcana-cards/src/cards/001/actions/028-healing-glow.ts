import type { ActionCard } from "@tcg/lorcana-types";

export const healingGlow: ActionCard = {
  abilities: [
    {
      effect: {
        amount: 2,
        target: "CHOSEN_CHARACTER",
        type: "remove-damage",
        upTo: true,
      },
      id: "1ix-1",
      text: "Remove up to 2 damage from chosen character.",
      type: "action",
    },
  ],
  cardNumber: 28,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "c4353a13ff7ad0865ca1e7860a6c5feb8d15866d",
  },
  franchise: "Tangled",
  id: "1ix",
  inkType: ["amber"],
  inkable: true,
  name: "Healing Glow",
  set: "001",
  text: "Remove up to 2 damage from chosen character.",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const healingGlow: LorcanitoActionCard = {
//   Id: "ta0",
//   Name: "Healing Glow",
//   Characteristics: ["action"],
//   Text: "Remove up to 2 damage from chosen character.",
//   Type: "action",
//   Rarity: "common",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "Healing Glow",
//       Text: "Remove up to 2 damage from chosen character.",
//       Effects: [
//         {
//           Type: "heal",
//           Amount: 2,
//           UpTo: true,
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
//     },
//   ],
//   Flavour: "Don't freak out! Rapunzel",
//   Inkwell: true,
//   Colors: ["amber"],
//   Cost: 1,
//   Illustrator: "Philipp Kruse",
//   Number: 28,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 492713,
//   },
// };
//
