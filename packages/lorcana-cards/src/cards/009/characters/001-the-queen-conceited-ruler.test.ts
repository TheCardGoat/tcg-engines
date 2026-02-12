// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   CharlotteLaBouffMardiGrasPrincess,
//   DeweyLovableShowoff,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { theQueenConceitedRuler } from "@lorcanito/lorcana-engine/cards/009";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Queen - Conceited Ruler", () => {
//   It("Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [theQueenConceitedRuler],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(theQueenConceitedRuler);
//     Expect(cardUnderTest.hasSupport).toBe(true);
//   });
//
//   It("ROYAL SUMMONS At the start of your turn, you may choose and discard a Princess or Queen character card to return a character card from your discard to your hand.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [theQueenConceitedRuler],
//       Hand: [charlotteLaBouffMardiGrasPrincess],
//       Discard: [deweyLovableShowoff],
//     });
//
//     Await testEngine.passTurn();
//     Await testEngine.passTurn();
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack(
//       { targets: [charlotteLaBouffMardiGrasPrincess] },
//       True,
//     );
//
//     Expect(
//       TestEngine.getCardModel(charlotteLaBouffMardiGrasPrincess).zone,
//     ).toBe("discard");
//
//     Await testEngine.resolveTopOfStack({ targets: [deweyLovableShowoff] });
//
//     Expect(testEngine.getCardModel(deweyLovableShowoff).zone).toBe("hand");
//   });
// });
//
