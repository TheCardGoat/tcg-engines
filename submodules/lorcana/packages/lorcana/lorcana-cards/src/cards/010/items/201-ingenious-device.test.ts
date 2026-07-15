import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { motunuiIslandParadise } from "../../003/locations/170-motunui-island-paradise";
import { ingeniousDevice } from "./201-ingenious-device";

const drawnCard = createMockCharacter({
  id: "ingenious-device-drawn-card",
  name: "Drawn Card",
  cost: 1,
});

const discardFodder = createMockCharacter({
  id: "ingenious-device-discard-fodder",
  name: "Discard Fodder",
  cost: 1,
});

describe("Ingenious Device", () => {
  it("draws a card, then makes you choose and discard a card", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      deck: [drawnCard],
      hand: [discardFodder],
      inkwell: 2,
      play: [ingeniousDevice],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(ingeniousDevice, "SURPRISE PACKAGE"),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(ingeniousDevice)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(drawnCard)).toBe("hand");
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(2);

    expect(testEngine.asPlayerOne().respondWith(discardFodder)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(discardFodder)).toBe("discard");
    expect(testEngine.asPlayerOne().getZonesCardCount().hand).toBe(1);
  });

  it("deals 3 damage to a chosen character or location when banished during your turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: [drawnCard],
        hand: [discardFodder],
        inkwell: 2,
        play: [ingeniousDevice],
      },
      {
        play: [motunuiIslandParadise],
      },
    );

    expect(
      testEngine.asPlayerOne().activateAbility(ingeniousDevice, "SURPRISE PACKAGE"),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().respondWith(discardFodder)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(ingeniousDevice, {
        targets: [motunuiIslandParadise],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getDamage(motunuiIslandParadise)).toBe(3);
  });
});
