// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { druunRavenousPlague } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Druun - Ravenous Plague", () => {
//   It("Challenger +4 (While challenging, this character gets +4 {S}.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [druunRavenousPlague],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(druunRavenousPlague);
//     Expect(cardUnderTest.hasChallenger).toBe(true);
//   });
// });
//
