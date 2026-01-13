import type { ActionCard } from "@tcg/lorcana-types";

export const legendOfTheSwordInTheStone: ActionCard = {
  id: "t20",
  cardType: "action",
  name: "Legend of the Sword in the Stone",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  text: "Chosen character gains Challenger +3 this turn. (They get +3 {S} while challenging.)",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 64,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "68b837d1794b4887d94e74205c81d1741976d19c",
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
// export const legendOfTheSwordInTheStone: LorcanitoActionCard = {
//   id: "fjm",
//   name: "Legend of the Sword in the Stone",
//   characteristics: ["action", "song"],
//   text: "_(A character with cost 2 or more can {E} to sing this song for free.)_\n\nChosen character gains **Challenger** +3 this turn. _(They get +3 {S} while challenging.)_",
//   type: "action",
//   abilities: [
//     {
//       type: "resolution",
//       text: "Chosen character gains **Challenger** +3 this turn. _(They get +3 {S} while challenging.)_",
//       effects: [
//         {
//           type: "ability",
//           ability: "challenger",
//           amount: 3,
//           modifier: "add",
//           duration: "turn",
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   flavour:
//     "A legend is sung of when England was young \nAnd knights were brave and bold",
//   inkwell: true,
//   colors: ["amethyst"],
//   cost: 2,
//   illustrator: "Kuya Jaypi",
//   number: 64,
//   set: "ROF",
//   externalIds: {
//     tcgPlayer: 526302,
//   },
//   rarity: "common",
// };
//
