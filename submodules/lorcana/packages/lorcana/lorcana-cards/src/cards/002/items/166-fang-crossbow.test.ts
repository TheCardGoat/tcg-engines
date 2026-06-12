import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { madamMimPurpleDragon, theQueenRegalMonarch } from "../characters";
import { fangCrossbow } from "./166-fang-crossbow";

describe("Fang Crossbow", () => {
  it("gives the chosen character -2 strength this turn", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      inkwell: 2,
      play: [fangCrossbow, theQueenRegalMonarch],
    });

    const baseStrength = testEngine.asPlayerOne().getCard(theQueenRegalMonarch).strength;
    expect(baseStrength).toBeDefined();
    const result = testEngine.asPlayerOne().activateAbility(fangCrossbow, {
      ability: "CAREFUL AIM",
      targets: [theQueenRegalMonarch],
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCard(theQueenRegalMonarch).strength).toBe(baseStrength! - 2);

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCard(theQueenRegalMonarch).strength).toBe(baseStrength);
  });

  it("banishes the chosen Dragon character and itself", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [fangCrossbow, madamMimPurpleDragon],
    });

    const result = testEngine.asPlayerOne().activateAbility(fangCrossbow, {
      ability: "STAY BACK!",
      targets: [madamMimPurpleDragon],
    });

    expect(result).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(fangCrossbow)).toBe("discard");
    expect(testEngine.asPlayerOne().getCardZone(madamMimPurpleDragon)).toBe("discard");
  });

  it("does not let you choose a non-Dragon character for STAY BACK!", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [fangCrossbow, theQueenRegalMonarch],
    });

    const result = testEngine.asPlayerOne().activateAbility(fangCrossbow, {
      ability: "STAY BACK!",
      targets: [theQueenRegalMonarch],
    });

    expect(result.success).toBe(false);
    expect(testEngine.asPlayerOne().getCardZone(fangCrossbow)).toBe("play");
    expect(testEngine.asPlayerOne().getCardZone(theQueenRegalMonarch)).toBe("play");
  });
});
