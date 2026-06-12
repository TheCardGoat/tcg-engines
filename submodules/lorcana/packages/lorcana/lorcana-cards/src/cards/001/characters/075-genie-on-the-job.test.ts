import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { genieOnTheJob } from "./075-genie-on-the-job";

const ownTarget = createMockCharacter({
  id: "genie-on-the-job-own-target",
  name: "Own Target",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const opposingTarget = createMockCharacter({
  id: "genie-on-the-job-opposing-target",
  name: "Opposing Target",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Genie - On the Job", () => {
  it("may return a chosen opposing character to its player's hand when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [genieOnTheJob],
        inkwell: genieOnTheJob.cost,
      },
      {
        play: [opposingTarget],
      },
    );

    expect(testEngine.asPlayerOne().playCard(genieOnTheJob)).toBeSuccessfulCommand();
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(genieOnTheJob, { resolveOptional: true, targets: [opposingTarget] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardsInZone("play", PLAYER_TWO).count).toBe(0);
    expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_TWO).count).toBe(1);
  });

  it("can return one of your own characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [genieOnTheJob],
      inkwell: genieOnTheJob.cost,
      play: [ownTarget],
    });

    expect(testEngine.asPlayerOne().playCard(genieOnTheJob)).toBeSuccessfulCommand();
    expect(
      testEngine
        .asPlayerOne()
        .resolvePendingByCard(genieOnTheJob, { resolveOptional: true, targets: [ownTarget] }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(ownTarget)).toBe("hand");
  });

  it("may decline to return a character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [genieOnTheJob],
        inkwell: genieOnTheJob.cost,
      },
      {
        play: [opposingTarget],
      },
    );

    expect(testEngine.asPlayerOne().playCard(genieOnTheJob)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(genieOnTheJob, { resolveOptional: false }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardsInZone("play", PLAYER_TWO).count).toBe(1);
  });
});
