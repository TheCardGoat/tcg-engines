import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockItem } from "@tcg/lorcana-engine/testing";
import { putThatThingBack } from "./103-put-that-thing-back";

const bouncedItem = createMockItem({
  id: "put-that-thing-back-bounced-item",
  name: "Bounced Item",
  cost: 2,
});

describe("Put That Thing Back", () => {
  it("returns a chosen item to its player's hand", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [putThatThingBack],
        inkwell: putThatThingBack.cost,
      },
      {
        play: [bouncedItem],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(putThatThingBack, {
        targets: [bouncedItem],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(bouncedItem)).toBe("hand");
  });
});
