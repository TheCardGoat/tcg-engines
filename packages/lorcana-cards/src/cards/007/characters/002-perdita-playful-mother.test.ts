// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { rollyHungryPup } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
// Import { perditaPlayfulMother } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Perdita - Playful Mother", () => {
//   Describe("WHO'S NEXT? Whenever this character quests, you pay 2 {I} less for the next Puppy character you play this turn.", () => {
//     It("should pay 2 less for the next Puppy character you play this turn", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 10,
//         Play: [perditaPlayfulMother],
//         Hand: [rollyHungryPup],
//       });
//       Const targetPuppy = testEngine.getCardModel(rollyHungryPup);
//
//       Expect(targetPuppy.cost).toBe(rollyHungryPup.cost);
//       Await testEngine.questCard(perditaPlayfulMother);
//       Expect(targetPuppy.cost).toBe(rollyHungryPup.cost - 2);
//
//       Await testEngine.playCard(rollyHungryPup);
//       Expect(testEngine.getAvailableInkwellCardCount("player_one")).toBe(9);
//     });
//
//     It("should not discount the cost of non-Puppy characters", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 10,
//         Play: [perditaPlayfulMother],
//         Hand: [mickeyBraveLittleTailor, rollyHungryPup],
//       });
//       Const targetNonPuppy = testEngine.getCardModel(mickeyBraveLittleTailor);
//
//       Expect(targetNonPuppy.cost).toBe(mickeyBraveLittleTailor.cost);
//       Await testEngine.questCard(perditaPlayfulMother);
//       Expect(targetNonPuppy.cost).toBe(mickeyBraveLittleTailor.cost);
//
//       Await testEngine.playCard(mickeyBraveLittleTailor);
//       Expect(testEngine.getAvailableInkwellCardCount("player_one")).toBe(2);
//
//       Await testEngine.playCard(rollyHungryPup);
//       Expect(testEngine.getAvailableInkwellCardCount("player_one")).toBe(1);
//     });
//   });
//
//   Describe("DON'T BE AFRAID Your Puppy characters gain Ward. (Opponents can't choose them except to challenge.)", () => {
//     It("should give Ward only to Puppy characters", async () => {
//       Const testEngine = new TestEngine({
//         Inkwell: 10,
//         Play: [perditaPlayfulMother, rollyHungryPup, mickeyBraveLittleTailor],
//         Hand: [],
//       });
//
//       Expect(testEngine.getCardModel(rollyHungryPup).hasAbility("ward")).toBe(
//         True,
//       );
//       Expect(
//         TestEngine.getCardModel(mickeyBraveLittleTailor).hasAbility("ward"),
//       ).toBe(false);
//       Expect(
//         TestEngine.getCardModel(perditaPlayfulMother).hasAbility("ward"),
//       ).toBe(false);
//     });
//   });
// });
//
