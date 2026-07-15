// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { johnSilverGreedyTreasureSeeker } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { rapunzelsTowerSecludedPrison } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("John Silver - Greedy Treasure Seeker", () => {
//   Describe("**CHART YOUR OWN COURSE** For each location you have in play, this character gains **Resist** +1 and gets +1 {L}. _(Damage dealt to them is reduced by 1.)_", () => {
//     It("For each location you have in play, this character gets +1 {L}.", () => {
//       Const testStore = new TestStore({
//         Inkwell: johnSilverGreedyTreasureSeeker.cost,
//         Play: [johnSilverGreedyTreasureSeeker, rapunzelsTowerSecludedPrison],
//       });
//
//       Const cardUnderTest = testStore.getCard(johnSilverGreedyTreasureSeeker);
//
//       Expect(cardUnderTest.lore).toEqual(
//         JohnSilverGreedyTreasureSeeker.lore + 1,
//       );
//     });
//
//     It("For each location you have in play, this character gains **Resist** +1.", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: rapunzelsTowerSecludedPrison.cost,
//         Play: [johnSilverGreedyTreasureSeeker],
//         Hand: [rapunzelsTowerSecludedPrison],
//       });
//
//       Const cardUnderTest = testEngine.getCardModel(
//         JohnSilverGreedyTreasureSeeker,
//       );
//
//       Expect(cardUnderTest.damageReduction()).toEqual(0);
//
//       Await testEngine.playCard(rapunzelsTowerSecludedPrison);
//
//       Expect(cardUnderTest.damageReduction()).toEqual(1);
//     });
//   });
// });
//
