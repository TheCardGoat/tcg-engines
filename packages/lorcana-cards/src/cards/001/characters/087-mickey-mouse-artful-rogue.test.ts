// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MegaraPullingTheStrings,
//   MickeyMouseArtfulRogue,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { hakunaMatata } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Mickey Mouse - Artful Rogue", () => {
//   It("**MISDIRECTION** Whenever you play an action, chosen opposing character can't quest during their next turn.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: hakunaMatata.cost,
//         Hand: [hakunaMatata],
//         Play: [mickeyMouseArtfulRogue],
//       },
//       {
//         Play: [megaraPullingTheStrings],
//       },
//     );
//
//     Const actionCard = testStore.getByZoneAndId("hand", hakunaMatata.id);
//     Const target = testStore.getByZoneAndId(
//       "play",
//       MegaraPullingTheStrings.id,
//       "player_two",
//     );
//
//     ActionCard.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.hasQuestRestriction).toEqual(true);
//   });
//
//   It("Shift", () => {
//     Const testStore = new TestStore({
//       Play: [mickeyMouseArtfulRogue],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       MickeyMouseArtfulRogue.id,
//     );
//
//     Expect(cardUnderTest.hasShift).toEqual(true);
//   });
// });
//
