// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { littleJohnRobinsCompanion } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Little John - Robin's Companion", () => {
//   It.skip("**Bodyguard** _(This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)_**DISGUISED** During your turn, this character gains **Evasive**. _(They can challenge characters with Evasive.)_", () => {
//     Const testStore = new TestStore({
//       Play: [littleJohnRobinsCompanion],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       LittleJohnRobinsCompanion.id,
//     );
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
// });
//
