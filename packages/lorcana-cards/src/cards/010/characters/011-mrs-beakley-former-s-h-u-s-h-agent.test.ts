// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mrsBeakleyFormerShushAgent } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mrs. Beakley - Former S.H.U.S.H. Agent", () => {
//   It("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [mrsBeakleyFormerShushAgent],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(mrsBeakleyFormerShushAgent);
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
// });
//
