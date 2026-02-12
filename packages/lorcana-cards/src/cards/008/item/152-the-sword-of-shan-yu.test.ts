// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { mulanArmoredFighter } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import {
//   KhanWarHorse,
//   PerditaOnTheLookout,
//   TheSwordOfShanYu,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("The Sword Of Shan Yu", () => {
//   It("WORTHY WEAPON {E}, {E} one of your characters - Ready chosen character. They can't quest for the rest of this turn.", async () => {
//     Const testEngine = new TestEngine({
//       Play: [theSwordOfShanYu, perditaOnTheLookout, khanWarHorse],
//     });
//
//     Await testEngine.tapCard(perditaOnTheLookout);
//
//     Await testEngine.activateCard(theSwordOfShanYu, {
//       Costs: [khanWarHorse],
//     });
//
//     Expect(testEngine.getCardModel(perditaOnTheLookout).exerted).toBe(true);
//     Expect(testEngine.getCardModel(khanWarHorse).exerted).toBe(true);
//
//     Await testEngine.resolveTopOfStack({ targets: [perditaOnTheLookout] });
//
//     Expect(testEngine.getCardModel(perditaOnTheLookout).exerted).toBe(false);
//     Expect(testEngine.getCardModel(perditaOnTheLookout).canQuest).toBe(false);
//   });
//
//   It("WORTHY WEAPON {E}, {E} one of your characters - Ready chosen character. They can't quest for the rest of this turn. (no drying characters)", async () => {
//     Const testEngine = new TestEngine({
//       Play: [theSwordOfShanYu, khanWarHorse],
//       Hand: [mulanArmoredFighter],
//       Inkwell: mulanArmoredFighter.cost,
//     });
//
//     Await testEngine.playCard(mulanArmoredFighter);
//     Await testEngine.activateCard(
//       TheSwordOfShanYu,
//       {
//         Costs: [mulanArmoredFighter],
//       },
//       True,
//     );
//
//     Expect(testEngine.getCardModel(mulanArmoredFighter).exerted).toBe(false);
//   });
// });
//
