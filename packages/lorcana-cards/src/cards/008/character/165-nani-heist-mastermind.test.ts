// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { liloEscapeArtist } from "@lorcanito/lorcana-engine/cards/006";
// Import { naniHeistMastermind } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Nani - Heist Mastermind", () => {
//   It("STICK TO THE PLAN {E} – Another chosen character gains Resist +2 this turn. (Damage dealt to them is reduced by 2.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: naniHeistMastermind.cost,
//       Play: [naniHeistMastermind, liloEscapeArtist],
//       Hand: [],
//     });
//
//     Await testEngine.activateCard(naniHeistMastermind, {
//       Ability: "STICK TO THE PLAN",
//       Targets: [liloEscapeArtist],
//     });
//     Expect(testEngine.getCardModel(liloEscapeArtist).hasResist).toBe(true);
//   });
//
//   It("IT'S UP TO YOU, LILO Your characters named Lilo gain Support. (Whenever they quest, you may add their {S} to another chosen character's {S} this turn.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: naniHeistMastermind.cost,
//       Play: [naniHeistMastermind, liloEscapeArtist],
//       Hand: [],
//     });
//
//     Expect(testEngine.getCardModel(liloEscapeArtist).hasSupport).toBe(true);
//   });
// });
//
