import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  LorcanaTestEngine,
  createMockAction,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { heiheiExpandedConsciousness } from "./163-heihei-expanded-consciousness";

const lucky = createMockCharacter({
  id: "heihei-expanded-consciousness-lucky",
  name: "Lucky",
  cost: 2,
});

const clue = createMockAction({
  id: "heihei-expanded-consciousness-clue",
  name: "Clue",
  cost: 1,
});

describe("Heihei - Expanded Consciousness", () => {
  it("has Shift 3 and Resist +1", () => {
    const testEngine = new LorcanaTestEngine({ play: [heiheiExpandedConsciousness] });
    const cardUnderTest = testEngine.getCardModel(heiheiExpandedConsciousness);

    expect(cardUnderTest.hasShift()).toBe(true);
    expect(cardUnderTest.hasResist).toBe(true);
  });

  it("puts all remaining hand cards into inkwell facedown and exerted when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [heiheiExpandedConsciousness, lucky, clue],
      inkwell: heiheiExpandedConsciousness.cost,
      deck: [],
    });

    expect(testEngine.asPlayerOne().playCard(heiheiExpandedConsciousness)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getCardZone(heiheiExpandedConsciousness)).toBe("play");
    expect(testEngine.asPlayerOne().getCardZone(lucky)).toBe("inkwell");
    expect(testEngine.asPlayerOne().getCardZone(clue)).toBe("inkwell");
    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 0,
        inkwell: heiheiExpandedConsciousness.cost + 2,
      }),
    );
  });
});
