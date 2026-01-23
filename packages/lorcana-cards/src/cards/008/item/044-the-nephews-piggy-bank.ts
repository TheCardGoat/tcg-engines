// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// import { ifYouHaveCharacterNamed } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import { chosenCharacterGetsStrength } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const theNephewsPiggyBank: LorcanitoItemCard = {
//   id: "s8i",
//   missingTestCase: true,
//   name: "The Nephews' Piggy Bank",
//   characteristics: ["item"],
//   text: "INSIDE JOB If you have a character named Donald Duck in play, you pay 1 {I} less to play this item.\nPAYOFF {e} – Chosen character gets -1 {S} until the start of your next turn.",
//   type: "item",
//   inkwell: false,
//   colors: ["amber"],
//   cost: 2,
//   illustrator: "Jeremy Adams",
//   number: 44,
//   set: "008",
//   externalIds: {
//     tcgPlayer: 631335,
//   },
//   rarity: "uncommon",
//   abilities: [
//     whenYouPlayThisForEachYouPayLess({
//       name: "INSIDE JOB",
//       text: "If you have a character named Donald Duck in play, you pay 1 {I} less to play this item.",
//       amount: 1,
//       conditions: [ifYouHaveCharacterNamed("Donald Duck")],
//     }),
//     {
//       type: "activated",
//       name: "PAYOFF",
//       text: "{e} – Chosen character gets -1 {S} until the start of your next turn.",
//       costs: [{ type: "exert" }],
//       effects: [chosenCharacterGetsStrength(-1, "next_turn")],
//     },
//   ],
// };
//
