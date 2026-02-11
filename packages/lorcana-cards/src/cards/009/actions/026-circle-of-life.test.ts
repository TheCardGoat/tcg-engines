// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { deweyLovableShowoff } from "@lorcanito/lorcana-engine/cards/008";
// Import { circleOfLife } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Circle Of Life", () => {
//   It.skip("Sing Together 8 (Any number of your or your teammates' characters with total cost 8 or more may {E} to sing this song for free.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: circleOfLife.cost,
//       Play: [circleOfLife],
//       Hand: [circleOfLife],
//     });
//
//     Await testEngine.playCard(circleOfLife);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
//
//   It("Play a character from your discard for free.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: circleOfLife.cost,
//       Discard: [deweyLovableShowoff],
//       Hand: [circleOfLife],
//     });
//
//     Const targetCard = testEngine.getCardModel(deweyLovableShowoff);
//     Const cardUnderTest = testEngine.getCardModel(circleOfLife);
//
//     Await testEngine.playCard(cardUnderTest);
//
//     Await testEngine.resolveTopOfStack({ targets: [targetCard] });
//
//     Expect(targetCard.zone).toEqual("play");
//   });
// });
//
