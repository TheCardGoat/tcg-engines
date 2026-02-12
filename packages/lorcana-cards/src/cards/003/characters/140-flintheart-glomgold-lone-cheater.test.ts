// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { flintheartGlomgoldLoneCheater } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Flintheart Glomgold - Lone Cheater", () => {
//   It.skip("**THEY'LL NEVER SEE IT COMING!** During your turn, this character gains **Evasive**. _(They can challenge characters with Evasive.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: flintheartGlomgoldLoneCheater.cost,
//       Play: [flintheartGlomgoldLoneCheater],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       FlintheartGlomgoldLoneCheater.id,
//     );
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
