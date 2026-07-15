import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { amberChromicon } from "./032-amber-chromicon";

const firstDamagedAlly = createMockCharacter({
  id: "amber-chromicon-ally-1",
  name: "First Damaged Ally",
  cost: 2,
});

const secondDamagedAlly = createMockCharacter({
  id: "amber-chromicon-ally-2",
  name: "Second Damaged Ally",
  cost: 3,
});

const damagedOpponent = createMockCharacter({
  id: "amber-chromicon-opponent",
  name: "Damaged Opponent",
  cost: 2,
});

describe("Amber Chromicon", () => {
  it("removes 1 damage from each of your characters only", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        deck: [],
        play: [amberChromicon, firstDamagedAlly, secondDamagedAlly],
      },
      {
        deck: [],
        play: [damagedOpponent],
      },
    );

    testEngine.asServer().manualSetDamage(firstDamagedAlly, 2);
    testEngine.asServer().manualSetDamage(secondDamagedAlly, 1);
    testEngine.asServer().manualSetDamage(damagedOpponent, 2);

    expect(testEngine.asPlayerOne().activateAbility(amberChromicon)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getDamage(firstDamagedAlly)).toBe(1);
    expect(testEngine.asPlayerOne().getDamage(secondDamagedAlly)).toBe(0);
    expect(testEngine.asPlayerTwo().getDamage(damagedOpponent)).toBe(2);
  });
});
