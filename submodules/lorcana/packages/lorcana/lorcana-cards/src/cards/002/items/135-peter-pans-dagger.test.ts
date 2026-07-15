import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { peterPansDagger } from "./135-peter-pans-dagger";

const evasiveAlly = createMockCharacter({
  id: "peter-pans-dagger-evasive-ally",
  name: "Evasive Ally",
  cost: 2,
  strength: 3,
  abilities: [{ id: "ppd-evasive", type: "keyword", keyword: "Evasive", text: "Evasive" }],
});

const nonEvasiveAlly = createMockCharacter({
  id: "peter-pans-dagger-non-evasive-ally",
  name: "Non Evasive Ally",
  cost: 2,
  strength: 2,
});

const opponentEvasiveCharacter = createMockCharacter({
  id: "peter-pans-dagger-opponent-evasive",
  name: "Opponent Evasive Character",
  cost: 2,
  strength: 3,
  abilities: [{ id: "ppd-opp-evasive", type: "keyword", keyword: "Evasive", text: "Evasive" }],
});

describe("Peter Pan's Dagger", () => {
  it("gives +1 strength only to your characters with Evasive, not to those without", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [peterPansDagger, evasiveAlly, nonEvasiveAlly],
      },
      {
        play: [opponentEvasiveCharacter],
      },
    );

    expect(testEngine.asPlayerOne().getCard(evasiveAlly)?.strength).toBe(4);
    expect(testEngine.asPlayerOne().getCard(nonEvasiveAlly)?.strength).toBe(2);
    expect(testEngine.asPlayerTwo().getCard(opponentEvasiveCharacter)?.strength).toBe(3);
  });
});
