// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { lingImperialSoldier } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Ling - Imperial Soldier", () => {
//   it.skip("**FULL OF SPIRIT** Your Hero characters get +1 {S}.", () => {
//     const testStore = new TestStore({
//       inkwell: lingImperialSoldier.cost,
//       play: [lingImperialSoldier],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       lingImperialSoldier.id,
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
