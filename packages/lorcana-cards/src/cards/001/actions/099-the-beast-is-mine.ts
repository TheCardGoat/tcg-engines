import type { ActionCard } from "@tcg/lorcana-types";

export const theBeastIsMine: ActionCard = {
  abilities: [
    {
      effect: {
        type: "gain-keyword",
        keyword: "Reckless",
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
      id: "10f-1",
      text: "Chosen character gains Reckless during their next turn.",
      type: "static",
    },
  ],
  cardNumber: 99,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "8488fbd0b43280a0577520d149097ebe9d751d8f",
  },
  franchise: "Beauty and the Beast",
  id: "10f",
  inkType: ["emerald"],
  inkable: true,
  name: "The Beast is Mine!",
  set: "001",
  text: "Chosen character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// Import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import type { AbilityEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// Export const theBeastIsMine: LorcanitoActionCard = {
//   Id: "mlb",
//   Name: "The Beast is Mine!",
//   Characteristics: ["action"],
//   Text: "Chosen character gains **Reckless** during their next turn. _(They can't quest and must challenge if able.)_",
//   Type: "action",
//   Abilities: [
//     {
//       Type: "resolution",
//       Name: "The Beast is Mine!",
//       Text: "Chosen character gains **Reckless** during their next turn. _(They can't quest and must challenge if able.)_",
//       Effects: [
//         {
//           Type: "ability",
//           Ability: "reckless",
//           Modifier: "add",
//           Duration: "next_turn",
//           Target: chosenCharacter,
//         } as AbilityEffect,
//       ],
//     },
//   ],
//   Flavour:
//     "It's only fitting that the finest hunter gets the foulest \rbeast!<br />\r− Gaston",
//   Inkwell: true,
//   Colors: ["emerald"],
//   Cost: 3,
//   Illustrator: "\tMatthew Robert Davies",
//   Number: 99,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 494154,
//   },
//   Rarity: "uncommon",
// };
//
