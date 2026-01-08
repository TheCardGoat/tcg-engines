// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, it } from "@jest/globals";
// import { johnSilverGreedyTreasureSeeker } from "@lorcanito/lorcana-engine/cards/009/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("John Silver - Greedy Treasure Seeker", () => {
//   it.skip("**CHART YOUR OWN COURSE** For each location you have in play, this character gains **Resist** +1 and gets +1 {L}. _(Damage dealt to them is reduced by 1.)_", async () => {
//     const testEngine = new TestEngine({
//       inkwell: johnSilverGreedyTreasureSeeker.cost,
//       play: [johnSilverGreedyTreasureSeeker],
//       hand: [johnSilverGreedyTreasureSeeker],
//     });
//
//     await testEngine.playCard(johnSilverGreedyTreasureSeeker);
//
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({});
//   });
// });
//
