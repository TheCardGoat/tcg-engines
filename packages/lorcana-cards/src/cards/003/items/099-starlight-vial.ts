import type { ItemCard } from "@tcg/lorcana-types";

export const starlightVial: ItemCard = {
  id: "1ec",
  cardType: "item",
  name: "Starlight Vial",
  inkType: ["emerald"],
  franchise: "Lorcana",
  set: "003",
  text: "EFFICIENT ENERGY {E} — You pay 2 {I} less for the next action you play this turn.\nTRAP 2 {I}, Banish this item — Draw 2 cards, then choose and discard a card.",
  cost: 4,
  cardNumber: 99,
  inkable: false,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b54a0a0a6287b0a37be5933c25f861901de4eb52",
  },
  abilities: [],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import {
//   discardACard,
//   drawACard,
//   youPayXLessToPlayNextActionThisTurn,
// } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const starlightVial: LorcanitoItemCard = {
//   id: "f2k",
//   missingTestCase: true,
//   name: "Starlight Vial",
//   characteristics: ["item"],
//   text: "**EFFICIENT ENERGY** {E} – You pay 2 {I} less for the next action you play this turn.\n\n\n**TRAP** 2 {I}, Banish this item – Draw 2 cards, then choose and discard a card.",
//   type: "item",
//   abilities: [
//     {
//       type: "activated",
//       costs: [{ type: "ink", amount: 2 }, { type: "banish" }],
//       name: "Trap",
//       text: "2 {I}, Banish this item – Draw 2 cards, then choose and discard a card.",
//       resolveEffectsIndividually: true,
//       effects: [discardACard, drawACard, drawACard],
//     },
//     {
//       type: "activated",
//       name: "**EFFICIENT ENERGY**",
//       costs: [{ type: "exert" }],
//       text: "{E} – You pay 2 {I} less for the next action you play this turn.",
//       effects: [youPayXLessToPlayNextActionThisTurn(2)],
//     },
//   ],
//   flavour: "In the wrong hands, this vial of magic could be disastrous.",
//   colors: ["emerald"],
//   illustrator: "Billy Wimblett",
//   number: 99,
//   set: "ITI",
//   externalIds: {
//     tcgPlayer: 539086,
//   },
//   rarity: "rare",
//   cost: 4,
// };
//
