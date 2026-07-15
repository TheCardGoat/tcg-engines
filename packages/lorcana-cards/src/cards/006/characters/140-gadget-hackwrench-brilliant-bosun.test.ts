// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { donaldDuckStruttingHisStuff } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
// Import { gadgetHackwrenchBrilliantBosun } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Gadget Hackwrench - Brilliant Bosun", () => {
//   It("**MECHANICALLY SAVVY** While you have 3 or more items in play, you pay 1 {I} less to play Inventor characters.", () => {
//     Const testStore = new TestEngine({
//       Play: [gadgetHackwrenchBrilliantBosun, pawpsicle, pawpsicle, pawpsicle],
//       Hand: [donaldDuckStruttingHisStuff],
//     });
//
//     Const cardUnderTest = testStore.getCardModel(donaldDuckStruttingHisStuff);
//
//     Expect(cardUnderTest.cost).toBe(donaldDuckStruttingHisStuff.cost - 1);
//   });
// });
//
