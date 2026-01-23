import type { ItemCard } from "@tcg/lorcana-types";

export const sleepysFlute: ItemCard = {
  id: "1aa",
  cardType: "item",
  name: "Sleepy's Flute",
  inkType: ["amber"],
  franchise: "Snow White",
  set: "002",
  text: "A SILLY SONG {E} — If you played a song this turn, gain 1 lore.",
  cost: 2,
  cardNumber: 34,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a88b678ed05a863099cb73f4b15ef9a23ded6195",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// export const sleepysFlute: LorcanitoItemCard = {
//   id: "fn4",
//   name: "Sleepy's Flute",
//   characteristics: ["item"],
//   text: "**A SILLY SONG** {E} − If you played a song this turn, gain 1 lore.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "A Silly Song",
//       text: "{E} − If you played a song this turn, gain 1 lore.",
//       optional: false,
//       costs: [{ type: "exert" }],
//       conditions: [{ type: "played-songs" }],
//       effects: [
//         {
//           type: "lore",
//           amount: 1,
//           modifier: "add",
//           target: {
//             type: "player",
//             value: "self",
//           },
//         },
//       ],
//     },
//   ],
//   colors: ["amber"],
//   cost: 2,
//   illustrator: "Antonia Flechsig",
//   number: 34,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527729,
//   },
//   rarity: "rare",
// };
//
