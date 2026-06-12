import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { tianaDiligentWaitress } from "../characters";
import { mouseArmor } from "./203-mouse-armor";

describe("Mouse Armor", () => {
  it("gives the chosen character Resist +1 until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [mouseArmor, tianaDiligentWaitress],
    });

    const result = testEngine.asPlayerOne().activateAbility(mouseArmor, {
      targets: [tianaDiligentWaitress],
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().isExerted(mouseArmor)).toBe(true);
    expect(testEngine.asPlayerOne().getKeywordValue(tianaDiligentWaitress, "Resist")).toBe(1);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getKeywordValue(tianaDiligentWaitress, "Resist")).toBe(1);

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getKeywordValue(tianaDiligentWaitress, "Resist")).toBeNull();
  });
});
