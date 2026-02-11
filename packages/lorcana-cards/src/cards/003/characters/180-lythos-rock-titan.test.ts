// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { lythosRockTitan } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Lythos - Rock Titan", () => {
//   It.skip("**Resist** +2 _(Damage dealt to this character is reduced by 2.)_**STONE SKIN** {E} − Chosen character gains **Resist** +2 this turn.", () => {
//     Const testStore = new TestStore({
//       Play: [lythosRockTitan],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", lythosRockTitan.id);
//     Expect(cardUnderTest.hasResist).toBe(true);
//   });
// });
//
