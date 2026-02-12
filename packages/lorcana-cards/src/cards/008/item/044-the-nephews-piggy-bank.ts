// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// Import type { LorcanitoItemCard } from "@lorcanito/lorcana-engine";
// Import { ifYouHaveCharacterNamed } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
// Import { whenYouPlayThisForEachYouPayLess } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// Import { chosenCharacterGetsStrength } from "@lorcanito/lorcana-engine/effects/effects";
//
// Export const theNephewsPiggyBank: LorcanitoItemCard = {
//   Id: "s8i",
//   MissingTestCase: true,
//   Name: "The Nephews' Piggy Bank",
//   Characteristics: ["item"],
//   Text: "INSIDE JOB If you have a character named Donald Duck in play, you pay 1 {I} less to play this item.\nPAYOFF {e} – Chosen character gets -1 {S} until the start of your next turn.",
//   Type: "item",
//   Inkwell: false,
//   Colors: ["amber"],
//   Cost: 2,
//   Illustrator: "Jeremy Adams",
//   Number: 44,
//   Set: "008",
//   ExternalIds: {
//     TcgPlayer: 631335,
//   },
//   Rarity: "uncommon",
//   Abilities: [
//     WhenYouPlayThisForEachYouPayLess({
//       Name: "INSIDE JOB",
//       Text: "If you have a character named Donald Duck in play, you pay 1 {I} less to play this item.",
//       Amount: 1,
//       Conditions: [ifYouHaveCharacterNamed("Donald Duck")],
//     }),
//     {
//       Type: "activated",
//       Name: "PAYOFF",
//       Text: "{e} – Chosen character gets -1 {S} until the start of your next turn.",
//       Costs: [{ type: "exert" }],
//       Effects: [chosenCharacterGetsStrength(-1, "next_turn")],
//     },
//   ],
// };
//
