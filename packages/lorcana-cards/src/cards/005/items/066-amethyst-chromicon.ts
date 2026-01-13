import type { ItemCard } from "@tcg/lorcana-types";

export const amethystChromicon: ItemCard = {
  id: "1nk",
  cardType: "item",
  name: "Amethyst Chromicon",
  inkType: ["amethyst"],
  franchise: "Lorcana",
  set: "005",
  text: "AMETHYST LIGHT {E} — Each player may draw a card.",
  cost: 2,
  cardNumber: 66,
  inkable: true,
  externalIds: {
    ravensburger: "d4d96ef9fc0086b65fcb2361a63d0808cb76f94c",
  },
  abilities: [
    {
      id: "1nk-1",
      type: "activated",
      cost: {},
      effect: {
        type: "draw",
        amount: 1,
        target: "EACH_PLAYER",
      },
      text: "AMETHYST LIGHT {E} — Each player may draw a card.",
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { opponent, self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { drawACard } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const amethystChromicon: LorcanitoItemCard = {
//   id: "onp",
//   missingTestCase: true,
//   name: "Amethyst Chromicon",
//   characteristics: ["item"],
//   text: "**AMETHYST LIGHT** {E} − Each player may draw a card.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "Amethyst Light",
//       text: "{E} − Each player may draw a card.",
//       costs: [{ type: "exert" }],
//       effects: [
//         {
//           type: "create-layer-for-player",
//           target: self,
//           layer: {
//             type: "resolution",
//             name: "Amethyst Light",
//             text: "You may draw a card.",
//             optional: true,
//             effects: [drawACard],
//           },
//         },
//         {
//           type: "create-layer-for-player",
//           target: opponent,
//           layer: {
//             type: "resolution",
//             name: "Amethyst Light",
//             text: "You may draw a card.",
//             optional: true,
//             responder: "opponent",
//             effects: [drawACard],
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "Seek not power for its own sake.\n–Inscription",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   illustrator: "Dustin Panzino",
//   number: 66,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 560096,
//   },
//   rarity: "uncommon",
// };
//
