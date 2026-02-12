import type { CharacterCard } from "@tcg/lorcana-types";

export const geniePowersUnleashed: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          cost: "free",
          costRestriction: {
            comparison: "less-or-equal",
            value: 5,
          },
          from: "hand",
          type: "play-card",
        },
        type: "optional",
      },
      id: "dgz-1",
      text: "**Shift** 6 (_You may pay 6 {I} to play this on top of one of your characters named Genie._)\n\n**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**PHENOMENAL COSMIC POWER** Whenever this character quests, you may play an action with cost 5 or less for free.",
      type: "action",
    },
  ],
  cardNumber: 76,
  cardType: "character",
  classifications: ["Hero", "Floodborn"],
  cost: 8,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Genie - Powers Unleashed",
  id: "dgz",
  inkType: ["emerald"],
  inkable: true,
  lore: 3,
  name: "Genie",
  set: "001",
  strength: 3,
  text: "**Shift** 6 (_You may pay 6 {I} to play this on top of one of your characters named Genie._)\n\n**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**PHENOMENAL COSMIC POWER** Whenever this character quests, you may play an action with cost 5 or less for free.",
  version: "Powers Unleashed",
  willpower: 5,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import {
//   EvasiveAbility,
//   ShiftAbility,
// } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { wheneverQuests } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const geniePowerUnleashed: LorcanitoCharacterCard = {
//   Id: "dgz",
//   Name: "Genie",
//   Title: "Powers Unleashed",
//   Characteristics: ["hero", "floodborn"],
//   Text: "**Shift** 6 (_You may pay 6 {I} to play this on top of one of your characters named Genie._)\n\n**Evasive** _(Only characters with Evasive can challenge this character.)_\n\n**PHENOMENAL COSMIC POWER** Whenever this character quests, you may play an action with cost 5 or less for free.",
//   Type: "character",
//   Illustrator: "Javier Salas",
//   Abilities: [
//     WheneverQuests({
//       Name: "Phenomenal Cosmic Power",
//       Text: "Whenever this character quests, you may play an action with cost 5 or less for free.",
//       Optional: true,
//       Effects: [
//         {
//           Type: "move",
//           To: "play",
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "owner", value: "self" },
//               { filter: "zone", value: "hand" },
//               { filter: "type", value: "action" },
//               {
//                 Filter: "attribute",
//                 Value: "cost",
//                 Comparison: { operator: "lte", value: 5 },
//               },
//             ],
//           },
//         },
//       ],
//     }),
//     EvasiveAbility,
//     ShiftAbility(6, "Genie"),
//   ],
//   Colors: ["emerald"],
//   Cost: 8,
//   Strength: 3,
//   Willpower: 5,
//   Lore: 3,
//   Number: 76,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508766,
//   },
//   Rarity: "rare",
// };
//
