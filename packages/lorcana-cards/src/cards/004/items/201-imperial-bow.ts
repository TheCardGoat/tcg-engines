import type { ItemCard } from "@tcg/lorcana-types";

export const imperialBow: ItemCard = {
  id: "1li",
  cardType: "item",
  name: "Imperial Bow",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "004",
  text: "WITHIN RANGE {E}, 1 {I} — Chosen Hero character gains Challenger +2 and Evasive this turn. (They get +2 {S} while challenging. They can challenge characters with Evasive.)",
  cost: 2,
  cardNumber: 201,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "cded588bc643a1accb5d62c5fb7c6a8644f34ebf",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { chosenHeroCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const imperialBow: LorcanitoItemCard = {
//   id: "mcd",
//   missingTestCase: true,
//   name: "Imperial Bow",
//   characteristics: ["item"],
//   text: "**WITHIN RANGE** {E}, 1 {I} − Chosen Hero character gains **Challenger** +2 and **Evasive** this turn. _(They get +2 {S} while challenging. They can challenge characters with Evasive.)_",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "Within Range",
//       text: "{E}, 1 {I} − Chosen Hero character gains **Challenger** +2 and **Evasive** this turn. _(They get +2 {S} while challenging. They can challenge characters with Evasive.)_",
//       costs: [{ type: "exert" }, { type: "ink", amount: 1 }],
//       effects: [
//         {
//           type: "ability",
//           ability: "challenger",
//           amount: 2,
//           modifier: "add",
//           duration: "turn",
//           target: chosenHeroCharacter,
//         },
//         {
//           type: "ability",
//           ability: "evasive",
//           modifier: "add",
//           duration: "turn",
//           target: chosenHeroCharacter,
//         },
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 2,
//   illustrator: "Yari Lute",
//   number: 201,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 549617,
//   },
//   rarity: "uncommon",
// };
//
