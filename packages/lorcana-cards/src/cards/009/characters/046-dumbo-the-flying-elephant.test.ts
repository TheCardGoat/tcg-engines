// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { deweyLovableShowoff } from "@lorcanito/lorcana-engine/cards/008";
// import { dumboTheFlyingElephant } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Dumbo - The Flying Elephant", () => {
//   it("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     const testEngine = new TestEngine({
//       play: [dumboTheFlyingElephant],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(dumboTheFlyingElephant);
//     expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   it("AERIAL DUO When you play this character, chosen character gains Evasive until the start of your next turn.", async () => {
//     const testEngine = new TestEngine({
//       inkwell: dumboTheFlyingElephant.cost,
//       hand: [dumboTheFlyingElephant],
//       play: [deweyLovableShowoff],
//     });
//
//     const cardUnderTest = testEngine.getCardModel(dumboTheFlyingElephant);
//     const target = testEngine.getCardModel(deweyLovableShowoff);
//
//     testEngine.playCard(cardUnderTest);
//     await testEngine.resolveTopOfStack({ targets: [target] });
//
//     expect(target.hasEvasive).toBe(true);
//
//     testEngine.passTurn();
//
//     expect(target.hasEvasive).toBe(true);
//   });
// });
//
