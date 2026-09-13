/**
 * Core skeleton CR path retained for regression: full library-consumer flow
 * with real cards. Chapter suites under 01–09 expand coverage.
 */
import { describe, expect, it } from "vite-plus/test";
import { FabTestEngine } from "../testing/test-engine.ts";
import { bravo, dash, nimbleStrikeRed, nimblismBlue, snatchRed } from "./fixtures.ts";

describe("core skeleton — library consumer (CR 4/5/7)", () => {
  it("payment pitch → play attack → defend → damage → life via full combat steps", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [nimbleStrikeRed, nimblismBlue], deck: 10, resourcePoints: 0 },
      { hero: dash, life: 20, hand: [snatchRed], deck: 10 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    // CR 1.14.3b: pitch as payment for cost 1 Nimble Strike
    Bravo.play(nimbleStrikeRed, { pitch: [nimblismBlue], target: Dash.id });
    expect(Bravo.resourcePoints()).toBe(2); // 3 − 1
    game.passBoth();
    game.passBoth();
    expect(game.combat()?.step).toBe("defend");
    Dash.blockWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expect(Dash.life()).toBe(18); // 4 − 2
    expect(Bravo.zone("graveyard")).toContain(nimbleStrikeRed.canonicalId);
    expect(Dash.zone("graveyard")).toContain(snatchRed.canonicalId);
    expect(game.combat()).toBeNull();
  });

  it("dual: play WITH target skips select-attack-target and completes combat damage", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 8 },
      { hero: dash, life: 20, deck: 8 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.play(snatchRed); // default target = opponent
    expect(game.getState().rulesStack.at(-1)).toMatchObject({ kind: "card", role: "attack" });
    game.passBoth(); // card layer resolves → attack
    game.passBoth();
    expect(game.combat()?.step).toBe("defend");
    game.helpers.resolveRestOfCombat();
    expect(Dash.life()).toBe(16);
    expect(Bravo.zone("graveyard")).toContain(snatchRed.canonicalId);
    expect(game.combat()).toBeNull();
  });

  it("life ≤ 0 ends the game after damage step", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 8 },
      { hero: dash, life: 3, deck: 8 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(game.hasGameEnded()).toBe(true);
    expect(game.getGameEndResult().winnerId).toBe(game.as(bravo).id);
  });
});
