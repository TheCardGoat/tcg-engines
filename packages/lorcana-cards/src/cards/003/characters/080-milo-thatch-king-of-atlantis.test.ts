// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { miloThatchKingOfAtlantis } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Milo Thatch - King of Atlantis", () => {
//   It.skip("**Shift** 4 _(You may pay 4 ink to play this on top of one of your characters named Milo Thatch.)_**TAKE THEM BY SURPRISE** When this character is banished, return all opposing characters to their players’ hands.", () => {
//     Const testStore = new TestStore({
//       Play: [miloThatchKingOfAtlantis],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       MiloThatchKingOfAtlantis.id,
//     );
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
// });
//
