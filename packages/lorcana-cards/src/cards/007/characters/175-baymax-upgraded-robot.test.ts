// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { baymaxUpgradedRobot } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Baymax - Upgraded Robot", () => {
//   It.skip("Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [baymaxUpgradedRobot],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(baymaxUpgradedRobot);
//     Expect(cardUnderTest.hasSupport).toBe(true);
//   });
//
//   It.skip("ADVANCED SCANNER When you play this character, look at the top 4 cards of your deck. You may reveal a Floodborn character card and put it into your hand. Put the rest on the bottom of your deck in any order.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: baymaxUpgradedRobot.cost,
//       Hand: [baymaxUpgradedRobot],
//     });
//
//     Await testEngine.playCard(baymaxUpgradedRobot);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
