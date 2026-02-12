// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { magicaDeSpellThievingSorceress } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Magica De Spell - Thieving Sorceress", () => {
//   It.skip("**TELEKINESIS** {E} – Return chosen item with cost equal to or less than this character's {S} to its player's hand.", () => {
//     Const testStore = new TestStore({
//       Inkwell: magicaDeSpellThievingSorceress.cost,
//       Play: [magicaDeSpellThievingSorceress],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       MagicaDeSpellThievingSorceress.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
