import type { ItemCard } from "@tcg/lorcana-types";

export const scepterOfArendelle: ItemCard = {
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        duration: "this-turn",
        keyword: "Support",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
      id: "1j9-1",
      name: "COMMAND",
      text: "COMMAND {E} — Chosen character gains Support this turn.",
      type: "activated",
    },
  ],
  cardNumber: 170,
  cardType: "item",
  cost: 1,
  externalIds: {
    ravensburger: "c727888823a011c91f8ab8c27400f74ffd775c06",
  },
  franchise: "Frozen",
  id: "1j9",
  inkType: ["sapphire"],
  inkable: true,
  name: "Scepter of Arendelle",
  set: "001",
  text: "COMMAND {E} — Chosen character gains Support this turn. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// Import type { AbilityEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
//
// Export const scepterOfArendelle: LorcanitoItemCard = {
//   Characteristics: ["item"],
//   Id: "ao2",
//
//   Name: "Scepter Of Arendelle",
//   Text: "**COMMAND** {E} − Chosen character gains **Support** this turn. _(Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)_",
//   Type: "item",
//   Abilities: [
//     {
//       Type: "activated",
//       Name: "Command",
//       Text: "Chosen character gains **Support** this turn.",
//       Costs: [{ type: "exert" }],
//       Effects: [
//         {
//           Type: "ability",
//           Ability: "support",
//           Modifier: "add",
//           Duration: "turn",
//           Target: {
//             Type: "card",
//             Value: 1,
//             Filters: [
//               { filter: "zone", value: "play" },
//               { filter: "type", value: "character" },
//             ],
//           },
//         } as AbilityEffect,
//       ],
//     } as ActivatedAbility,
//   ],
//   Inkwell: true,
//   Colors: ["sapphire"],
//   Cost: 1,
//   Illustrator: "Grace Tran",
//   Number: 170,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 505963,
//   },
//   Rarity: "uncommon",
// };
//
