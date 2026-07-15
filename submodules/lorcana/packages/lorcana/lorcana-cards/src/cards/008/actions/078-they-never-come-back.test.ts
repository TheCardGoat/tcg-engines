import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mickeyMouseTrueFriend, simbaProtectiveCub } from "../../001";
import { auroraDreamingGuardian } from "../../001/characters/139-aurora-dreaming-guardian";
import { theyNeverComeBack } from "./078-they-never-come-back";

describe("They Never Come Back", () => {
  it("keeps up to 2 chosen characters from readying at the start of their next turn and draws a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [theyNeverComeBack],
        inkwell: theyNeverComeBack.cost,
        deck: [simbaProtectiveCub],
      },
      {
        play: [simbaProtectiveCub, mickeyMouseTrueFriend],
      },
    );
    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", "p2");
    const mickeyId = testEngine.findCardInstanceId(mickeyMouseTrueFriend, "play", "p2");

    testEngine.asServer().manualExertCard(simbaId);
    testEngine.asServer().manualExertCard(mickeyId);

    expect(
      testEngine.asPlayerOne().playCard(theyNeverComeBack, {
        targets: [simbaId, mickeyId],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().isExerted(simbaProtectiveCub)).toBe(true);
    expect(testEngine.asPlayerTwo().isExerted(mickeyMouseTrueFriend)).toBe(true);
  });

  it("can target opponent's characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [theyNeverComeBack],
        inkwell: theyNeverComeBack.cost,
        deck: 1,
      },
      {
        play: [{ card: simbaProtectiveCub, exerted: true }],
      },
    );

    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", "p2");
    expect(
      testEngine.asPlayerOne().playCard(theyNeverComeBack, { targets: [simbaId] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().isExerted(simbaProtectiveCub)).toBe(true);
  });

  it("regression: cannot target opponent's character with granted Ward", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [theyNeverComeBack],
        inkwell: theyNeverComeBack.cost,
        deck: 1,
      },
      {
        // Aurora grants Ward to her other characters → Simba should be unselectable.
        play: [auroraDreamingGuardian, { card: simbaProtectiveCub, exerted: true }],
      },
    );

    const simbaId = testEngine.findCardInstanceId(simbaProtectiveCub, "play", "p2");
    const result = testEngine.asPlayerOne().playCard(theyNeverComeBack, { targets: [simbaId] });

    // Expect command to fail — Ward must block opponent-chosen targeting.
    expect(result.success).toBe(false);
  });
});
