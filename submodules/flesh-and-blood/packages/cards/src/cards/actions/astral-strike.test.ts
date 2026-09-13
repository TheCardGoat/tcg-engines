import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { pleiadesSuperstar } from "../heroes/pleiades-superstar.ts";
import { thespianCharmYellow } from "../instants/thespian-charm.ts";
import { auroraEmissaryOfLightning } from "../heroes/aurora-emissary-of-lightning.ts";
import { astralStrikeRed } from "./astral-strike.ts";
import { riftBreakerBlue } from "./rift-breaker.ts";
import { lightningFlow } from "../tokens/lightning-flow.ts";

/**
 * Astral Strike (OMN145) — Lightning Action - Attack, 5{p}.
 * Printed rider is available only after this player actually destroys a
 * Lightning Flow this turn.
 */

describe("Astral Strike (OMN145) AAA", () => {
  it("happy: destroying the opponent's Lightning Flow credits the attacking player", () => {
    const game = FabTestEngine.start(
      {
        hero: auroraEmissaryOfLightning,
        hand: [riftBreakerBlue, astralStrikeRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        arena: [lightningFlow],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Aurora = game.as(auroraEmissaryOfLightning);

    Aurora.playAttack(riftBreakerBlue);
    game.closeCombat({ ordering: "listed", entityTargets: "minimum" });
    game.as(dash).target(lightningFlow);
    game.helpers.resolveUntilIdle();

    Aurora.playAttack(astralStrikeRed, { stopAt: "on-attack" });
    game.advanceToDecision(Aurora, "option");
    Aurora.choose("gets2");
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });

    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: moving a Lightning Flow out of the arena is not destroying it", () => {
    const game = FabTestEngine.start(
      {
        hero: pleiadesSuperstar,
        arena: [fabToken("lightning-flow")],
        hand: [thespianCharmYellow, astralStrikeRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Pleiades = game.as(pleiadesSuperstar);

    Pleiades.play(thespianCharmYellow, { modeIndexes: [2] });
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });
    Pleiades.playAttack(astralStrikeRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });

    expectCombat(game).toHaveAttackPower(5);
  });
});
