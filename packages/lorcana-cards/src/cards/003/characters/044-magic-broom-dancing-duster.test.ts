// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { magicBroomDancingDuster } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Magic Broom - Dancing Duster", () => {
//   It.skip("**ENERGETIC CLEANING** When you play this character, if you have a Sorcerer character in play, exert an opposing character. The chosen character doesn't ready at the start of their next turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: magicBroomDancingDuster.cost,
//       Hand: [magicBroomDancingDuster],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       MagicBroomDancingDuster.id,
//     );
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
