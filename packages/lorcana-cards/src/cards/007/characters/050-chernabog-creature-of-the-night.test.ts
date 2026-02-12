// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { chernabogCreatureOfTheNight } from "@lorcanito/lorcana-engine/cards/007/index";
// Import {
//   ArchimedesResourcefulOwl,
//   DeweyLovableShowoff,
// } from "@lorcanito/lorcana-engine/cards/008";
// Import { cardEffectTargetPredicate } from "@lorcanito/lorcana-engine/effects/effectTargets";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Chernabog - Creature of the Night", () => {
//   It("MIDNIGHT FESTIVITIES When you play this character, each opponent chooses one of their readied characters and exhausts it. Characters exhausted this way do not ready at the start of their next turn.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: chernabogCreatureOfTheNight.cost,
//         Hand: [chernabogCreatureOfTheNight],
//       },
//       {
//         Play: [deweyLovableShowoff],
//       },
//     );
//
//     Const target = testEngine.getCardModel(deweyLovableShowoff);
//     Expect(target.exerted).toBe(false);
//
//     Await testEngine.playCard(chernabogCreatureOfTheNight);
//
//     TestEngine.changeActivePlayer("player_two");
//     Await testEngine.resolveTopOfStack({ targets: [target] });
//
//     // Character should be exerted
//     Expect(target.exerted).toBe(true);
//   });
//
//   It("should only allow opponent to choose ready characters, not already exerted ones", async () => {
//     // Arrange: Set up game where opponent has both ready and exerted characters
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: chernabogCreatureOfTheNight.cost,
//         Hand: [chernabogCreatureOfTheNight],
//       },
//       {
//         Play: [deweyLovableShowoff, archimedesResourcefulOwl],
//       },
//     );
//
//     Const readyCharacter = testEngine.getCardModel(deweyLovableShowoff);
//     Const exertedCharacter = testEngine.getCardModel(archimedesResourcefulOwl);
//
//     // Exert one character before playing Chernabog
//     ExertedCharacter.exert();
//     Expect(readyCharacter.exerted).toBe(false);
//     Expect(exertedCharacter.exerted).toBe(true);
//
//     // Act: Play Chernabog
//     Await testEngine.playCard(chernabogCreatureOfTheNight);
//
//     // Switch to opponent's perspective
//     TestEngine.changeActivePlayer("player_two");
//
//     // Verify that the stack layer has the ready filter in its target
//     Const topLayer = testEngine.store.stackLayerStore.topLayer;
//     Expect(topLayer).toBeTruthy();
//
//     // Check that the exert effect has the ready filter
//     Const effects = topLayer?.ability.effects || [];
//     Const exertEffect = effects.find((e) => e.type === "exert");
//     Expect(exertEffect).toBeTruthy();
//
//     If (
//       ExertEffect &&
//       "target" in exertEffect &&
//       CardEffectTargetPredicate(exertEffect.target)
//     ) {
//       Const targetFilters = exertEffect.target.filters || [];
//       Const hasReadyFilter = targetFilters.some(
//         (filter) => filter.filter === "status" && filter.value === "ready",
//       );
//       Expect(hasReadyFilter).toBe(true);
//     }
//
//     // Resolve with the ready character (this should work)
//     Await testEngine.resolveTopOfStack({ targets: [readyCharacter] });
//
//     // Assert: Only the ready character should be exerted
//     Expect(readyCharacter.exerted).toBe(true);
//     // The already exerted character should remain exerted (not double-exerted)
//     Expect(exertedCharacter.exerted).toBe(true);
//   });
// });
//
