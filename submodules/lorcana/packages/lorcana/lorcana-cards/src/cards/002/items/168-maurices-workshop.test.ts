import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { mauricesWorkshop } from "./168-maurices-workshop";
import { sardineCan } from "./170-sardine-can";

describe("Maurice's Workshop - LOOKING FOR THIS?", () => {
  it("triggers when another item is played and draws a card when 1 ink is paid", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [sardineCan],
      inkwell: sardineCan.cost + 1,
      play: [mauricesWorkshop],
    });

    expect(testEngine.asPlayerOne().playCard(sardineCan)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(testEngine.asPlayerOne().resolvePendingByCard(mauricesWorkshop)).toBeSuccessfulCommand();

    // Drew 1 card from the default 10-card deck
    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 1, play: 2, deck: 9 }),
    );
  });

  it("does not draw a card when the optional is declined", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [sardineCan],
      inkwell: sardineCan.cost + 1,
      play: [mauricesWorkshop],
    });

    expect(testEngine.asPlayerOne().playCard(sardineCan)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(mauricesWorkshop, { resolveOptional: false }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 0, play: 2 }),
    );
  });

  it("does not trigger when Maurice's Workshop itself is played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [mauricesWorkshop],
      inkwell: mauricesWorkshop.cost,
    });

    expect(testEngine.asPlayerOne().playCard(mauricesWorkshop)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
  });

  it("does not trigger when an opponent plays an item", () => {
    // Player one plays an item; player two controls the workshop — it should not trigger
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [sardineCan], inkwell: sardineCan.cost },
      { play: [mauricesWorkshop] },
    );

    expect(testEngine.asPlayerOne().playCard(sardineCan)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
  });
});
