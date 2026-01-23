// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { lythosRockTitan } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Lythos - Rock Titan", () => {
//   it.skip("**Resist** +2 _(Damage dealt to this character is reduced by 2.)_**STONE SKIN** {E} − Chosen character gains **Resist** +2 this turn.", () => {
//     const testStore = new TestStore({
//       play: [lythosRockTitan],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("play", lythosRockTitan.id);
//     expect(cardUnderTest.hasResist).toBe(true);
//   });
// });
//
