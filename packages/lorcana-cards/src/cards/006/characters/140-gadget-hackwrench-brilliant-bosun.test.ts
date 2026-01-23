// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { donaldDuckStruttingHisStuff } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items";
// import { gadgetHackwrenchBrilliantBosun } from "@lorcanito/lorcana-engine/cards/006/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Gadget Hackwrench - Brilliant Bosun", () => {
//   it("**MECHANICALLY SAVVY** While you have 3 or more items in play, you pay 1 {I} less to play Inventor characters.", () => {
//     const testStore = new TestEngine({
//       play: [gadgetHackwrenchBrilliantBosun, pawpsicle, pawpsicle, pawpsicle],
//       hand: [donaldDuckStruttingHisStuff],
//     });
//
//     const cardUnderTest = testStore.getCardModel(donaldDuckStruttingHisStuff);
//
//     expect(cardUnderTest.cost).toBe(donaldDuckStruttingHisStuff.cost - 1);
//   });
// });
//
