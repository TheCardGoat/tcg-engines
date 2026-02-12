// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { giantCobraGhostlySerpent } from "@lorcanito/lorcana-engine/cards/007";
// Import {
//   DeweyLovableShowoff,
//   PullTheLever,
//   TheSultanRoyalApparition,
// } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Sultan - Royal Apparition", () => {
//   It("COMMANDING PRESENCE Whenever one of your Illusion characters quests, exert chosen opposing character.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Play: [theSultanRoyalApparition, giantCobraGhostlySerpent],
//       },
//       {
//         Play: [deweyLovableShowoff],
//       },
//     );
//
//     Const cardUnderTest = testEngine.getCardModel(theSultanRoyalApparition);
//     Const target = testEngine.getCardModel(giantCobraGhostlySerpent);
//     Const target2 = testEngine.getCardModel(deweyLovableShowoff);
//
//     Expect(target2.exerted).toEqual(false);
//
//     Await testEngine.questCard(target);
//
//     // await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({ targets: [target2] });
//
//     Expect(target2.exerted).toEqual(true);
//   });
// });
//
// Describe("Regression tests", () => {
//   It("Vanish (When an opponent chooses this character for an action, banish them.)", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: pullTheLever.cost,
//         Hand: [pullTheLever],
//         Deck: 10,
//       },
//       {
//         Play: [theSultanRoyalApparition],
//       },
//     );
//     Await testEngine.playCard(pullTheLever, { mode: "1" });
//
//     Expect(testEngine.getZonesCardCount()).toEqual(
//       Expect.objectContaining({
//         Hand: 2,
//         Deck: 8,
//       }),
//     );
//
//     Expect(testEngine.getCardModel(theSultanRoyalApparition).zone).toEqual(
//       "play",
//     );
//   });
// });
//
