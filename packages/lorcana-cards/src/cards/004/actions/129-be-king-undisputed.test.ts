// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { princeJohnGreediestOfAll } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { beKingUndisputed } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { magicBroomLivelySweeper } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Be King Undisputed", () => {
//   It("Each opponent chooses and banishes one of their characters.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: beKingUndisputed.cost,
//         Hand: [beKingUndisputed],
//       },
//       {
//         Play: [magicBroomLivelySweeper],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", beKingUndisputed.id);
//     Const target = testStore.getByZoneAndId(
//       "play",
//       MagicBroomLivelySweeper.id,
//       "player_two",
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.changePlayer().resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toBe("discard");
//   });
//
//   It("Only targetable character has ward", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: beKingUndisputed.cost,
//         Hand: [beKingUndisputed],
//       },
//       {
//         Play: [princeJohnGreediestOfAll],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", beKingUndisputed.id);
//     Const target = testStore.getByZoneAndId(
//       "play",
//       PrinceJohnGreediestOfAll.id,
//       "player_two",
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.changePlayer().resolveTopOfStack({ targets: [target] });
//
//     Expect(target.zone).toBe("discard");
//   });
// });
//
