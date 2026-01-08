// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   patchPlayfulPup,
//   twitterpated,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Twitterpated", () => {
//   it("Chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)", async () => {
//     const testEngine = new TestEngine({
//       inkwell: twitterpated.cost,
//       play: [patchPlayfulPup],
//       hand: [twitterpated],
//     });
//
//     expect(testEngine.getCardModel(patchPlayfulPup).hasEvasive).toEqual(false);
//     await testEngine.playCard(twitterpated);
//
//     await testEngine.resolveTopOfStack({ targets: [patchPlayfulPup] });
//     expect(testEngine.getCardModel(patchPlayfulPup).hasEvasive).toEqual(true);
//
//     testEngine.passTurn();
//     expect(testEngine.getCardModel(patchPlayfulPup).hasEvasive).toEqual(true);
//
//     testEngine.passTurn();
//     expect(testEngine.getCardModel(patchPlayfulPup).hasEvasive).toEqual(false);
//   });
// });
//
