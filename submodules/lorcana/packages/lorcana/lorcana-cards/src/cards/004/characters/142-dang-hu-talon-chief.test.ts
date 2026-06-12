import { describe, expect, it } from "bun:test";
import { createMockCharacter, LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { dangHuTalonChief } from "./142-dang-hu-talon-chief";

const villainAlly = createMockCharacter({
  id: "dang-hu-villain-ally",
  name: "Villain Ally",
  cost: 2,
  classifications: ["Storyborn", "Villain"],
});

const villainOpponent = createMockCharacter({
  id: "dang-hu-villain-opponent",
  name: "Villain Opponent",
  cost: 2,
  classifications: ["Storyborn", "Villain"],
});

const heroAlly = createMockCharacter({
  id: "dang-hu-hero-ally",
  name: "Hero Ally",
  cost: 2,
  classifications: ["Storyborn", "Hero"],
});

describe("Dang Hu - Talon Chief", () => {
  it("grants Support to your other Villain characters only", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [dangHuTalonChief, villainAlly, heroAlly],
      },
      {
        play: [villainOpponent],
      },
    );

    expect(testEngine.hasKeyword(villainAlly, "Support")).toBe(true);
    expect(testEngine.hasKeyword(heroAlly, "Support")).toBe(false);
    expect(testEngine.hasKeyword(villainOpponent, "Support")).toBe(false);
    expect(testEngine.hasKeyword(dangHuTalonChief, "Support")).toBe(false);
  });
});
