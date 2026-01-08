// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { safeAndSound } from "@lorcanito/lorcana-engine/cards/006/actions/actions";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// import { goonsMaleficent } from "../../001/characters/characters";
// import { thePhantomBlotShadowyFigure } from "../../007";
//
// describe("Safe And Sound", () => {
//   it("Chosen character of yours can’t be challenged until the start of your next turn.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: safeAndSound.cost,
//         play: [goonsMaleficent],
//         hand: [safeAndSound],
//       },
//       {
//         inkwell: safeAndSound.cost,
//         play: [thePhantomBlotShadowyFigure],
//       },
//     );
//
//     await testEngine.playCard(safeAndSound, { targets: [goonsMaleficent] });
//     await testEngine.exertCard(goonsMaleficent);
//
//     await testEngine.passTurn();
//
//     const cardUnderTest = testEngine.getCardModel(goonsMaleficent);
//     const challenger = testEngine.getCardModel(thePhantomBlotShadowyFigure);
//
//     expect(cardUnderTest.canBeChallenged(challenger)).toBe(false);
//
//     await testEngine.passTurn();
//     await testEngine.exertCard(goonsMaleficent);
//
//     await testEngine.passTurn();
//
//     expect(cardUnderTest.canBeChallenged(challenger)).toBe(true);
//   });
// });
//
