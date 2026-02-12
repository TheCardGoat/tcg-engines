// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { zazuPrideLandsManager } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { forbiddenMountainMaleficentsCastle } from "@lorcanito/lorcana-engine/cards/003/locations/locations";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Zazu - Pride Land’s Manager", () => {
//   It("**IT’S TIME TO LEAVE!** While this character is at a location, he gets +1 lore.", () => {
//     Const testStore = new TestStore({
//       Inkwell: zazuPrideLandsManager.cost,
//       Play: [zazuPrideLandsManager, forbiddenMountainMaleficentsCastle],
//     });
//
//     Const cardUnderTest = testStore.getCard(zazuPrideLandsManager);
//     Const location = testStore.getCard(forbiddenMountainMaleficentsCastle);
//
//     Expect(cardUnderTest.lore).toEqual(zazuPrideLandsManager.lore);
//     CardUnderTest.enterLocation(location);
//     Expect(cardUnderTest.lore).toEqual(zazuPrideLandsManager.lore + 1);
//   });
// });
//
