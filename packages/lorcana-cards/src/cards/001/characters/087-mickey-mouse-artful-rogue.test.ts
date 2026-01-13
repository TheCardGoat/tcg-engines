// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
// import { describe, expect, it } from "@jest/globals";
// import {
//   megaraPullingTheStrings,
//   mickeyMouseArtfulRogue,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { hakunaMatata } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Mickey Mouse - Artful Rogue", () => {
//   it("**MISDIRECTION** Whenever you play an action, chosen opposing character can't quest during their next turn.", () => {
//     const testStore = new TestStore(
//       {
//         inkwell: hakunaMatata.cost,
//         hand: [hakunaMatata],
//         play: [mickeyMouseArtfulRogue],
//       },
//       {
//         play: [megaraPullingTheStrings],
//       },
//     );
//
//     const actionCard = testStore.getByZoneAndId("hand", hakunaMatata.id);
//     const target = testStore.getByZoneAndId(
//       "play",
//       megaraPullingTheStrings.id,
//       "player_two",
//     );
//
//     actionCard.playFromHand();
//     testStore.resolveTopOfStack({ targets: [target] });
//
//     expect(target.hasQuestRestriction).toEqual(true);
//   });
//
//   it("Shift", () => {
//     const testStore = new TestStore({
//       play: [mickeyMouseArtfulRogue],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       mickeyMouseArtfulRogue.id,
//     );
//
//     expect(cardUnderTest.hasShift).toEqual(true);
//   });
// });
//
