/**
 * CR Chapter 1 — Game Concepts (defining sections).
 * Citations: 1.11 priority, 1.13 assets, 1.14 costs.
 */
import { describe, expect, it } from "vite-plus/test";
import { FabTestEngine } from "../../../testing/test-engine.ts";
import { bravo, dash, nimbleStrikeRed, nimblismBlue, snatchRed } from "../../fixtures.ts";

describe("CR 1 — Game Concepts", () => {
  it("1.13.2: turn player has action points; spending is an asset cost of playing an action", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(game.as(bravo).actionPoints()).toBe(1);
    expect(game.as(dash).actionPoints()).toBe(0);
    game.as(bravo).attackWith(snatchRed);
    expect(game.as(bravo).actionPoints()).toBe(0);
  });

  it("1.13.3 / 1.14.3: pitching while paying a cost generates resource points", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [nimblismBlue, nimbleStrikeRed], deck: 6, resourcePoints: 0 },
      { hero: dash, deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    // CR 1.14.3b: pitch only as payment (or effect) — inline pitch on play.
    // Attacks default to the opponent; pitch stays explicit.
    Bravo.play(nimbleStrikeRed, { pitch: [nimblismBlue] });
    expect(Bravo.resourcePoints()).toBe(2); // pitch 3 − cost 1
    expect(Bravo.zone("pitch")).toContain(nimblismBlue.canonicalId);
  });

  it("1.14.3b: free open-action pitch is illegal without a cost to pay", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [nimblismBlue], deck: 4 },
      { hero: dash, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const cardId = game.findCardInZone(game.as(bravo).id, "hand", nimblismBlue);
    const r = dispatchTestCommand(game.getRuntime(), "pitch", game.as(bravo).id, { cardId });
    expect(r).toMatchObject({ accepted: false, errorCode: "unknown_move" });
  });

  it("1.14: playing with insufficient resources is illegal (cost not paid)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [nimbleStrikeRed], deck: 4, resourcePoints: 0 },
      { hero: dash, deck: 4 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const cardId = game.findCardInZone(game.as(bravo).id, "hand", nimbleStrikeRed);
    const r = game.as(bravo).expectFailure({
      move: "begin-play",
      payload: { instanceId: cardId, target: game.as(dash).id },
    });
    expect(r.errorCode).toBe("insufficient_resources");
  });

  it("1.11: only the priority player may pass; consecutive passes advance combat", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.play(snatchRed, { target: Dash.id });
    expect(game.getState().rulesStack.at(-1)).toMatchObject({ kind: "card", role: "attack" });
    expect(game.combat()).toMatchObject({ open: true, step: "layer" });
    expect(Bravo.hasPriority()).toBe(true);
    const bad = Dash.expectFailure({ move: "pass" });
    expect(bad.errorCode).toBe("not_priority_player");
    game.passBoth();
    expect(game.combat()?.step).toBe("attack");
  });

  it("1.13 life is an asset reduced by combat damage", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      // Walks priority/pitch timing by hand - opt out of the smart defaults.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(16);
  });
});
import { dispatchTestCommand } from "../../../testing/test-command.ts";
