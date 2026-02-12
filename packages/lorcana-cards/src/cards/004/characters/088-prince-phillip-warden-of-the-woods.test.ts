// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { princePhillipWardenOfTheWoods } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Prince Phillip - Warden of the Woods", () => {
//   It.skip("**SHINING BEACON** Your other Hero characters gain **Ward**. _(Opponents can't chose them except to challenge.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: princePhillipWardenOfTheWoods.cost,
//       Play: [princePhillipWardenOfTheWoods],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       PrincePhillipWardenOfTheWoods.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
