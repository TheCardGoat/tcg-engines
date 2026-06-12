import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { herculesHeroInTraining, pachaVillageLeader } from "../characters";
import { fallingDownTheRabbitHole } from "./162-falling-down-the-rabbit-hole";

describe("Falling Down the Rabbit Hole", () => {
  it("has each player choose one of their characters to put into their inkwell facedown and exerted", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [fallingDownTheRabbitHole],
        inkwell: fallingDownTheRabbitHole.cost,
        play: [pachaVillageLeader],
      },
      {
        play: [herculesHeroInTraining],
      },
    );
    const ownTargetId = testEngine.findCardInstanceId(pachaVillageLeader, "play", "p1");
    const opponentTargetId = testEngine.findCardInstanceId(herculesHeroInTraining, "play", "p2");

    expect(
      testEngine.asPlayerOne().playCard(fallingDownTheRabbitHole, {
        targets: [ownTargetId],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(ownTargetId)).toBe("inkwell");
    expect(testEngine.asServer().getCard(ownTargetId)).toEqual(
      expect.objectContaining({ zone: "inkwell", exerted: true }),
    );
    expect(
      testEngine.getAuthoritativeState().ctx.zones.private.cardMeta[ownTargetId]?.publicFaceState,
    ).toBe("faceDown");
    const effectId = testEngine.asServer().getState().ctx.priority.pendingChoice?.requestID;
    if (!effectId) {
      throw new Error("Expected opponent choice request after resolving the first selection");
    }

    expect(
      testEngine.asPlayerTwo().resolveEffect(effectId, {
        targets: [opponentTargetId],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerTwo().getCardZone(opponentTargetId)).toBe("inkwell");
    expect(testEngine.asServer().getCard(opponentTargetId)).toEqual(
      expect.objectContaining({ zone: "inkwell", exerted: true }),
    );
    expect(
      testEngine.getAuthoritativeState().ctx.zones.private.cardMeta[opponentTargetId]
        ?.publicFaceState,
    ).toBe("faceDown");
  });
});
