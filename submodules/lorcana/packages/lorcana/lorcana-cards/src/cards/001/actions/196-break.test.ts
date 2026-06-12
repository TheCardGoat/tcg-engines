import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { dinglehopper } from "../items";
import { breakCard } from "./196-break";

describe("Break", () => {
  it("banishes chosen item", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [breakCard],
      inkwell: breakCard.cost,
      play: [dinglehopper],
    });

    const playResult = testEngine.asPlayerOne().playCard(breakCard, {
      targets: [dinglehopper],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(dinglehopper)).toEqual("discard");
  });
});
