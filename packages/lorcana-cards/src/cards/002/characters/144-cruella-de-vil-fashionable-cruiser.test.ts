// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { cruellaDeVilFashionableCruiser } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Cruella De Vil - Fashionable Cruiser", () => {
//   it("Now Get Going", () => {
//     const testStore = new TestStore(
//       {
//         play: [cruellaDeVilFashionableCruiser],
//       },
//       { deck: 1 },
//     );
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       cruellaDeVilFashionableCruiser.id,
//     );
//
//     expect(cardUnderTest.hasEvasive).toEqual(true);
//     testStore.passTurn();
//     expect(cardUnderTest.hasEvasive).toEqual(false);
//   });
// });
//
