import type { ItemCard } from "@tcg/lorcana-types";

export const medalOfHeroes: ItemCard = {
  id: "b7p",
  cardType: "item",
  name: "Medal of Heroes",
  inkType: ["sapphire"],
  franchise: "Wreck It Ralph",
  set: "005",
  text: "CONGRATULATIONS, SOLDIER {E}, 2 {I}, Banish this item — Chosen character of yours gets +2 {L} this turn.",
  cost: 2,
  cardNumber: 165,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "286a732f67c5d41fdf485c1310e810e1f5b650f5",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacterGetLoreThisTurn } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const medalOfHeroes: LorcanitoItemCard = {
//   id: "xz9",
//   missingTestCase: true,
//   name: "Medal of Heroes",
//   characteristics: ["item"],
//   text: "**CONGRATULATIONS, SOLDIER**{E}, 2 {I}, Banish this item − Chosen character of yours gets +2 {L} this turn.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "Congratulations, Soldier",
//       text: "{E}, 2 {I}, Banish this item − Chosen character of yours gets +2 {L} this turn.",
//       costs: [{ type: "ink", amount: 2 }, { type: "banish" }],
//       effects: [chosenCharacterGetLoreThisTurn(2)],
//     },
//   ],
//   flavour:
//     "You have etched in the rock of virtue a legacy beyond compare.\n–General Hologram",
//   inkwell: true,
//   colors: ["sapphire"],
//   cost: 2,
//   illustrator: "Toni Bruno",
//   number: 165,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 559711,
//   },
//   rarity: "common",
// };
//
