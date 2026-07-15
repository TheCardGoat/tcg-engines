// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MickeyMouseLeaderOfTheBand,
//   PrinceEricSeafaringPrince,
//   UrsulaVanessa,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mickey Mouse - Leader of the Band", () => {
//   It("**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: mickeyMouseLeaderOfTheBand.cost,
//       Play: [mickeyMouseLeaderOfTheBand, ursulaVanessa],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(mickeyMouseLeaderOfTheBand);
//     Const target = testEngine.getCardModel(ursulaVanessa);
//
//     Expect(cardUnderTest.hasAbility("support")).toBe(true);
//     CardUnderTest.quest();
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [target] }, true);
//
//     Expect(target.strength).toBe(3);
//   });
//   It("When you play this character, chosen character gains **Support ** this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: mickeyMouseLeaderOfTheBand.cost,
//       Play: [ursulaVanessa, princeEricSeafaringPrince],
//       Hand: [mickeyMouseLeaderOfTheBand],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(mickeyMouseLeaderOfTheBand);
//     Const target = testEngine.getCardModel(ursulaVanessa);
//     Const target2 = testEngine.getCardModel(princeEricSeafaringPrince);
//
//     CardUnderTest.playFromHand();
//     Await testEngine.resolveTopOfStack({ targets: [target] }, true);
//     Expect(target.hasAbility("support")).toBe(true);
//
//     Target.quest();
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [target2] }, true);
//
//     Expect(target2.strength).toBe(4);
//   });
// });
//
