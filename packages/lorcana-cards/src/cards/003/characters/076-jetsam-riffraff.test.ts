// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { jetsamRiffraff } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Jetsam - Riffraff", () => {
//   It.skip("**Ward** _(Opponents can't choose this character except to challenge.)_**EERIE PAIR** Your characters named Flotsam gain **Ward**.", () => {
//     Const testStore = new TestStore({
//       Play: [jetsamRiffraff],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", jetsamRiffraff.id);
//     Expect(cardUnderTest.hasWard).toBe(true);
//   });
// });
//
