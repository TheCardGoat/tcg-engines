import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine, PLAYER_ONE } from "@tcg/lorcana/testing";
import { grammaTalaStoryteller } from "./146-gramma-tala-storyteller";

describe("Gramma Tala - Storyteller", () => {
  // Add ability tests here
  // Examples:
  // It("has [Keyword]", () => {
  //   Const testEngine = new LorcanaTestEngine({ play: [grammaTalaStoryteller] });
  //   Expect(testEngine.getCardModel(grammaTalaStoryteller).hasKeyword()).toBe(true);
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
//   GrammaTalaStoryteller,
//   MauriceWorldFamousInventor,
// } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Gramma Tala - Storyteller", () => {
//   It("**I WILL BE WITH YOU** When this character is banished, you may put this card into your inkwell facedown and exerted.", () => {
//     Const testStore = new TestStore(
//       {
//         Inkwell: grammaTalaStoryteller.cost,
//         Play: [grammaTalaStoryteller],
//       },
//       {
//         Play: [mauriceWorldFamousInventor],
//       },
//     );
//
//     Const cardUnderTest = testStore.getByZoneAndId(
//       "play",
//       GrammaTalaStoryteller.id,
//     );
//
//     CardUnderTest.updateCardMeta({ exerted: true });
//     Const attacker = testStore.getByZoneAndId(
//       "play",
//       MauriceWorldFamousInventor.id,
//       "player_two",
//     );
//
//     Attacker.challenge(cardUnderTest);
//     TestStore.resolveOptionalAbility();
//
//     Expect(cardUnderTest.zone).toEqual("inkwell");
//     Expect(cardUnderTest.ready).toEqual(false);
//     Expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
//   });
// });
//
