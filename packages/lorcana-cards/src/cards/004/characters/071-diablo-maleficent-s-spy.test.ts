// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   mickeyBraveLittleTailor,
//   mickeyMouseArtfulRogue,
//   mickeyMouseTrueFriend,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { diabloMaleficentsSpy } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Diablo - Maleficent's Spy", () => {
//   it("**SCOUT AHEAD** When you play this character, you may look at each opponent's hand.", () => {
//     const testStore = new TestStore(
//       {
//         inkwell: diabloMaleficentsSpy.cost,
//         hand: [diabloMaleficentsSpy],
//       },
//       {
//         hand: [
//           mickeyBraveLittleTailor,
//           mickeyMouseArtfulRogue,
//           mickeyMouseTrueFriend,
//         ],
//       },
//     );
//
//     const cardUnderTest = testStore.getCard(diabloMaleficentsSpy);
//     cardUnderTest.playFromHand();
//     // testStore.resolveOptionalAbility(true);
//
//     const targets = [
//       testStore.getByZoneAndId(
//         "hand",
//         mickeyBraveLittleTailor.id,
//         "player_two",
//       ),
//       testStore.getByZoneAndId("hand", mickeyMouseArtfulRogue.id, "player_two"),
//       testStore.getByZoneAndId("hand", mickeyMouseTrueFriend.id, "player_two"),
//     ];
//
//     cardUnderTest.playFromHand();
//
//     targets.forEach((card) => {
//       expect(card.meta.revealed).toEqual(true);
//     });
//   });
// });
//
