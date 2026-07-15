// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   PainUnderworldImp,
//   PanicUnderworldImp,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Pain - Underworld Imp", () => {
//   It("**COMING, YOUR MOST LUGUBRIOUSNESS** While this character has 5 {S} or more, he gets + 2 {L}.", () => {
//     Const testStore = new TestStore({
//       Inkwell: panicUnderworldImp.cost,
//       Hand: [panicUnderworldImp],
//       Play: [painUnderworldImp],
//     });
//
//     Const buff = testStore.getByZoneAndId("hand", panicUnderworldImp.id);
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       PainUnderworldImp.id,
//     );
//
//     Buff.playFromHand();
//     TestStore.resolveTopOfStack({ targets: [cardUnderTest] });
//
//     Expect(cardUnderTest.strength).toBe(painUnderworldImp.strength + 4);
//     Expect(cardUnderTest.lore).toBe(painUnderworldImp.lore + 2);
//   });
// });
//
