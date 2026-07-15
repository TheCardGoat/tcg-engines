import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { hadesInfernalSchemer } from "./147-hades-infernal-schemer";

describe("Hades - Infernal Schemer", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [hadesInfernalSchemer] });
  //   Expect(testEngine.getCardModel(hadesInfernalSchemer).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, expect, it } from "@jest/globals";
// Import {
//   HadesInfernalSchemer,
//   MauriceWorldFamousInventor,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// Describe("Hades - Infernal Schemer", () => {
//   It("**IS THERE A DOWNSIDE TO THIS?** When you play this character, you may put chosen opposing character into their player's inkwell facedown.", async () => {
//     Const testEngine = new TestEngine(
//       {
//         Inkwell: hadesInfernalSchemer.cost,
//         Hand: [hadesInfernalSchemer],
//       },
//       {
//         Play: [mauriceWorldFamousInventor],
//       },
//     );
//
//     Await testEngine.playCard(hadesInfernalSchemer);
//     Await testEngine.resolveOptionalAbility();
//     Await testEngine.resolveTopOfStack({
//       Targets: [mauriceWorldFamousInventor],
//     });
//
//     Const target = testEngine.getCardModel(mauriceWorldFamousInventor);
//
//     Expect(target.zone).toEqual("inkwell");
//     Expect(target.ready).toEqual(false);
//   });
// });
//
