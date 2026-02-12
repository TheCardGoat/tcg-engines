// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GeneNicelandResident,
//   JasmineSteadyStrategist,
//   LadyDecisiveDog,
//   RhinoOnesixteenthWolf,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Jasmine - Steady Strategist", () => {
//   It("Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Jasmine.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [jasmineSteadyStrategist],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(jasmineSteadyStrategist);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("ALWAYS PLANNING Whenever this character quests, look at the top 3 cards of your deck. You may reveal an Ally character card and put it into your hand. Put the rest on the bottom of your deck in any order.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: jasmineSteadyStrategist.cost,
//       Play: [jasmineSteadyStrategist],
//       Deck: [geneNicelandResident, rhinoOnesixteenthWolf, ladyDecisiveDog],
//     });
//     Const cardUnderTest = testEngine.getCardModel(jasmineSteadyStrategist);
//     CardUnderTest.quest();
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({
//       Scry: {
//         Hand: [rhinoOnesixteenthWolf],
//         Bottom: [geneNicelandResident, ladyDecisiveDog],
//       },
//     });
//     Expect(testEngine.getCardModel(rhinoOnesixteenthWolf).zone).toBe("hand");
//     Expect(testEngine.getCardModel(geneNicelandResident).zone).toBe("deck");
//     Expect(testEngine.getCardModel(ladyDecisiveDog).zone).toBe("deck");
//   });
// });
//
