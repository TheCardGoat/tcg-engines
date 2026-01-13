// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { miloThatchKingOfAtlantis } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Milo Thatch - King of Atlantis", () => {
//   it.skip("**Shift** 4 _(You may pay 4 ink to play this on top of one of your characters named Milo Thatch.)_**TAKE THEM BY SURPRISE** When this character is banished, return all opposing characters to their players’ hands.", () => {
//     const testStore = new TestStore({
//       play: [miloThatchKingOfAtlantis],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       miloThatchKingOfAtlantis.id,
//     );
//     expect(cardUnderTest.hasShift).toBe(true);
//   });
// });
//
