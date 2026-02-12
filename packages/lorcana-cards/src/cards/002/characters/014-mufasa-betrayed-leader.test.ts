// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { liloGalacticHero } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { letTheStormRageOn } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import {
//   GoofyKnightForADay,
//   MickeyMouseFriendlyFace,
//   MufasaBetrayedLeader,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Mufasa - Betrayed Leader", () => {
//   It("**THE SUN WILL SET** When this character is banished, you may reveal the top card of your deck. If it's a character card, you may play that character for free and they enter play exerted. Otherwise, put it on the top of your deck.", () => {
//     Const testStore = new TestStore({
//       Play: [mufasaBetrayedLeader],
//       Deck: [goofyKnightForADay],
//     });
//
//     Const cardUnderTest = testStore.getCard(mufasaBetrayedLeader);
//     Const target = testStore.getCard(goofyKnightForADay);
//
//     CardUnderTest.banish();
//
//     Expect(testStore.stackLayers).toHaveLength(1);
//     TestStore.resolveOptionalAbility();
//
//     Expect(target.zone).toBe("play");
//     Expect(target.meta.exerted).toBe(true);
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({ deck: 0 }),
//     );
//   });
// });
//
// Describe("Regressions", () => {
//   It("Removed on opponent's turn", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: letTheStormRageOn.cost,
//         Hand: [letTheStormRageOn],
//         Deck: [mickeyMouseFriendlyFace, liloGalacticHero],
//       },
//       {
//         Play: [mufasaBetrayedLeader],
//         Deck: [goofyKnightForADay],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(mufasaBetrayedLeader);
//     Const target = testEngine.getCardModel(goofyKnightForADay);
//     Const notTarget = testEngine.getCardModel(mickeyMouseFriendlyFace);
//
//     CardUnderTest.updateCardMeta({
//       Damage: mufasaBetrayedLeader.willpower - 1,
//     });
//
//     Await testEngine.playCard(letTheStormRageOn);
//     Await testEngine.resolveTopOfStack({ targets: [cardUnderTest] }, true);
//
//     TestEngine.changeActivePlayer("player_two");
//     Await testEngine.resolveOptionalAbility();
//
//     Expect(notTarget.zone).toBe("deck");
//     Expect(target.zone).toBe("play");
//     Expect(target.meta.exerted).toBe(true);
//     Expect(testEngine.getZonesCardCount("player_two")).toEqual(
//       Expect.objectContaining({ deck: 0 }),
//     );
//   });
// });
//
