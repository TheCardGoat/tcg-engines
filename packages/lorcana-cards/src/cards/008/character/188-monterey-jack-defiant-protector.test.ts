// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { montereyJackDefiantProtector } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Monterey Jack - Defiant Protector", () => {
//   it.skip("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
//     const testEngine = new TestEngine({
//       play: [montereyJackDefiantProtector],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(montereyJackDefiantProtector);
//     expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
// });
//
