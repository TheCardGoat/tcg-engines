// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { winnieThePoohHoneyPirateLookout } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Winnie the Pooh - Honey Pirate Lookout", () => {
//   It.skip("Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [winnieThePoohHoneyPirateLookout],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       WinnieThePoohHoneyPirateLookout,
//     );
//     Expect(cardUnderTest.hasSupport).toBe(true);
//   });
//
//   It.skip("WE'RE PIRATES, YOU SEE Whenever this character quests, the next Pirate character you play this turn costs 1 {I} less.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: winnieThePoohHoneyPirateLookout.cost,
//       Play: [winnieThePoohHoneyPirateLookout],
//       Hand: [winnieThePoohHoneyPirateLookout],
//     });
//
//     Await testEngine.playCard(winnieThePoohHoneyPirateLookout);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
