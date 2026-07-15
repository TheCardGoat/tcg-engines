// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { beastSelflessProtector } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Beast - Selfless Protector", () => {
//   It("**SHIELD ANOTHER** Whenever one of your other characters would be dealt damage, put that many damage counters on this character instead.", () => {
//     Const testStore = new TestStore({
//       Play: [beastSelflessProtector],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       BeastSelflessProtector.id,
//     );
//
//     Expect(cardUnderTest.hasProtector).toEqual(true);
//   });
// });
//
