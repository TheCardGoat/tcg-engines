import type { ItemCard } from "@tcg/lorcana-types";

export const thePlank: ItemCard = {
  id: "1yt",
  cardType: "item",
  name: "The Plank",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "004",
  text: "WALK! 2 {I}, Banish this item – Choose one:\n• Banish chosen Hero character.\n• Ready chosen Villain character. They can't quest for the rest of this turn.",
  cost: 3,
  cardNumber: 133,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ff3464c93b7b522cffba8844ab4fd8b78781cec5",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { readyAndCantQuest } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const thePlank: LorcanitoItemCard = {
//   id: "xh7",
//   name: "The Plank",
//   characteristics: ["item"],
//   text: "**WALK!** 2 {I}, Banish this item - Choose one:\n· Banish chosen Hero character.\n· Ready chosen Villain character. They can't quest for the rest of this turn.",
//   type: "item",
//   abilities: [
//     {
//       name: "WALK!",
//       type: "activated",
//       text: "2 {I}, Banish this item - Choose one:\n· Banish chosen Hero character.\n· Ready chosen Villain character. They can't quest for the rest of this turn.",
//       costs: [{ type: "banish" }, { type: "ink", amount: 2 }],
//       effects: [
//         {
//           type: "modal",
//           target: chosenCharacter,
//           modes: [
//             {
//               id: "1",
//               text: "Banish chosen Hero character.",
//               effects: [
//                 {
//                   type: "banish",
//                   target: {
//                     type: "card",
//                     value: 1,
//                     filters: [
//                       { filter: "type", value: "character" },
//                       { filter: "zone", value: "play" },
//                       { filter: "characteristics", value: ["hero"] },
//                     ],
//                   },
//                 },
//               ],
//             },
//             {
//               id: "2",
//               text: "Ready chosen Villain character. They can't quest for the rest of this turn.",
//               effects: [
//                 ...readyAndCantQuest({
//                   type: "card",
//                   value: 1,
//                   filters: [
//                     { filter: "type", value: "character" },
//                     { filter: "zone", value: "play" },
//                     { filter: "characteristics", value: ["villain"] },
//                   ],
//                 }),
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   ],
//   flavour: "It's a once-in-a-lifetime view.",
//   colors: ["ruby"],
//   cost: 3,
//   illustrator: "Roberto Gatto",
//   number: 133,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550603,
//   },
//   rarity: "common",
// };
//
