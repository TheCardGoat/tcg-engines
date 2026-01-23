import type { ItemCard } from "@tcg/lorcana-types";

export const plateArmor: ItemCard = {
  id: "14f",
  cardType: "item",
  name: "Plate Armor",
  inkType: ["steel"],
  franchise: "Sword in the Stone",
  set: "005",
  text: "WELL CRAFTED {E} — Chosen character gains Resist +2 until the start of your next turn. (Damage dealt to them is reduced by 2.)",
  cost: 4,
  cardNumber: 201,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "915ef4e692a5bc97a06aca3c141fd01f48a150b1",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacterGainsResist } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const plateArmor: LorcanitoItemCard = {
//   id: "pwi",
//   missingTestCase: true,
//   name: "Plate Armor",
//   characteristics: ["item"],
//   text: "**WELL CRAFTED** {E} – Chosen character gains **Resist** +2 until the start of your next turn. _(Damage dealt to them is reduced by 2.)_",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "Well Crafted",
//       text: " {E} – Chosen character gains **Resist** +2 until the start of your next turn. _(Damage dealt to them is reduced by 2.)_",
//       costs: [{ type: "exert" }],
//       effects: [chosenCharacterGainsResist(2)],
//     },
//   ],
//   colors: ["steel"],
//   cost: 4,
//   illustrator: "Gaku Kumatori",
//   number: 201,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561195,
//   },
//   rarity: "rare",
// };
//
