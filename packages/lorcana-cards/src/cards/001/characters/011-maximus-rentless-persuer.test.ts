// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   MaximusRentlessPersuer,
//   MickeyMouseTrueFriend,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Maximus Relentless Pursuer!", () => {
//   It("HORSE KICK effect - Chosen characters gets -2 {S} this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: maximusRentlessPersuer.cost,
//       Hand: [maximusRentlessPersuer],
//       Play: [mickeyMouseTrueFriend],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       MaximusRentlessPersuer.id,
//     );
//     Const target = testStore.getByZoneAndId("play", mickeyMouseTrueFriend.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targetId: target.instanceId });
//
//     Expect(target.strength).toEqual((target.lorcanitoCard.strength || 0) - 2);
//   });
// });
//
