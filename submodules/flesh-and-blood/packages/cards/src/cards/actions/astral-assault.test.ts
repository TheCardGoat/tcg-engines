import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { lightningFlow } from "../tokens/lightning-flow.ts";
import { astralAssaultRed } from "./astral-assault.ts";

/**
 * Astral Assault (OMN160) — Lightning Action - Attack, cost 2, 5{p}.
 *
 * Printed: When this attacks, you may destroy a Lightning Flow you control.
 * If you do, this gets +2{p}.
 */

describe("Astral Assault (OMN160) AAA", () => {
  it("happy: destroying a Lightning Flow grants +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [astralAssaultRed],
        arena: [lightningFlow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(astralAssaultRed, { stopAt: "on-attack" });
    Briar.accept();
    Briar.target(lightningFlow);
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat();
    expectFabPlayer(Briar).toHaveTokenCount("lightning-flow", 0);
  });

  it("boundary: with no Lightning Flow, power stays printed 5", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [astralAssaultRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(astralAssaultRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat();
  });

  it("timing: declining the destroy keeps printed 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [astralAssaultRed],
        arena: [lightningFlow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.playAttack(astralAssaultRed, { stopAt: "on-attack" });
    Briar.decline();
    game.advanceUntil({ stopAt: "defend" });
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat();
  });
});
