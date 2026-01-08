// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { fourDozenEggs } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// import { mulanReflecting } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Mulan - Reflecting", () => {
//   it("shift", () => {
//     const testStore = new TestStore({
//       play: [mulanReflecting],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("play", mulanReflecting.id);
//
//     expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   it("**HONOR TO THE ANCESTORS** Whenever this character quests, you may reveal the top card of your deck. If it's a song card, you may play it for free. Otherwise, put it on the top of your deck.", () => {
//     const testStore = new TestStore({
//       play: [mulanReflecting],
//       deck: [fourDozenEggs],
//     });
//
//     const cardUnderTest = testStore.getByZoneAndId("play", mulanReflecting.id);
//     const target = testStore.getByZoneAndId("deck", fourDozenEggs.id);
//
//     cardUnderTest.quest();
//
//     expect(testStore.stackLayers).toHaveLength(1);
//     testStore.resolveOptionalAbility();
//
//     expect(target.zone).toBe("discard");
//     expect(testStore.getZonesCardCount()).toEqual(
//       expect.objectContaining({ deck: 0 }),
//     );
//
//     // Four Dozen Eggs gives resist
//     expect(cardUnderTest.hasResist).toBe(true);
//   });
// });
//
