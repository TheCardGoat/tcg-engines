// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { pinocchioOnTheRun } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { whenWillMyLifeBegin } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("When Will My Life Begin?", () => {
//   It("Chosen character can’t challenge during their next turn. Draw a card.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: whenWillMyLifeBegin.cost,
//         Hand: [whenWillMyLifeBegin],
//         Play: [pinocchioOnTheRun],
//         Deck: 1,
//       },
//       {
//         Play: [liloMakingAWish],
//       },
//     );
//
//     Const cardUnderTest = testStore.getCard(whenWillMyLifeBegin);
//     Const target = testStore.getCard(liloMakingAWish);
//     Const defender = testStore.getCard(pinocchioOnTheRun);
//     Defender.updateCardMeta({ exerted: true });
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//     Expect(testStore.getZonesCardCount().hand).toEqual(1);
//
//     TestStore.passTurn();
//
//     Expect(target.canChallenge(defender)).toEqual(false);
//   });
// });
//
