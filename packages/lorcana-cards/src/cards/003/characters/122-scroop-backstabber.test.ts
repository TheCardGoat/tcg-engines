// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { scroopBackstabber } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Scroop - Backstabber", () => {
//   it.skip("**BRUTE** While this character has damage, he gets +3 {S}.", () => {
//     const testStore = new TestStore({
//       inkwell: scroopBackstabber.cost,
//       play: [scroopBackstabber],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       scroopBackstabber.id,
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
