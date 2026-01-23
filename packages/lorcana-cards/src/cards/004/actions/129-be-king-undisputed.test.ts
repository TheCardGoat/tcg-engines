// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { princeJohnGreediestOfAll } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { beKingUndisputed } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// import { magicBroomLivelySweeper } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Be King Undisputed", () => {
//   it("Each opponent chooses and banishes one of their characters.", () => {
//     const testStore = new TestStore(
//       {
//         inkwell: beKingUndisputed.cost,
//         hand: [beKingUndisputed],
//       },
//       {
//         play: [magicBroomLivelySweeper],
//       },
//     );
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", beKingUndisputed.id);
//     const target = testStore.getByZoneAndId(
//       "play",
//       magicBroomLivelySweeper.id,
//       "player_two",
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.changePlayer().resolveTopOfStack({ targets: [target] });
//
//     expect(target.zone).toBe("discard");
//   });
//
//   it("Only targetable character has ward", () => {
//     const testStore = new TestStore(
//       {
//         inkwell: beKingUndisputed.cost,
//         hand: [beKingUndisputed],
//       },
//       {
//         play: [princeJohnGreediestOfAll],
//       },
//     );
//
//     const cardUnderTest = testStore.getByZoneAndId("hand", beKingUndisputed.id);
//     const target = testStore.getByZoneAndId(
//       "play",
//       princeJohnGreediestOfAll.id,
//       "player_two",
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.changePlayer().resolveTopOfStack({ targets: [target] });
//
//     expect(target.zone).toBe("discard");
//   });
// });
//
