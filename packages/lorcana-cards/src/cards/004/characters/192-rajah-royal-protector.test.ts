// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { rajahRoyalProtector } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Rajah - Royal Protector", () => {
//   It.skip("**STEADY GAZE** While you have no cards in your hand, characters with cost 4 or less can't challenge this character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: rajahRoyalProtector.cost,
//       Play: [rajahRoyalProtector],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       RajahRoyalProtector.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
