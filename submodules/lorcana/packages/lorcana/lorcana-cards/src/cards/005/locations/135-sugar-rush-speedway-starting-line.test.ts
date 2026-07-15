import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { rapunzelsTowerSecludedPrison } from "./033-rapunzels-tower-secluded-prison";
import { sugarRushSpeedwayStartingLine } from "./135-sugar-rush-speedway-starting-line";
import { sugarRushSpeedwayFinishLine } from "../../006/locations/035-sugar-rush-speedway-finish-line";

const racer = createMockCharacter({
  id: "starting-line-racer",
  name: "Starting Line Racer",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Sugar Rush Speedway - Starting Line", () => {
  it("exerts a character here, deals 1 damage, and moves them to another location for free", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        sugarRushSpeedwayStartingLine,
        rapunzelsTowerSecludedPrison,
        { card: racer, atLocation: sugarRushSpeedwayStartingLine },
      ],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().activateAbility(sugarRushSpeedwayStartingLine).success).toBe(
      true,
    );
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        targets: [racer],
      }).success,
    ).toBe(true);
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        targets: {
          kind: "move-to-location",
          subject: [testEngine.findCardInstanceId(racer, "play", "p1")],
          location: [testEngine.findCardInstanceId(rapunzelsTowerSecludedPrison, "play", "p1")],
        },
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCard(racer)?.damage).toBe(1);
    expect(testEngine.asPlayerOne().getCard(racer)?.exerted).toBe(true);
    expect(testEngine.asPlayerOne().getCardLocationId(racer)).toBe(
      testEngine.findCardInstanceId(rapunzelsTowerSecludedPrison, "play", "p1"),
    );
    expect(testEngine.asPlayerOne().activateAbility(sugarRushSpeedwayStartingLine).success).toBe(
      false,
    );
  });

  it("regression: allows free move to Finish Line location", () => {
    const finishLineRacer = createMockCharacter({
      id: "starting-line-finish-racer",
      name: "Finish Line Racer",
      cost: 2,
      strength: 2,
      willpower: 3,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        sugarRushSpeedwayStartingLine,
        sugarRushSpeedwayFinishLine,
        { card: finishLineRacer, atLocation: sugarRushSpeedwayStartingLine },
      ],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().activateAbility(sugarRushSpeedwayStartingLine).success).toBe(
      true,
    );
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        targets: [finishLineRacer],
      }).success,
    ).toBe(true);
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        targets: {
          kind: "move-to-location",
          subject: [testEngine.findCardInstanceId(finishLineRacer, "play", "p1")],
          location: [testEngine.findCardInstanceId(sugarRushSpeedwayFinishLine, "play", "p1")],
        },
      }).success,
    ).toBe(true);

    // The character should have been moved to the Finish Line for free (despite its 6 move cost)
    expect(testEngine.asPlayerOne().getCardLocationId(finishLineRacer)).toBe(
      testEngine.findCardInstanceId(sugarRushSpeedwayFinishLine, "play", "p1"),
    );
  });

  it("prompts for the destination after the character is chosen", () => {
    const promptRacer = createMockCharacter({
      id: "starting-line-prompt-racer",
      name: "Prompt Racer",
      cost: 2,
      strength: 2,
      willpower: 3,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        sugarRushSpeedwayStartingLine,
        sugarRushSpeedwayFinishLine,
        { card: promptRacer, atLocation: sugarRushSpeedwayStartingLine },
      ],
      deck: 1,
    });

    expect(
      testEngine.asPlayerOne().activateAbility(sugarRushSpeedwayStartingLine),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        resolveOptional: true,
        targets: [promptRacer],
      }),
    ).toBeSuccessfulCommand();

    const destinationPrompt = testEngine.asPlayerOne().getPendingEffects()[0]?.selectionContext;
    expect(destinationPrompt?.kind).toBe("target-selection");
    if (!destinationPrompt || destinationPrompt.kind !== "target-selection") {
      throw new Error("Expected Starting Line to prompt for a destination location");
    }

    expect(destinationPrompt.expectedSlottedKind).toBe("move-to-location");
    expect(destinationPrompt.targetDsl).toHaveLength(1);
    expect(destinationPrompt.targetDsl[0]).toMatchObject({
      selector: "chosen",
      cardTypes: ["location"],
    });
    expect(destinationPrompt.cardCandidateIds).toContain(
      testEngine.findCardInstanceId(sugarRushSpeedwayFinishLine, "play", "p1"),
    );
  });

  it("BUG-19: only characters AT the Starting Line are selectable — a character at a different location is NOT a valid target", () => {
    const racerAtStartingLine = createMockCharacter({
      id: "bug19-racer-at-starting-line",
      name: "Racer At Starting Line",
      cost: 2,
      strength: 2,
      willpower: 3,
    });

    const racerElsewhere = createMockCharacter({
      id: "bug19-racer-elsewhere",
      name: "Racer Elsewhere",
      cost: 2,
      strength: 2,
      willpower: 3,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        sugarRushSpeedwayStartingLine,
        rapunzelsTowerSecludedPrison,
        { card: racerAtStartingLine, atLocation: sugarRushSpeedwayStartingLine },
        { card: racerElsewhere, atLocation: rapunzelsTowerSecludedPrison },
      ],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().activateAbility(sugarRushSpeedwayStartingLine).success).toBe(
      true,
    );

    // A character NOT at Starting Line should NOT be a valid target
    const resultWithElsewhere = testEngine.asPlayerOne().resolveNextPending({
      resolveOptional: true,
      targets: [racerElsewhere, sugarRushSpeedwayStartingLine],
    });
    expect(resultWithElsewhere.success).toBe(false);
  });

  it.todo("regression: should not allow exerted characters to be chosen since exerting is part of cost", () => {
    // Bug: Sugar Rush Speedway was allowing exerted characters to be chosen.
    // Since exerting is part of the cost, the character must be ready to be chosen.
    const exertedRacer = createMockCharacter({
      id: "starting-line-exerted-racer",
      name: "Exerted Racer",
      cost: 2,
      strength: 2,
      willpower: 3,
    });

    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [
        sugarRushSpeedwayStartingLine,
        rapunzelsTowerSecludedPrison,
        { card: exertedRacer, atLocation: sugarRushSpeedwayStartingLine, exerted: true },
      ],
      deck: 1,
    });

    expect(testEngine.asPlayerOne().activateAbility(sugarRushSpeedwayStartingLine).success).toBe(
      true,
    );

    // Trying to choose the exerted racer should fail
    const result = testEngine.asPlayerOne().resolveNextPending({
      resolveOptional: true,
      targets: [exertedRacer, rapunzelsTowerSecludedPrison],
    });

    // The exerted character should not be a valid target since exerting is the cost
    expect(result.success).toBe(false);
  });
});
