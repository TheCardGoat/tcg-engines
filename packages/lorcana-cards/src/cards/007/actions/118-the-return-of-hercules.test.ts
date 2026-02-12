// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MickeyMouseTrueFriend,
//   RapunzelGiftedWithHealing,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   ChiefBogoRespectedOfficer,
//   PanicUnderworldImp,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { jimHawkinsRiggerSpecialist } from "@lorcanito/lorcana-engine/cards/006";
// Import {
//   MoanaAdventurerOfLandAndSea,
//   TheReturnOfHercules,
// } from "@lorcanito/lorcana-engine/cards/007";
// Import { honeyLemonCostumedCatalyst } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { mrSmeeBumblingMate } from "../../003/characters/characters";
// Import { princePhillipVanquisherOfFoes } from "../../009";
//
// Describe("The Return Of Hercules", () => {
//   It("Each player may reveal a character card from their hand and play it for free", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: theReturnOfHercules.cost,
//         Hand: [theReturnOfHercules, moanaAdventurerOfLandAndSea],
//       },
//       {
//         Hand: [mickeyMouseTrueFriend],
//       },
//     );
//
//     Await testEngine.playCard(theReturnOfHercules);
//
//     // Player 1 reveals and plays their character
//     Await testEngine.acceptOptionalAbility();
//     Await testEngine.resolveTopOfStack(
//       {
//         Targets: [moanaAdventurerOfLandAndSea],
//       },
//       True,
//     );
//     Expect(testEngine.getCardModel(moanaAdventurerOfLandAndSea).zone).toBe(
//       "play",
//     );
//
//     // // Player 2 reveals and plays their character
//     TestEngine.changeActivePlayer("player_two");
//     Expect(testEngine.store.priorityPlayer).toEqual("player_two");
//     Await testEngine.acceptOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [mickeyMouseTrueFriend] });
//     Expect(testEngine.getCardModel(mickeyMouseTrueFriend).zone).toBe("play");
//   });
//
//   It("Return of Hercules + When you play this character effects", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: theReturnOfHercules.cost,
//         Hand: [theReturnOfHercules, jimHawkinsRiggerSpecialist],
//         Play: [chiefBogoRespectedOfficer],
//       },
//       {
//         Hand: [panicUnderworldImp],
//         Play: [honeyLemonCostumedCatalyst],
//       },
//     );
//
//     Await testEngine.playCard(theReturnOfHercules);
//
//     // Player 1 accepts the optional ability to play a character
//     TestEngine.changeActivePlayer("player_one");
//     Expect(testEngine.store.priorityPlayer).toEqual("player_one");
//     Await testEngine.acceptOptionalLayer(
//       False,
//       TestEngine.getLayerIdForPlayer("player_one"),
//     );
//     Await testEngine.resolveStackLayer(
//       {
//         LayerId: testEngine.getLayerIdForPlayer("player_one"),
//         Targets: [jimHawkinsRiggerSpecialist],
//       },
//       True,
//     );
//
//     Expect(testEngine.getCardModel(jimHawkinsRiggerSpecialist).zone).toBe(
//       "play",
//     );
//
//     // Player 2 accepts the optional ability to play a character
//     TestEngine.changeActivePlayer("player_two");
//     Expect(testEngine.store.priorityPlayer).toEqual("player_two");
//     Await testEngine.acceptOptionalLayer(
//       False,
//       TestEngine.getLayerIdForPlayer("player_two"),
//     );
//     Await testEngine.resolveStackLayer(
//       {
//         LayerId: testEngine.getLayerIdForPlayer("player_two"),
//         Targets: [panicUnderworldImp],
//       },
//       True,
//     );
//     Expect(testEngine.getCardModel(panicUnderworldImp).zone).toBe("play");
//
//     TestEngine.changeActivePlayer("player_one");
//
//     Await testEngine.acceptOptionalLayerBySource({
//       Source: chiefBogoRespectedOfficer,
//     });
//
//     // Chief Bogo Ability triggers, causing 1 damage to each character
//     Expect(testEngine.getCardModel(honeyLemonCostumedCatalyst).damage).toBe(1);
//     Expect(testEngine.getCardModel(panicUnderworldImp).damage).toBe(1);
//
//     // Player 1's character has a "When you play this character" effect
//     TestEngine.changeActivePlayer("player_one");
//     Expect(testEngine.store.priorityPlayer).toEqual("player_one");
//     Await testEngine.acceptOptionalLayer(
//       False,
//       TestEngine.getLayerIdForPlayer("player_one"),
//     );
//     Await testEngine.resolveStackLayer(
//       {
//         LayerId: testEngine.getLayerIdForPlayer("player_one"),
//         Targets: [chiefBogoRespectedOfficer],
//       },
//       True,
//     );
//
//     // Jim Hawkins' ability should trigger and deal 1 damage to Chief Bogo
//     Expect(testEngine.getCardModel(chiefBogoRespectedOfficer).damage).toBe(1);
//
//     // Now player one uses Panic Underworld Imp's ability
//     TestEngine.changeActivePlayer("player_two");
//     Expect(testEngine.store.priorityPlayer).toEqual("player_two");
//     Await testEngine.resolveStackLayer(
//       {
//         LayerId: testEngine.getLayerIdForPlayer("player_two"),
//         Targets: [honeyLemonCostumedCatalyst],
//       },
//       True,
//     );
//
//     Expect(testEngine.getCardModel(honeyLemonCostumedCatalyst).strength).toBe(
//       HoneyLemonCostumedCatalyst.strength + 2,
//     );
//
//     TestEngine.changeActivePlayer("player_one");
//     Expect(testEngine.stackLayers).toHaveLength(0);
//   });
//
//   It("Return of Hercules + When you play this character effects", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: theReturnOfHercules.cost,
//         Hand: [theReturnOfHercules, princePhillipVanquisherOfFoes],
//         Play: [chiefBogoRespectedOfficer],
//       },
//       {
//         Hand: [rapunzelGiftedWithHealing],
//         Play: [mrSmeeBumblingMate],
//       },
//     );
//
//     Await testEngine.setCardDamage(mrSmeeBumblingMate, 1);
//     Expect(testEngine.getCardModel(mrSmeeBumblingMate).damage).toBe(1);
//
//     Await testEngine.playCard(theReturnOfHercules);
//
//     TestEngine.changeActivePlayer("player_one");
//     Await testEngine.acceptOptionalLayer(
//       False,
//       TestEngine.getLayerIdForPlayer("player_one"),
//     );
//     Await testEngine.resolveStackLayer(
//       {
//         LayerId: testEngine.getLayerIdForPlayer("player_one"),
//         Targets: [princePhillipVanquisherOfFoes],
//       },
//       True,
//     );
//     // Mr. Smee should not be banished
//     Expect(testEngine.getCardModel(mrSmeeBumblingMate).zone).toBe("play");
//
//     Expect(testEngine.getCardModel(princePhillipVanquisherOfFoes).zone).toBe(
//       "play",
//     );
//
//     TestEngine.changeActivePlayer("player_two");
//     Await testEngine.acceptOptionalLayer(
//       False,
//       TestEngine.getLayerIdForPlayer("player_two"),
//     );
//     Await testEngine.resolveStackLayer(
//       {
//         LayerId: testEngine.getLayerIdForPlayer("player_two"),
//         Targets: [rapunzelGiftedWithHealing],
//       },
//       True,
//     );
//
//     Expect(testEngine.getCardModel(rapunzelGiftedWithHealing).zone).toBe(
//       "play",
//     );
//
//     TestEngine.changeActivePlayer("player_one");
//     Await testEngine.acceptOptionalLayerBySource({
//       Source: chiefBogoRespectedOfficer,
//     });
//
//     Expect(testEngine.getCardModel(rapunzelGiftedWithHealing).damage).toBe(1);
//     Expect(testEngine.getCardModel(mrSmeeBumblingMate).damage).toBe(2);
//
//     Await testEngine.acceptOptionalLayerBySource({
//       Source: princePhillipVanquisherOfFoes,
//     });
//     Expect(testEngine.getCardModel(rapunzelGiftedWithHealing).zone).toBe(
//       "discard",
//     );
//     Expect(testEngine.getCardModel(mrSmeeBumblingMate).zone).toBe("discard");
//
//     TestEngine.changeActivePlayer("player_two");
//     Await testEngine.acceptOptionalLayerBySource({
//       Source: rapunzelGiftedWithHealing,
//     });
//
//     Expect(testEngine.stackLayers).toHaveLength(0);
//   });
// });
//
