// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   CinderellaGentleAndKind,
//   MoanaOfMotunui,
//   StichtNewDog,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { fairyGodmothersWand } from "@lorcanito/lorcana-engine/cards/010/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Fairy Godmother's Wand", () => {
//   It("ONLY TILL MIDNIGHT - chosen Princess character gains Ward until the start of your next turn", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: fairyGodmothersWand.cost,
//         Play: [fairyGodmothersWand, moanaOfMotunui],
//         Hand: [cinderellaGentleAndKind],
//       },
//       {},
//     );
//
//     Const princessTarget = testEngine.getCardModel(moanaOfMotunui);
//     Const cardToInkwell = testEngine.getCardModel(cinderellaGentleAndKind);
//
//     Expect(princessTarget.hasWard).toBe(false);
//
//     // Put a card into inkwell during our turn
//     Await testEngine.putIntoInkwell(cardToInkwell);
//
//     // Resolve optional ability
//     Await testEngine.resolveOptionalAbility();
//
//     // Choose the Princess target
//     Await testEngine.resolveTopOfStack({ targets: [princessTarget] });
//
//     // Princess should have Ward now
//     Expect(princessTarget.hasWard).toBe(true);
//
//     // Pass to opponent's turn
//     TestEngine.passTurn();
//
//     // Princess should still have Ward during opponent's turn
//     Expect(princessTarget.hasWard).toBe(true);
//
//     // Pass back to our turn (start of next turn)
//     TestEngine.passTurn();
//
//     // Ward should be removed at the start of our next turn
//     Expect(princessTarget.hasWard).toBe(false);
//   });
//
//   It("ONLY TILL MIDNIGHT - should only trigger during your turn", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: fairyGodmothersWand.cost,
//         Play: [fairyGodmothersWand],
//       },
//       {
//         Hand: [cinderellaGentleAndKind],
//         Play: [moanaOfMotunui],
//       },
//     );
//
//     Const princessTarget = testEngine.getCardModel(moanaOfMotunui, 1);
//     Const cardToInkwell = testEngine.getCardModel(cinderellaGentleAndKind, 1);
//
//     // Pass to opponent's turn
//     TestEngine.passTurn();
//
//     Expect(princessTarget.hasWard).toBe(false);
//
//     // Put a card into inkwell during opponent's turn
//     Await testEngine.putIntoInkwell(cardToInkwell);
//
//     // Ability should not trigger (no optional ability to resolve)
//     Expect(princessTarget.hasWard).toBe(false);
//   });
//
//   It("ONLY TILL MIDNIGHT - should only target Princess characters of yours", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: fairyGodmothersWand.cost,
//       Play: [fairyGodmothersWand, stichtNewDog, moanaOfMotunui],
//       Hand: [cinderellaGentleAndKind],
//     });
//
//     Const nonPrincessChar = testEngine.getCardModel(stichtNewDog);
//     Const princessChar = testEngine.getCardModel(moanaOfMotunui);
//     Const cardToInkwell = testEngine.getCardModel(cinderellaGentleAndKind);
//
//     Expect(nonPrincessChar.hasWard).toBe(false);
//     Expect(princessChar.hasWard).toBe(false);
//
//     // Put a card into inkwell
//     Await testEngine.putIntoInkwell(cardToInkwell);
//
//     // Resolve optional ability
//     Await testEngine.resolveOptionalAbility();
//
//     // Try to target non-Princess character - should fail
//     Await expect(
//       TestEngine.resolveTopOfStack({ targets: [nonPrincessChar] }),
//     ).rejects.toThrow();
//
//     // But should work with Princess character
//     Await testEngine.resolveTopOfStack({ targets: [princessChar] });
//     Expect(princessChar.hasWard).toBe(true);
//     Expect(nonPrincessChar.hasWard).toBe(false);
//   });
// });
//
