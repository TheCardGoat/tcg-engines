// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   ArthurKingVictorious,
//   MerlinBackFromTheBermudas,
//   MonstroWhaleOfAWhale,
// } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Merlin - Back from the Bermudas", () => {
//   It("**LONG LIVE THE KING!** Your Arthur characters give **Resist** +1 _(Damage dealt to this character is reduced by 1)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: merlinBackFromTheBermudas.cost,
//       Play: [
//         MerlinBackFromTheBermudas,
//         ArthurKingVictorious,
//         MonstroWhaleOfAWhale,
//       ],
//     });
//
//     Const cardUnderTest = testStore.getCard(merlinBackFromTheBermudas);
//     Const arthur = testStore.getCard(arthurKingVictorious);
//     Const monstro = testStore.getCard(monstroWhaleOfAWhale);
//
//     Expect(cardUnderTest.hasResist).toEqual(false);
//     Expect(arthur.hasResist).toEqual(true);
//     Expect(monstro.hasResist).toEqual(false);
//   });
// });
//
