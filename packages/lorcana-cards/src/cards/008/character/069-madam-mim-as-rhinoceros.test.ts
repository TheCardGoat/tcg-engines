// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DeweyLovableShowoff,
//   MadamMimAsRhinoceros,
//   MadamMimUpToNoGood,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Madam Mim - As Rhinoceros", () => {
//   It("SHIFT 2 (You can pay 2 {I} to play this character on one of your Madame Mime characters.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: madamMimAsRhinoceros.cost,
//       Hand: [madamMimAsRhinoceros],
//       Play: [madamMimUpToNoGood, deweyLovableShowoff],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(madamMimAsRhinoceros);
//     Const target1 = testEngine.getCardModel(madamMimUpToNoGood);
//     Const target2 = testEngine.getCardModel(deweyLovableShowoff);
//
//     Await testEngine.playCard(cardUnderTest);
//
//     Await testEngine.resolveTopOfStack({ targets: [target1] }, true); // Shift onto Madam Mim
//     Await testEngine.resolveTopOfStack({ targets: [target2] }, true); // Return Dewey to hand
//
//     Expect(cardUnderTest.zone).toEqual("play");
//     Expect(target1.zone).toEqual("play");
//     Expect(target2.zone).toEqual("hand");
//   });
//
//   Describe("MAKE WAY, I'M COMING! When you play this character, banish it or return one of your other characters in play to your hand.", () => {
//     It("return another chosen character of yours to your hand.", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: madamMimAsRhinoceros.cost,
//         Hand: [madamMimAsRhinoceros],
//         Play: [deweyLovableShowoff],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(madamMimAsRhinoceros);
//       Const target = testEngine.getCardModel(deweyLovableShowoff);
//
//       Await testEngine.playCard(cardUnderTest);
//       Await testEngine.resolveTopOfStack({ skip: true }, true); // Skip shift effect
//       Await testEngine.resolveTopOfStack({ targets: [target] }, true); // Return Dewey to hand
//
//       Expect(target.zone).toEqual("hand");
//     });
//
//     It("skipping the effect banishes her.", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: madamMimAsRhinoceros.cost,
//         Hand: [madamMimAsRhinoceros],
//         Play: [deweyLovableShowoff],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(madamMimAsRhinoceros);
//       Const target = testEngine.getCardModel(deweyLovableShowoff);
//
//       Await testEngine.playCard(cardUnderTest);
//       Await testEngine.skipTopOfStack();
//
//       Expect(cardUnderTest.zone).toEqual("discard");
//       Expect(target.zone).toEqual("play");
//     });
//   });
//
//   It("MAKE WAY, I'M COMING! When you play this character, banish it or return one of your other characters in play to your hand.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: madamMimAsRhinoceros.cost,
//       Hand: [madamMimAsRhinoceros],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(madamMimAsRhinoceros);
//
//     Await testEngine.playCard(cardUnderTest);
//     Await testEngine.acceptOptionalLayer();
//
//     Expect(cardUnderTest.zone).toEqual("discard");
//   });
// });
//
