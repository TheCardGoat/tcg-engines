// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { jebidiahFarnsworthExpeditionCook } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Jebidiah Farnsworth - Expedition Cook", () => {
//   It.skip("Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [jebidiahFarnsworthExpeditionCook],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(
//       JebidiahFarnsworthExpeditionCook,
//     );
//     Expect(cardUnderTest.hasSupport).toBe(true);
//   });
//
//   It.skip("I GOT YOUR FOUR BASIC FOOD GROUPS When you play this character, chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: jebidiahFarnsworthExpeditionCook.cost,
//       Hand: [jebidiahFarnsworthExpeditionCook],
//     });
//
//     Await testEngine.playCard(jebidiahFarnsworthExpeditionCook);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
