// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   mickeyMouseTrueFriend,
//   rapunzelGiftedWithHealing,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import {
//   chiefBogoRespectedOfficer,
//   panicUnderworldImp,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { jimHawkinsRiggerSpecialist } from "@lorcanito/lorcana-engine/cards/006";
// import {
//   moanaAdventurerOfLandAndSea,
//   theReturnOfHercules,
// } from "@lorcanito/lorcana-engine/cards/007";
// import { honeyLemonCostumedCatalyst } from "@lorcanito/lorcana-engine/cards/008";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// import { mrSmeeBumblingMate } from "../../003/characters/characters";
// import { princePhillipVanquisherOfFoes } from "../../009";
//
// describe("The Return Of Hercules", () => {
//   it("Each player may reveal a character card from their hand and play it for free", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: theReturnOfHercules.cost,
//         hand: [theReturnOfHercules, moanaAdventurerOfLandAndSea],
//       },
//       {
//         hand: [mickeyMouseTrueFriend],
//       },
//     );
//
//     await testEngine.playCard(theReturnOfHercules);
//
//     // Player 1 reveals and plays their character
//     await testEngine.acceptOptionalAbility();
//     await testEngine.resolveTopOfStack(
//       {
//         targets: [moanaAdventurerOfLandAndSea],
//       },
//       true,
//     );
//     expect(testEngine.getCardModel(moanaAdventurerOfLandAndSea).zone).toBe(
//       "play",
//     );
//
//     // // Player 2 reveals and plays their character
//     testEngine.changeActivePlayer("player_two");
//     expect(testEngine.store.priorityPlayer).toEqual("player_two");
//     await testEngine.acceptOptionalAbility();
//     await testEngine.resolveTopOfStack({ targets: [mickeyMouseTrueFriend] });
//     expect(testEngine.getCardModel(mickeyMouseTrueFriend).zone).toBe("play");
//   });
//
//   it("Return of Hercules + When you play this character effects", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: theReturnOfHercules.cost,
//         hand: [theReturnOfHercules, jimHawkinsRiggerSpecialist],
//         play: [chiefBogoRespectedOfficer],
//       },
//       {
//         hand: [panicUnderworldImp],
//         play: [honeyLemonCostumedCatalyst],
//       },
//     );
//
//     await testEngine.playCard(theReturnOfHercules);
//
//     // Player 1 accepts the optional ability to play a character
//     testEngine.changeActivePlayer("player_one");
//     expect(testEngine.store.priorityPlayer).toEqual("player_one");
//     await testEngine.acceptOptionalLayer(
//       false,
//       testEngine.getLayerIdForPlayer("player_one"),
//     );
//     await testEngine.resolveStackLayer(
//       {
//         layerId: testEngine.getLayerIdForPlayer("player_one"),
//         targets: [jimHawkinsRiggerSpecialist],
//       },
//       true,
//     );
//
//     expect(testEngine.getCardModel(jimHawkinsRiggerSpecialist).zone).toBe(
//       "play",
//     );
//
//     // Player 2 accepts the optional ability to play a character
//     testEngine.changeActivePlayer("player_two");
//     expect(testEngine.store.priorityPlayer).toEqual("player_two");
//     await testEngine.acceptOptionalLayer(
//       false,
//       testEngine.getLayerIdForPlayer("player_two"),
//     );
//     await testEngine.resolveStackLayer(
//       {
//         layerId: testEngine.getLayerIdForPlayer("player_two"),
//         targets: [panicUnderworldImp],
//       },
//       true,
//     );
//     expect(testEngine.getCardModel(panicUnderworldImp).zone).toBe("play");
//
//     testEngine.changeActivePlayer("player_one");
//
//     await testEngine.acceptOptionalLayerBySource({
//       source: chiefBogoRespectedOfficer,
//     });
//
//     // Chief Bogo Ability triggers, causing 1 damage to each character
//     expect(testEngine.getCardModel(honeyLemonCostumedCatalyst).damage).toBe(1);
//     expect(testEngine.getCardModel(panicUnderworldImp).damage).toBe(1);
//
//     // Player 1's character has a "When you play this character" effect
//     testEngine.changeActivePlayer("player_one");
//     expect(testEngine.store.priorityPlayer).toEqual("player_one");
//     await testEngine.acceptOptionalLayer(
//       false,
//       testEngine.getLayerIdForPlayer("player_one"),
//     );
//     await testEngine.resolveStackLayer(
//       {
//         layerId: testEngine.getLayerIdForPlayer("player_one"),
//         targets: [chiefBogoRespectedOfficer],
//       },
//       true,
//     );
//
//     // Jim Hawkins' ability should trigger and deal 1 damage to Chief Bogo
//     expect(testEngine.getCardModel(chiefBogoRespectedOfficer).damage).toBe(1);
//
//     // Now player one uses Panic Underworld Imp's ability
//     testEngine.changeActivePlayer("player_two");
//     expect(testEngine.store.priorityPlayer).toEqual("player_two");
//     await testEngine.resolveStackLayer(
//       {
//         layerId: testEngine.getLayerIdForPlayer("player_two"),
//         targets: [honeyLemonCostumedCatalyst],
//       },
//       true,
//     );
//
//     expect(testEngine.getCardModel(honeyLemonCostumedCatalyst).strength).toBe(
//       honeyLemonCostumedCatalyst.strength + 2,
//     );
//
//     testEngine.changeActivePlayer("player_one");
//     expect(testEngine.stackLayers).toHaveLength(0);
//   });
//
//   it("Return of Hercules + When you play this character effects", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: theReturnOfHercules.cost,
//         hand: [theReturnOfHercules, princePhillipVanquisherOfFoes],
//         play: [chiefBogoRespectedOfficer],
//       },
//       {
//         hand: [rapunzelGiftedWithHealing],
//         play: [mrSmeeBumblingMate],
//       },
//     );
//
//     await testEngine.setCardDamage(mrSmeeBumblingMate, 1);
//     expect(testEngine.getCardModel(mrSmeeBumblingMate).damage).toBe(1);
//
//     await testEngine.playCard(theReturnOfHercules);
//
//     testEngine.changeActivePlayer("player_one");
//     await testEngine.acceptOptionalLayer(
//       false,
//       testEngine.getLayerIdForPlayer("player_one"),
//     );
//     await testEngine.resolveStackLayer(
//       {
//         layerId: testEngine.getLayerIdForPlayer("player_one"),
//         targets: [princePhillipVanquisherOfFoes],
//       },
//       true,
//     );
//     // Mr. Smee should not be banished
//     expect(testEngine.getCardModel(mrSmeeBumblingMate).zone).toBe("play");
//
//     expect(testEngine.getCardModel(princePhillipVanquisherOfFoes).zone).toBe(
//       "play",
//     );
//
//     testEngine.changeActivePlayer("player_two");
//     await testEngine.acceptOptionalLayer(
//       false,
//       testEngine.getLayerIdForPlayer("player_two"),
//     );
//     await testEngine.resolveStackLayer(
//       {
//         layerId: testEngine.getLayerIdForPlayer("player_two"),
//         targets: [rapunzelGiftedWithHealing],
//       },
//       true,
//     );
//
//     expect(testEngine.getCardModel(rapunzelGiftedWithHealing).zone).toBe(
//       "play",
//     );
//
//     testEngine.changeActivePlayer("player_one");
//     await testEngine.acceptOptionalLayerBySource({
//       source: chiefBogoRespectedOfficer,
//     });
//
//     expect(testEngine.getCardModel(rapunzelGiftedWithHealing).damage).toBe(1);
//     expect(testEngine.getCardModel(mrSmeeBumblingMate).damage).toBe(2);
//
//     await testEngine.acceptOptionalLayerBySource({
//       source: princePhillipVanquisherOfFoes,
//     });
//     expect(testEngine.getCardModel(rapunzelGiftedWithHealing).zone).toBe(
//       "discard",
//     );
//     expect(testEngine.getCardModel(mrSmeeBumblingMate).zone).toBe("discard");
//
//     testEngine.changeActivePlayer("player_two");
//     await testEngine.acceptOptionalLayerBySource({
//       source: rapunzelGiftedWithHealing,
//     });
//
//     expect(testEngine.stackLayers).toHaveLength(0);
//   });
// });
//
