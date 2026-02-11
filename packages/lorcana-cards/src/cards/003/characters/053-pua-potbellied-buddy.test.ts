// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { puaPotbelliedBuddy } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Pua - Potbellied Buddy", () => {
//   It.skip("**ALWAYS THERE** When this character is banished, you may shuffle this card into your deck.", () => {
//     Const testStore = new TestStore({
//       Inkwell: puaPotbelliedBuddy.cost,
//       Play: [puaPotbelliedBuddy],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       PuaPotbelliedBuddy.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
