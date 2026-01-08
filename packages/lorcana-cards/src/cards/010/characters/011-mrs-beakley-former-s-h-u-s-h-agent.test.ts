// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mrsBeakleyFormerShushAgent } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Mrs. Beakley - Former S.H.U.S.H. Agent", () => {
//   it("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
//     const testEngine = new TestEngine({
//       play: [mrsBeakleyFormerShushAgent],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(mrsBeakleyFormerShushAgent);
//     expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
// });
//
