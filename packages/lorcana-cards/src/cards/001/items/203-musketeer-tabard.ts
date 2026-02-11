import type { ItemCard } from "@tcg/lorcana-types";

export const musketeerTabard: ItemCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      id: "8a5-1",
      name: "ALL FOR ONE AND ONE FOR ALL",
      text: "ALL FOR ONE AND ONE FOR ALL Whenever one of your characters with Bodyguard is banished, you may draw a card.",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      type: "triggered",
    },
  ],
  cardNumber: 203,
  cardType: "item",
  cost: 4,
  externalIds: {
    ravensburger: "1dd9513f5330b41950fea67f21d19e751b9551a2",
  },
  id: "8a5",
  inkType: ["steel"],
  inkable: false,
  name: "Musketeer Tabard",
  set: "001",
  text: "ALL FOR ONE AND ONE FOR ALL Whenever one of your characters with Bodyguard is banished, you may draw a card.",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { TriggeredAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { BanishTrigger } from "@lorcanito/lorcana-engine/abilities/triggers";
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const musketeerTabard: LorcanitoItemCard = {
//   Characteristics: ["item"],
//   Id: "j3v",
//
//   Name: "Musketeer Tabard",
//   Text: "**ALL FOR ONE AND ONE FOR ALL** Whenever one of your characters with **Bodyguard** is banished, you may draw a card.",
//   Type: "item",
//   Abilities: [
//     {
//       Type: "static-triggered",
//       Optional: false,
//       Trigger: {
//         On: "banish",
//         Filters: [
//           { filter: "owner", value: "self" },
//           { filter: "type", value: "character" },
//           { filter: "ability", value: "bodyguard" },
//         ],
//       } as BanishTrigger,
//       Layer: {
//         Type: "resolution",
//         Optional: true,
//         Effects: [
//           {
//             Type: "draw",
//             Amount: 1,
//             Target: {
//               Type: "player",
//               Value: "self",
//             },
//           },
//         ],
//       },
//     } as TriggeredAbility,
//   ],
//   Flavour: "There's no such thing as a lone musketeer.",
//   Colors: ["steel"],
//   Cost: 4,
//   Illustrator: "Dav Augereau / Guykua Ruva",
//   Number: 203,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 505951,
//   },
//   Rarity: "rare",
// };
//
