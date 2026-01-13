// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { aliceSavvySailor } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Alice - Savvy Sailor", () => {
//   it.skip("Ward (Opponents can't choose this character except to challenge.)", async () => {
//     const testEngine = new TestEngine({
//       play: [aliceSavvySailor],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(aliceSavvySailor);
//     expect(cardUnderTest.hasWard).toBe(true);
//   });
//
//   it.skip("AHOY! Whenever this character quests, another chosen character of yours gets +1 {L} and gains Ward until the start of your next turn.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: aliceSavvySailor.cost,
//       play: [aliceSavvySailor],
//       hand: [aliceSavvySailor],
//     });
//
//     await testEngine.playCard(aliceSavvySailor);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
