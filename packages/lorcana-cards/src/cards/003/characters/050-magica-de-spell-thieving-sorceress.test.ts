// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { magicaDeSpellThievingSorceress } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Magica De Spell - Thieving Sorceress", () => {
//   it.skip("**TELEKINESIS** {E} – Return chosen item with cost equal to or less than this character's {S} to its player's hand.", () => {
//     const testStore = new TestStore({
//       inkwell: magicaDeSpellThievingSorceress.cost,
//       play: [magicaDeSpellThievingSorceress],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       magicaDeSpellThievingSorceress.id,
//     );
//
//     cardUnderTest.playFromHand();
//     testStore.resolveOptionalAbility();
//     testStore.resolveTopOfStack({});
//   });
// });
//
