// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DeweyLovableShowoff,
//   GadgetHackwrenchQuirkyScientist,
//   LouieOneCoolDuck,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Gadget Hackwrench - Quirky Scientist", () => {
//   It("GOLLY! When you play this character, if an opponent has more cards in their hand than you, you may draw a card.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: gadgetHackwrenchQuirkyScientist.cost,
//         Hand: [gadgetHackwrenchQuirkyScientist],
//       },
//       {
//         Hand: [deweyLovableShowoff, louieOneCoolDuck],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(
//       GadgetHackwrenchQuirkyScientist,
//     );
//
//     Await testEngine.playCard(cardUnderTest);
//     Await testEngine.acceptOptionalLayer();
//
//     Expect(testEngine.getCardsByZone("hand").length).toEqual(1);
//   });
//   It("Start with 1 card player one e 1 card player 2", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: gadgetHackwrenchQuirkyScientist.cost,
//         Hand: [gadgetHackwrenchQuirkyScientist],
//       },
//       {
//         Hand: [deweyLovableShowoff],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(
//       GadgetHackwrenchQuirkyScientist,
//     );
//
//     Await testEngine.playCard(cardUnderTest);
//     Await testEngine.acceptOptionalLayer();
//
//     Expect(testEngine.getCardsByZone("hand").length).toEqual(1);
//   });
//   It("Don't Draw", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: gadgetHackwrenchQuirkyScientist.cost,
//         Hand: [gadgetHackwrenchQuirkyScientist],
//       },
//       {
//         Hand: [],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(
//       GadgetHackwrenchQuirkyScientist,
//     );
//
//     Await testEngine.playCard(cardUnderTest);
//
//     Expect(testEngine.getCardsByZone("hand").length).toEqual(0);
//   });
// });
//
