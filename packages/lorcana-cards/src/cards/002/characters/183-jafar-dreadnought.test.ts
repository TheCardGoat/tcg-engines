// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { liloMakingAWish } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { jafarDreadnought } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Jafar- Dreadnought", () => {
//   It("**NOW WHERE WERE WE?** During your turn, whenever this character banishes another character in a challenge, you may draw a card.", () => {
//     Const testStore = new TestStore(
//       {
//         Play: [jafarDreadnought],
//         Deck: 2,
//       },
//       {
//         Play: [liloMakingAWish],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", jafarDreadnought.id);
//     Const target = testStore.getByZoneAndId(
//       "play",
//       LiloMakingAWish.id,
//       "player_two",
//     );
//     Target.updateCardMeta({ exerted: true });
//
//     CardUnderTest.challenge(target);
//     TestStore.resolveOptionalAbility();
//
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Hand: 1,
//         Deck: 1,
//       }),
//     );
//   });
// });
//
