import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { obscurosphere } from "./099-obscurosphere";

const protectedAlly = createMockCharacter({
  id: "obscurosphere-target",
  name: "Protected Ally",
  cost: 2,
});

describe("Obscurosphere", () => {
  it("gives your characters Ward until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: 2,
        inkwell: 1,
        play: [obscurosphere, protectedAlly],
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().activateAbility(obscurosphere)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().hasKeyword(protectedAlly, "Ward")).toBe(true);
    expect(testEngine.asPlayerOne().getCardZone(obscurosphere)).toBe("discard");

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().hasKeyword(protectedAlly, "Ward")).toBe(true);

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().hasKeyword(protectedAlly, "Ward")).toBe(false);
  });
});
