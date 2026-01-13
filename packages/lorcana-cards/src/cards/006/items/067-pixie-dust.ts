import type { ItemCard } from "@tcg/lorcana-types";

export const pixieDust: ItemCard = {
  id: "100",
  cardType: "item",
  name: "Pixie Dust",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "006",
  text: "FAITH AND TRUST {E}, {2} {I} - Chosen character gains Challenger +2 and Evasive until the start of your next turn. (While challenging, they get +2 {1}. Only characters with Evasive can challenge them.)",
  cost: 4,
  cardNumber: 67,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "81bfe47645b7451e9719f784418d39de85304651",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { faithAndTrust } from "@lorcanito/lorcana-engine/cards/006/items/abilities";
//
// export const pixieDust: LorcanitoItemCard = {
//   id: "t1s",
//   missingTestCase: true,
//   name: "Pixie Dust",
//   characteristics: ["item"],
//   text: "FAITH AND TRUST {E}, {2} {I} - Chosen character gains Challenger +2 and Evasive until the start of your next turn. (While challenging, they get +2 {1}. Only characters with Evasive can challenge them.)",
//   type: "item",
//   abilities: [faithAndTrust],
//   inkwell: false,
//   colors: ["amethyst"],
//   cost: 4,
//   illustrator: "Ellie Horie / Mara Tango",
//   number: 67,
//   set: "006",
//   externalIds: {
//     tcgPlayer: 583854,
//   },
//   rarity: "uncommon",
// };
//
