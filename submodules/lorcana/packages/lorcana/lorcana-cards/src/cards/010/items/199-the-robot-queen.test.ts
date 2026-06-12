import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { theRobotQueen } from "./199-the-robot-queen";

const triggerCharacter = createMockCharacter({
  id: "robot-queen-trigger-character",
  name: "Trigger Character",
  cost: 1,
});

const damagedTarget = createMockCharacter({
  id: "robot-queen-damaged-target",
  name: "Damaged Target",
  cost: 3,
  strength: 3,
  willpower: 5,
});

describe("The Robot Queen", () => {
  it("may pay 1 ink and banish itself to deal 2 damage when you play a character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: 2,
        hand: [triggerCharacter],
        play: [theRobotQueen],
      },
      {
        play: [damagedTarget],
      },
    );

    expect(testEngine.asPlayerOne().playCard(triggerCharacter)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(theRobotQueen, {
        resolveOptional: true,
      }),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [damagedTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(theRobotQueen)).toBe("discard");
    expect(testEngine.asPlayerTwo().getDamage(damagedTarget)).toBe(2);
  });

  it("can decline the optional follow-up", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        inkwell: 2,
        hand: [triggerCharacter],
        play: [theRobotQueen],
      },
      {
        play: [damagedTarget],
      },
    );

    expect(testEngine.asPlayerOne().playCard(triggerCharacter)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(theRobotQueen, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(theRobotQueen)).toBe("play");
    expect(testEngine.asPlayerTwo().getDamage(damagedTarget)).toBe(0);
  });
});
