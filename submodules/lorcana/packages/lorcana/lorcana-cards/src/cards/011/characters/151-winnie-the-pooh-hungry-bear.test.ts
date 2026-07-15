import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { potOfHoney } from "../items/067-pot-of-honey";
import { snowFort } from "../items/098-snow-fort";
import { winnieThePoohHungryBear } from "./151-winnie-the-pooh-hungry-bear";

describe("Winnie the Pooh - Hungry Bear", () => {
  it("LOOKING FOR A MORSEL - returns an item from discard to hand when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [winnieThePoohHungryBear],
      discard: [potOfHoney],
      inkwell: winnieThePoohHungryBear.cost,
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(winnieThePoohHungryBear)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(winnieThePoohHungryBear)).toBe("play");

    // Resolve the triggered ability via bag
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(winnieThePoohHungryBear, {
        targets: [potOfHoney],
      }),
    ).toBeSuccessfulCommand();

    // Item should now be in hand
    expect(testEngine.asPlayerOne().getCardZone(potOfHoney)).toBe("hand");
  });

  it("LOOKING FOR A MORSEL - can choose from multiple items in discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [winnieThePoohHungryBear],
      discard: [potOfHoney, snowFort],
      inkwell: winnieThePoohHungryBear.cost,
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(winnieThePoohHungryBear)).toBeSuccessfulCommand();

    // Resolve the triggered ability
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(winnieThePoohHungryBear, {
        targets: [snowFort],
      }),
    ).toBeSuccessfulCommand();

    // Chosen item should be in hand, other stays in discard
    expect(testEngine.asPlayerOne().getCardZone(snowFort)).toBe("hand");
    expect(testEngine.asPlayerOne().getCardZone(potOfHoney)).toBe("discard");
  });
});
