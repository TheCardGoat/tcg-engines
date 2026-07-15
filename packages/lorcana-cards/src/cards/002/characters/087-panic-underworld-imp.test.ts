// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { aladdinCorneredSwordman } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import {
//   PainUnderworldImp,
//   PanicUnderworldImp,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Panic - Underworld Imp", () => {
//   Describe("**I CAN HANDLE IT** When you play this character, chosen character gets +2 {S} this turn. If the chosen character is named Pain, he gets +4 {S} instead.", () => {
//     It("Targets Pain", () => {
//       Const testStore = new TestStore({
//         Inkwell: panicUnderworldImp.cost,
//         Hand: [panicUnderworldImp],
//         Play: [painUnderworldImp],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         PanicUnderworldImp.id,
//       );
//       Const target = testStore.getByZoneAndId("play", painUnderworldImp.id);
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.strength).toBe(painUnderworldImp.strength + 4);
//     });
//
//     It("NOT Targeting Pain", () => {
//       Const testStore = new TestStore({
//         Inkwell: panicUnderworldImp.cost,
//         Hand: [panicUnderworldImp],
//         Play: [aladdinCorneredSwordman],
//       });
//
//       Const cardUnderTest = testStore.getByZoneAndId(
//         "hand",
//         PanicUnderworldImp.id,
//       );
//       Const target = testStore.getByZoneAndId(
//         "play",
//         AladdinCorneredSwordman.id,
//       );
//
//       CardUnderTest.playFromHand();
//       TestStore.resolveTopOfStack({ targets: [target] });
//
//       Expect(target.strength).toBe(aladdinCorneredSwordman.strength + 2);
//     });
//   });
// });
//
