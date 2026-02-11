// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   DrFacilierSavvyOpportunist,
//   MadamMimRivalOfMerlin,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { pegasusFlyingSteed } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Madam Mim - Rival of Merlin", () => {
//   It("**GRUESOME AND GRIM** {E} − Play a character with cost 4 or less for free. They gain **Rush**. At the end of the turn, banish them. _They can challenge the turn they're played._'", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Hand: [drFacilierSavvyOpportunist],
//         Play: [madamMimRivalOfMerlin],
//         Deck: 1,
//       },
//       {
//         Deck: 2,
//         Play: [pegasusFlyingSteed],
//       },
//     );
//
//     Await testEngine.activateCard(madamMimRivalOfMerlin, {
//       Targets: [drFacilierSavvyOpportunist],
//     });
//
//     Expect(testEngine.getCardModel(drFacilierSavvyOpportunist).hasRush).toBe(
//       True,
//     );
//
//     Await testEngine.passTurn();
//
//     Expect(testEngine.getCardModel(madamMimRivalOfMerlin).zone).toBe("play");
//     Expect(testEngine.getCardModel(pegasusFlyingSteed).zone).toBe("play");
//     Expect(testEngine.getCardModel(drFacilierSavvyOpportunist).zone).toBe(
//       "discard",
//     );
//   });
//
//   It("Shift", () => {
//     Const testEngine = new TestEngine({
//       Play: [madamMimRivalOfMerlin],
//     });
//
//     Expect(testEngine.getCardModel(madamMimRivalOfMerlin).hasShift).toBe(true);
//   });
// });
//
