import type { ActionCard } from "@tcg/lorcana-types";

export const controlYourTemper: ActionCard = {
  id: "nur",
  cardType: "action",
  name: "Control Your Temper!",
  inkType: ["amber"],
  franchise: "Beauty and the Beast",
  set: "001",
  text: "Chosen character gets -2 {S} this turn.",
  cost: 1,
  cardNumber: 26,
  inkable: true,
  externalIds: {
    ravensburger: "55f9630150960925f548c841768e0cd6ac3aa1ef",
  },
  abilities: [
    {
      id: "nur-1",
      type: "action",
      text: "Chosen character gets -2 {S} this turn.",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        duration: "this-turn",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const controlYourTemper: LorcanitoActionCard = {
//   id: "eny",
//   name: "Control Your Temper!",
//   characteristics: ["action"],
//   text: "Chosen character gets -2 {S} this turn.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       effects: [
//         {
//           type: "attribute",
//           attribute: "strength",
//           amount: 2,
//           modifier: "subtract",
//           duration: "turn",
//           target: {
//             type: "card",
//             value: 1,
//             filters: [
//               { filter: "type", value: "character" },
//               { filter: "zone", value: "play" },
//             ],
//           },
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["amber"],
//   cost: 1,
//   illustrator: "Amber Kommavongsa",
//   number: 26,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 493501,
//   },
//   rarity: "common",
// };
//
