// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   AnnaDiplomaticQueen,
//   EdLaughingHyena,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Anna - Diplomatic Queen", () => {
//   Describe("**ROYAL RESOLUTION** When you play this character you may pay 2 {I} to chose one:* Each opponent choses and discards a card.* Chosen character gets +2 {S} this turn. * Banish chosen damaged character.", () => {
//     It("you MUST pay 2 {I} to chose one", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: annaDiplomaticQueen.cost,
//           Hand: [annaDiplomaticQueen],
//         },
//         {
//           Hand: [edLaughingHyena],
//           Deck: 1,
//         },
//       );
//
//       Const cardUnderTest = testStore.getCard(annaDiplomaticQueen);
//       Const target = testStore.getCard(edLaughingHyena);
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({ mode: "1" }, true);
//
//       Expect(testStore.stackLayers).toHaveLength(0);
//     });
//
//     It("Each opponent chooses and discards a card.", async () => {
//       Const testEngine = new TestEngine(
//         {
//           Inkwell: annaDiplomaticQueen.cost + 2,
//           Hand: [annaDiplomaticQueen],
//         },
//         {
//           Hand: [edLaughingHyena],
//           Deck: 1,
//         },
//       );
//
//       Const target = testEngine.getCardModel(edLaughingHyena);
//
//       Await testEngine.playCard(annaDiplomaticQueen);
//       Await testEngine.resolveOptionalAbility();
//       Await testEngine.resolveTopOfStack({ mode: "1" }, true);
//
//       Expect(testEngine.store.priorityPlayer).toEqual("player_two");
//       TestEngine.changeActivePlayer("player_two");
//       Await testEngine.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.zone).toBe("discard");
//     });
//
//     It("Chosen character gets +2 {S} this turn.", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: annaDiplomaticQueen.cost + 2,
//           Hand: [annaDiplomaticQueen],
//           Play: [edLaughingHyena],
//         },
//         {
//           Deck: 1,
//         },
//       );
//
//       Const cardUnderTest = testStore.getCard(annaDiplomaticQueen);
//       Const target = testStore.getCard(edLaughingHyena);
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({ mode: "2" }, true);
//       TestStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.strength).toBe(edLaughingHyena.strength + 2);
//
//       TestStore.passTurn();
//
//       Expect(target.strength).toBe(edLaughingHyena.strength);
//     });
//
//     It("Banish chosen damaged character.", () => {
//       Const testStore = new TestStore(
//         {
//           Inkwell: annaDiplomaticQueen.cost + 2,
//           Hand: [annaDiplomaticQueen],
//           Play: [edLaughingHyena],
//         },
//         {
//           Deck: 1,
//         },
//       );
//
//       Const cardUnderTest = testStore.getCard(annaDiplomaticQueen);
//       Const target = testStore.getCard(edLaughingHyena);
//       Target.updateCardMeta({ damage: 1 });
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveOptionalAbility();
//       TestStore.resolveTopOfStack({ mode: "3" }, true);
//       TestStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.zone).toBe("discard");
//     });
//   });
// });
//
// Describe("Regression", () => {
//   It("should not crash when playing a card with no cost", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: annaDiplomaticQueen.cost + 2,
//       Hand: [annaDiplomaticQueen],
//       Play: [edLaughingHyena],
//     });
//
//     Const cardUnderTest = await testEngine.playCard(annaDiplomaticQueen);
//     Await testEngine.acceptOptionalLayer();
//     Await testEngine.resolveTopOfStack({ mode: "2" }, true);
//     Await testEngine.resolveTopOfStack({ targets: [edLaughingHyena] });
//
//     Expect(testEngine.getCardModel(edLaughingHyena).strength).toBe(
//       EdLaughingHyena.strength + 2,
//     );
//   });
// });
//
