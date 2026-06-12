import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, PLAYER_ONE } from "@tcg/lorcana-engine/testing";
import { simbaProtectiveCub, tinkerBellPeterPansAlly } from "../../001";
import { lostInTheWoods } from "./029-lost-in-the-woods";

describe("Lost in the Woods", () => {
  it("reduces all opposing characters' strength until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [lostInTheWoods],
        inkwell: lostInTheWoods.cost,
      },
      {
        play: [simbaProtectiveCub, tinkerBellPeterPansAlly],
      },
    );

    const simbaStrength = testEngine.asPlayerTwo().getCardStrength(simbaProtectiveCub);
    const tinkerBellStrength = testEngine.asPlayerTwo().getCardStrength(tinkerBellPeterPansAlly);

    expect(testEngine.asPlayerOne().playCard(lostInTheWoods)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardStrength(simbaProtectiveCub)).toBe(simbaStrength - 2);
    expect(testEngine.asPlayerTwo().getCardStrength(tinkerBellPeterPansAlly)).toBe(
      tinkerBellStrength - 2,
    );

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardStrength(simbaProtectiveCub)).toBe(simbaStrength - 2);
    expect(testEngine.asPlayerTwo().getCardStrength(tinkerBellPeterPansAlly)).toBe(
      tinkerBellStrength - 2,
    );

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerTwo().getCardStrength(simbaProtectiveCub)).toBe(simbaStrength);
    expect(testEngine.asPlayerTwo().getCardStrength(tinkerBellPeterPansAlly)).toBe(
      tinkerBellStrength,
    );
  });
});
