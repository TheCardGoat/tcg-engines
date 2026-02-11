// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { theMusesProclaimersOfHeroes } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { fidgetSneakyBat } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("EVASIVE (Only characters with Evasive can challenge this character.)", () => {
//   It.skip("", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: fidgetSneakyBat.cost,
//       Play: [fidgetSneakyBat],
//       Hand: [fidgetSneakyBat],
//     });
//
//     Await testEngine.playCard(fidgetSneakyBat);
//
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({});
//   });
// });
//
// Describe("TOOK CARE OF EVERYTHING Whenever this character quests, another chosen character of yours gain Evasive until the start of your next turn.", () => {
//   It("another character should gain Evasive", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: fidgetSneakyBat.cost,
//       Play: [fidgetSneakyBat, theMusesProclaimersOfHeroes],
//       Hand: [],
//     });
//
//     Const target = testEngine.getCardModel(theMusesProclaimersOfHeroes);
//
//     Expect(target.hasEvasive).toBe(false);
//
//     Await testEngine.questCard(fidgetSneakyBat);
//
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//
//     Expect(target.hasEvasive).toBe(true);
//   });
// });
//
