import type { ItemCard } from "@tcg/lorcana-types";

export const dinglehopper: ItemCard = {
  id: "7r6",
  cardType: "item",
  name: "Dinglehopper",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "001",
  text: "STRAIGHTEN HAIR {E} — Remove up to 1 damage from chosen character.",
  cost: 1,
  cardNumber: 32,
  inkable: true,
  externalIds: {
    ravensburger: "00c6be6408d3d9e54f25ef26b390b9087bf722cb",
  },
  abilities: [
    {
      id: "7r6-1",
      text: "STRAIGHTEN HAIR {E} — Remove up to 1 damage from chosen character.",
      name: "STRAIGHTEN HAIR",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        type: "remove-damage",
        amount: 1,
        target: "CHOSEN_CHARACTER",
        upTo: true,
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const dingleHopper: LorcanitoItemCard = {
//   characteristics: ["item"],
//   id: "qef",
//   name: "Dinglehopper",
//   text: "**STRAIGHTEN HAIR** {E} - Remove up to 1 damage from chosen character.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "Straighten Hair",
//       text: "{E} - Remove up to 1 damage from chosen character.",
//       optional: false,
//       costs: [{ type: "exert" }],
//       effects: [
//         {
//           type: "heal",
//           amount: 1,
//           upTo: true,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "owner", value: "self" },
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     } as ActivatedAbility,
//   ],
//   flavour: "Enjoy the finest of human hairstyles.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 1,
//   illustrator: "Eri Welli",
//   number: 32,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 492733,
//   },
//   rarity: "common",
// };
//
