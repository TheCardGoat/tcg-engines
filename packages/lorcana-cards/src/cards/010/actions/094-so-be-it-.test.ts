// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyMouseArtfulRogue } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { dingleHopper } from "@lorcanito/lorcana-engine/cards/001/items/items";
// Import {
//   BalooFriendAndGuardian,
//   SoBeIt,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("So Be It!", () => {
//   Describe("Each of your characters gets +1 strength this turn", () => {
//     It("should give all your characters +1 strength when played", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: soBeIt.cost,
//           Hand: [soBeIt],
//           Play: [balooFriendAndGuardian, mickeyMouseArtfulRogue],
//         },
//         {},
//       );
//
//       Const baloo = testEngine.getCardModel(balooFriendAndGuardian);
//       Const mickey = testEngine.getCardModel(mickeyMouseArtfulRogue);
//
//       Const balooOriginalStrength = baloo.strength;
//       Const mickeyOriginalStrength = mickey.strength;
//
//       Await testEngine.playCard(soBeIt);
//
//       // The stack should be automatically resolved since the attribute effect has no targets
//
//       Expect(baloo.strength).toBe(balooOriginalStrength + 1);
//       Expect(mickey.strength).toBe(mickeyOriginalStrength + 1);
//     });
//
//     It("should not affect opponent's characters", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: soBeIt.cost,
//           Hand: [soBeIt],
//           Play: [balooFriendAndGuardian],
//         },
//         {
//           Play: [mickeyMouseArtfulRogue],
//         },
//       );
//
//       Const baloo = testEngine.getCardModel(balooFriendAndGuardian);
//       Const opponentMickey = testEngine.getCardModel(mickeyMouseArtfulRogue);
//
//       Const balooOriginalStrength = baloo.strength;
//       Const opponentMickeyOriginalStrength = opponentMickey.strength;
//
//       Await testEngine.playCard(soBeIt);
//
//       Expect(baloo.strength).toBe(balooOriginalStrength + 1);
//       Expect(opponentMickey.strength).toBe(opponentMickeyOriginalStrength);
//     });
//
//     // TODO: Investigate continuous effect duration handling
//     // The buff with duration: "turn" should expire, but currently persists
//     It.todo("should buff be removed at end of turn");
//
//     It("should work even if you have no characters in play", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: soBeIt.cost,
//           Hand: [soBeIt],
//         },
//         {},
//       );
//
//       Await testEngine.playCard(soBeIt);
//
//       Expect(testEngine.getCardModel(soBeIt).zone).toBe("discard");
//     });
//   });
//
//   Describe("You may banish chosen item", () => {
//     It("should allow banishing a chosen item when you choose to", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: soBeIt.cost,
//           Hand: [soBeIt],
//           Play: [balooFriendAndGuardian],
//         },
//         {
//           Play: [dingleHopper],
//         },
//       );
//
//       Const item = testEngine.getCardModel(dingleHopper);
//
//       Await testEngine.playCard(soBeIt, { targets: [item] });
//
//       Expect(item.zone).toBe("discard");
//     });
//
//     It("should allow skipping the banish item effect (optional)", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: soBeIt.cost,
//           Hand: [soBeIt],
//           Play: [balooFriendAndGuardian],
//         },
//         {
//           Play: [dingleHopper],
//         },
//       );
//
//       Const item = testEngine.getCardModel(dingleHopper);
//
//       Await testEngine.playCard(soBeIt);
//
//       // Don't call resolveOptionalAbility - skip the optional effect
//
//       Expect(item.zone).toBe("play");
//     });
//
//     It("should work even if there are no items in play", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: soBeIt.cost,
//           Hand: [soBeIt],
//           Play: [balooFriendAndGuardian],
//         },
//         {},
//       );
//
//       Await testEngine.playCard(soBeIt);
//
//       // Don't call resolveOptionalAbility since there are no items
//
//       Expect(testEngine.getCardModel(soBeIt).zone).toBe("discard");
//     });
//   });
//
//   Describe("Combined effects", () => {
//     It("should apply strength buff and banish item when both effects are used", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: soBeIt.cost,
//           Hand: [soBeIt],
//           Play: [balooFriendAndGuardian],
//         },
//         {
//           Play: [dingleHopper],
//         },
//       );
//
//       Const baloo = testEngine.getCardModel(balooFriendAndGuardian);
//       Const item = testEngine.getCardModel(dingleHopper);
//
//       Const balooOriginalStrength = baloo.strength;
//
//       Await testEngine.playCard(soBeIt, { targets: [item] });
//
//       Expect(baloo.strength).toBe(balooOriginalStrength + 1);
//       Expect(item.zone).toBe("discard");
//     });
//
//     It("should apply strength buff even when skipping item banish", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: soBeIt.cost,
//           Hand: [soBeIt],
//           Play: [balooFriendAndGuardian],
//         },
//         {
//           Play: [dingleHopper],
//         },
//       );
//
//       Const baloo = testEngine.getCardModel(balooFriendAndGuardian);
//       Const item = testEngine.getCardModel(dingleHopper);
//
//       Const balooOriginalStrength = baloo.strength;
//
//       Await testEngine.playCard(soBeIt);
//
//       // Don't call resolveOptionalAbility - skip the optional effect
//
//       Expect(baloo.strength).toBe(balooOriginalStrength + 1);
//       Expect(item.zone).toBe("play");
//     });
//   });
// });
//
