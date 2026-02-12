import type { ItemCard } from "@tcg/lorcana-types";

export const drFacilierundefined: ItemCard = {
  abilities: [
    {
      effect: {
        from: "hand",
        type: "play-card",
      },
      id: "s8n-1",
      text: "**THE CARDS WILL TELL** {E} − You pay 1 {I} less for the next action you play this turn.",
      type: "action",
    },
  ],
  cardNumber: 101,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "",
  },
  franchise: "Disney",
  fullName: "Dr. Facilier - undefined",
  id: "s8n",
  inkType: ["emerald"],
  inkable: true,
  name: "Dr. Facilier",
  set: "001",
  text: "**THE CARDS WILL TELL** {E} − You pay 1 {I} less for the next action you play this turn.",
  version: "undefined",
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// Export const drFacilierCards: LorcanitoItemCard = {
//   Characteristics: ["item"],
//   Id: "s8n",
//
//   Name: "Dr. Facilier's Cards",
//   Text: "**THE CARDS WILL TELL** {E} − You pay 1 {I} less for the next action you play this turn.",
//   Type: "item",
//   Abilities: [
//     {
//       Type: "activated",
//       Name: "The Cards Will Tell",
//       Text: "You pay 1 {I} less for the next action you play this turn.",
//       Costs: [{ type: "exert" }],
//       Effects: [
//         {
//           Type: "replacement",
//           Replacement: "cost",
//           Duration: "next",
//           Amount: 1,
//           Target: {
//             Type: "card",
//             Value: "all",
//             Filters: [{ filter: "type", value: "action" }],
//           },
//         },
//       ],
//     } as ActivatedAbility,
//   ],
//   Flavour: "Take a little trip into your future with me! \n−Dr. Facilier",
//   Colors: ["emerald"],
//   Cost: 2,
//   Illustrator: "Koni",
//   Number: 101,
//   Set: "TFC",
//   ExternalIds: {
//     TcgPlayer: 508762,
//   },
//   Rarity: "uncommon",
// };
//
