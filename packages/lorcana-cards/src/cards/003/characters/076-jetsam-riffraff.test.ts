// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { jetsamRiffraff } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Jetsam - Riffraff", () => {
//   it.skip("**Ward** _(Opponents can't choose this character except to challenge.)_**EERIE PAIR** Your characters named Flotsam gain **Ward**.", () => {
//     const testStore = new TestStore({
//       play: [jetsamRiffraff],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("play", jetsamRiffraff.id);
//     expect(cardUnderTest.hasWard).toBe(true);
//   });
// });
//
