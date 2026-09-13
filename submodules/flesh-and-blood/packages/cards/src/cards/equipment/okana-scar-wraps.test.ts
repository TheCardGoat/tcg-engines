import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { fai } from "../heroes/fai.ts";
import { dash } from "../heroes/dash.ts";
import { edgeOfAutumn } from "../weapons/edge-of-autumn.ts";
import { seekVengeanceBlue } from "../actions/seek-vengeance.ts";
import { floodOfForceYellow } from "../actions/flood-of-force.ts";
import { okanaScarWraps } from "./okana-scar-wraps.ts";

/**
 * Okana Scar Wraps — Ninja Arms d2 Blade Break.
 *
 * Printed: "Attack Reaction - {t}, banish an Edge of Autumn you control: Target
 * Ninja attack action card gets +1{p}. / Whenever an attack you control with
 * Vengeance in its name hits, you may equip an Edge of Autumn from your
 * banished zone. Blade Break"
 */

describe("Okana Scar Wraps AAA", () => {
  it("happy: the AR banishes the Edge for +1{p}, and the Vengeance hit re-equips it", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        arms: [okanaScarWraps],
        weapon1: [edgeOfAutumn],
        hand: [seekVengeanceBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Fai.playAttack(seekVengeanceBlue); // 2{p} Ninja attack with "Vengeance" in its name
    game.toReaction("attacker");
    Fai.activate(okanaScarWraps); // {t} + banish Edge of Autumn
    game.passBoth(); // resolve the AR: +1{p} on the live attack

    expectCombat(game).toHaveAttackPower(3);
    expectFabCard(Fai, Fai.cardIn("banished", edgeOfAutumn)).toBeIn("banished");

    // The Vengeance hit: equip the Edge back from the banished zone.
    game.closeCombat({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Fai, edgeOfAutumn).toBeIn("weapon1");
    expect(Fai.zone("banished")).toHaveLength(0);
  });

  it("boundary: a hit without Vengeance in the name leaves the Edge banished", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        arms: [okanaScarWraps],
        weapon1: [edgeOfAutumn],
        hand: [floodOfForceYellow], // Ninja attack, no "Vengeance" in the name
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);
    const _Dash = game.as(dash);

    Fai.playAttack(floodOfForceYellow);
    game.toReaction("attacker");
    Fai.activate(okanaScarWraps);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(2); // 1{p} + 1
    game.closeCombat({ optionals: "decline" });

    expectFabCard(Fai, Fai.cardIn("banished", edgeOfAutumn)).toBeIn("banished");
    expect(Fai.zone("weapon1")).toHaveLength(0);
  });
});
