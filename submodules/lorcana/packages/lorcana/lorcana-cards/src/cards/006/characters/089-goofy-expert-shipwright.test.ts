import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { goofyExpertShipwright } from "./089-goofy-expert-shipwright";

const protectedAlly = createMockCharacter({
  id: "goofy-expert-shipwright-protected-ally",
  name: "Protected Ally",
  cost: 2,
  lore: 1,
});

describe("Goofy - Expert Shipwright", () => {
  it("CLEVER DESIGN gives the chosen character Ward until the start of your next turn after Goofy quests", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: goofyExpertShipwright, isDrying: false }, protectedAlly],
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().hasKeyword(protectedAlly, "Ward")).toBe(false);

    expect(testEngine.asPlayerOne().quest(goofyExpertShipwright)).toBeSuccessfulCommand();
    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(goofyExpertShipwright, {
        targets: [protectedAlly],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(protectedAlly, "Ward")).toBe(true);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().hasKeyword(protectedAlly, "Ward")).toBe(true);

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().hasKeyword(protectedAlly, "Ward")).toBe(false);
  });
});
