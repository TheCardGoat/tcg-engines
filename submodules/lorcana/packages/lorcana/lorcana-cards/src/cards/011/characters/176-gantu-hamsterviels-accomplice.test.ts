import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { gantuHamstervielsAccomplice } from "./176-gantu-hamsterviels-accomplice";

const handFodder = createMockCharacter({
  id: "gantu-hand-fodder",
  name: "Hand Fodder",
  cost: 1,
});

describe("Gantu - Hamsterviel's Accomplice", () => {
  it("prompts to discard a card when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [gantuHamstervielsAccomplice, handFodder],
      inkwell: gantuHamstervielsAccomplice.cost,
    });

    expect(testEngine.asPlayerOne().playCard(gantuHamstervielsAccomplice)).toBeSuccessfulCommand();

    // The on-play trigger creates a bag effect for discarding
    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(gantuHamstervielsAccomplice),
    ).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveNextPending({
        targets: [handFodder],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(handFodder)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(gantuHamstervielsAccomplice)).toBe("play");
  });
});
