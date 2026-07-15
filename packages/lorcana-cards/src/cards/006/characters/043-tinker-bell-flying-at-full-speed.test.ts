// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { tinkerBellFlyingAtFullSpeed } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Tinker Bell - Flying at Full Speed", () => {
//   It.skip("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [tinkerBellFlyingAtFullSpeed],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(tinkerBellFlyingAtFullSpeed);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
// });
//
