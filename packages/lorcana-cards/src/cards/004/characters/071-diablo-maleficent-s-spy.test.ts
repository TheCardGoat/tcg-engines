// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MickeyBraveLittleTailor,
//   MickeyMouseArtfulRogue,
//   MickeyMouseTrueFriend,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { diabloMaleficentsSpy } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Diablo - Maleficent's Spy", () => {
//   It("**SCOUT AHEAD** When you play this character, you may look at each opponent's hand.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: diabloMaleficentsSpy.cost,
//         Hand: [diabloMaleficentsSpy],
//       },
//       {
//         Hand: [
//           MickeyBraveLittleTailor,
//           MickeyMouseArtfulRogue,
//           MickeyMouseTrueFriend,
//         ],
//       },
//     );
//
//     Const cardUnderTest = testStore.getCard(diabloMaleficentsSpy);
//     CardUnderTest.playFromHand();
//     // testStore.resolveOptionalAbility(true);
//
//     Const targets = [
//       TestStore.getByZoneAndId(
//         "hand",
//         MickeyBraveLittleTailor.id,
//         "player_two",
//       ),
//       TestStore.getByZoneAndId("hand", mickeyMouseArtfulRogue.id, "player_two"),
//       TestStore.getByZoneAndId("hand", mickeyMouseTrueFriend.id, "player_two"),
//     ];
//
//     CardUnderTest.playFromHand();
//
//     Targets.forEach((card) => {
//       Expect(card.meta.revealed).toEqual(true);
//     });
//   });
// });
//
