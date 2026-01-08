// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { beastSelflessProtector } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Beast - Selfless Protector", () => {
//   it("**SHIELD ANOTHER** Whenever one of your other characters would be dealt damage, put that many damage counters on this character instead.", () => {
//     const testStore = new TestStore({
//       play: [beastSelflessProtector],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       beastSelflessProtector.id,
//     );
//
//     expect(cardUnderTest.hasProtector).toEqual(true);
//   });
// });
//
