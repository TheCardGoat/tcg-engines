// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { ticktockEverpresentPursuer } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Tick-Tock - Ever-Present Pursuer", () => {
//   It("**Evasive** _(Only characters with Evasive can challenge this character.)_", () => {
//     Const testStore = new TestStore({
//       Play: [ticktockEverpresentPursuer],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       TicktockEverpresentPursuer.id,
//     );
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
// });
//
