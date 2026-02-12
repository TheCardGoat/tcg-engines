import type { CharacterCard } from "@tcg/lorcana-types";

export const mickeyMouseArtfulRogue: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "play-card",
          from: "hand",
        },
        type: "optional",
      },
      id: "dul-1",
      text: "**Shift** 5 (_You may pay 5 {I} to play this on top of one of your characters named Tinker Bell._)\n**MISDIRECTION** Whenever you play an action, chosen opposing character can",
      type: "action",
    },
  ],
  cardNumber: 88,
  cardType: "character",
  classifications: ["Hero", "Floodborn"],
  cost: 7,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Mickey Mouse - Artful Rogue",
  id: "dul",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  name: "Mickey Mouse",
  set: "001",
  strength: 6,
  text: "**Shift** 5 (_You may pay 5 {I} to play this on top of one of your characters named Tinker Bell._)\n**MISDIRECTION** Whenever you play an action, chosen opposing character can",
  version: "Artful Rogue",
  willpower: 5,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { chosenOpposingCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import { wheneverPlays } from "@lorcanito/lorcana-engine/abilities/wheneverAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const mickeyMouseArtfulRogue: LorcanitoCharacterCard = {
//   Id: "dul",
//   Name: "Mickey Mouse",
//   Title: "Artful Rogue",
//   Characteristics: ["hero", "floodborn"],
//   Type: "character",
//   Text: "**Shift** 5 (_You may pay 5 {I} to play this on top of one of your characters named Tinker Bell._)\n**MISDIRECTION** Whenever you play an action, chosen opposing character can't quest during their next turn.",
//   Abilities: [
//     ShiftAbility(5, "Mickey Mouse"),
//     WheneverPlays({
//       Name: "Misdirection",
//       Text: "Whenever you play an action, chosen opposing character can't quest during their next turn.",
//       TriggerTarget: {
//         Type: "card",
//         Value: 1,
//         Filters: [
//           { filter: "type", value: "action" },
//           { filter: "characteristics", value: ["action"] },
//           { filter: "owner", value: "self" },
//         ],
//       },
//       Effects: [
//         {
//           Type: "restriction",
//           Restriction: "quest",
//           Duration: "next_turn",
//           Until: true,
//           Target: chosenOpposingCharacter,
//         },
//       ],
//     }),
//   ],
//   Flavour: "Quiet as a . . . well, you know.",
//   Colors: ["emerald"],
//   Cost: 7,
//   Strength: 6,
//   Willpower: 5,
//   Lore: 2,
//   Illustrator: "Alex Accorsi",
//   Number: 88,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 506827,
//   },
//   Rarity: "super_rare",
// };
//
