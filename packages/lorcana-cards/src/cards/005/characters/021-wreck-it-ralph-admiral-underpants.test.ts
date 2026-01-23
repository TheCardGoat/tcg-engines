// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   vanellopeVonSchweetzSugarRushChamp,
//   wreckitRalphAdmiralUnderpants,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Wreck-It Ralph - Admiral Underpants", () => {
//   describe("**I’VE GOT THE COOLEST FRIEND** When you play this character, return a character card from your discard to your hand. If that card is a Princess character card, gain 2 lore.", () => {
//     it("Returning a princess", async () => {
//       const testEngine = new TestEngine({
//         inkwell: wreckitRalphAdmiralUnderpants.cost,
//         hand: [wreckitRalphAdmiralUnderpants],
//         discard: [vanellopeVonSchweetzSugarRushChamp],
//         lore: 0,
//       });
//
//       await testEngine.playCard(wreckitRalphAdmiralUnderpants, {
//         targets: [vanellopeVonSchweetzSugarRushChamp],
//       });
//
//       expect(testEngine.getPlayerLore()).toEqual(2);
//       expect(
//         testEngine.getCardModel(vanellopeVonSchweetzSugarRushChamp).zone,
//       ).toBe("hand");
//     });
//   });
// });
//
