import type { ItemCard } from "@tcg/lorcana-types";

export const airfoil: ItemCard = {
  id: "1kp",
  cardType: "item",
  name: "Airfoil",
  inkType: ["emerald"],
  franchise: "Talespin",
  set: "003",
  text: "I GOT TO BE GOING {E} — If you've played 2 or more actions this turn, draw a card.",
  cost: 2,
  cardNumber: 97,
  inkable: true,
  externalIds: {
    ravensburger: "cc66d741f2606521d3e52b9282371857f133830f",
  },
  abilities: [
    {
      id: "1kp-1",
      type: "activated",
      cost: {},
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you've played 2 or more actions this turn",
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
      text: "I GOT TO BE GOING {E} — If you've played 2 or more actions this turn, draw a card.",
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
//
// export const airfoil: LorcanitoItemCard = {
//   id: "v9z",
//   missingTestCase: true,
//   name: "Airfoil",
//   characteristics: ["item"],
//   text: "**I GOT TO BE GOING** {E} – If you've played 2 or more actions this turn, draw a card.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "I Got to be Going",
//       text: "{E} − If you've played 2 or more actions this turn, draw a card.",
//       optional: false,
//       costs: [{ type: "exert" }],
//       conditions: [
//         { type: "played-actions", comparison: { operator: "gte", value: 2 } },
//       ],
//       effects: [
//         {
//           type: "draw",
//           amount: 1,
//           target: {
//             type: "player",
//             value: "self",
//           },
//         },
//       ],
//     },
//   ],
//   flavour: "Discovered in the lost Sea Duck, it looked good as new.",
//   inkwell: true,
//   colors: ["emerald"],
//   cost: 2,
//   illustrator: "Jenna Gray",
//   number: 97,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 537757,
//   },
//   rarity: "common",
// };
//
