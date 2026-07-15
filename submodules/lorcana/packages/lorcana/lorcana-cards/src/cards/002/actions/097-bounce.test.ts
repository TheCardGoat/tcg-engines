import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { liloGalacticHero } from "../../001";
import { cinderellaBallroomSensation } from "../characters";
import { bounce } from "./097-bounce";

describe("Bounce", () => {
  it("returns your chosen character and then another chosen character to their players' hands", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [bounce],
        inkwell: bounce.cost,
        play: [cinderellaBallroomSensation],
      },
      {
        play: [liloGalacticHero],
      },
    );
    const ownTargetId = testEngine.findCardInstanceId(cinderellaBallroomSensation, "play", "p1");
    const opponentTargetId = testEngine.findCardInstanceId(liloGalacticHero, "play", "p2");

    expect(
      testEngine.asPlayerOne().playCard(bounce, {
        targets: [ownTargetId, opponentTargetId],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(ownTargetId)).toBe("hand");
    expect(testEngine.asPlayerTwo().getCardZone(opponentTargetId)).toBe("hand");
  });

  it("requires the second chosen character to be different from the first", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [bounce],
        inkwell: bounce.cost,
        play: [cinderellaBallroomSensation],
      },
      {
        play: [liloGalacticHero],
      },
    );
    const ownTargetId = testEngine.findCardInstanceId(cinderellaBallroomSensation, "play", "p1");
    const result = testEngine.asPlayerOne().playCard(bounce, {
      targets: [ownTargetId, ownTargetId],
    });

    expect(result.success).toBe(false);
  });

  it("returns the first character and then resolves the second selection through the pending prompt", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [bounce],
        inkwell: bounce.cost,
        play: [cinderellaBallroomSensation],
      },
      {
        play: [liloGalacticHero],
      },
    );
    const ownTargetId = testEngine.findCardInstanceId(cinderellaBallroomSensation, "play", "p1");
    const opponentTargetId = testEngine.findCardInstanceId(liloGalacticHero, "play", "p2");

    expect(
      testEngine.asPlayerOne().playCard(bounce, {
        targets: [ownTargetId],
      }).success,
    ).toBe(true);
    expect(testEngine.asPlayerOne().getCardZone(ownTargetId)).toBe("hand");

    expect(
      testEngine.asPlayerOne().resolveNextPending({ targets: [opponentTargetId] }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(ownTargetId)).toBe("hand");
    expect(testEngine.asPlayerTwo().getCardZone(opponentTargetId)).toBe("hand");
  });
});
