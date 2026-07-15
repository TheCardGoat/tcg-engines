// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   PeterPanShadowFinder,
//   TicktockEverpresentPursuer,
// } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Peter Pan - Shadow Finder", () => {
//   It("**Rush** _(This character can challenge the turn they're played.)_", () => {
//     Const testStore = new TestStore({
//       Play: [peterPanShadowFinder],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       PeterPanShadowFinder.id,
//     );
//     Expect(cardUnderTest.hasRush).toBe(true);
//   });
//
//   It("**Evasive** _(Only characters with Evasive can challenge this character.)_", () => {
//     Const testStore = new TestStore({
//       Play: [peterPanShadowFinder],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       PeterPanShadowFinder.id,
//     );
//     Expect(cardUnderTest.hasEvasive).toBe(true);
//   });
//
//   It("**FLY, OF COURSE!** Your other characters with **Evasive** gain **Rush.**", () => {
//     Const testStore = new TestStore({
//       Inkwell: peterPanShadowFinder.cost,
//       Hand: [peterPanShadowFinder],
//       Play: [ticktockEverpresentPursuer],
//     });
//
//     Const cardUnderTest = testStore.getCard(peterPanShadowFinder);
//     Const target = testStore.getCard(ticktockEverpresentPursuer);
//
//     Expect(target.hasEvasive).toBe(true);
//     Expect(target.hasRush).toBe(false);
//
//     CardUnderTest.playFromHand();
//
//     Expect(target.hasEvasive).toBe(true);
//     Expect(target.hasRush).toBe(true);
//
//     Console.log("Banishing Peter Pan");
//     CardUnderTest.banish();
//
//     Expect(target.hasEvasive).toBe(true);
//     Expect(target.hasRush).toBe(false);
//   });
// });
//
