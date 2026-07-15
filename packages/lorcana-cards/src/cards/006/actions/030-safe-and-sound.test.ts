// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { safeAndSound } from "@lorcanito/lorcana-engine/cards/006/actions/actions";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { goonsMaleficent } from "../../001/characters/characters";
// Import { thePhantomBlotShadowyFigure } from "../../007";
//
// Describe("Safe And Sound", () => {
//   It("Chosen character of yours can’t be challenged until the start of your next turn.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: safeAndSound.cost,
//         Play: [goonsMaleficent],
//         Hand: [safeAndSound],
//       },
//       {
//         Inkwell: safeAndSound.cost,
//         Play: [thePhantomBlotShadowyFigure],
//       },
//     );
//
//     Await testEngine.playCard(safeAndSound, { targets: [goonsMaleficent] });
//     Await testEngine.exertCard(goonsMaleficent);
//
//     Await testEngine.passTurn();
//
//     Const cardUnderTest = testEngine.getCardModel(goonsMaleficent);
//     Const challenger = testEngine.getCardModel(thePhantomBlotShadowyFigure);
//
//     Expect(cardUnderTest.canBeChallenged(challenger)).toBe(false);
//
//     Await testEngine.passTurn();
//     Await testEngine.exertCard(goonsMaleficent);
//
//     Await testEngine.passTurn();
//
//     Expect(cardUnderTest.canBeChallenged(challenger)).toBe(true);
//   });
// });
//
