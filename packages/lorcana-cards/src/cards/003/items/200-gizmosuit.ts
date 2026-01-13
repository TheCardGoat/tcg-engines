import type { ItemCard } from "@tcg/lorcana-types";

export const gizmosuit: ItemCard = {
  id: "1ip",
  cardType: "item",
  name: "Gizmosuit",
  inkType: ["steel"],
  franchise: "Ducktales",
  set: "003",
  text: "CYBERNETIC ARMOR Banish this item — Chosen character gains Resist +2 until the start of your next turn. (Damage dealt to them is reduced by 2.)",
  cost: 3,
  cardNumber: 200,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c52fabcec115b588f6fb5dd2bbc1529632fb8b72",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
//
// export const gizmosuit: LorcanitoItemCard = {
//   id: "f01",
//   missingTestCase: true,
//   name: "Gizmosuit",
//   characteristics: ["item"],
//   text: "**CYBERNETIC ARMOR** Banish this item – Chosen character gains **Resist** +2 until the start of your next turn. (Damage dealt to them is reduced by 2.)",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       costs: [{ type: "banish" }],
//       text: "Banish this item – Chosen character gains **Resist** +2 until the start of your next turn. (Damage dealt to them is reduced by 2.)",
//       effects: [
//         {
//           type: "ability",
//           ability: "resist",
//           amount: 2,
//           modifier: "add",
//           duration: "next_turn",
//           until: true,
//           target: chosenCharacter,
//         },
//       ],
//     },
//   ],
//   flavour:
//     "It stands in the Hall of Lorcana, waiting for someone to speak the secret words.",
//   inkwell: true,
//   colors: ["steel"],
//   cost: 3,
//   illustrator: "Dustin Panzino",
//   number: 200,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 538292,
//   },
//   rarity: "common",
// };
//
