import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { goonsMaleficentsUnderlings, heiheiBoatSnack, simbaProtectiveCub } from "../../001";
import { thePhantomBlotShadowyFigure } from "../../007";
import { motherWillProtectYou } from "./030-mother-will-protect-you";

describe("Mother Will Protect You", () => {
  it("stops the chosen character from being challenged until your next turn starts", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [motherWillProtectYou],
        inkwell: motherWillProtectYou.cost,
        deck: [goonsMaleficentsUnderlings, goonsMaleficentsUnderlings],
        play: [goonsMaleficentsUnderlings],
      },
      {
        deck: [thePhantomBlotShadowyFigure, thePhantomBlotShadowyFigure],
        play: [thePhantomBlotShadowyFigure],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(motherWillProtectYou, {
        targets: [goonsMaleficentsUnderlings],
      }).success,
    ).toBe(true);
    expect(
      testEngine.asServer().manualExertCard(goonsMaleficentsUnderlings),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine
        .asPlayerTwo()
        .canChallenge(thePhantomBlotShadowyFigure, goonsMaleficentsUnderlings),
    ).toBe(false);

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(
      testEngine.asServer().manualExertCard(goonsMaleficentsUnderlings),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(
      testEngine
        .asPlayerTwo()
        .canChallenge(thePhantomBlotShadowyFigure, goonsMaleficentsUnderlings),
    ).toBe(true);
  });

  it("lets challengers ignore a protected bodyguard and challenge another exerted character", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [motherWillProtectYou],
        inkwell: motherWillProtectYou.cost,
        deck: [simbaProtectiveCub, heiheiBoatSnack],
        play: [simbaProtectiveCub, heiheiBoatSnack],
      },
      {
        deck: [thePhantomBlotShadowyFigure, thePhantomBlotShadowyFigure],
        play: [thePhantomBlotShadowyFigure],
      },
    );

    expect(
      testEngine.asPlayerOne().playCard(motherWillProtectYou, {
        targets: [simbaProtectiveCub],
      }).success,
    ).toBe(true);
    expect(testEngine.asServer().manualExertCard(simbaProtectiveCub)).toBeSuccessfulCommand();
    expect(testEngine.asServer().manualExertCard(heiheiBoatSnack)).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerTwo().canChallenge(thePhantomBlotShadowyFigure, simbaProtectiveCub),
    ).toBe(false);
    expect(
      testEngine.asPlayerTwo().canChallenge(thePhantomBlotShadowyFigure, heiheiBoatSnack),
    ).toBe(true);

    expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
    expect(testEngine.asServer().manualExertCard(simbaProtectiveCub)).toBeSuccessfulCommand();
    expect(testEngine.asServer().manualExertCard(heiheiBoatSnack)).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

    expect(
      testEngine.asPlayerTwo().canChallenge(thePhantomBlotShadowyFigure, simbaProtectiveCub),
    ).toBe(true);
    expect(
      testEngine.asPlayerTwo().canChallenge(thePhantomBlotShadowyFigure, heiheiBoatSnack),
    ).toBe(false);
  });
});
