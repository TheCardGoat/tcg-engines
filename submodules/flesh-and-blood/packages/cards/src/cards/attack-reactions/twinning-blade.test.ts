import { describe, it } from "vitest";
import { FabTestEngine, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { snatchBlue, snatchRed } from "../actions/snatch.ts";
import { dash } from "../heroes/dash.ts";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { twinningBladeYellow } from "./twinning-blade.ts";

describe("Twinning Blade (CRU082)", () => {
  it("adds one shared Dawnblade activation without AP, untap, or printed-limit reset", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [dawnblade],
        hand: [twinningBladeYellow],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, snatchBlue], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Dori = game.as(dorinthea);

    Dori.must.activate(dawnblade);
    game.advanceUntil({ stopAt: "defend" });
    // Miss so Dorinthea's first-hit permission does not also raise the limit.
    game.as(dash).defendWith(snatchRed, snatchBlue);
    game.toReaction("attacker");
    Dori.must.playReaction(twinningBladeYellow);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dori).toHaveAP(1);
    Dori.must.activate(dawnblade);
    game.helpers.resolveRestOfCombat();
    Dori.expectActivationRejected(dawnblade, "activation_limit");
  });
});
