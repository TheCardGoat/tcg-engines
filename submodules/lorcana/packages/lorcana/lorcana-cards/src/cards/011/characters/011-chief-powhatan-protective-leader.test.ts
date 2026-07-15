import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "@tcg/lorcana-engine";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { chiefPowhatanProtectiveLeader } from "./011-chief-powhatan-protective-leader";

describe("Chief Powhatan - Protective Leader", () => {
  it("has Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [chiefPowhatanProtectiveLeader],
    });

    expect(testEngine.getCardModel(chiefPowhatanProtectiveLeader).hasBodyguard()).toBe(true);
  });

  it("can be played from hand with standard cost", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [chiefPowhatanProtectiveLeader],
        inkwell: chiefPowhatanProtectiveLeader.cost,
        deck: 5,
      },
      { deck: 5 },
    );

    expect(
      testEngine.asPlayerOne().playCard(chiefPowhatanProtectiveLeader),
    ).toBeSuccessfulCommand();
  });

  it("enters play ready by default (Bodyguard choice)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [chiefPowhatanProtectiveLeader],
        inkwell: chiefPowhatanProtectiveLeader.cost,
        deck: 5,
      },
      { deck: 5 },
    );

    expect(
      testEngine.asPlayerOne().playCard(chiefPowhatanProtectiveLeader),
    ).toBeSuccessfulCommand();
    expect(testEngine.isExerted(chiefPowhatanProtectiveLeader)).toBe(false);
  });

  it("can enter play exerted via Bodyguard choice", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [chiefPowhatanProtectiveLeader],
        inkwell: chiefPowhatanProtectiveLeader.cost,
        deck: 5,
      },
      { deck: 5 },
    );

    expect(
      testEngine.asPlayerOne().playCard(chiefPowhatanProtectiveLeader, { resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(testEngine.isExerted(chiefPowhatanProtectiveLeader)).toBe(true);
  });

  it("can be played via dispatch without explicit cost (defaults to standard)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [chiefPowhatanProtectiveLeader],
        inkwell: chiefPowhatanProtectiveLeader.cost,
        deck: 5,
      },
      { deck: 5 },
    );

    const cardId = testEngine.findCardInstanceId(chiefPowhatanProtectiveLeader, "hand", PLAYER_ONE);
    const result = testEngine.executeMoveForView("authoritative", "playCard", {
      args: { cardId },
    });

    expect(result.success).toBe(true);
  });

  it("should not be able to challenge (STANDS HIS GROUND)", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: chiefPowhatanProtectiveLeader, exerted: false }],
      },
      {
        play: [{ card: simbaProtectiveCub, exerted: true }],
      },
    );

    const result = testEngine
      .asPlayerOne()
      .challenge(chiefPowhatanProtectiveLeader, simbaProtectiveCub) as CommandFailure;

    expect(result.success).toBe(false);
  });

  it("can be challenged by opponent", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: chiefPowhatanProtectiveLeader, exerted: true }],
      },
      {
        play: [{ card: simbaProtectiveCub, exerted: false }],
      },
    );

    // Pass turn to player two so they can challenge
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerTwo().challenge(simbaProtectiveCub, chiefPowhatanProtectiveLeader),
    ).toBeSuccessfulCommand();
  });
});
