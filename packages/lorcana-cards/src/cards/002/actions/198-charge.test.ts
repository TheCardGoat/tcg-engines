// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { charge } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Charge", () => {
//   It("Chosen character gains **Challenger** +2 and **Resist** +2 this turn. _(They get +2 {S} while challenging. Damage dealt to them is reduced by 2.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: charge.cost,
//       Hand: [charge],
//       Play: [goofyKnightForADay],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("hand", charge.id);
//     Const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.hasChallenger).toBe(true);
//     Expect(target.hasResist).toBe(true);
//
//     TestStore.passTurn();
//
//     Expect(target.hasChallenger).toBe(false);
//     Expect(target.hasResist).toBe(false);
//   });
// });
//
