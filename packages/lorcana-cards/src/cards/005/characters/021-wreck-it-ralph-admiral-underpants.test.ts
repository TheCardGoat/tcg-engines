// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   VanellopeVonSchweetzSugarRushChamp,
//   WreckitRalphAdmiralUnderpants,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Wreck-It Ralph - Admiral Underpants", () => {
//   Describe("**I’VE GOT THE COOLEST FRIEND** When you play this character, return a character card from your discard to your hand. If that card is a Princess character card, gain 2 lore.", () => {
//     It("Returning a princess", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: wreckitRalphAdmiralUnderpants.cost,
//         Hand: [wreckitRalphAdmiralUnderpants],
//         Discard: [vanellopeVonSchweetzSugarRushChamp],
//         Lore: 0,
//       });
//
//       Await testEngine.playCard(wreckitRalphAdmiralUnderpants, {
//         Targets: [vanellopeVonSchweetzSugarRushChamp],
//       });
//
//       Expect(testEngine.getPlayerLore()).toEqual(2);
//       Expect(
//         TestEngine.getCardModel(vanellopeVonSchweetzSugarRushChamp).zone,
//       ).toBe("hand");
//     });
//   });
// });
//
