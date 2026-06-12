import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { atlanteanCrystal } from "./180-atlantean-crystal";

const protectedAlly = createMockCharacter({
  id: "atlantean-crystal-protected-ally",
  name: "Protected Ally",
  cost: 2,
});

describe("Atlantean Crystal", () => {
  it("grants Resist +2 and Support until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 2,
      play: [atlanteanCrystal, protectedAlly],
    });

    expect(
      testEngine.asPlayerOne().activateAbility(atlanteanCrystal, {
        ability: "SHIELDING LIGHT",
        targets: [protectedAlly],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getKeywordValue(protectedAlly, "Resist")).toBe(2);
    expect(testEngine.asPlayerOne().hasKeyword(protectedAlly, "Support")).toBe(true);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getKeywordValue(protectedAlly, "Resist")).toBe(2);
    expect(testEngine.asPlayerOne().hasKeyword(protectedAlly, "Support")).toBe(true);

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getKeywordValue(protectedAlly, "Resist")).toBeNull();
    expect(testEngine.asPlayerOne().hasKeyword(protectedAlly, "Support")).toBe(false);
  });
});
