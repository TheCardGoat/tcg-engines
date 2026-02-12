// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { puaProtectivePig } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Pua - Protective Pig", () => {
//   It("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [puaProtectivePig],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(puaProtectivePig);
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
//
//   It("FREE FRUIT When this character is banished, you may draw a card.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [puaProtectivePig],
//     });
//
//     Const cardToTest = testEngine.getCardModel(puaProtectivePig);
//
//     CardToTest.banish();
//
//     Await testEngine.resolveOptionalAbility();
//
//     Expect(testEngine.getCardsByZone("hand").length).toBe(1);
//     // await testEngine.resolveTopOfStack({});
//   });
// });
//
