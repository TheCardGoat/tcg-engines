// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { fourDozenEggs } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import { mulanReflecting } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Mulan - Reflecting", () => {
//   It("shift", () => {
//     Const testStore = new TestStore({
//       Play: [mulanReflecting],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", mulanReflecting.id);
//
//     Expect(cardUnderTest.hasShift).toBe(true);
//   });
//
//   It("**HONOR TO THE ANCESTORS** Whenever this character quests, you may reveal the top card of your deck. If it's a song card, you may play it for free. Otherwise, put it on the top of your deck.", () => {
//     Const testStore = new TestStore({
//       Play: [mulanReflecting],
//       Deck: [fourDozenEggs],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", mulanReflecting.id);
//     Const target = testStore.getByZoneAndId("deck", fourDozenEggs.id);
//
//     CardUnderTest.quest();
//
//     Expect(testStore.stackLayers).toHaveLength(1);
//     TestStore.resolveOptionalAbility();
//
//     Expect(target.zone).toBe("discard");
//     Expect(testStore.getZonesCardCount()).toEqual(
//       Expect.objectContaining({ deck: 0 }),
//     );
//
//     // Four Dozen Eggs gives resist
//     Expect(cardUnderTest.hasResist).toBe(true);
//   });
// });
//
