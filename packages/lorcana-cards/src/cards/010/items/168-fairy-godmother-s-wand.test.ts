// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   cinderellaGentleAndKind,
//   moanaOfMotunui,
//   stichtNewDog,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { fairyGodmothersWand } from "@lorcanito/lorcana-engine/cards/010/index";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Fairy Godmother's Wand", () => {
//   it("ONLY TILL MIDNIGHT - chosen Princess character gains Ward until the start of your next turn", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: fairyGodmothersWand.cost,
//         play: [fairyGodmothersWand, moanaOfMotunui],
//         hand: [cinderellaGentleAndKind],
//       },
//       {},
//     );
//
//     const princessTarget = testEngine.getCardModel(moanaOfMotunui);
//     const cardToInkwell = testEngine.getCardModel(cinderellaGentleAndKind);
//
//     expect(princessTarget.hasWard).toBe(false);
//
//     // Put a card into inkwell during our turn
//     await testEngine.putIntoInkwell(cardToInkwell);
//
//     // Resolve optional ability
//     await testEngine.resolveOptionalAbility();
//
//     // Choose the Princess target
//     await testEngine.resolveTopOfStack({ targets: [princessTarget] });
//
//     // Princess should have Ward now
//     expect(princessTarget.hasWard).toBe(true);
//
//     // Pass to opponent's turn
//     testEngine.passTurn();
//
//     // Princess should still have Ward during opponent's turn
//     expect(princessTarget.hasWard).toBe(true);
//
//     // Pass back to our turn (start of next turn)
//     testEngine.passTurn();
//
//     // Ward should be removed at the start of our next turn
//     expect(princessTarget.hasWard).toBe(false);
//   });
//
//   it("ONLY TILL MIDNIGHT - should only trigger during your turn", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: fairyGodmothersWand.cost,
//         play: [fairyGodmothersWand],
//       },
//       {
//         hand: [cinderellaGentleAndKind],
//         play: [moanaOfMotunui],
//       },
//     );
//
//     const princessTarget = testEngine.getCardModel(moanaOfMotunui, 1);
//     const cardToInkwell = testEngine.getCardModel(cinderellaGentleAndKind, 1);
//
//     // Pass to opponent's turn
//     testEngine.passTurn();
//
//     expect(princessTarget.hasWard).toBe(false);
//
//     // Put a card into inkwell during opponent's turn
//     await testEngine.putIntoInkwell(cardToInkwell);
//
//     // Ability should not trigger (no optional ability to resolve)
//     expect(princessTarget.hasWard).toBe(false);
//   });
//
//   it("ONLY TILL MIDNIGHT - should only target Princess characters of yours", async () => {
//     const testEngine = new TestEngine({
//       inkwell: fairyGodmothersWand.cost,
//       play: [fairyGodmothersWand, stichtNewDog, moanaOfMotunui],
//       hand: [cinderellaGentleAndKind],
//     });
//
//     const nonPrincessChar = testEngine.getCardModel(stichtNewDog);
//     const princessChar = testEngine.getCardModel(moanaOfMotunui);
//     const cardToInkwell = testEngine.getCardModel(cinderellaGentleAndKind);
//
//     expect(nonPrincessChar.hasWard).toBe(false);
//     expect(princessChar.hasWard).toBe(false);
//
//     // Put a card into inkwell
//     await testEngine.putIntoInkwell(cardToInkwell);
//
//     // Resolve optional ability
//     await testEngine.resolveOptionalAbility();
//
//     // Try to target non-Princess character - should fail
//     await expect(
//       testEngine.resolveTopOfStack({ targets: [nonPrincessChar] }),
//     ).rejects.toThrow();
//
//     // But should work with Princess character
//     await testEngine.resolveTopOfStack({ targets: [princessChar] });
//     expect(princessChar.hasWard).toBe(true);
//     expect(nonPrincessChar.hasWard).toBe(false);
//   });
// });
//
