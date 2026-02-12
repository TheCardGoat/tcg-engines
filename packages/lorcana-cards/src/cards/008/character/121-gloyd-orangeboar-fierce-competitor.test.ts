// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { gloydOrangeboarFierceCompetitor } from "@lorcanito/lorcana-engine/cards/008/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Gloyd Orangeboar - Fierce Competitor", () => {
//   It("PUMPKIN SPICE When you play this character, each opponent loses 1 lore and you gain 1 lore.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: gloydOrangeboarFierceCompetitor.cost,
//         Hand: [gloydOrangeboarFierceCompetitor],
//         Lore: 5,
//       },
//       {
//         Lore: 5,
//       },
//     );
//
//     Await testEngine.playCard(gloydOrangeboarFierceCompetitor);
//
//     Expect(testEngine.getLoreForPlayer("player_one")).toEqual(6);
//     Expect(testEngine.getLoreForPlayer("player_two")).toEqual(4);
//   });
// });
//
