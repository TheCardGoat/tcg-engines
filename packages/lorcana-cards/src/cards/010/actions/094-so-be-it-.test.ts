// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { mickeyMouseArtfulRogue } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { dingleHopper } from "@lorcanito/lorcana-engine/cards/001/items/items";
// import {
//   balooFriendAndGuardian,
//   soBeIt,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("So Be It!", () => {
//   describe("Each of your characters gets +1 strength this turn", () => {
//     it("should give all your characters +1 strength when played", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: soBeIt.cost,
//           hand: [soBeIt],
//           play: [balooFriendAndGuardian, mickeyMouseArtfulRogue],
//         },
//         {},
//       );
//
//       const baloo = testEngine.getCardModel(balooFriendAndGuardian);
//       const mickey = testEngine.getCardModel(mickeyMouseArtfulRogue);
//
//       const balooOriginalStrength = baloo.strength;
//       const mickeyOriginalStrength = mickey.strength;
//
//       await testEngine.playCard(soBeIt);
//
//       // The stack should be automatically resolved since the attribute effect has no targets
//
//       expect(baloo.strength).toBe(balooOriginalStrength + 1);
//       expect(mickey.strength).toBe(mickeyOriginalStrength + 1);
//     });
//
//     it("should not affect opponent's characters", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: soBeIt.cost,
//           hand: [soBeIt],
//           play: [balooFriendAndGuardian],
//         },
//         {
//           play: [mickeyMouseArtfulRogue],
//         },
//       );
//
//       const baloo = testEngine.getCardModel(balooFriendAndGuardian);
//       const opponentMickey = testEngine.getCardModel(mickeyMouseArtfulRogue);
//
//       const balooOriginalStrength = baloo.strength;
//       const opponentMickeyOriginalStrength = opponentMickey.strength;
//
//       await testEngine.playCard(soBeIt);
//
//       expect(baloo.strength).toBe(balooOriginalStrength + 1);
//       expect(opponentMickey.strength).toBe(opponentMickeyOriginalStrength);
//     });
//
//     // TODO: Investigate continuous effect duration handling
//     // The buff with duration: "turn" should expire, but currently persists
//     it.todo("should buff be removed at end of turn");
//
//     it("should work even if you have no characters in play", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: soBeIt.cost,
//           hand: [soBeIt],
//         },
//         {},
//       );
//
//       await testEngine.playCard(soBeIt);
//
//       expect(testEngine.getCardModel(soBeIt).zone).toBe("discard");
//     });
//   });
//
//   describe("You may banish chosen item", () => {
//     it("should allow banishing a chosen item when you choose to", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: soBeIt.cost,
//           hand: [soBeIt],
//           play: [balooFriendAndGuardian],
//         },
//         {
//           play: [dingleHopper],
//         },
//       );
//
//       const item = testEngine.getCardModel(dingleHopper);
//
//       await testEngine.playCard(soBeIt, { targets: [item] });
//
//       expect(item.zone).toBe("discard");
//     });
//
//     it("should allow skipping the banish item effect (optional)", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: soBeIt.cost,
//           hand: [soBeIt],
//           play: [balooFriendAndGuardian],
//         },
//         {
//           play: [dingleHopper],
//         },
//       );
//
//       const item = testEngine.getCardModel(dingleHopper);
//
//       await testEngine.playCard(soBeIt);
//
//       // Don't call resolveOptionalAbility - skip the optional effect
//
//       expect(item.zone).toBe("play");
//     });
//
//     it("should work even if there are no items in play", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: soBeIt.cost,
//           hand: [soBeIt],
//           play: [balooFriendAndGuardian],
//         },
//         {},
//       );
//
//       await testEngine.playCard(soBeIt);
//
//       // Don't call resolveOptionalAbility since there are no items
//
//       expect(testEngine.getCardModel(soBeIt).zone).toBe("discard");
//     });
//   });
//
//   describe("Combined effects", () => {
//     it("should apply strength buff and banish item when both effects are used", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: soBeIt.cost,
//           hand: [soBeIt],
//           play: [balooFriendAndGuardian],
//         },
//         {
//           play: [dingleHopper],
//         },
//       );
//
//       const baloo = testEngine.getCardModel(balooFriendAndGuardian);
//       const item = testEngine.getCardModel(dingleHopper);
//
//       const balooOriginalStrength = baloo.strength;
//
//       await testEngine.playCard(soBeIt, { targets: [item] });
//
//       expect(baloo.strength).toBe(balooOriginalStrength + 1);
//       expect(item.zone).toBe("discard");
//     });
//
//     it("should apply strength buff even when skipping item banish", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: soBeIt.cost,
//           hand: [soBeIt],
//           play: [balooFriendAndGuardian],
//         },
//         {
//           play: [dingleHopper],
//         },
//       );
//
//       const baloo = testEngine.getCardModel(balooFriendAndGuardian);
//       const item = testEngine.getCardModel(dingleHopper);
//
//       const balooOriginalStrength = baloo.strength;
//
//       await testEngine.playCard(soBeIt);
//
//       // Don't call resolveOptionalAbility - skip the optional effect
//
//       expect(baloo.strength).toBe(balooOriginalStrength + 1);
//       expect(item.zone).toBe("play");
//     });
//   });
// });
//
