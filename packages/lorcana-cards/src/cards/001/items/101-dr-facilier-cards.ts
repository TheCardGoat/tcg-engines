import type { ItemCard } from "@tcg/lorcana-types";

export const drFacilierundefined: ItemCard = {
  id: "s8n",
  cardType: "item",
  name: "Dr. Facilier",
  version: "undefined",
  fullName: "Dr. Facilier - undefined",
  inkType: ["emerald"],
  franchise: "Disney",
  set: "001",
  text: "**THE CARDS WILL TELL** {E} − You pay 1 {I} less for the next action you play this turn.",
  cost: 2,
  cardNumber: 101,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**THE CARDS WILL TELL** {E} − You pay 1 {I} less for the next action you play this turn.",
      id: "s8n-1",
      effect: {
        type: "play-card",
        from: "hand",
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const drFacilierCards: LorcanitoItemCard = {
//   characteristics: ["item"],
//   id: "s8n",
//
//   name: "Dr. Facilier's Cards",
//   text: "**THE CARDS WILL TELL** {E} − You pay 1 {I} less for the next action you play this turn.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "The Cards Will Tell",
//       text: "You pay 1 {I} less for the next action you play this turn.",
//       costs: [{ type: "exert" }],
//       effects: [
//         {
//           type: "replacement",
//           replacement: "cost",
//           duration: "next",
//           amount: 1,
//           target: {
//             type: "card",
//             value: "all",
//             filters: [{ filter: "type", value: "action" }],
//           },
//         },
//       ],
//     } as ActivatedAbility,
//   ],
//   flavour: "Take a little trip into your future with me! \n−Dr. Facilier",
//   colors: ["emerald"],
//   cost: 2,
//   illustrator: "Koni",
//   number: 101,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 508762,
//   },
//   rarity: "uncommon",
// };
//
