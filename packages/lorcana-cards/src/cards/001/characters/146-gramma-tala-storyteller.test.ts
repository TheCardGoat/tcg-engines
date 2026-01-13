import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { grammaTalaStoryteller } from "./146-gramma-tala-storyteller";

describe("Gramma Tala - Storyteller", () => {
  // Add ability tests here
  // Examples:
  // it("has [Keyword]", () => {
  //   const testEngine = new LorcanaTestEngine({ play: [grammaTalaStoryteller] });
  //   expect(testEngine.getCardModel(grammaTalaStoryteller).hasKeyword()).toBe(true);
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
//   grammaTalaStoryteller,
//   mauriceWorldFamousInventor,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// describe("Gramma Tala - Storyteller", () => {
//   it("**I WILL BE WITH YOU** When this character is banished, you may put this card into your inkwell facedown and exerted.", () => {
//     const testStore = new TestStore(
//       {
//         inkwell: grammaTalaStoryteller.cost,
//         play: [grammaTalaStoryteller],
//       },
//       {
//         play: [mauriceWorldFamousInventor],
//       },
//     );
//
//     const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       grammaTalaStoryteller.id,
//     );
//
//     cardUnderTest.updateCardMeta({ exerted: true });
//     const attacker = testStore.getByZoneAndId(
//       "play",
//       mauriceWorldFamousInventor.id,
//       "player_two",
//     );
//
//     attacker.challenge(cardUnderTest);
//     testStore.resolveOptionalAbility();
//
//     expect(cardUnderTest.zone).toEqual("inkwell");
//     expect(cardUnderTest.ready).toEqual(false);
//     expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//   });
// });
//
