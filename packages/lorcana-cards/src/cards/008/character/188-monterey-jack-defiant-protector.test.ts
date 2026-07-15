// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { montereyJackDefiantProtector } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Monterey Jack - Defiant Protector", () => {
//   It.skip("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [montereyJackDefiantProtector],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(montereyJackDefiantProtector);
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
// });
//
