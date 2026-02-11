// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { iFindEmIFlattenEm } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("I Find 'Em, I Flatten 'Em", () => {
//   It.skip("_(A character with cost 4 or more can {E} to sing this song for free.)_Banish all items.", () => {
//     Const testStore = new TestStore({
//       Inkwell: iFindEmIFlattenEm.cost,
//       Hand: [iFindEmIFlattenEm],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       IFindEmIFlattenEm.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
