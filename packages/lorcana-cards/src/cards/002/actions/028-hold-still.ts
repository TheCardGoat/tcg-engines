import type { ActionCard } from "@tcg/lorcana-types";

export const holdStill: ActionCard = {
  id: "1cm",
  cardType: "action",
  name: "Hold Still",
  inkType: ["amber"],
  franchise: "Beauty and the Beast",
  set: "002",
  text: "Remove up to 4 damage from chosen character.",
  cost: 2,
  cardNumber: 28,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "af7ad8e2f2e28d3c3a1323718ae5d87054755485",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
//
// const chosenCharacter = {
//   type: "card" as const,
//   value: 1,
//   filters: [
//     { filter: "zone" as const, value: "play" as const },
//     { filter: "type" as const, value: "character" as const },
//   ],
// };
//
// export const holdStill: LorcanitoActionCard = {
//   id: "y6k",
//
//   name: "Hold Still",
//   characteristics: ["action"],
//   text: "Remove up to 4 damage from chosen character.",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       text: "Remove up to 4 damage from chosen character.",
//       effects: [
//         {
//           type: "heal",
//           amount: 4,
//           upTo: true,
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   flavour: "This might sting a little.",
//   inkwell: true,
//   colors: ["amber"],
//   cost: 2,
//   illustrator: "Connie Kang / Jackie Droujko",
//   number: 28,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 527726,
//   },
//   rarity: "common",
// };
//
