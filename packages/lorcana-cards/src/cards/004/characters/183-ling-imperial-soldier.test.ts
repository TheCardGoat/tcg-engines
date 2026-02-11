// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { lingImperialSoldier } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Ling - Imperial Soldier", () => {
//   It.skip("**FULL OF SPIRIT** Your Hero characters get +1 {S}.", () => {
//     Const testStore = new TestStore({
//       Inkwell: lingImperialSoldier.cost,
//       Play: [lingImperialSoldier],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       LingImperialSoldier.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
