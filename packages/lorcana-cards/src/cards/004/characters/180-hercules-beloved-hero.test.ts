// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { herculesBelovedHero } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Hercules - Beloved Hero", () => {
//   It.skip("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_**Resist +1** _(Damage dealt to this character is reduced by 1.)_", () => {
//     Const testStore = new TestStore({
//       Play: [herculesBelovedHero],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       HerculesBelovedHero.id,
//     );
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
// });
//
