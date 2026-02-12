// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { ursulaVanessa } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Ursula - Vanessa", () => {
//   It("**Singer** 4 _(This character counts as cost 4 to sing songs.)_", () => {
//     Const testStore = new TestStore({
//       Play: [ursulaVanessa],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", ursulaVanessa.id);
//     Expect(cardUnderTest.hasSinger).toBe(true);
//   });
// });
//
