import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { elsaStormChaser } from "./042-elsa-storm-chaser";

const freshCharacter = createMockCharacter({
  id: "elsa-storm-chaser-fresh-character",
  name: "Fresh Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const exertedDefender = createMockCharacter({
  id: "elsa-storm-chaser-exerted-defender",
  name: "Exerted Defender",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Elsa - Storm Chaser", () => {
  it("grants Challenger +2 and Rush to the same chosen character this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [
          { card: elsaStormChaser, isDrying: false },
          { card: freshCharacter, isDrying: true },
        ],
      },
      {
        play: [{ card: exertedDefender, exerted: true, isDrying: false }],
      },
    );

    expect(testEngine.asPlayerOne().canChallenge(freshCharacter, exertedDefender)).toBe(false);
    expect(
      testEngine.asPlayerOne().activateAbility(elsaStormChaser, {
        targets: [freshCharacter],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(freshCharacter, "Challenger")).toBe(true);
    expect(testEngine.asPlayerOne().hasKeyword(freshCharacter, "Rush")).toBe(true);
    expect(testEngine.asPlayerOne().canChallenge(freshCharacter, exertedDefender)).toBe(true);
  });
});

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// /**
//  * @jest-environment node
//  */
//
// Import { describe, it } from "@jest/globals";
// Import { elsaStormChaser } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
// Import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
//
// Describe("Elsa - Storm Chaser", () => {
//   It.skip("**TEMPEST** {E}− Chosen character gains **Challenger** +2 and **Rush** this turn. _(They get +2 {S} while challenging. They can challenge the turn they're played.)_", () => {
//     Const testStore = new TestStore({
//       Inkwell: elsaStormChaser.cost,
//       Play: [elsaStormChaser],
//     });
//
//     Const cardUnderTest = testStore.getByZoneAndId("play", elsaStormChaser.id);
//
//     CardUnderTest.playFromHand();
//     TestStore.resolveOptionalAbility();
//     TestStore.resolveTopOfStack({});
//   });
// });
//
