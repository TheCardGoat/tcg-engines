// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { ticktockEverpresentPursuer } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Tick-Tock - Ever-Present Pursuer", () => {
//   it("**Evasive** _(Only characters with Evasive can challenge this character.)_", () => {
//     const testStore = new TestStore({
//       play: [ticktockEverpresentPursuer],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       ticktockEverpresentPursuer.id,
//     );
//     expect(cardUnderTest.hasEvasive).toBe(true);
//   });
// });
//
