import type { ItemCard } from "@tcg/lorcana-types";

export const shieldOfArendelle: ItemCard = {
  id: "rd3",
  cardType: "item",
  name: "Shield of Arendelle",
  inkType: ["steel"],
  franchise: "Frozen",
  set: "005",
  text: "DEFLECT Banish this item — Chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
  cost: 1,
  cardNumber: 200,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "629ec024c2e311b02a232a0ba846ef924eb73d12",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   AbilityEffect,
//   LorcanitoItemCard,
// } from "@lorcanito/lorcana-engine";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
//
// export const shieldOfArendelle: LorcanitoItemCard = {
//   id: "ws0",
//   name: "Shield of Arendelle",
//   characteristics: ["item"],
//   text: "**DEFLECT** Banish this item – Chosen character gains **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "Deflect",
//       text: "Banish this item – Chosen character gains **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_",
//       costs: [{ type: "banish" }],
//       effects: [
//         {
//           type: "ability",
//           ability: "resist",
//           amount: 1,
//           modifier: "add",
//           duration: "next_turn",
//           until: true,
//           target: chosenCharacter,
//         } as AbilityEffect,
//       ],
//     },
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 1,
//   illustrator: "Eva Widermann",
//   number: 200,
//   set: "SSK",
//   externalIds: {
//     tcgPlayer: 561851,
//   },
//   rarity: "common",
// };
//
