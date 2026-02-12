// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { fredMascotByDay } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Fred - Mascot by Day", () => {
//   It.skip("**HOW COOL IS THAT** Whenever this character is challenged, gain 2 lore.", () => {
//     Const testStore = new TestStore({
//       Inkwell: fredMascotByDay.cost,
//       Play: [fredMascotByDay],
//     });
//
//     Const cardUnderTest = testStore.getCard(fredMascotByDay);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
