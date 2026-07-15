// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { brunoMadrigalOutOfTheShadows } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Bruno Madrigal - Out of the Shadows", () => {
//   It.skip("**IT WAS YOUR VISION** When you play this character, chosen character gains 'When this character is banished in a challenge, you may return this card to your hand' this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: brunoMadrigalOutOfTheShadows.cost,
//       Hand: [brunoMadrigalOutOfTheShadows],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       BrunoMadrigalOutOfTheShadows.id,
//     );
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
