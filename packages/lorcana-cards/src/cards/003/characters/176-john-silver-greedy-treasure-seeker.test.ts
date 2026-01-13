// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { johnSilverGreedyTreasureSeeker } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// import { rapunzelsTowerSecludedPrison } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("John Silver - Greedy Treasure Seeker", () => {
//   describe("**CHART YOUR OWN COURSE** For each location you have in play, this character gains **Resist** +1 and gets +1 {L}. _(Damage dealt to them is reduced by 1.)_", () => {
//     it("For each location you have in play, this character gets +1 {L}.", () => {
//       const testStore = new TestStore({
//         inkwell: johnSilverGreedyTreasureSeeker.cost,
//         play: [johnSilverGreedyTreasureSeeker, rapunzelsTowerSecludedPrison],
//       });
//
//       const cardUnderTest = testStore.getCard(johnSilverGreedyTreasureSeeker);
//
//       expect(cardUnderTest.lore).toEqual(
//         johnSilverGreedyTreasureSeeker.lore + 1,
//       );
//     });
//
//     it("For each location you have in play, this character gains **Resist** +1.", async () => {
//       const testEngine = new TestEngine({
//         inkwell: rapunzelsTowerSecludedPrison.cost,
//         play: [johnSilverGreedyTreasureSeeker],
//         hand: [rapunzelsTowerSecludedPrison],
//       });
//
//       const cardUnderTest = testEngine.getCardModel(
//         johnSilverGreedyTreasureSeeker,
//       );
//
//       expect(cardUnderTest.damageReduction()).toEqual(0);
//
//       await testEngine.playCard(rapunzelsTowerSecludedPrison);
//
//       expect(cardUnderTest.damageReduction()).toEqual(1);
//     });
//   });
// });
//
