import type { CharacterCard } from "@tcg/lorcana-types";

export const pegNaturalPerformer: CharacterCard = {
  id: "wsf",
  cardType: "character",
  name: "Peg",
  version: "Natural Performer",
  fullName: "Peg - Natural Performer",
  inkType: ["amber", "emerald"],
  franchise: "Lady and the Tramp",
  set: "007",
  text: "CAPTIVE AUDIENCE {E} — If you have 3 or more other characters in play, draw a card.",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  cardNumber: 7,
  inkable: true,
  externalIds: {
    ravensburger: "762d1029f027634d776b43710b50208449173fad",
  },
  abilities: [
    {
      id: "wsf-1",
      type: "activated",
      cost: {},
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have 3 or more other characters in play",
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
      text: "CAPTIVE AUDIENCE {E} — If you have 3 or more other characters in play, draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const pegNaturalPerformer: LorcanitoCharacterCard = {
//   id: "dly",
//   name: "Peg",
//   title: "Natural Performer",
//   characteristics: ["storyborn", "ally"],
//   text: "CAPTIVE AUDIENCE {E} – If you have at least 3 other characters in play, draw a card.",
//   type: "character",
//   abilities: [
//     {
//       type: "activated",
//       name: "CAPTIVE AUDIENCE",
//       text: "{E} – If you have at least 3 other characters in play, draw a card.",
//       costs: [{ type: "exert" }],
//       effects: [
//         {
//           type: "draw",
//           amount: 1,
//           target: self,
//           conditions: [
//             {
//               type: "filter",
//               filters: [
//                 { filter: "zone", value: "play" },
//                 { filter: "owner", value: "self" },
//                 { filter: "type", value: "character" },
//                 { filter: "source", value: "other" },
//               ],
//               comparison: { operator: "gte", value: 3 },
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//
//   colors: ["emerald", "amber"],
//   cost: 3,
//   strength: 2,
//   willpower: 4,
//   illustrator: "Mariana Moreno",
//   number: 7,
//   set: "007",
//   externalIds: {
//     tcgPlayer: 619410,
//   },
//   rarity: "uncommon",
//   lore: 1,
// };
//
