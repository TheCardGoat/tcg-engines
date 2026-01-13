// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import { chernabogCreatureOfTheNight } from "@lorcanito/lorcana-engine/cards/007/index";
// import {
//   archimedesResourcefulOwl,
//   deweyLovableShowoff,
// } from "@lorcanito/lorcana-engine/cards/008";
// import { cardEffectTargetPredicate } from "@lorcanito/lorcana-engine/effects/effectTargets";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Chernabog - Creature of the Night", () => {
//   it("MIDNIGHT FESTIVITIES When you play this character, each opponent chooses one of their readied characters and exhausts it. Characters exhausted this way do not ready at the start of their next turn.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: chernabogCreatureOfTheNight.cost,
//         hand: [chernabogCreatureOfTheNight],
//       },
//       {
//         play: [deweyLovableShowoff],
//       },
//     );
//
//     const target = testEngine.getCardModel(deweyLovableShowoff);
//     expect(target.exerted).toBe(false);
//
//     await testEngine.playCard(chernabogCreatureOfTheNight);
//
//     testEngine.changeActivePlayer("player_two");
//     await testEngine.resolveTopOfStack({ targets: [target] });
//
//     // Character should be exerted
//     expect(target.exerted).toBe(true);
//   });
//
//   it("should only allow opponent to choose ready characters, not already exerted ones", async () => {
//     // Arrange: Set up game where opponent has both ready and exerted characters
//     const testEngine = new TestEngine(
//       {
//         inkwell: chernabogCreatureOfTheNight.cost,
//         hand: [chernabogCreatureOfTheNight],
//       },
//       {
//         play: [deweyLovableShowoff, archimedesResourcefulOwl],
//       },
//     );
//
//     const readyCharacter = testEngine.getCardModel(deweyLovableShowoff);
//     const exertedCharacter = testEngine.getCardModel(archimedesResourcefulOwl);
//
//     // Exert one character before playing Chernabog
//     exertedCharacter.exert();
//     expect(readyCharacter.exerted).toBe(false);
//     expect(exertedCharacter.exerted).toBe(true);
//
//     // Act: Play Chernabog
//     await testEngine.playCard(chernabogCreatureOfTheNight);
//
//     // Switch to opponent's perspective
//     testEngine.changeActivePlayer("player_two");
//
//     // Verify that the stack layer has the ready filter in its target
//     const topLayer = testEngine.store.stackLayerStore.topLayer;
//     expect(topLayer).toBeTruthy();
//
//     // Check that the exert effect has the ready filter
//     const effects = topLayer?.ability.effects || [];
//     const exertEffect = effects.find((e) => e.type === "exert");
//     expect(exertEffect).toBeTruthy();
//
//     if (
//       exertEffect &&
//       "target" in exertEffect &&
//       cardEffectTargetPredicate(exertEffect.target)
//     ) {
//       const targetFilters = exertEffect.target.filters || [];
//       const hasReadyFilter = targetFilters.some(
//         (filter) => filter.filter === "status" && filter.value === "ready",
//       );
//       expect(hasReadyFilter).toBe(true);
//     }
//
//     // Resolve with the ready character (this should work)
//     await testEngine.resolveTopOfStack({ targets: [readyCharacter] });
//
//     // Assert: Only the ready character should be exerted
//     expect(readyCharacter.exerted).toBe(true);
//     // The already exerted character should remain exerted (not double-exerted)
//     expect(exertedCharacter.exerted).toBe(true);
//   });
// });
//
