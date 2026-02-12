import type { CharacterCard } from "@tcg/lorcana-types";

export const iagoLoudmouthedParrot: CharacterCard = {
  abilities: [],
  cardNumber: 80,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Iago - Loud-Mouthed Parrot",
  id: "s1f",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  name: "Iago",
  set: "001",
  strength: 1,
  text: "**YOU GOT A PROBLEM** {E} − Chosen character gains **Reckless** during their next turn. _(They can",
  version: "Loud-Mouthed Parrot",
  willpower: 4,
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import type { AbilityEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// Export const iagoLoudMouthedParrot: LorcanitoCharacterCard = {
//   Id: "s1f",
//   Name: "Iago",
//   Title: "Loud-Mouthed Parrot",
//   Characteristics: ["storyborn", "ally"],
//   Text: "**YOU GOT A PROBLEM** {E} − Chosen character gains **Reckless** during their next turn. _(They can't quest and must challenge if able.)_",
//   Type: "character",
//   Abilities: [
//     {
//       Type: "activated",
//       Name: "YOU GOT A PROBLEM?",
//       Text: "{E} − Chosen character gains **Reckless** during their next turn. _(They can't quest and must challenge if able.)_",
//       Costs: [{ type: "exert" }],
//       Effects: [
//         {
//           Type: "ability",
//           Ability: "reckless",
//           Modifier: "add",
//           Duration: "next_turn",
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "zone", value: "play" },
//               { filter: "owner", value: "opponent" },
//               { filter: "type", value: "character" },
//             ],
//           },
//         } as AbilityEffect,
//       ],
//     } as ActivatedAbility,
//   ],
//   Inkwell: true,
//   Colors: ["emerald"],
//   Cost: 3,
//   Strength: 1,
//   Willpower: 4,
//   Lore: 1,
//   Illustrator: "Brian Weisz",
//   Number: 80,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 497207,
//   },
//   Rarity: "rare",
// };
//
