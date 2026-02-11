// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { magicBroomBucketBrigade } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { magicBroomTheBigSweeper } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { theSorcerersTowerWondrousWorkspace } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("The Sorcerer's Tower - Wondrous Workspace", () => {
//   It("**BROOM CLOSET** Your characters named Magic Broom may move here for free.", () => {
//     Const testStore = new TestStore({
//       Play: [
//         TheSorcerersTowerWondrousWorkspace,
//         MagicBroomBucketBrigade,
//         MagicBroomTheBigSweeper,
//       ],
//     });
//
//     Const cardUnderTest = testStore.getCard(theSorcerersTowerWondrousWorkspace);
//
//     Const magicBroomBucketBrigadeCard = testStore.getCard(
//       MagicBroomBucketBrigade,
//     );
//     Const magicBroomTheBigSweeperCard = testStore.getCard(
//       MagicBroomTheBigSweeper,
//     );
//
//     MagicBroomBucketBrigadeCard.enterLocation(cardUnderTest);
//     MagicBroomTheBigSweeperCard.enterLocation(cardUnderTest);
//
//     Expect(magicBroomBucketBrigadeCard.isAtLocation(cardUnderTest)).toBe(true);
//     Expect(magicBroomTheBigSweeperCard.isAtLocation(cardUnderTest)).toBe(true);
//     Expect(cardUnderTest.containsCharacter(magicBroomBucketBrigadeCard)).toBe(
//       True,
//     );
//     Expect(cardUnderTest.containsCharacter(magicBroomTheBigSweeperCard)).toBe(
//       True,
//     );
//   });
//
//   It.skip("**MAGICAL POWER** Characters get +1 {L} while here.", () => {
//     Const testStore = new TestStore({
//       Inkwell: theSorcerersTowerWondrousWorkspace.cost,
//       Play: [theSorcerersTowerWondrousWorkspace],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       TheSorcerersTowerWondrousWorkspace.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
