// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { pinocchioOnTheRun } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { sisuEmboldenedWarrior } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { olafHappyPassenger } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Olaf - Happy Passenger", () => {
//   It("**CLEAR THE PATH** For each exerted character opponents have in play, you pay 1 {I} less to play this character.<br/>**Evasive** _(Only characters with Evasive can challenge this character.)_", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: olafHappyPassenger.cost,
//         Hand: [olafHappyPassenger],
//       },
//       {
//         Play: [pinocchioOnTheRun, sisuEmboldenedWarrior],
//       },
//     );
//
//     Const cardUnderTest = testStore.getCard(olafHappyPassenger);
//     Const damagedCards = [
//       TestStore.getCard(pinocchioOnTheRun),
//       TestStore.getCard(sisuEmboldenedWarrior),
//     ];
//
//     DamagedCards.forEach((card) => {
//       Card.updateCardMeta({ exerted: true });
//     });
//
//     CardUnderTest.playFromHand();
//     Expect(cardUnderTest.zone).toEqual("play");
//     Expect(testStore.getAvailableInkwellCardCount()).toEqual(
//       OlafHappyPassenger.cost - (olafHappyPassenger.cost - damagedCards.length),
//     );
//   });
// });
//
