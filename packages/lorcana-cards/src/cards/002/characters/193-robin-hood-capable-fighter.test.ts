// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   PrinceNaveenPennilessRoyal,
//   RobinHoodCapableFighter,
// } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Robin Hood- Capable Fighter", () => {
//   It("**SKIRMISH** {E} − Deal 1 damage to chosen character.", () => {
//     Const testStore = new TestStore({
//       Inkwell: robinHoodCapableFighter.cost,
//       Hand: [robinHoodCapableFighter],
//       Play: [princeNaveenPennilessRoyal],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "hand",
//       RobinHoodCapableFighter.id,
//     );
//     Const target = testStore.getByZoneAndId(
//       "play",
//       PrinceNaveenPennilessRoyal.id,
//     );
//
//     CardUnderTest.activate();
//     TestStore.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.meta.damage).toEqual(1);
//   });
// });
//
