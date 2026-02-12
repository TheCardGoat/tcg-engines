// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { calhounHardnosedLeader } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Calhoun - Hard-Nosed Leader", () => {
//   It("Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [calhounHardnosedLeader],
//     });
//
//     Const cardUnderTest = testEngine.getCardModel(calhounHardnosedLeader);
//     Expect(cardUnderTest.hasBodyguard).toBe(true);
//   });
//
//   It("LOOT DROP When this character is banished, gain 1 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [calhounHardnosedLeader],
//     });
//
//     Const cardToTest = await testEngine.getCardModel(calhounHardnosedLeader);
//
//     Await cardToTest.banish();
//
//     Expect(cardToTest.zone).toEqual("discard");
//     Expect(testEngine.getLoreForPlayer("player_one")).toEqual(1);
//   });
// });
//
