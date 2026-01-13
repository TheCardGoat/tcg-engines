// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// // Import some test characters with different costs
// import {
//   mowgliManCub, // Cost 2
//   scarEerilyPrepared, // Cost 5
//   spookySight,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Spooky Sight", () => {
//   describe("Basic functionality", () => {
//     it("puts all characters with cost 3 or less into their players' inkwells facedown and exerted - mixed costs", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: spookySight.cost,
//           hand: [spookySight],
//           play: [mowgliManCub], // Cost 2 - should be affected
//         },
//         {
//           play: [scarEerilyPrepared], // Cost 5 - should NOT be affected
//         },
//       );
//
//       const initialPlayerInkwellCount =
//         testEngine.getTotalInkwellCardCount("player_one");
//       const initialOpponentInkwellCount =
//         testEngine.getTotalInkwellCardCount("player_two");
//
//       await testEngine.playCard(spookySight);
//
//       // Verify low-cost character moved to inkwell
//       expect(testEngine.getCardModel(mowgliManCub).zone).toBe("inkwell");
//       expect(testEngine.getCardModel(mowgliManCub).exerted).toBe(true);
//
//       // Verify high-cost character stayed in play
//       expect(testEngine.getCardModel(scarEerilyPrepared).zone).toBe("play");
//
//       // Verify inkwell counts increased correctly
//       expect(testEngine.getTotalInkwellCardCount("player_one")).toBe(
//         initialPlayerInkwellCount + 1,
//       );
//       expect(testEngine.getTotalInkwellCardCount("player_two")).toBe(
//         initialOpponentInkwellCount,
//       );
//     });
//
//     it("affects both players' characters with cost 3 or less", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: spookySight.cost,
//           hand: [spookySight],
//           play: [mowgliManCub], // Cost 2 - should be affected
//         },
//         {
//           play: [mowgliManCub], // Cost 2 - should be affected
//         },
//       );
//
//       const initialPlayerInkwellCount =
//         testEngine.getTotalInkwellCardCount("player_one");
//       const initialOpponentInkwellCount =
//         testEngine.getTotalInkwellCardCount("player_two");
//
//       await testEngine.playCard(spookySight);
//
//       // Both characters should be moved to their respective inkwells
//       expect(
//         testEngine.getByZoneAndId("inkwell", mowgliManCub.id, "player_one"),
//       ).toBeDefined();
//       expect(
//         testEngine.getByZoneAndId("inkwell", mowgliManCub.id, "player_two"),
//       ).toBeDefined();
//
//       // Both should be exerted
//       expect(
//         testEngine.getByZoneAndId("inkwell", mowgliManCub.id, "player_one")
//           .exerted,
//       ).toBe(true);
//       expect(
//         testEngine.getByZoneAndId("inkwell", mowgliManCub.id, "player_two")
//           .exerted,
//       ).toBe(true);
//
//       // Both inkwells should have increased by 1
//       expect(testEngine.getTotalInkwellCardCount("player_one")).toBe(
//         initialPlayerInkwellCount + 1,
//       );
//       expect(testEngine.getTotalInkwellCardCount("player_two")).toBe(
//         initialOpponentInkwellCount + 1,
//       );
//     });
//
//     it("exerts all affected characters when moving them to inkwell", async () => {
//       const testEngine = new TestEngine({
//         inkwell: spookySight.cost,
//         hand: [spookySight],
//         play: [mowgliManCub], // Cost 2
//       });
//
//       await testEngine.playCard(spookySight);
//
//       // Character should be in inkwell and exerted
//       expect(testEngine.getCardModel(mowgliManCub).zone).toBe("inkwell");
//       expect(testEngine.getCardModel(mowgliManCub).exerted).toBe(true);
//     });
//   });
//
//   describe("Cost filtering", () => {
//     it("does not affect characters with cost 4 or more", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: spookySight.cost,
//           hand: [spookySight],
//           play: [scarEerilyPrepared], // Cost 5
//         },
//         {
//           play: [scarEerilyPrepared], // Cost 5
//         },
//       );
//
//       await testEngine.playCard(spookySight);
//
//       // High-cost characters should remain in play
//       expect(
//         testEngine.getByZoneAndId("play", scarEerilyPrepared.id, "player_one"),
//       ).toBeDefined();
//       expect(
//         testEngine.getByZoneAndId("play", scarEerilyPrepared.id, "player_two"),
//       ).toBeDefined();
//     });
//
//     it("affects characters with cost exactly 3", async () => {
//       // Note: We'll need a cost 3 character for this test
//       // For now, this is a placeholder showing the intent
//       const testEngine = new TestEngine({
//         inkwell: spookySight.cost,
//         hand: [spookySight],
//         play: [mowgliManCub], // Using cost 2 as placeholder
//       });
//
//       await testEngine.playCard(spookySight);
//
//       // Character with cost <= 3 should be affected
//       expect(testEngine.getCardModel(mowgliManCub).zone).toBe("inkwell");
//       expect(testEngine.getCardModel(mowgliManCub).exerted).toBe(true);
//     });
//   });
//
//   describe("Edge cases", () => {
//     it("works when no qualifying characters are in play", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: spookySight.cost,
//           hand: [spookySight],
//           play: [scarEerilyPrepared], // Cost 5 - not affected
//         },
//         {
//           play: [scarEerilyPrepared], // Cost 5 - not affected
//         },
//       );
//
//       const initialPlayerInkwellCount =
//         testEngine.getTotalInkwellCardCount("player_one");
//       const initialOpponentInkwellCount =
//         testEngine.getTotalInkwellCardCount("player_two");
//
//       await testEngine.playCard(spookySight);
//
//       // No characters should be moved
//       expect(
//         testEngine.getByZoneAndId("play", scarEerilyPrepared.id, "player_one"),
//       ).toBeDefined();
//       expect(
//         testEngine.getByZoneAndId("play", scarEerilyPrepared.id, "player_two"),
//       ).toBeDefined();
//
//       // Inkwell counts should be unchanged
//       expect(testEngine.getTotalInkwellCardCount("player_one")).toBe(
//         initialPlayerInkwellCount,
//       );
//       expect(testEngine.getTotalInkwellCardCount("player_two")).toBe(
//         initialOpponentInkwellCount,
//       );
//     });
//
//     it("works when only one player has qualifying characters", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: spookySight.cost,
//           hand: [spookySight],
//           play: [mowgliManCub], // Cost 2 - should be affected
//         },
//         {
//           play: [scarEerilyPrepared], // Cost 5 - should not be affected
//         },
//       );
//
//       await testEngine.playCard(spookySight);
//
//       // Only player one's character should be affected
//       expect(
//         testEngine.getByZoneAndId("inkwell", mowgliManCub.id, "player_one"),
//       ).toBeDefined();
//       expect(
//         testEngine.getByZoneAndId("inkwell", mowgliManCub.id, "player_one")
//           .exerted,
//       ).toBe(true);
//       expect(
//         testEngine.getByZoneAndId("play", scarEerilyPrepared.id, "player_two"),
//       ).toBeDefined();
//     });
//
//     it("puts cards into correct player's inkwell (not caster's inkwell)", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: spookySight.cost,
//           hand: [spookySight],
//           play: [], // No characters for player one
//         },
//         {
//           play: [mowgliManCub], // Cost 2 - opponent's character
//         },
//       );
//
//       const initialPlayerInkwellCount =
//         testEngine.getTotalInkwellCardCount("player_one");
//       const initialOpponentInkwellCount =
//         testEngine.getTotalInkwellCardCount("player_two");
//
//       await testEngine.playCard(spookySight);
//
//       // Opponent's character should go to opponent's inkwell, not caster's
//       expect(
//         testEngine.getByZoneAndId("inkwell", mowgliManCub.id, "player_two"),
//       ).toBeDefined();
//       expect(testEngine.getTotalInkwellCardCount("player_one")).toBe(
//         initialPlayerInkwellCount,
//       );
//       expect(testEngine.getTotalInkwellCardCount("player_two")).toBe(
//         initialOpponentInkwellCount + 1,
//       );
//     });
//   });
//
//   describe("Complete effect test", () => {
//     it("fulfills the complete card text: Put all characters with cost 3 or less into their players' inkwells facedown and exerted", async () => {
//       const testEngine = new TestEngine(
//         {
//           inkwell: spookySight.cost,
//           hand: [spookySight],
//           play: [mowgliManCub], // Cost 2
//         },
//         {
//           play: [mowgliManCub], // Cost 2
//         },
//       );
//
//       await testEngine.playCard(spookySight);
//
//       // All characters with cost 3 or less should be in their owner's inkwell, facedown and exerted
//       expect(
//         testEngine.getByZoneAndId("inkwell", mowgliManCub.id, "player_one"),
//       ).toBeDefined();
//       expect(
//         testEngine.getByZoneAndId("inkwell", mowgliManCub.id, "player_one")
//           .exerted,
//       ).toBe(true);
//       expect(
//         testEngine.getByZoneAndId("inkwell", mowgliManCub.id, "player_two"),
//       ).toBeDefined();
//       expect(
//         testEngine.getByZoneAndId("inkwell", mowgliManCub.id, "player_two")
//           .exerted,
//       ).toBe(true);
//     });
//   });
// });
//
