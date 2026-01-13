// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { pinocchioOnTheRun } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { sisuEmboldenedWarrior } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { olafHappyPassenger } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Olaf - Happy Passenger", () => {
//   it("**CLEAR THE PATH** For each exerted character opponents have in play, you pay 1 {I} less to play this character.<br/>**Evasive** _(Only characters with Evasive can challenge this character.)_", () => {
//     const testStore = new TestStore(
//       {
//         inkwell: olafHappyPassenger.cost,
//         hand: [olafHappyPassenger],
//       },
//       {
//         play: [pinocchioOnTheRun, sisuEmboldenedWarrior],
//       },
//     );
//
//     const cardUnderTest = testStore.getCard(olafHappyPassenger);
//     const damagedCards = [
//       testStore.getCard(pinocchioOnTheRun),
//       testStore.getCard(sisuEmboldenedWarrior),
//     ];
//
//     damagedCards.forEach((card) => {
//       card.updateCardMeta({ exerted: true });
//     });
//
//     cardUnderTest.playFromHand();
//     expect(cardUnderTest.zone).toEqual("play");
//     expect(testStore.getAvailableInkwellCardCount()).toEqual(
//       olafHappyPassenger.cost - (olafHappyPassenger.cost - damagedCards.length),
//     );
//   });
// });
//
