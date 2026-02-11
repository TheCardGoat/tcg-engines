// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { brunoMadrigalUndetectedUncle } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Bruno Madrigal - Undetected Uncle", () => {
//   It.skip("**Evasive** _(Only characters with Evasive can challenge this character.)_", async () => {
//     Const testEngine = new TestEngine({
//       Play: [brunoMadrigalUndetectedUncle],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(brunoMadrigalUndetectedUncle);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   It.skip("**YOU JUST HAVE TO SEE IT** {E} − Name a card, then reveal the top card of your deck. If it's the named card, put that card into your hand and gain 3 lore. Otherwise, put it on the top of your deck.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: brunoMadrigalUndetectedUncle.cost,
//       Play: [brunoMadrigalUndetectedUncle],
//       Hand: [brunoMadrigalUndetectedUncle],
//     });
//
//     Await testEngine.playCard(brunoMadrigalUndetectedUncle);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
