// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   goofyKnightForADay,
//   namaariNemesis,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Namaari - Nemesis", () => {
//   it("**THIS SHOULDN'T TAKE LONG** {E}, Banish this character − Banish chosen character.", () => {
//     const testStore = new TestStore(
//       {
//         play: [namaariNemesis],
//       },
//       {
//         play: [goofyKnightForADay],
//       },
//     );
//
//     const cardUnderTest = testStore.getByZoneAndId("play", namaariNemesis.id);
//     const target = testStore.getByZoneAndId(
//       "play",
//       goofyKnightForADay.id,
//       "player_two",
//     );
//
//     cardUnderTest.activate();
//
//     testStore.resolveTopOfStack({ targets: [target] });
//     expect(target.zone).toBe("discard");
//     expect(cardUnderTest.zone).toBe("discard");
//   });
// });
//
