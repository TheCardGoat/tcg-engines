// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { arielSingingMermaid } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Ariel - Singing Mermaid", () => {
//   It.skip("**Singer** 7 _(This character counts as cost 7 to sing songs.)_", () => {
//     Const testStore = new TestStore({
//       Play: [arielSingingMermaid],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       ArielSingingMermaid.id,
//     );
//     Expect(cardUnderTest.hasSinger).toBe(true);
//   });
// });
//
