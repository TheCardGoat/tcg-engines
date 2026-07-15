import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { nothingToHide } from "../../002";
import { magicalManeuvers } from "../actions";
import { grewngeCannonExpert } from "./086-grewnge-cannon-expert";

const opposingTarget = createMockCharacter({
  id: "grewnge-opposing-target",
  name: "Opposing Target",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

describe("Grewnge - Cannon Expert", () => {
  it("reduces the cost of the next action you play this turn after Grewnge quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: grewngeCannonExpert, isDrying: false }],
        hand: [magicalManeuvers, nothingToHide],
        inkwell: 1,
        deck: 3,
      },
      {
        play: [opposingTarget],
        deck: 3,
      },
    );
    const grewngeId = testEngine.findCardInstanceId(grewngeCannonExpert, "play");
    const opposingTargetId = testEngine.findCardInstanceId(opposingTarget, "play", "player_two");

    const preQuestPlayResult = testEngine.asPlayerOne().playCard(magicalManeuvers, {
      targets: [grewngeId, opposingTargetId],
    });
    expect(preQuestPlayResult.success).toBe(false);
    expect(testEngine.asPlayerOne().getCardZone(magicalManeuvers)).toBe("hand");

    expect(testEngine.asPlayerOne().quest(grewngeCannonExpert)).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerOne().playCard(magicalManeuvers, {
        targets: [grewngeId, opposingTargetId],
      }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(magicalManeuvers)).toBe("discard");

    const secondActionResult = testEngine.asPlayerOne().playCard(nothingToHide);
    expect(secondActionResult.success).toBe(false);
    expect(testEngine.asPlayerOne().getCardZone(nothingToHide)).toBe("hand");
  });
});
