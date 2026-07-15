// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { sapphireChromicon } from "@lorcanito/lorcana-engine/cards/005/items/items";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Sapphire Chromicon", () => {
//   It.skip("**POWERING UP** This item enters play exerted.", () => {
//     Const testEngine = new TestEngine({
//       Inkwell: sapphireChromicon.cost,
//       Play: [sapphireChromicon],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(sapphireChromicon);
//
//     CardUnderTest.playFromHand();
//     TestEngine.resolveOptionalAbility();
//     TestEngine.resolveTopOfStack({});
//   });
//
//   It("**SAPPHIRE LIGHT** {E}, 2 {I}, Banish one of your items – Gain 2 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: sapphireChromicon.cost + pawpsicle.cost,
//       Play: [sapphireChromicon, pawpsicle],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(sapphireChromicon);
//     Const target = testEngine.getCardModel(pawpsicle);
//     Expect(testEngine.getPlayerLore()).toBe(0);
//
//     CardUnderTest.activate();
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//
//     Expect(testEngine.getCardZone(cardUnderTest)).toBe("play");
//     Expect(testEngine.getCardZone(target)).toBe("discard");
//     Expect(testEngine.getPlayerLore()).toBe(2);
//   });
// });
//
