// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   Brawl,
//   WeDontTalkAboutBruno,
// } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import {
//   AladdinBraveRescuer,
//   AladdinResoluteSwordsman,
//   ArgesTheCyclops,
//   HerculesBelovedHero,
//   SisuEmboldenedWarrior,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// // Flaky test
// Describe.skip("We Don't Talk About Bruno", () => {
//   It("should return  opponent chosen character to their player's hand and discard opponent card", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: weDontTalkAboutBruno.cost,
//         Hand: [weDontTalkAboutBruno],
//       },
//       {
//         Hand: [
//           HerculesBelovedHero,
//           Brawl,
//           AladdinResoluteSwordsman,
//           ArgesTheCyclops,
//         ],
//         Play: [aladdinBraveRescuer],
//       },
//     );
//
//     Const cardUnderTest = testStore.getCard(weDontTalkAboutBruno);
//     Const target = testStore.getCard(aladdinBraveRescuer);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] }, true);
//
//     Expect(target.zone).toBe("hand");
//
//     Expect(testStore.getZonesCardCount("player_two").hand).toBe(4);
//     Expect(testStore.getZonesCardCount("player_two").discard).toBe(1);
//   });
//
//   It("should return  opponent chosen character to their player's hand and discard opponent card", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: weDontTalkAboutBruno.cost,
//       Play: [aladdinBraveRescuer],
//       Hand: [
//         WeDontTalkAboutBruno,
//         HerculesBelovedHero,
//         Brawl,
//         AladdinResoluteSwordsman,
//         ArgesTheCyclops,
//       ],
//     });
//
//     Await testEngine.playCard(weDontTalkAboutBruno, {
//       Targets: [aladdinBraveRescuer],
//     });
//
//     Expect(testEngine.getCardModel(aladdinBraveRescuer).zone).not.toBe("play");
//     Expect(testEngine.getZonesCardCount().hand).toBe(4);
//     Expect(testEngine.getZonesCardCount().discard).toBe(2);
//   });
//
//   It("Return chosen character to their player's hand, then that player discards a card at random.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: weDontTalkAboutBruno.cost,
//         Hand: [weDontTalkAboutBruno],
//       },
//       {
//         Play: [aladdinBraveRescuer],
//         Hand: [sisuEmboldenedWarrior],
//       },
//     );
//
//     Const cardUnderTest = testStore.getCard(weDontTalkAboutBruno);
//     Const target = testStore.getCard(aladdinBraveRescuer);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//     Expect(testStore.getZonesCardCount("player_two").hand).toBe(1);
//   });
//
//   It("No cards in hand and a single card in play", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: weDontTalkAboutBruno.cost,
//         Hand: [weDontTalkAboutBruno],
//       },
//       {
//         Play: [aladdinBraveRescuer],
//       },
//     );
//
//     Await testEngine.playCard(weDontTalkAboutBruno);
//
//     Expect(testEngine.store.stackLayerStore.topLayer?.id).toContain("_move");
//
//     Await testEngine.resolveTopOfStack({ targets: [aladdinBraveRescuer] });
//
//     Expect(testEngine.getCardModel(aladdinBraveRescuer).zone).toBe("discard");
//   });
// });
//
// Describe("Regression", () => {
//   It("Should not discard from hand if no valid target to return to hand", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: weDontTalkAboutBruno.cost,
//         Hand: [weDontTalkAboutBruno],
//       },
//       {
//         Hand: [aladdinBraveRescuer],
//       },
//     );
//
//     Await testEngine.playCard(weDontTalkAboutBruno);
//
//     Expect(testEngine.getCardModel(aladdinBraveRescuer).zone).toBe("hand");
//     Expect(testEngine.store.stackLayerStore.layers).toHaveLength(0);
//   });
// });
//
