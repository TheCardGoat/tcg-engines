import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { hadesInfernalSchemer } from "./147-hades-infernal-schemer";

describe("Hades - Infernal Schemer", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [hadesInfernalSchemer] });
  //   expect(testEngine.getCardModel(hadesInfernalSchemer).hasKeyword()).toBe(true);
  // });
  // TODO: Add tests for abilities
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// import { describe, expect, it } from "@jest/globals";
// import {
//   hadesInfernalSchemer,
//   mauriceWorldFamousInventor,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
//
// describe("Hades - Infernal Schemer", () => {
//   it("**IS THERE A DOWNSIDE TO THIS?** When you play this character, you may put chosen opposing character into their player's inkwell facedown.", async () => {
//     const testEngine = new TestEngine(
//       {
//         inkwell: hadesInfernalSchemer.cost,
//         hand: [hadesInfernalSchemer],
//       },
//       {
//         play: [mauriceWorldFamousInventor],
//       },
//     );
//
//     await testEngine.playCard(hadesInfernalSchemer);
//     await testEngine.resolveOptionalAbility();
//     await testEngine.resolveTopOfStack({
//       targets: [mauriceWorldFamousInventor],
//     });
//
//     const target = testEngine.getCardModel(mauriceWorldFamousInventor);
//
//     expect(target.zone).toEqual("inkwell");
//     expect(target.ready).toEqual(false);
//   });
// });
//
