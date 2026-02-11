// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { fieldOfIce } from "@lorcanito/lorcana-engine/cards/004/items/items";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Field of Ice", () => {
//   It.skip("**ICY DEFENSE** Whenever you play a character, they gain **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: fieldOfIce.cost,
//       Play: [fieldOfIce],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", fieldOfIce.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
