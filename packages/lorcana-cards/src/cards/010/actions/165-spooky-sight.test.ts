// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// // Import some test characters with different costs
// Import {
//   MowgliManCub, // Cost 2
//   ScarEerilyPrepared, // Cost 5
//   SpookySight,
// } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Spooky Sight", () => {
//   Describe("Basic functionality", () => {
//     It("puts all characters with cost 3 or less into their players' inkwells facedown and exerted - mixed costs", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: spookySight.cost,
//           Hand: [spookySight],
//           Play: [mowgliManCub], // Cost 2 - should be affected
//         },
//         {
//           Play: [scarEerilyPrepared], // Cost 5 - should NOT be affected
//         },
//       );
//
//       Const initialPlayerInkwellCount =
//         TestEngine.getTotalInkwellCardCount("player_one");
//       Const initialOpponentInkwellCount =
//         TestEngine.getTotalInkwellCardCount("player_two");
//
//       Await testEngine.playCard(spookySight);
//
//       // Verify low-cost character moved to inkwell
//       Expect(testEngine.getCardModel(mowgliManCub).zone).toBe("inkwell");
//       Expect(testEngine.getCardModel(mowgliManCub).exerted).toBe(true);
//
//       // Verify high-cost character stayed in play
//       Expect(testEngine.getCardModel(scarEerilyPrepared).zone).toBe("play");
//
//       // Verify inkwell counts increased correctly
//       Expect(testEngine.getTotalInkwellCardCount("player_one")).toBe(
//         InitialPlayerInkwellCount + 1,
//       );
//       Expect(testEngine.getTotalInkwellCardCount("player_two")).toBe(
//         InitialOpponentInkwellCount,
//       );
//     });
//
//     It("affects both players' characters with cost 3 or less", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: spookySight.cost,
//           Hand: [spookySight],
//           Play: [mowgliManCub], // Cost 2 - should be affected
//         },
//         {
//           Play: [mowgliManCub], // Cost 2 - should be affected
//         },
//       );
//
//       Const initialPlayerInkwellCount =
//         TestEngine.getTotalInkwellCardCount("player_one");
//       Const initialOpponentInkwellCount =
//         TestEngine.getTotalInkwellCardCount("player_two");
//
//       Await testEngine.playCard(spookySight);
//
//       // Both characters should be moved to their respective inkwells
//       Expect(
//         TestEngine.getByZoneAndId("inkwell", mowgliManCub.id, "player_one"),
//       ).toBeDefined();
//       Expect(
//         TestEngine.getByZoneAndId("inkwell", mowgliManCub.id, "player_two"),
//       ).toBeDefined();
//
//       // Both should be exerted
//       Expect(
//         TestEngine.getByZoneAndId("inkwell", mowgliManCub.id, "player_one")
//           .exerted,
//       ).toBe(true);
//       Expect(
//         TestEngine.getByZoneAndId("inkwell", mowgliManCub.id, "player_two")
//           .exerted,
//       ).toBe(true);
//
//       // Both inkwells should have increased by 1
//       Expect(testEngine.getTotalInkwellCardCount("player_one")).toBe(
//         InitialPlayerInkwellCount + 1,
//       );
//       Expect(testEngine.getTotalInkwellCardCount("player_two")).toBe(
//         InitialOpponentInkwellCount + 1,
//       );
//     });
//
//     It("exerts all affected characters when moving them to inkwell", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: spookySight.cost,
//         Hand: [spookySight],
//         Play: [mowgliManCub], // Cost 2
//       });
//
//       Await testEngine.playCard(spookySight);
//
//       // Character should be in inkwell and exerted
//       Expect(testEngine.getCardModel(mowgliManCub).zone).toBe("inkwell");
//       Expect(testEngine.getCardModel(mowgliManCub).exerted).toBe(true);
//     });
//   });
//
//   Describe("Cost filtering", () => {
//     It("does not affect characters with cost 4 or more", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: spookySight.cost,
//           Hand: [spookySight],
//           Play: [scarEerilyPrepared], // Cost 5
//         },
//         {
//           Play: [scarEerilyPrepared], // Cost 5
//         },
//       );
//
//       Await testEngine.playCard(spookySight);
//
//       // High-cost characters should remain in play
//       Expect(
//         TestEngine.getByZoneAndId("play", scarEerilyPrepared.id, "player_one"),
//       ).toBeDefined();
//       Expect(
//         TestEngine.getByZoneAndId("play", scarEerilyPrepared.id, "player_two"),
//       ).toBeDefined();
//     });
//
//     It("affects characters with cost exactly 3", async () => {
//       // Note: We'll need a cost 3 character for this test
//       // For now, this is a placeholder showing the intent
//       Const testEngine = new TestEngine({
//         Inkwell: spookySight.cost,
//         Hand: [spookySight],
//         Play: [mowgliManCub], // Using cost 2 as placeholder
//       });
//
//       Await testEngine.playCard(spookySight);
//
//       // Character with cost <= 3 should be affected
//       Expect(testEngine.getCardModel(mowgliManCub).zone).toBe("inkwell");
//       Expect(testEngine.getCardModel(mowgliManCub).exerted).toBe(true);
//     });
//   });
//
//   Describe("Edge cases", () => {
//     It("works when no qualifying characters are in play", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: spookySight.cost,
//           Hand: [spookySight],
//           Play: [scarEerilyPrepared], // Cost 5 - not affected
//         },
//         {
//           Play: [scarEerilyPrepared], // Cost 5 - not affected
//         },
//       );
//
//       Const initialPlayerInkwellCount =
//         TestEngine.getTotalInkwellCardCount("player_one");
//       Const initialOpponentInkwellCount =
//         TestEngine.getTotalInkwellCardCount("player_two");
//
//       Await testEngine.playCard(spookySight);
//
//       // No characters should be moved
//       Expect(
//         TestEngine.getByZoneAndId("play", scarEerilyPrepared.id, "player_one"),
//       ).toBeDefined();
//       Expect(
//         TestEngine.getByZoneAndId("play", scarEerilyPrepared.id, "player_two"),
//       ).toBeDefined();
//
//       // Inkwell counts should be unchanged
//       Expect(testEngine.getTotalInkwellCardCount("player_one")).toBe(
//         InitialPlayerInkwellCount,
//       );
//       Expect(testEngine.getTotalInkwellCardCount("player_two")).toBe(
//         InitialOpponentInkwellCount,
//       );
//     });
//
//     It("works when only one player has qualifying characters", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: spookySight.cost,
//           Hand: [spookySight],
//           Play: [mowgliManCub], // Cost 2 - should be affected
//         },
//         {
//           Play: [scarEerilyPrepared], // Cost 5 - should not be affected
//         },
//       );
//
//       Await testEngine.playCard(spookySight);
//
//       // Only player one's character should be affected
//       Expect(
//         TestEngine.getByZoneAndId("inkwell", mowgliManCub.id, "player_one"),
//       ).toBeDefined();
//       Expect(
//         TestEngine.getByZoneAndId("inkwell", mowgliManCub.id, "player_one")
//           .exerted,
//       ).toBe(true);
//       Expect(
//         TestEngine.getByZoneAndId("play", scarEerilyPrepared.id, "player_two"),
//       ).toBeDefined();
//     });
//
//     It("puts cards into correct player's inkwell (not caster's inkwell)", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: spookySight.cost,
//           Hand: [spookySight],
//           Play: [], // No characters for player one
//         },
//         {
//           Play: [mowgliManCub], // Cost 2 - opponent's character
//         },
//       );
//
//       Const initialPlayerInkwellCount =
//         TestEngine.getTotalInkwellCardCount("player_one");
//       Const initialOpponentInkwellCount =
//         TestEngine.getTotalInkwellCardCount("player_two");
//
//       Await testEngine.playCard(spookySight);
//
//       // Opponent's character should go to opponent's inkwell, not caster's
//       Expect(
//         TestEngine.getByZoneAndId("inkwell", mowgliManCub.id, "player_two"),
//       ).toBeDefined();
//       Expect(testEngine.getTotalInkwellCardCount("player_one")).toBe(
//         InitialPlayerInkwellCount,
//       );
//       Expect(testEngine.getTotalInkwellCardCount("player_two")).toBe(
//         InitialOpponentInkwellCount + 1,
//       );
//     });
//   });
//
//   Describe("Complete effect test", () => {
//     It("fulfills the complete card text: Put all characters with cost 3 or less into their players' inkwells facedown and exerted", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: spookySight.cost,
//           Hand: [spookySight],
//           Play: [mowgliManCub], // Cost 2
//         },
//         {
//           Play: [mowgliManCub], // Cost 2
//         },
//       );
//
//       Await testEngine.playCard(spookySight);
//
//       // All characters with cost 3 or less should be in their owner's inkwell, facedown and exerted
//       Expect(
//         TestEngine.getByZoneAndId("inkwell", mowgliManCub.id, "player_one"),
//       ).toBeDefined();
//       Expect(
//         TestEngine.getByZoneAndId("inkwell", mowgliManCub.id, "player_one")
//           .exerted,
//       ).toBe(true);
//       Expect(
//         TestEngine.getByZoneAndId("inkwell", mowgliManCub.id, "player_two"),
//       ).toBeDefined();
//       Expect(
//         TestEngine.getByZoneAndId("inkwell", mowgliManCub.id, "player_two")
//           .exerted,
//       ).toBe(true);
//     });
//   });
// });
//
