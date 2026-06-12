import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { shieldOfVirtue } from "../../001/items/135-shield-of-virtue";
import { iFindEmIFlattenEm } from "./199-i-find-em-i-flatten-em";

describe("I Find 'Em, I Flatten 'Em", () => {
  it("banishes all items", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [iFindEmIFlattenEm],
        inkwell: iFindEmIFlattenEm.cost,
        play: [shieldOfVirtue],
      },
      {
        play: [shieldOfVirtue],
      },
    );

    expect(testEngine.asPlayerOne().playCard(iFindEmIFlattenEm)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(shieldOfVirtue)).toBe("discard");
    expect(testEngine.asPlayerTwo().getCardZone(shieldOfVirtue)).toBe("discard");
  });
});
