// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { criKeeLuckyCricket } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Cri-Kee - Lucky Cricket", () => {
//   It.skip("**SPREADING GOOD FORTUNE** When you play this character, your other characters get +3 {S} this turn.", () => {
//     Const testStore = new TestStore({
//       Inkwell: criKeeLuckyCricket.cost,
//       Hand: [criKeeLuckyCricket],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       CriKeeLuckyCricket.id,
//     );
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
