// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { suddenChill } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
// Import { kronkRelaxed } from "@lorcanito/lorcana-engine/cards/007";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Kronk - Relaxed", () => {
//   It("Ward", async () => {
//     Const testEngine = new TestEngine({
//       Play: [kronkRelaxed],
//     });
//
//     Expect(testEngine.getCardModel(kronkRelaxed).hasWard).toBe(true);
//   });
//
//   It("I LOVE IT If an effect would make you discard one or more cards, don't discard any.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: suddenChill.cost,
//         Hand: [suddenChill],
//       },
//       {
//         Hand: [moanaOfMotunui],
//         Play: [kronkRelaxed],
//       },
//     );
//
//     Await testEngine.playCard(suddenChill);
//
//     TestEngine.changeActivePlayer("player_two");
//     Await testEngine.resolveTopOfStack({ targets: [moanaOfMotunui] });
//
//     Expect(testEngine.getCardModel(moanaOfMotunui).zone).toBe("hand");
//   });
// });
//
