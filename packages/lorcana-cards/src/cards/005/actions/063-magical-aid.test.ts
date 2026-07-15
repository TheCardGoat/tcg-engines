// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { pinocchioOnTheRun } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { magicalAid } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Magical Aid", () => {
//   It("Chosen character gains **Challenger** +3 and When this character is banished in a challenge, return this card to your hand this turn. _(They get +3 {S} while challenging.)_", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: magicalAid.cost,
//         Hand: [magicalAid],
//         Play: [liloMakingAWish],
//       },
//       {
//         Play: [pinocchioOnTheRun],
//       },
//     );
//
//     Const cardUnderTest = testStore.getCard(magicalAid);
//     Const challenger = testStore.getCard(liloMakingAWish);
//     Const defender = testStore.getCard(pinocchioOnTheRun);
//
//     Defender.updateCardMeta({ exerted: true });
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [challenger] });
//     Expect(challenger.hasChallenger).toEqual(true);
//
//     Challenger.challenge(defender);
//     Expect(challenger.zone).toEqual("hand");
//   });
// });
//
