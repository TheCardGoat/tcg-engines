import { describe, expect, it } from "bun:test";
import type { CommandFailure } from "@tcg/lorcana-engine";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { jebidiahFarnsworthCookie } from "./117-jebidiah-farnsworth-cookie";

const nonEvasiveAttacker = createMockCharacter({
  id: "jebidiah-non-evasive-attacker",
  name: "Non-Evasive Attacker",
  cost: 3,
  strength: 3,
  willpower: 3,
});

describe("Jebidiah Farnsworth - Cookie", () => {
  it("should have Evasive", () => {
    const testEngine = new LorcanaTestEngine({
      play: [jebidiahFarnsworthCookie],
    });

    const cardUnderTest = testEngine.getCardModel(jebidiahFarnsworthCookie);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("should have Reckless", () => {
    const testEngine = new LorcanaTestEngine({
      play: [jebidiahFarnsworthCookie],
    });

    const cardUnderTest = testEngine.getCardModel(jebidiahFarnsworthCookie);
    expect(cardUnderTest.hasReckless()).toBe(true);
  });

  it("cannot be challenged by a non-Evasive character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [{ card: nonEvasiveAttacker, isDrying: false }],
        deck: 5,
      },
      {
        play: [{ card: jebidiahFarnsworthCookie, exerted: true, isDrying: false }],
        deck: 5,
      },
    );

    expect(
      testEngine.asPlayerOne().challenge(nonEvasiveAttacker, jebidiahFarnsworthCookie),
    ).not.toBeSuccessfulCommand();
  });

  it("cannot quest due to Reckless", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [{ card: jebidiahFarnsworthCookie, isDrying: false }],
    });

    const result = testEngine.asPlayerOne().quest(jebidiahFarnsworthCookie) as CommandFailure;

    expect(result.success).toBe(false);
    expect(result.errorCode).toBe("RECKLESS_CANT_QUEST");
  });
});
