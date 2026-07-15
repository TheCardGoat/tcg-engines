// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mauiHalfshark } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Maui - Half-Shark", () => {
//   It.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [mauiHalfshark],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(mauiHalfshark);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   It.skip("CHEEEEOHOOOO! Whenever this character challenges another character, you may return an action card from your discard to your hand.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: mauiHalfshark.cost,
//       Play: [mauiHalfshark],
//       Hand: [mauiHalfshark],
//     });
//
//     Await testEngine.playCard(mauiHalfshark);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It.skip("WAYFINDING Whenever you play an action, gain 1 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: mauiHalfshark.cost,
//       Play: [mauiHalfshark],
//       Hand: [mauiHalfshark],
//     });
//
//     Await testEngine.playCard(mauiHalfshark);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
