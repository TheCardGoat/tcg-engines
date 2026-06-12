import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { simbaScrappyCub } from "../characters";
import { gizmosuit } from "./200-gizmosuit";

describe("Gizmosuit", () => {
  it("banishes itself and gives the chosen character Resist +2 until the start of your next turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [gizmosuit, simbaScrappyCub],
      deck: 2,
    });

    const result = testEngine.asPlayerOne().activateAbility(gizmosuit, {
      ability: "CYBERNETIC ARMOR",
      targets: [simbaScrappyCub],
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(gizmosuit)).toBe("discard");
    expect(testEngine.asPlayerOne().getKeywordValue(simbaScrappyCub, "Resist")).toBe(2);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getKeywordValue(simbaScrappyCub, "Resist")).toBe(2);

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getKeywordValue(simbaScrappyCub, "Resist")).toBeNull();
  });
});
