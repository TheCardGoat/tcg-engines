// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { gastonSchemingSuitor } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Gaston - Scheming Suitor", () => {
//   describe("**YES, I'M INTIMIDATING** While one or more opponents have no cards in their hands, this character gets +3 {S}.", () => {
//     it("No Cards in Hand", () => {
//       const testStore = new TestStore(
//         {
//           play: [gastonSchemingSuitor],
//         },
//         { hand: 0 },
//       );
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         gastonSchemingSuitor.id,
//       );
//
//       expect(cardUnderTest.strength).toEqual(gastonSchemingSuitor.strength + 3);
//     });
//
//     it("Cards in Hand", () => {
//       const testStore = new TestStore(
//         {
//           play: [gastonSchemingSuitor],
//         },
//         { hand: 1 },
//       );
//
//       const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         gastonSchemingSuitor.id,
//       );
//
//       expect(cardUnderTest.strength).toEqual(gastonSchemingSuitor.strength);
//     });
//   });
// });
//
