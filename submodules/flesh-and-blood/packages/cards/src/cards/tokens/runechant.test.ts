import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { viserai } from "../heroes/viserai.ts";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { snagBlue } from "../instants/snag.ts";
import { edgeOfAutumn } from "../weapons/edge-of-autumn.ts";
import { runechant } from "./runechant.ts";

/**
 * Runechant (1HP300) — Runeblade Token - Aura.
 * Printed: "When you play an attack action card or activate a weapon attack,
 * destroy this and deal 1 arcane damage to target opposing hero."
 */
describe("Runechant (1HP300) AAA", () => {
  it("happy: playing an attack action card burns the Runechant into 1 arcane damage", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        arena: [runechant],
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Viserai = game.as(viserai);

    Viserai.playAttack(brutalAssaultBlue);
    game.as(dash).defendWith();
    game.helpers.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expect(Viserai.zone("arena")).not.toContain(runechant.canonicalId);
  });

  it("boundary: a non-attack play leaves the Runechant and the opposing hero alone", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        arena: [runechant],
        hand: [snagBlue],
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Viserai = game.as(viserai);

    Viserai.play(snagBlue);
    game.helpers.untilIdle();

    expectFabPlayer(game.as(dash)).toHaveLife(20);
    expectFabCard(Viserai, runechant).toBeIn("arena");
  });

  it("timing: activating a weapon attack also burns the Runechant into 1 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [runechant],
        weapon1: [edgeOfAutumn],
        hand: [],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.activateAttack(edgeOfAutumn);
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith();
    game.helpers.closeCombat({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(18);
    expect(Bravo.zone("arena")).not.toContain(runechant.canonicalId);
  });
});
