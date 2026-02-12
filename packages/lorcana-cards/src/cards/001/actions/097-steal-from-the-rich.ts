import type { ActionCard } from "@tcg/lorcana-types";

export const stealFromTheRich: ActionCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        target: "EACH_OPPONENT",
        type: "lose-lore",
      },
      id: "ncz-1",
      text: "Whenever one of your characters quests this turn, each opponent loses 1 lore.",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 97,
  cardType: "action",
  cost: 5,
  externalIds: {
    ravensburger: "54317280fda3eec0bfe9a09946029a6334cadaf3",
  },
  franchise: "Robin Hood",
  id: "ncz",
  inkType: ["emerald"],
  inkable: false,
  name: "Steal from the Rich",
  set: "001",
  text: "Whenever one of your characters quests this turn, each opponent loses 1 lore.",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { Trigger } from "@lorcanito/lorcana-engine";
// Import type { FloatingTriggeredAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import type { LoreEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// Export const stealFromRich: LorcanitoActionCard = {
//   Id: "wje",
//   Name: "Steal from the Rich",
//   Characteristics: ["action"],
//   Text: "Whenever one of your characters quests this turn, each opponent loses 1 lore.",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "floating-triggered",
//       Duration: "turn",
//       Trigger: {
//         On: "quest",
//         Target: {
//           Type: "card",
//           Value: "all",
//           Filters: [
//             { filter: "owner", value: "self" },
//             { filter: "zone", value: "play" },
//             { filter: "type", value: "character" },
//           ],
//         },
//       } as Trigger,
//       Layer: {
//         Type: "resolution",
//         Effects: [
//           {
//             Type: "lore",
//             Amount: 1,
//             Modifier: "subtract",
//             Target: {
//               Type: "player",
//               Value: "opponent",
//             },
//           } as LoreEffect,
//         ],
//       },
//     } as FloatingTriggeredAbility,
//   ],
//   Flavour:
//     "Wonder how much ol' Prince John spent on all those fancy locks. \n−Little John",
//   Colors: ["emerald"],
//   Cost: 5,
//   Illustrator: "Hedvig Häggman-Sund",
//   Number: 97,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508773,
//   },
//   Rarity: "rare",
// };
//
