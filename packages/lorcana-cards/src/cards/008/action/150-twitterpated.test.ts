// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   PatchPlayfulPup,
//   Twitterpated,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Twitterpated", () => {
//   It("Chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: twitterpated.cost,
//       Play: [patchPlayfulPup],
//       Hand: [twitterpated],
//     });
//
//     Expect(testEngine.getCardModel(patchPlayfulPup).hasEvasive).toEqual(false);
//     Await testEngine.playCard(twitterpated);
//
//     Await testEngine.resolveTopOfStack({ targets: [patchPlayfulPup] });
//     Expect(testEngine.getCardModel(patchPlayfulPup).hasEvasive).toEqual(true);
//
//     TestEngine.passTurn();
//     Expect(testEngine.getCardModel(patchPlayfulPup).hasEvasive).toEqual(true);
//
//     TestEngine.passTurn();
//     Expect(testEngine.getCardModel(patchPlayfulPup).hasEvasive).toEqual(false);
//   });
// });
//
