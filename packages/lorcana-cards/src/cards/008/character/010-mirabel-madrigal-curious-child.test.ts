// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { lookAtThisFamily } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { mirabelMadrigalCuriousChild } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Mirabel Madrigal - Curious Child", () => {
//   It("YOU ARE A JEWEL When you play this character, you may reveal a song card in your hand to gain 1 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: mirabelMadrigalCuriousChild.cost,
//       Hand: [lookAtThisFamily, mirabelMadrigalCuriousChild],
//     });
//
//     Await testEngine.playCard(mirabelMadrigalCuriousChild);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ targets: [lookAtThisFamily] });
//
//     Expect(testEngine.getPlayerLore()).toBe(1);
//   });
//
//   It("YOU ARE A JEWEL No reveal, no lore", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: mirabelMadrigalCuriousChild.cost,
//       Hand: [lookAtThisFamily, mirabelMadrigalCuriousChild],
//     });
//
//     Await testEngine.playCard(mirabelMadrigalCuriousChild);
//     Await testEngine.skipTopOfStack();
//
//     Expect(testEngine.getPlayerLore()).toBe(0);
//   });
//
//   It("YOU ARE A JEWEL No song in hand, no lore", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: mirabelMadrigalCuriousChild.cost,
//       Hand: [mirabelMadrigalCuriousChild],
//     });
//
//     Await testEngine.playCard(mirabelMadrigalCuriousChild);
//     Await testEngine.acceptOptionalLayer();
//     Expect(testEngine.stackLayers).toHaveLength(0);
//
//     Expect(testEngine.getPlayerLore()).toBe(0);
//   });
// });
//
