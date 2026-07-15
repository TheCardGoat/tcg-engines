import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { powerSurge } from "./166-power-surge";

const p1TopA = createMockCharacter({ id: "power-surge-p1-top-a", name: "P1 Top A", cost: 1 });
const p1TopB = createMockCharacter({ id: "power-surge-p1-top-b", name: "P1 Top B", cost: 1 });
const p2TopA = createMockCharacter({ id: "power-surge-p2-top-a", name: "P2 Top A", cost: 1 });
const p2TopB = createMockCharacter({ id: "power-surge-p2-top-b", name: "P2 Top B", cost: 1 });

describe("Power Surge", () => {
  it("puts the top 2 cards of each player's deck into their inkwell", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [powerSurge],
        inkwell: powerSurge.cost,
        deck: [p1TopA, p1TopB],
      },
      {
        deck: [p2TopA, p2TopB],
      },
    );

    expect(testEngine.asPlayerOne().playCard(powerSurge)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(p1TopA)).toBe("inkwell");
    expect(testEngine.asPlayerOne().getCardZone(p1TopB)).toBe("inkwell");
    expect(testEngine.asPlayerTwo().getCardZone(p2TopA)).toBe("inkwell");
    expect(testEngine.asPlayerTwo().getCardZone(p2TopB)).toBe("inkwell");
  });
});
