// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { naniProtectiveSister } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Nani - Protective Sister", () => {
//   It.skip("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_", () => {
//     Const testStore = new TestStore({
//       Play: [naniProtectiveSister],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       NaniProtectiveSister.id,
//     );
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
// });
//
