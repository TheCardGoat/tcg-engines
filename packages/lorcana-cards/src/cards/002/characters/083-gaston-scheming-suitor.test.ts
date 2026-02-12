// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { gastonSchemingSuitor } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Gaston - Scheming Suitor", () => {
//   Describe("**YES, I'M INTIMIDATING** While one or more opponents have no cards in their hands, this character gets +3 {S}.", () => {
//     It("No Cards in Hand", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [gastonSchemingSuitor],
//         },
//         { hand: 0 },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         GastonSchemingSuitor.id,
//       );
//
//       Expect(cardUnderTest.strength).toEqual(gastonSchemingSuitor.strength + 3);
//     });
//
//     It("Cards in Hand", () => {
//       Const testStore = new TestStore(
//         {
//           Play: [gastonSchemingSuitor],
//         },
//         { hand: 1 },
//       );
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "play",
//         GastonSchemingSuitor.id,
//       );
//
//       Expect(cardUnderTest.strength).toEqual(gastonSchemingSuitor.strength);
//     });
//   });
// });
//
