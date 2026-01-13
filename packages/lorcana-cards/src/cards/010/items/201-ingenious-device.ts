import type { ItemCard } from "@tcg/lorcana-types";

export const ingeniousDevice: ItemCard = {
  id: "12e",
  cardType: "item",
  name: "Ingenious Device",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "010",
  text: "SURPRISE PACKAGE {E}, 2 {I}, Banish this item — Draw a card, then choose and discard a card.\nTIME GROWS SHORT During your turn, when this item is banished, deal 3 damage to chosen character or location.",
  cost: 3,
  cardNumber: 201,
  inkable: false,
  externalIds: {
    ravensburger: "8a50bd678c2214c7ff51d993613b9ce04f7e3fea",
  },
  abilities: [
    {
      id: "12e-1",
      text: "SURPRISE PACKAGE {E}, 2 {I}, Banish this item — Draw a card, then choose and discard a card.",
      name: "SURPRISE PACKAGE",
      type: "activated",
      cost: {
        exert: true,
        ink: 2,
        banishSelf: true,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
          {
            type: "discard",
            amount: 1,
            target: "CONTROLLER",
            chosen: true,
          },
        ],
      },
    },
    {
      id: "12e-2",
      text: "TIME GROWS SHORT During your turn, when this item is banished, deal 3 damage to chosen character or location.",
      name: "TIME GROWS SHORT",
      type: "triggered",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "deal-damage",
        amount: 3,
        target: {
          selector: "chosen",
          count: 1,
          cardTypes: ["character", "location"],
        },
      },
      condition: {
        type: "turn",
        whose: "your",
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import {
//   discardACard,
//   drawACard,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const ingeniousDevice: LorcanitoItemCard = {
//   id: "t7m",
//   name: "Ingenious Device",
//   characteristics: ["item"],
//   text: "SOUVENIR {E}, 2 {I}, banish this item — Draw a card, then choose and discard a card. TIME FLIES During your turn, when this item is banished, deal 3 damage to a character or a location of your choice.",
//   type: "item",
//   inkwell: false,
//   colors: ["steel"],
//   cost: 3,
//   illustrator: "Giulia Bernardelli",
//   number: 201,
//   set: "010",
//   externalIds: {
//     tcgPlayer: 659410,
//   },
//   rarity: "uncommon",
//   abilities: [
//     {
//       type: "activated",
//       name: "Souvenir",
//       text: "{E}, 2 {I}, banish this item — Draw a card, then choose and discard a card.",
//       costs: [
//         { type: "exert" },
//         { type: "ink", amount: 2 },
//         { type: "banish" },
//       ],
//       resolveEffectsIndividually: true,
//       effects: [drawACard, discardACard],
//     },
//     whenThisCharacterBanished({
//       name: "Time Flies",
//       text: "During your turn, when this item is banished, deal 3 damage to a character or a location of your choice.",
//       conditions: [
//         {
//           type: "during-turn",
//           value: "self",
//         },
//       ],
//       effects: [
//         {
//           type: "damage",
//           amount: 3,
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: ["character", "location"] },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     }),
//   ],
// };
//
