import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { lookWhatYouveDone } from "./200-look-what-youve-done";
import { youBrokeMySmolder } from "./201-you-broke-my-smolder";
import { angelExperiment624 } from "../../011/characters/191-angel-experiment-624";

const lookTarget = createMockCharacter({
  id: "look-what-youve-done-target",
  name: "Look Target",
  cost: 2,
  willpower: 5,
});

const lookDrawA = createMockCharacter({
  id: "look-what-youve-done-draw-a",
  name: "Draw A",
  cost: 1,
});
const lookDrawB = createMockCharacter({
  id: "look-what-youve-done-draw-b",
  name: "Draw B",
  cost: 1,
});

describe("Look What You've Done", () => {
  it("deals 2 damage to chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [lookWhatYouveDone],
        inkwell: lookWhatYouveDone.cost,
      },
      {
        play: [lookTarget],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(lookWhatYouveDone, {
        targets: [lookTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getCard(lookTarget).damage).toBe(2);
  });

  it("may be played from discard any time this turn after being discarded during your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [youBrokeMySmolder, lookWhatYouveDone],
        inkwell: youBrokeMySmolder.cost + lookWhatYouveDone.cost,
        deck: [lookDrawA, lookDrawB],
      },
      {
        play: [lookTarget],
      },
    );

    expect(testEngine.asPlayerOne().playCard(youBrokeMySmolder)).toBeSuccessfulCommand();

    const lookWhatYouveDoneId = testEngine.findCardInstanceId(
      lookWhatYouveDone,
      "discard",
      "player_one",
    );
    const playMove = testEngine
      .asPlayerOne()
      .getAvailableMoves()
      .find((move) => move.moveId === "playCard");
    expect(playMove?.selectableCardIds).toContain(lookWhatYouveDoneId);

    expect(
      testEngine.asPlayerOne().playCard(lookWhatYouveDone, {
        targets: [lookTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getCard(lookTarget).damage).toBe(2);
    expect(testEngine.asPlayerOne().getCardZone(lookWhatYouveDone)).toBe("discard");
  });

  it("may be played from discard any time this turn after Angel discards it as an activated ability cost", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [angelExperiment624],
        hand: [lookWhatYouveDone],
        inkwell: angelExperiment624.cost + lookWhatYouveDone.cost,
      },
      {
        play: [lookTarget],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(angelExperiment624, {
        costs: { discardCards: [lookWhatYouveDone] },
        targets: [lookTarget],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(lookWhatYouveDone)).toBe("discard");

    const lookWhatYouveDoneId = testEngine.findCardInstanceId(
      lookWhatYouveDone,
      "discard",
      "player_one",
    );
    const playMove = testEngine
      .asPlayerOne()
      .getAvailableMoves()
      .find((move) => move.moveId === "playCard");
    expect(playMove?.selectableCardIds).toContain(lookWhatYouveDoneId);

    expect(
      testEngine.asPlayerOne().playCard(lookWhatYouveDone, {
        targets: [lookTarget],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.getCard(lookTarget).damage).toBe(4);
    expect(testEngine.asPlayerOne().getCardZone(lookWhatYouveDone)).toBe("discard");
  });
});
