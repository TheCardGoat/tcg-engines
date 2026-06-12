import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { shieldOfVirtue } from "../items";
import { ifItsNotBaroque } from "./162-if-its-not-baroque";

describe("If It's Not Baroque", () => {
  it("returns a chosen item card from your discard to your hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [ifItsNotBaroque],
      inkwell: ifItsNotBaroque.cost,
      discard: [shieldOfVirtue],
    });

    const playResult = testEngine.asPlayerOne().playCard(ifItsNotBaroque, {
      targets: [shieldOfVirtue],
    });

    expect(playResult).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(ifItsNotBaroque)).toEqual("discard");
    expect(testEngine.asPlayerOne().getCardZone(shieldOfVirtue)).toEqual("hand");
  });
});
