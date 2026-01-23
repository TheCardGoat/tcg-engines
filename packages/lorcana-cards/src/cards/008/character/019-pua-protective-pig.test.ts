// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { puaProtectivePig } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Pua - Protective Pig", () => {
//   it("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
//     const testEngine = new TestEngine({
//       play: [puaProtectivePig],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(puaProtectivePig);
//     expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
//
//   it("FREE FRUIT When this character is banished, you may draw a card.", async () => {
//     const testEngine = new TestEngine({
//       play: [puaProtectivePig],
//     });
//
//     const cardToTest = testEngine.getCardModel(puaProtectivePig);
//
//     cardToTest.banish();
//
//     await testEngine.resolveOptionalAbility();
//
//     expect(testEngine.getCardsByZone("hand").length).toBe(1);
//     // await testEngine.resolveTopOfStack({});
//   });
// });
//
