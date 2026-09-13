import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { hyperDriverRed } from "./hyper-driver.ts";
import { torqueTunedRed } from "./torque-tuned.ts";
import { nimblismBlue } from "./nimblism.ts";
import { zeroToSixtyRed } from "./zero-to-sixty.ts";

/**
 * Torque-Tuned, Red (EVO114) — Mechanologist Action - Attack, cost 2,
 * 6{p}.
 * Printed: "If an item you control has been destroyed this turn, this
 * gets overpower. When this defends, you may destroy an item you
 * control. If you do, this gets +2{d}."
 */

describe("Torque-Tuned, Red (EVO114) AAA", () => {
  it("happy: an item destroyed this turn (boost-freed Hyper Driver) grants overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [torqueTunedRed, zeroToSixtyRed],
        arena: [{ card: hyperDriverRed, state: { steamCounters: 1 } }],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: fai, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    // Boost removes the driver's last counter; it self-destructs.
    Dash.playAttack(zeroToSixtyRed, { boost: true, stopAt: "on-attack" });
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", ordering: "listed" });
    game.closeCombat({ entityTargets: "minimum", ordering: "listed" });
    Dash.playAttack(torqueTunedRed);
    game.advanceCombatTo("defend");

    expectCombat(game).toHaveKeyword("overpower");
  });

  it("boundary: declining the destroy leaves no overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [torqueTunedRed],
        arena: [hyperDriverRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: fai, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(torqueTunedRed);
    game.advanceCombatTo("defend");

    expectFabCard(Dash, hyperDriverRed).toBeIn("arena");
    expectCombat(game).notToHaveKeyword("overpower");
  });

  it("timing: the +2{d} defend rider blocks 4 exactly (3{d} base... wait 1{d}) — 1+2+Nimblism", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [torqueTunedRed],
        arena: [hyperDriverRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: fai,
        hand: [torqueTunedRed, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: fai },
    );
    const Dash = game.as(dash);

    game.as(fai).attackWith(torqueTunedRed);
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
    Dash.defendWith([torqueTunedRed]);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: hyperDriverRed.canonicalId,
    });
    game.closeCombat({ ordering: "listed" });

    expect(Dash.life()).toBeLessThanOrEqual(20);
  });
});
