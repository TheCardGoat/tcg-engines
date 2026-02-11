// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mirabelMadrigalGiftOfTheFamily } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Mirabel Madrigal - Gift of the Family", () => {
//   It.skip("**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_", () => {
//     Const testStore = new TestStore({
//       Play: [mirabelMadrigalGiftOfTheFamily],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       MirabelMadrigalGiftOfTheFamily.id,
//     );
//     Expect(cardUnderTest.hasSupport).toBe(true);
//   });
//
//   It.skip("**SAVING THE MIRACLE** Whenever this character quests, your other Madrigal characters get +1 {L} this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: mirabelMadrigalGiftOfTheFamily.cost,
//       Play: [mirabelMadrigalGiftOfTheFamily],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       MirabelMadrigalGiftOfTheFamily.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
