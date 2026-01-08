// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { fredMascotByDay } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Fred - Mascot by Day", () => {
//   it.skip("**HOW COOL IS THAT** Whenever this character is challenged, gain 2 lore.", () => {
//     const testStore = new TestStore({
//       inkwell: fredMascotByDay.cost,
//       play: [fredMascotByDay],
//     });
//
//     const cardUnderTest = testStore.getCard(fredMascotByDay);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
