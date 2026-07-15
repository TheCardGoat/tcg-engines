// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { deweyLovableShowoff } from "@lorcanito/lorcana-engine/cards/008";
// Import { dumboTheFlyingElephant } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Dumbo - The Flying Elephant", () => {
//   It("Evasive (Only characters with Evasive can challenge this character.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [dumboTheFlyingElephant],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(dumboTheFlyingElephant);
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   It("AERIAL DUO When you play this character, chosen character gains Evasive until the start of your next turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: dumboTheFlyingElephant.cost,
//       Hand: [dumboTheFlyingElephant],
//       Play: [deweyLovableShowoff],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(dumboTheFlyingElephant);
//     Const target = testEngine.getCardModel(deweyLovableShowoff);
//
//     TestEngine.playCard(cardUnderTest);
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.hasEvasive).toBe(true);
//
//     TestEngine.passTurn();
//
//     Expect(target.hasEvasive).toBe(true);
//   });
// });
//
