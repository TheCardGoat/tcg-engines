// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AladdinCorneredSwordman,
//   MaleficentBinding,
//   MauiHeroToAll,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { simbaPrideProtector } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Simba - Pride Protector", () => {
//   It("Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Simba.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [simbaPrideProtector],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(simbaPrideProtector);
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It.skip("UNDERSTAND THE BALANCE At the end of your turn, if this character is exerted, you may ready your other characters.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: simbaPrideProtector.cost,
//       Play: [simbaPrideProtector],
//       Hand: [simbaPrideProtector],
//     });
//
//     Await testEngine.playCard(simbaPrideProtector);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
// Describe("Regression", () => {
//   It("Untapping reckless should not ask to challenge again", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [simbaPrideProtector, mauiHeroToAll],
//       },
//       {
//         Play: [maleficentBinding, aladdinCorneredSwordman],
//         Deck: 1,
//       },
//     );
//
//     For (const card of [
//       MaleficentBinding,
//       AladdinCorneredSwordman,
//       SimbaPrideProtector,
//     ]) {
//       Await testEngine.tapCard(card);
//     }
//
//     Await testEngine.challenge({
//       Attacker: mauiHeroToAll,
//       Defender: aladdinCorneredSwordman,
//     });
//
//     Expect(testEngine.getCardModel(mauiHeroToAll).exerted).toBe(true);
//     Await testEngine.passTurn();
//     TestEngine.changeActivePlayer("player_one");
//     Await testEngine.resolveOptionalAbility();
//     Expect(testEngine.getCardModel(mauiHeroToAll).exerted).toBe(false);
//
//     Expect(testEngine.store.turnPlayer).toEqual("player_two");
//   });
//
//   // 7.4.4. Some triggered abilities are written as [Trigger Condition], if [Secondary Condition], [Effect]. These abilities check whether
//   // the secondary condition is true both when the effect would be added to the bag and again when the effect resolves.
//   It("Two Simbas should not untap each other", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [simbaPrideProtector, simbaPrideProtector],
//       },
//       {
//         Play: [maleficentBinding, aladdinCorneredSwordman],
//         Deck: 2,
//       },
//     );
//
//     Const simbaZero = testEngine.getCardModel(simbaPrideProtector, 0);
//     Const simbaOne = testEngine.getCardModel(simbaPrideProtector, 1);
//
//     For (const card of [simbaOne, simbaZero]) {
//       Await testEngine.tapCard(card);
//     }
//
//     Await testEngine.passTurn("player_one", true);
//
//     Expect(testEngine.store.turnPlayer).toEqual("player_one");
//     Expect(testEngine.stackLayers).toHaveLength(2);
//
//     // Both Simbas should be exerted
//     Expect(simbaOne.exerted).toBe(simbaZero.exerted);
//
//     TestEngine.resolveOptionalAbility();
//
//     // Only one Simba should be untapped
//     Expect(simbaOne.exerted).not.toBe(simbaZero.exerted);
//
//     TestEngine.resolveOptionalAbility();
//
//     // Only one Simba should be untapped
//     Expect(simbaOne.exerted).not.toBe(simbaZero.exerted);
//
//     Expect(testEngine.stackLayers).toHaveLength(0);
//     Expect(testEngine.store.turnPlayer).toEqual("player_two");
//   });
// });
//
