// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import { annaBravingTheStorm } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { elsaTrustedSister } from "@lorcanito/lorcana-engine/cards/007/index";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Elsa - Trusted Sister", () => {
//   It("WHAT DO WE DO NOW? Whenever this character quests, if you have a character named Anna in play, gain 1 lore.", async () => {
//     Const testEngine = new TestEngine({
//       Inkwell: 10,
//       Play: [elsaTrustedSister, annaBravingTheStorm],
//       Hand: [],
//       Lore: 0,
//     });
//
//     Await testEngine.questCard(elsaTrustedSister);
//
//     Expect(testEngine.getLoreForPlayer("player_one")).toBe(2);
//   });
// });
//
