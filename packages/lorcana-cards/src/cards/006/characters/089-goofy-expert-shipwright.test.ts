// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { goofyExpertShipwright } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Goofy - Expert Shipwright", () => {
//   It.skip("Ward (Opponents can't choose this character except to challenge.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [goofyExpertShipwright],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(goofyExpertShipwright);
//     Expect(cardUnderTest.hasWard).toBe(true);
//   });
//
//   It.skip("CLEVER DESIGN Whenever this character quests, chosen character gains Ward until the start of your next turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: goofyExpertShipwright.cost,
//       Play: [goofyExpertShipwright],
//       Hand: [goofyExpertShipwright],
//     });
//
//     Await testEngine.playCard(goofyExpertShipwright);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
