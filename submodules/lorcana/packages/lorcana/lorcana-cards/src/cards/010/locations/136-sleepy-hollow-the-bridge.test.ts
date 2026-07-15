import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { sleepyHollowTheBridge } from "./136-sleepy-hollow-the-bridge";

const bridgeRunner = createMockCharacter({
  id: "bridge-runner",
  name: "Bridge Runner",
  cost: 3,
  lore: 1,
  willpower: 4,
});

describe("Sleepy Hollow - The Bridge", () => {
  it("banishes itself to give the questing character Evasive until the start of your next turn and gain 2 lore", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [sleepyHollowTheBridge, { card: bridgeRunner, atLocation: sleepyHollowTheBridge }],
      deck: 2,
    });

    expect(testEngine.asPlayerOne().quest(bridgeRunner)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().resolvePendingByCard(sleepyHollowTheBridge).success).toBe(true);
    expect(testEngine.asPlayerOne().getCardZone(sleepyHollowTheBridge)).toBe("discard");
    expect(testEngine.asPlayerOne().hasKeyword(bridgeRunner, "Evasive")).toBe(true);
    expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(3);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().hasKeyword(bridgeRunner, "Evasive")).toBe(false);
  });
});
