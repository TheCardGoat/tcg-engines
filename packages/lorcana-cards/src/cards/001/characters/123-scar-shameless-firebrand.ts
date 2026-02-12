import type { CharacterCard } from "@tcg/lorcana-types";

export const scarShamelessFirebrand: CharacterCard = {
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
      id: "mm7-1",
      text: "**Shift** 6 _(You may pay 6 {I} to play this on top of one of your characters named Scar.)_\n**ROUSING SPEECH** When you play this character, ready your characters with cost 3 or less. They can",
      type: "action",
    },
  ],
  cardNumber: 123,
  cardType: "character",
  classifications: ["Floodborn", "Villain", "King"],
  cost: 8,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Scar - Shameless Firebrand",
  id: "mm7",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  name: "Scar",
  set: "001",
  strength: 6,
  text: "**Shift** 6 _(You may pay 6 {I} to play this on top of one of your characters named Scar.)_\n**ROUSING SPEECH** When you play this character, ready your characters with cost 3 or less. They can",
  version: "Shameless Firebrand",
  willpower: 6,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { shiftAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import { whenYouPlayThisCharAbility } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const scarShamelessFirebrand: LorcanitoCharacterCard = {
//   Id: "mm7",
//   Name: "Scar",
//   Title: "Shameless Firebrand",
//   Characteristics: ["floodborn", "villain", "king"],
//   Text: "**Shift** 6 _(You may pay 6 {I} to play this on top of one of your characters named Scar.)_\n**ROUSING SPEECH** When you play this character, ready your characters with cost 3 or less. They can't quest for the rest of this turn.",
//   Type: "character",
//   Abilities: [
//     ShiftAbility(6, "Scar"),
//     WhenYouPlayThisCharAbility({
//       Type: "resolution",
//       Name: "ROUSING SPEECH",
//       Text: "When you play this character, ready your characters with cost 3 or less. They can't quest for the rest of this turn",
//       Effects: readyAndCantQuest({
//         Type: "card",
//         Value: "all",
//         Filters: [
//           { filter: "type", value: "character" },
//           { filter: "zone", value: "play" },
//           { filter: "owner", value: "self" },
//           {
//             Filter: "attribute",
//             Value: "cost",
//             Comparison: { operator: "lte", value: 3 },
//           },
//         ],
//       }),
//     }),
//   ],
//   Colors: ["ruby"],
//   Cost: 8,
//   Strength: 6,
//   Willpower: 6,
//   Lore: 1,
//   Illustrator: "Jenna Gray",
//   Number: 123,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 507467,
//   },
//   Rarity: "rare",
// };
//
