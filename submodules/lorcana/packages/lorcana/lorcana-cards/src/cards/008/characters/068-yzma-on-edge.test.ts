import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { pullTheLever } from "../actions/080-pull-the-lever";
import { wrongLever } from "../actions/116-wrong-lever";
import { yzmaOnEdge } from "./068-yzma-on-edge";

const fillerDeckCard = createMockCharacter({
  id: "yzma-on-edge-filler",
  name: "Filler Deck Card",
  cost: 1,
});

describe("Yzma - On Edge", () => {
  it("can search for Wrong Lever! if Pull the Lever! is in your discard", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: yzmaOnEdge.cost,
      hand: [yzmaOnEdge],
      discard: [pullTheLever],
      deck: [wrongLever, fillerDeckCard],
    });

    expect(testEngine.asPlayerOne().playCard(yzmaOnEdge)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(yzmaOnEdge, { resolveOptional: true }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(wrongLever)).toBe("hand");
  });
});
