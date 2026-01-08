// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { fallingDownTheRabbitHole } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// import {
//   herculesHeroInTraining,
//   pachaVillageLeader,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Falling Down the Rabbit Hole", () => {
//   it("Each player chooses one of their characters and puts them into their inkwell facedown and exerted.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: fallingDownTheRabbitHole.cost,
//         hand: [fallingDownTheRabbitHole],
//         play: [pachaVillageLeader],
//       },
//       {
//         play: [herculesHeroInTraining],
//       },
//     );
//
//     const cardUnderTest = testEngine.getByZoneAndId(
//       "hand",
//       fallingDownTheRabbitHole.id,
//     );
//     const target = testEngine.getByZoneAndId("play", pachaVillageLeader.id);
//     const opponentTarget = testEngine.getByZoneAndId(
//       "play",
//       herculesHeroInTraining.id,
//       "player_two",
//     );
//
//     await testEngine.playCard(cardUnderTest);
//
//     testEngine.changeActivePlayer("player_one");
//     expect(testEngine.store.priorityPlayer).toEqual("player_one");
//
//     await testEngine.resolveStackLayer(
//       {
//         layerId: testEngine.getLayerIdForPlayer("player_one"),
//         targets: [target],
//       },
//       true,
//     );
//     expect(target.zone).toEqual("inkwell");
//     expect(target.ready).toEqual(false);
//
//     testEngine.changeActivePlayer("player_two");
//     expect(testEngine.store.priorityPlayer).toEqual("player_two");
//
//     await testEngine.resolveStackLayer(
//       {
//         layerId: testEngine.getLayerIdForPlayer("player_two"),
//         targets: [opponentTarget],
//       },
//       true,
//     );
//
//     expect(opponentTarget.zone).toEqual("inkwell");
//     expect(opponentTarget.ready).toEqual(false);
//
//     expect(testEngine.stackLayers).toHaveLength(0);
//   });
// });
//
