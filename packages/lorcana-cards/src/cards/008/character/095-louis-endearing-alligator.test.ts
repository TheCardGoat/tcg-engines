// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DeweyLovableShowoff,
//   LouisEndearingAlligator,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Louis - Endearing Alligator", () => {
//   It("SENSITIVE SOUL This character enters play exerted.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: louisEndearingAlligator.cost,
//       Hand: [louisEndearingAlligator],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(louisEndearingAlligator);
//
//     Await testEngine.playCard(cardUnderTest);
//     Await testEngine.resolveTopOfStack({}, true);
//     Await testEngine.resolveTopOfStack({}, true);
//
//     Expect(cardUnderTest.exerted).toEqual(true);
//   });
//
//   It("FRIENDLIER THAN HE LOOKS When you play this character, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: louisEndearingAlligator.cost,
//         Hand: [louisEndearingAlligator],
//       },
//       {
//         Play: [deweyLovableShowoff],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(louisEndearingAlligator);
//     Const target = testEngine.getCardModel(deweyLovableShowoff);
//
//     Await testEngine.playCard(cardUnderTest);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.hasReckless).toEqual(false);
//
//     Await testEngine.passTurn();
//
//     Expect(target.hasReckless).toEqual(true);
//   });
//
//   It("Future effect flag is set", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: louisEndearingAlligator.cost,
//         Hand: [louisEndearingAlligator],
//       },
//       {
//         Play: [deweyLovableShowoff],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(louisEndearingAlligator);
//     Const target = testEngine.getCardModel(deweyLovableShowoff);
//
//     Await testEngine.playCard(cardUnderTest);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.hasFutureEffects).toEqual(true);
//     Await testEngine.passTurn();
//     Expect(target.hasFutureEffects).toEqual(false);
//   });
// });
//
