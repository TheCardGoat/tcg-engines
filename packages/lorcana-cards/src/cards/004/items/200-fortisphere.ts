import type { ItemCard } from "@tcg/lorcana-types";

export const fortisphere: ItemCard = {
  id: "s5n",
  cardType: "item",
  name: "Fortisphere",
  inkType: ["steel"],
  franchise: "Lorcana",
  set: "004",
  text: "RESOURCEFUL When you play this item, you may draw a card.\nEXTRACT OF STEEL 1 {I}, Banish this item — Chosen character of yours gains Bodyguard until the start of your next turn. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cost: 1,
  cardNumber: 200,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "657a90059a6feb1b954c3f1140bec62e1776e73d",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type {
//   AbilityEffect,
//   LorcanitoItemCard,
// } from "@lorcanito/lorcana-engine";
// import type { ActivatedAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
// import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
// import { whenYouPlayMayDrawACard } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
//
// export const fortisphere: LorcanitoItemCard = {
//   id: "id0",
//   name: "Fortisphere",
//   characteristics: ["item"],
//   text: "**RESOURCEFUL** When you play this item, you may draw a card.\n\n\n**EXTRACT OF STEEL** 1 {I}, Banish this item - Chosen character of yours gains **Bodyguard** until the start of your next turn. _(An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_",
//   type: "item",
//   abilities: [
//     {
//       ...whenYouPlayMayDrawACard,
//       name: "RESOURCEFUL",
//       text: "**RESOURCEFUL** When you play this item, you may draw a card.",
//     },
//     {
//       type: "activated",
//       name: "EXTRACT OF STEEL",
//       text: "1 {I}, Banish this item - Chosen character of yours gains **Bodyguard** until the start of your next turn. _(An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_",
//       costs: [{ type: "ink", amount: 1 }, { type: "banish" }],
//       effects: [
//         {
//           type: "ability",
//           ability: "bodyguard",
//           modifier: "add",
//           duration: "next_turn",
//           until: true,
//           target: chosenCharacter,
//         } as AbilityEffect,
//       ],
//     } as ActivatedAbility,
//   ],
//   inkwell: true,
//   colors: ["steel"],
//   cost: 1,
//   illustrator: "Mariana Moreno Ayala",
//   number: 200,
//   set: "URR",
//   externalIds: {
//     tcgPlayer: 550626,
//   },
//   rarity: "common",
// };
//
