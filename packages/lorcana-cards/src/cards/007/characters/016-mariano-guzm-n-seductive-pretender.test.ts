// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { doloresMadrigalEasyListener } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { marianoGuzmanSeductivePretender } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mariano Guzmán - Seductive Pretender", () => {
//   It("I SEE YOU As long as you have a Dolores Madrigal character in play, this character gets +1 {L}.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [marianoGuzmanSeductivePretender, doloresMadrigalEasyListener],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       MarianoGuzmanSeductivePretender,
//     );
//     Expect(testEngine.getPlayerLore()).toBe(0);
//     CardUnderTest.quest();
//     Expect(testEngine.getPlayerLore()).toBe(2);
//   });
//
//   It("Ensure only 1 lore is gained when Dolores Madrigal is not in play.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [marianoGuzmanSeductivePretender],
//       Hand: [doloresMadrigalEasyListener],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       MarianoGuzmanSeductivePretender,
//     );
//     Expect(testEngine.getPlayerLore()).toBe(0);
//     CardUnderTest.quest();
//     Expect(testEngine.getPlayerLore()).toBe(1);
//   });
// });
//
