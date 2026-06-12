import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_TWO } from "@tcg/lorcana-engine/testing";
import { healingGlow } from "../../001";
import { pumbaaWinterWarthog } from "./004-pumbaa-winter-warthog";

describe("Pumbaa - Winter Warthog", () => {
  it("SHAKE THINGS UP - each opponent chooses and discards a card when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [pumbaaWinterWarthog],
        inkwell: pumbaaWinterWarthog.cost,
      },
      {
        hand: [healingGlow],
      },
    );
    const opponentCardId = testEngine.findCardInstanceId(healingGlow, "hand", PLAYER_TWO);

    expect(testEngine.asPlayerOne().playCard(pumbaaWinterWarthog)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().respondWith(opponentCardId)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(healingGlow)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(pumbaaWinterWarthog)).toBe("play");
  });
});
