// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { kenaiMagicalBear } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Kenai - Magical Bear", () => {
//   It.skip("Challenger +2 (While challenging, this character gets +2 {}). WISDOM OF HIS STORY During your turn, when this character is banished in a challenge, return this card to your hand and gain 1 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [kenaiMagicalBear],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(kenaiMagicalBear);
//     Expect(cardUnderTest.hasChallenger).toBe(true);
//   });
// });
//
