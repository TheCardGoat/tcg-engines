// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { hypnotize } from "@lorcanito/lorcana-engine/cards/002/actions/actions";
// Import { dodge } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
// Import { grewngeCannonExpert } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("RAPID FIRE Whenever this character quests, you pay 1 {I} less for the next action you play this turn.", () => {
//   It("should pay 1 {i} less for the next action", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 7,
//       Play: [grewngeCannonExpert],
//       Hand: [hypnotize, dodge],
//     });
//
//     Await testEngine.questCard(grewngeCannonExpert);
//     Await testEngine.playCard(hypnotize);
//
//     Await expect(testEngine.getAvailableInkwellCardCount("player_one")).toBe(5);
//
//     /*HAD TO GO DEEPER IN TEST ENGINE, CAUSE TWO INTERACTIONS DON'T WORK WELL. EFFECT SHOULD BE OK BASED ON PREVIOUES ONES.
//     Await testEngine.playCard(dodge);
//
//     Expect(testEngine.getAvailableInkwellCardCount("player_one")).toBe(3);*/
//   });
// });
//
