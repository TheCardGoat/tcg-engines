import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { potOfHoney } from "../items/067-pot-of-honey";
import { snowFort } from "../items/098-snow-fort";
import { winnieThePoohHungryBearEpic } from "./217-winnie-the-pooh-hungry-bear-epic";

describe("Winnie the Pooh - Hungry Bear (Epic)", () => {
  it("LOOKING FOR A MORSEL - returns an item from discard to hand when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [winnieThePoohHungryBearEpic],
      discard: [potOfHoney],
      inkwell: winnieThePoohHungryBearEpic.cost,
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(winnieThePoohHungryBearEpic)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(winnieThePoohHungryBearEpic)).toBe("play");

    // Resolve the triggered ability via bag
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(winnieThePoohHungryBearEpic, {
        targets: [potOfHoney],
      }),
    ).toBeSuccessfulCommand();

    // Item should now be in hand
    expect(testEngine.asPlayerOne().getCardZone(potOfHoney)).toBe("hand");
  });

  it("LOOKING FOR A MORSEL - can choose from multiple items in discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [winnieThePoohHungryBearEpic],
      discard: [potOfHoney, snowFort],
      inkwell: winnieThePoohHungryBearEpic.cost,
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(winnieThePoohHungryBearEpic)).toBeSuccessfulCommand();

    // Resolve the triggered ability
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(winnieThePoohHungryBearEpic, {
        targets: [snowFort],
      }),
    ).toBeSuccessfulCommand();

    // Chosen item should be in hand, other stays in discard
    expect(testEngine.asPlayerOne().getCardZone(snowFort)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(potOfHoney)).toBe("discard");
  });
});
