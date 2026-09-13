import { describe, expect, it } from "vitest";
import { expectCombat, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { bravoShowstopper } from "./bravo-showstopper.ts";
import { disableRed } from "../actions/disable.ts";
import { regurgitatingSlogRed } from "../actions/regurgitating-slog.ts";
import { anothos } from "../weapons/anothos.ts";

/** AAA acceptance — Bravo, Showstopper (BVO001) and Anothos (BVO003). */

describe("Bravo, Showstopper + Anothos AAA (BVO001/BVO003)", () => {
  it("gives a cost-3 attack action dominate, which limits the defending player to one hand card", () => {
    const game = FabTestEngine.start(
      { hero: bravoShowstopper, hand: [disableRed], resourcePoints: 7, deck: 6 },
      { hero: dash, hand: [snatchRed, nimblismBlue], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravoShowstopper);
    const Dash = game.as(dash);

    Bravo.must.activate(bravoShowstopper);
    game.passBoth();
    Bravo.attackWith(disableRed);

    expectCombat(game).toBeAtStep("defend").toHaveKeyword("dominate");
    expect(Dash.expectBlockRejected([snatchRed, nimblismBlue]).errorCode).toBe("dominate");
  });

  it("does not grant dominate to a cost-2 attack action", () => {
    const game = FabTestEngine.start(
      { hero: bravoShowstopper, hand: [regurgitatingSlogRed], resourcePoints: 4, deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravoShowstopper);

    Bravo.must.activate(bravoShowstopper);
    game.passBoth();
    Bravo.attackWith(regurgitatingSlogRed);

    expectCombat(game).toBeAtStep("defend").notToHaveKeyword("dominate");
  });

  it("keeps Anothos as a legal weapon attack without incorrectly granting it dominate", () => {
    const game = FabTestEngine.start(
      { hero: bravoShowstopper, weapon1: [anothos], resourcePoints: 5, actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravoShowstopper);

    Bravo.must.activate(bravoShowstopper);
    game.passBoth();
    Bravo.must.activate(anothos);
    game.passBoth();

    expectCombat(game).toBeOpen().notToHaveKeyword("dominate");
  });
});
