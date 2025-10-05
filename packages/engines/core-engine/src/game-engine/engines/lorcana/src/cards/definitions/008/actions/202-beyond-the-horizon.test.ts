import { describe, expect, it } from "bun:test";
import {
  beyondTheHorizon,
  fredMajorScienceEnthusiast,
  louisEndearingAlligator,
  madDogKarnagesFirstMate,
  napoleonCleverBloodhound,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Beyond The Horizon", () => {
  it("Sing Together 7 (Any number of your or your teammates' characters with total cost 7 or more may {E} to sing this song for free.)", async () => {
    const testEngine = new TestEngine({
      hand: [beyondTheHorizon],
    });

    expect(testEngine.getCardModel(beyondTheHorizon).hasSingTogether).toBe(
      true,
    );
  });

  it("Both Discard their hands", async () => {
    const initialHand = [
      beyondTheHorizon,
      napoleonCleverBloodhound,
      louisEndearingAlligator,
      madDogKarnagesFirstMate,
      fredMajorScienceEnthusiast,
    ];
    const testEngine = new TestEngine(
      {
        inkwell: beyondTheHorizon.cost,
        hand: initialHand,
        deck: 10,
      },
      {
        hand: 10,
        deck: 10,
      },
    );

    await testEngine.playCard(beyondTheHorizon);
    await testEngine.resolveTopOfStack({ mode: "1" });

    expect(testEngine.getZonesCardCount("player_one")).toEqual(
      expect.objectContaining({
        hand: 3,
        deck: 10 - 3,
        discard: initialHand.length,
      }),
    );
    expect(testEngine.getZonesCardCount("player_two")).toEqual(
      expect.objectContaining({
        hand: 3,
        deck: 10 - 3,
        discard: 10,
      }),
    );
  });

  it("Only player discards", async () => {
    const initialHand = [
      beyondTheHorizon,
      napoleonCleverBloodhound,
      louisEndearingAlligator,
      madDogKarnagesFirstMate,
      fredMajorScienceEnthusiast,
    ];
    const testEngine = new TestEngine(
      {
        inkwell: beyondTheHorizon.cost,
        hand: initialHand,
        deck: 10,
      },
      {
        hand: 10,
        deck: 10,
      },
    );

    await testEngine.playCard(beyondTheHorizon);
    await testEngine.resolveTopOfStack({ mode: "2" });

    expect(testEngine.getZonesCardCount("player_one")).toEqual(
      expect.objectContaining({
        hand: 3,
        deck: 10 - 3,
        discard: initialHand.length,
      }),
    );
    expect(testEngine.getZonesCardCount("player_two")).toEqual(
      expect.objectContaining({
        hand: 10,
        deck: 10,
        discard: 0,
      }),
    );
  });

  it("Only opponent discards", async () => {
    const initialHand = [
      beyondTheHorizon,
      napoleonCleverBloodhound,
      louisEndearingAlligator,
      madDogKarnagesFirstMate,
      fredMajorScienceEnthusiast,
    ];
    const testEngine = new TestEngine(
      {
        inkwell: beyondTheHorizon.cost,
        hand: initialHand,
        deck: 10,
      },
      {
        hand: 10,
        deck: 10,
      },
    );

    await testEngine.playCard(beyondTheHorizon);
    await testEngine.resolveTopOfStack({ mode: "3" });

    expect(testEngine.getZonesCardCount("player_one")).toEqual(
      expect.objectContaining({
        hand: initialHand.length - 1,
        deck: 10,
        discard: 1,
      }),
    );
    expect(testEngine.getZonesCardCount("player_two")).toEqual(
      expect.objectContaining({
        hand: 3,
        deck: 10 - 3,
        discard: 10,
      }),
    );
  });
});
