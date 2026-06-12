import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockItem } from "@tcg/lorcana-engine/testing";
import { donaldDuckAlongForTheRide } from "./178-donald-duck-along-for-the-ride";

const ownItem = createMockItem({ id: "donald-own-item", name: "Own Item", cost: 1 });
const opponentItem = createMockItem({
  id: "donald-opponent-item",
  name: "Opponent Item",
  cost: 1,
});

describe("Donald Duck - Along for the Ride", () => {
  it("can be played from hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [donaldDuckAlongForTheRide],
      inkwell: donaldDuckAlongForTheRide.cost,
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(donaldDuckAlongForTheRide)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(donaldDuckAlongForTheRide)).toBe("play");
  });

  it("COMIN' THROUGH! - banishes chosen item when accepting the optional ability", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [donaldDuckAlongForTheRide],
      inkwell: donaldDuckAlongForTheRide.cost,
      play: [ownItem],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(donaldDuckAlongForTheRide)).toBeSuccessfulCommand();

    // The optional banish ability should be in the bag
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

    const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(donaldDuckAlongForTheRide, {
        resolveOptional: true,
        targets: [ownItem],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(ownItem)).toBe("discard");
  });

  it("COMIN' THROUGH! - can decline the optional banish ability", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [donaldDuckAlongForTheRide],
      inkwell: donaldDuckAlongForTheRide.cost,
      play: [ownItem],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().playCard(donaldDuckAlongForTheRide)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

    const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(donaldDuckAlongForTheRide, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(ownItem)).toBe("play");
  });

  it("COMIN' THROUGH! - can target opponent's item", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [donaldDuckAlongForTheRide],
        inkwell: donaldDuckAlongForTheRide.cost,
        deck: 2,
      },
      {
        play: [opponentItem],
      },
    );

    expect(testEngine.asPlayerOne().playCard(donaldDuckAlongForTheRide)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

    const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(donaldDuckAlongForTheRide, {
        resolveOptional: true,
        targets: [opponentItem],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(opponentItem)).toBe("discard");
  });
});
