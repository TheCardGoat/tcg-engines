import type { ItemCard } from "@tcg/lorcana-types";

export const theLamp: ItemCard = {
  id: "1ik",
  cardType: "item",
  name: "The Lamp",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "003",
  text: "GOOD OR EVIL Banish this item — If you have a character named Jafar in play, draw 2 cards. If you have a character named Genie in play, return chosen character with cost 4 or less to their player's hand.",
  cost: 2,
  cardNumber: 64,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c3691753bf9b5b6ef060569d9c6f8fa67de42e66",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { ifYouHaveCharacterNamed } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { self } from "@lorcanito/lorcana-engine/abilities/targets";
// import { returnChosenCharacterWithCostLess } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const theLamp: LorcanitoItemCard = {
//   id: "byw",
//   name: "The Lamp",
//   characteristics: ["item"],
//   text: "**GOOD OR EVIL** Banish this item – If you have a character named Jafar in play, draw 2 cards. If you have a character named Genie in play, return chosen character with cost 4 or less to their player's hand.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       name: "GOOD OR EVIL",
//       text: "Banish this item – If you have a character named Jafar in play, draw 2 cards. If you have a character named Genie in play, return chosen character with cost 4 or less to their player's hand.",
//       costs: [{ type: "banish" }],
//       resolveEffectsIndividually: true,
//       effects: [
//         {
//           type: "draw",
//           amount: 2,
//           target: self,
//           conditions: [ifYouHaveCharacterNamed("Jafar")],
//         },
//         {
//           ...returnChosenCharacterWithCostLess(4),
//           conditions: [ifYouHaveCharacterNamed("Genie")],
//         },
//       ],
//     },
//   ],
//   colors: ["amethyst"],
//   illustrator: "Ever Galvez / Anna Stosik",
//   number: 64,
//   cost: 2,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 539079,
//   },
//   rarity: "rare",
// };
//
