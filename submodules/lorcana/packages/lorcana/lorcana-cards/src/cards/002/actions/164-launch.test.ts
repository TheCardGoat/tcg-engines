import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { goofyKnightForADay } from "../characters";
import { pawpsicle } from "../items";
import { launch } from "./164-launch";

describe("Launch", () => {
  it("banishes your chosen item to deal 5 damage to a chosen character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [launch],
        inkwell: launch.cost,
        play: [pawpsicle],
      },
      {
        play: [goofyKnightForADay],
      },
    );
    const itemId = testEngine.findCardInstanceId(pawpsicle, "play", "p1");
    const targetId = testEngine.findCardInstanceId(goofyKnightForADay, "play", "p2");

    expect(
      testEngine.asPlayerOne().playCard(launch, {
        targets: [itemId, targetId],
      }).success,
    ).toBe(true);

    expect(testEngine.asPlayerOne().getCardZone(itemId)).toBe("discard");
    expect(testEngine.asServer().getCard(targetId)).toEqual(expect.objectContaining({ damage: 5 }));
  });
});
