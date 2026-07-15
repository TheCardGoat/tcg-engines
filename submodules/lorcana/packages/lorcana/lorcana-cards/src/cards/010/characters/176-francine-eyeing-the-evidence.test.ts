import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { francineEyeingTheEvidence } from "./176-francine-eyeing-the-evidence";

describe("Francine - Eyeing the Evidence", () => {
  const attacker = createMockCharacter({
    id: "francine-eyeing-the-evidence-attacker",
    name: "Attacker",
    cost: 2,
    strength: 2,
    willpower: 3,
  });

  it("reduces damage dealt to Francine by 1", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [attacker],
      },
      {
        play: [{ card: francineEyeingTheEvidence, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(attacker, francineEyeingTheEvidence),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo()).toHaveDamage({
      card: francineEyeingTheEvidence,
      value: 1,
    });
  });
});
