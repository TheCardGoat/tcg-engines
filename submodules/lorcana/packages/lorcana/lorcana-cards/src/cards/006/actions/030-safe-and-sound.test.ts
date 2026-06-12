import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { owlPirateLookout } from "../characters/001-owl-pirate-lookout";
import { thePhantomBlotShadowyFigure } from "../../007";
import { safeAndSound } from "./030-safe-and-sound";

describe("Safe and Sound", () => {
  it("prevents the chosen character from being challenged until your next turn starts", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [safeAndSound],
        inkwell: safeAndSound.cost,
        deck: [owlPirateLookout, owlPirateLookout],
        play: [owlPirateLookout],
      },
      {
        deck: [thePhantomBlotShadowyFigure, thePhantomBlotShadowyFigure],
        play: [thePhantomBlotShadowyFigure],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(safeAndSound, {
        targets: [owlPirateLookout],
      }).success,
    ).toBe(true);
    expect(testEngine.asServer().manualExertCard(owlPirateLookout)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerTwo().canChallenge(thePhantomBlotShadowyFigure, owlPirateLookout),
    ).toBe(false);

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asServer().manualExertCard(owlPirateLookout)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerTwo().canChallenge(thePhantomBlotShadowyFigure, owlPirateLookout),
    ).toBe(true);
  });

  it("only protects the chosen character, not other characters you control", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [safeAndSound],
        inkwell: safeAndSound.cost,
        deck: [owlPirateLookout, owlPirateLookout],
        play: [owlPirateLookout, { card: thePhantomBlotShadowyFigure }],
      },
      {
        deck: [thePhantomBlotShadowyFigure, thePhantomBlotShadowyFigure],
        play: [{ card: owlPirateLookout, exerted: true }],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(safeAndSound, {
        targets: [owlPirateLookout],
      }).success,
    ).toBe(true);
    expect(
      testEngine.asServer().manualExertCard(thePhantomBlotShadowyFigure),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerTwo().canChallenge(owlPirateLookout, thePhantomBlotShadowyFigure),
    ).toBe(false);
  });
});
