// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { idunaCaringMother } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Iduna - Caring Mother", () => {
//   It.skip("**ENDURING LOVE** When this character is banished, you may put this card into your inkwell facedown and exerted.", () => {
//     Const testStore = new TestStore({
//       Inkwell: idunaCaringMother.cost,
//       Play: [idunaCaringMother],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       IdunaCaringMother.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
