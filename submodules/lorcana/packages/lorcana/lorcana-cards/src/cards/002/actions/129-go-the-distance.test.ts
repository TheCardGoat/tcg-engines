import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub } from "../../001";
import { goTheDistance } from "./129-go-the-distance";

describe("Go the Distance", () => {
  it("readies your chosen damaged character, stops them from questing this turn, and draws a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [goTheDistance],
      inkwell: goTheDistance.cost,
      deck: 5,
      play: [{ card: simbaProtectiveCub, exerted: true, damage: 1 }],
    });

    expect(
      testEngine.asPlayerOne().playCard(goTheDistance, { targets: [simbaProtectiveCub] }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne()).toBeReady(simbaProtectiveCub);
    expect(testEngine.asPlayerOne()).toHaveRestriction({
      card: simbaProtectiveCub,
      restriction: "cant-quest",
    });
    expect(testEngine.asPlayerOne().getCardsInZone("hand", PLAYER_ONE).count).toBe(1);
  });
});
