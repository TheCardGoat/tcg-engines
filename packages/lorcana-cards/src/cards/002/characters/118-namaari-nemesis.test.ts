// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GoofyKnightForADay,
//   NamaariNemesis,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Namaari - Nemesis", () => {
//   It("**THIS SHOULDN'T TAKE LONG** {E}, Banish this character − Banish chosen character.", () => {
//     Const testStore = new TestStore(
//       {
//         Play: [namaariNemesis],
//       },
//       {
//         Play: [goofyKnightForADay],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", namaariNemesis.id);
//     Const target = testStore.getByZoneAndId(
//       "play",
//       GoofyKnightForADay.id,
//       "player_two",
//     );
//
//     CardUnderTest.activate();
//
//     TestStore.resolveTopOfStack({ targets: [target] });
//     Expect(target.zone).toBe("discard");
//     Expect(cardUnderTest.zone).toBe("discard");
//   });
// });
//
