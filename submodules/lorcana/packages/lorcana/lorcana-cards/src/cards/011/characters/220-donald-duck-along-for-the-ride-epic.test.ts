import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockItem } from "@tcg/lorcana-engine/testing";
import { donaldDuckAlongForTheRideEpic } from "./220-donald-duck-along-for-the-ride-epic";

const ownItem = createMockItem({
  id: "donald-epic-own-item",
  name: "Own Item",
  cost: 1,
});
const opponentItem = createMockItem({
  id: "donald-epic-opponent-item",
  name: "Opponent Item",
  cost: 1,
});

describe("Donald Duck - Along for the Ride (Epic)", () => {
  it("can be played from hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [donaldDuckAlongForTheRideEpic],
      inkwell: donaldDuckAlongForTheRideEpic.cost,
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().playCard(donaldDuckAlongForTheRideEpic),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(donaldDuckAlongForTheRideEpic)).toBe("play");
  });

  it("COMIN' THROUGH! - banishes chosen item when accepting the optional ability", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [donaldDuckAlongForTheRideEpic],
      inkwell: donaldDuckAlongForTheRideEpic.cost,
      play: [ownItem],
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().playCard(donaldDuckAlongForTheRideEpic),
    ).toBeSuccessfulCommand();

    // The optional banish ability should be in the bag
    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

    const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(donaldDuckAlongForTheRideEpic, {
        resolveOptional: true,
        targets: [ownItem],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(ownItem)).toBe("discard");
  });

  it("COMIN' THROUGH! - can decline the optional banish ability", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [donaldDuckAlongForTheRideEpic],
      inkwell: donaldDuckAlongForTheRideEpic.cost,
      play: [ownItem],
      deck: 2,
    });

    expect(
      testEngine.asPlayerOne().playCard(donaldDuckAlongForTheRideEpic),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

    const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(donaldDuckAlongForTheRideEpic, {
        resolveOptional: false,
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(ownItem)).toBe("play");
  });

  it("COMIN' THROUGH! - can target opponent's item", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [donaldDuckAlongForTheRideEpic],
        inkwell: donaldDuckAlongForTheRideEpic.cost,
        deck: 2,
      },
      {
        play: [opponentItem],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(donaldDuckAlongForTheRideEpic),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);

    const bagId = testEngine.asPlayerOne().getBagEffects()[0]!.id;
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(donaldDuckAlongForTheRideEpic, {
        resolveOptional: true,
        targets: [opponentItem],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(opponentItem)).toBe("discard");
  });
});
