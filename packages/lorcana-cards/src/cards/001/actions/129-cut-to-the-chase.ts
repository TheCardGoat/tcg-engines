import type { ActionCard } from "@tcg/lorcana-types";

export const cutToTheChase: ActionCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        keyword: "Rush",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
      id: "5a0-1",
      text: "Chosen character gains Rush this turn.",
      type: "static",
    },
  ],
  cardNumber: 129,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "13057e6bb6112157b88c4ebbaec83cc1a20d9e5c",
  },
  id: "5a0",
  inkType: ["ruby"],
  inkable: true,
  name: "Cut to the Chase",
  set: "001",
  text: "Chosen character gains Rush this turn. (They can challenge the turn they're played.)",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import type { AbilityEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// Export const cutToTheChase: LorcanitoActionCard = {
//   Id: "cei",
//   Name: "Cut to the Chase",
//   Characteristics: ["action"],
//   Text: "Chosen character gains **Rush** this turn. _(They can challenge the turn they're played.)_",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "Cut to the Chase",
//       Text: "Chosen character gains **Rush** this turn. _(They can challenge the turn they're played.)_",
//       Effects: [
//         {
//           Type: "ability",
//           Ability: "rush",
//           Modifier: "add",
//           Duration: "turn",
//           Until: true,
//           Target: chosenCharacter,
//         } as AbilityEffect,
//       ],
//     },
//   ],
//   Flavour: "Surprise!",
//   Inkwell: true,
//   Colors: ["ruby"],
//   Cost: 2,
//   Illustrator: "Ellie Horie",
//   Number: 129,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508615,
//   },
//   Rarity: "uncommon",
// };
//
