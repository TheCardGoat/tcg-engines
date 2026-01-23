// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   goofyKnightForADay,
//   magicBroomIndustrialModel,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Magic Broom- Industrial Model", () => {
//   it("**MAKE IT SHINE** When you play this character, chosen character gains **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_", () => {
//     const testStore = new TestStore(
//       {
//         inkwell: magicBroomIndustrialModel.cost,
//         hand: [magicBroomIndustrialModel],
//         play: [goofyKnightForADay],
//         deck: 1,
//       },
//       { deck: 2 },
//     );
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       magicBroomIndustrialModel.id,
//     );
//     const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);
//
//     cardUnderTest.playFromHand();
//     testStore.resolveTopOfStack({ targets: [target] });
//
//     expect(target.hasResist).toBe(true);
//     testStore.passTurn();
//     expect(target.hasResist).toBe(true);
//     testStore.passTurn();
//     expect(target.hasResist).toBe(false);
//   });
// });
//
