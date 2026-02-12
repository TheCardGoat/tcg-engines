// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   BePrepared,
//   GrabYourSword,
//   HakunaMatata,
// } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import {
//   OwlIslandSecludedEntrance,
//   PeterPanShadowCatcher,
//   StitchLittleTrickster,
// } from "@lorcanito/lorcana-engine/cards/006";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Owl's Island - Isolated Entrance", () => {
//   It("TEAMWORK For each character you have here, you pay 1 {I} less for the first action you play each turn.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: hakunaMatata.cost + owlIslandSecludedEntrance.moveCost * 2,
//       Play: [
//         OwlIslandSecludedEntrance,
//         PeterPanShadowCatcher,
//         StitchLittleTrickster,
//       ],
//       Hand: [hakunaMatata, grabYourSword],
//     });
//
//     Const actionCard = testEngine.getCardModel(hakunaMatata);
//     Const anotherActionCard = testEngine.getCardModel(grabYourSword);
//
//     Expect(actionCard.cost).toBe(hakunaMatata.cost);
//
//     Await testEngine.moveToLocation({
//       Location: owlIslandSecludedEntrance,
//       Character: peterPanShadowCatcher,
//     });
//
//     Expect(actionCard.cost).toBe(hakunaMatata.cost - 1);
//
//     Await testEngine.moveToLocation({
//       Location: owlIslandSecludedEntrance,
//       Character: stitchLittleTrickster,
//     });
//
//     Expect(actionCard.cost).toBe(hakunaMatata.cost - 2);
//     Expect(anotherActionCard.cost).toBe(grabYourSword.cost - 2);
//
//     Await testEngine.playCard(hakunaMatata);
//
//     Expect(anotherActionCard.cost).toBe(grabYourSword.cost);
//   });
//
//   It("LOTS TO LEARN Whenever you play a second action in a turn, gain 3 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: hakunaMatata.cost + grabYourSword.cost + bePrepared.cost,
//       Play: [owlIslandSecludedEntrance],
//       Hand: [hakunaMatata, grabYourSword, bePrepared],
//     });
//
//     Await testEngine.playCard(hakunaMatata);
//     Expect(testEngine.getLoreForPlayer("player_one")).toBe(0);
//     Await testEngine.playCard(grabYourSword);
//     Expect(testEngine.getLoreForPlayer("player_one")).toBe(3);
//     Await testEngine.playCard(bePrepared);
//     Expect(testEngine.getLoreForPlayer("player_one")).toBe(3);
//   });
// });
//
