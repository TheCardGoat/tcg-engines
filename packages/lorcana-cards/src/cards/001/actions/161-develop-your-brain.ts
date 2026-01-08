import type { ActionCard } from "@tcg/lorcana-types";

export const developYourBrainundefined: ActionCard = {
  id: "yy9",
  cardType: "action",
  name: "Develop Your Brain",
  version: "undefined",
  fullName: "Develop Your Brain - undefined",
  inkType: ["sapphire"],
  franchise: "Disney",
  set: "001",
  text: "Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of the deck.",
  cost: 1,
  cardNumber: 161,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of the deck.",
      id: "yy9-1",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "look-at-cards",
            amount: 2,
            from: "top-of-deck",
            target: "CONTROLLER",
          },
          {
            type: "put-on-bottom",
            target: "CHOSEN_CHARACTER",
          },
        ],
      },
    },
  ],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const developYourBrain: LorcanitoActionCard = {
//   id: "yy9",
//   reprints: ["ph9"],
//   name: "Develop Your Brain",
//   characteristics: ["action"],
//   text: "Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of the deck.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       name: "Develop Your Brain",
//       text: "Look at the top 2 cards of your deck. Put one into your hand and the other on the bottom of the deck.",
//       effects: [
//         {
//           type: "scry",
//           amount: 2,
//           mode: "bottom",
//           shouldRevealTutored: false,
//           target: self,
//           limits: {
//             bottom: 1,
//             inkwell: 0,
//             hand: 1,
//             top: 0,
//           },
//           tutorFilters: [
//             { filter: "owner", value: "self" },
//             { filter: "zone", value: "deck" },
//           ],
//         },
//       ],
//     },
//   ],
//   flavour:
//     "„Knowledge, wisdom−there's the <b>real</b> power!\u0003<br />−Merlin",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 1,
//   illustrator: "Pao Yong",
//   number: 161,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 493478,
//   },
//   rarity: "common",
// };
//
