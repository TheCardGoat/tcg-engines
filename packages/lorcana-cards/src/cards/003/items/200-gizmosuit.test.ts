// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { gizmosuit } from "@lorcanito/lorcana-engine/cards/003/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Gizmosuit", () => {
//   It.skip("**CYBERNETIC ARMOR** Banish this item – Chosen character gains **Resist** +2 until the start of your next turn. (Damage dealt to them is reduced by 2.)", () => {
//     Const testStore = new TestStore({
//       Inkwell: gizmosuit.cost,
//       Play: [gizmosuit],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", gizmosuit.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
