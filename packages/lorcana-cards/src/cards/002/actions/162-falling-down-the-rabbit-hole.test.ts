// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { fallingDownTheRabbitHole } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import {
//   HerculesHeroInTraining,
//   PachaVillageLeader,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Falling Down the Rabbit Hole", () => {
//   It("Each player chooses one of their characters and puts them into their inkwell facedown and exerted.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: fallingDownTheRabbitHole.cost,
//         Hand: [fallingDownTheRabbitHole],
//         Play: [pachaVillageLeader],
//       },
//       {
//         Play: [herculesHeroInTraining],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       FallingDownTheRabbitHole.id,
//     );
//     Const target = testEngine.getByZoneAndId("play", pachaVillageLeader.id);
//     Const opponentTarget = testEngine.getByZoneAndId(
//       "play",
//       HerculesHeroInTraining.id,
//       "player_two",
//     );
//
//     Await testEngine.playCard(cardUnderTest);
//
//     TestEngine.changeActivePlayer("player_one");
//     Expect(testEngine.store.priorityPlayer).toEqual("player_one");
//
//     Await testEngine.resolveStackLayer(
//       {
//         LayerId: testEngine.getLayerIdForPlayer("player_one"),
//         Targets: [target],
//       },
//       True,
//     );
//     Expect(target.zone).toEqual("inkwell");
//     Expect(target.ready).toEqual(false);
//
//     TestEngine.changeActivePlayer("player_two");
//     Expect(testEngine.store.priorityPlayer).toEqual("player_two");
//
//     Await testEngine.resolveStackLayer(
//       {
//         LayerId: testEngine.getLayerIdForPlayer("player_two"),
//         Targets: [opponentTarget],
//       },
//       True,
//     );
//
//     Expect(opponentTarget.zone).toEqual("inkwell");
//     Expect(opponentTarget.ready).toEqual(false);
//
//     Expect(testEngine.stackLayers).toHaveLength(0);
//   });
// });
//
