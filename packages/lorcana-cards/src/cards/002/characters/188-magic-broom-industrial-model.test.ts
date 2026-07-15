// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   GoofyKnightForADay,
//   MagicBroomIndustrialModel,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Magic Broom- Industrial Model", () => {
//   It("**MAKE IT SHINE** When you play this character, chosen character gains **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: magicBroomIndustrialModel.cost,
//         Hand: [magicBroomIndustrialModel],
//         Play: [goofyKnightForADay],
//         Deck: 1,
//       },
//       { deck: 2 },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       MagicBroomIndustrialModel.id,
//     );
//     Const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.hasResist).toBe(true);
//     TestStore.passTurn();
//     Expect(target.hasResist).toBe(true);
//     TestStore.passTurn();
//     Expect(target.hasResist).toBe(false);
//   });
// });
//
