// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { johnSilverGreedyTreasureSeeker } from "@lorcanito/lorcana-engine/cards/009/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("John Silver - Greedy Treasure Seeker", () => {
//   It.skip("**CHART YOUR OWN COURSE** For each location you have in play, this character gains **Resist** +1 and gets +1 {L}. _(Damage dealt to them is reduced by 1.)_", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: johnSilverGreedyTreasureSeeker.cost,
//       Play: [johnSilverGreedyTreasureSeeker],
//       Hand: [johnSilverGreedyTreasureSeeker],
//     });
//
//     Await testEngine.playCard(johnSilverGreedyTreasureSeeker);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
