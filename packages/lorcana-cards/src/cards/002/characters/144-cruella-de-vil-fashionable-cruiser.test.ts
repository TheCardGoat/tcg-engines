// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { cruellaDeVilFashionableCruiser } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Cruella De Vil - Fashionable Cruiser", () => {
//   It("Now Get Going", () => {
//     Const testStore = new TestStore(
//       {
//         Play: [cruellaDeVilFashionableCruiser],
//       },
//       { deck: 1 },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       CruellaDeVilFashionableCruiser.id,
//     );
//
//     Expect(cardUnderTest.hasEvasive).toEqual(true);
//     TestStore.passTurn();
//     Expect(cardUnderTest.hasEvasive).toEqual(false);
//   });
// });
//
