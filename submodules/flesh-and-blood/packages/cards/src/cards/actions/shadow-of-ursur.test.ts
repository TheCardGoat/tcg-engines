import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { ghostlyVisitRed } from "./ghostly-visit.ts";
import { shadowOfUrsurBlue } from "./shadow-of-ursur.ts";

/**
 * Shadow of Ursur, Blue (MON156) — Shadow Runeblade Attack Action.
 *
 * Printed: "You may play Shadow of Ursur from your banished zone.
 * As an additional cost to play Shadow of Ursur, you may banish a card with
 * blood debt from your hand. If you do, Shadow of Ursur gains go again.
 * Blood Debt" (cost 0, 2{p}, 3{d})
 */

describe("Shadow of Ursur (MON156) AAA", () => {
  it("happy: banishing a blood-debt card from hand grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        // Two eligible cards force the public play-cost-target decision path
        // instead of the declaration procedure auto-selecting a sole target.
        hand: [ghostlyVisitRed, ghostlyVisitRed],
        banished: [shadowOfUrsurBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.playAttack(shadowOfUrsurBlue, {
      from: "banished",
      optionals: "accept",
      entityTargets: "minimum",
    });
    expectCombat(game).toHaveAttackPower(2);
    expect(Chane.zone("banished")).toContain(ghostlyVisitRed.canonicalId);
    expect(Chane.zone("hand")).toContain(ghostlyVisitRed.canonicalId);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Chane).toHaveAP(1);
    expectFabPlayer(game.as(dash)).toHaveLife(18);
  });

  it("boundary: from banished with an empty hand plays without the go-again rider", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [],
        banished: [shadowOfUrsurBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.attackWith(shadowOfUrsurBlue, { from: "banished" });
    expectCombat(game).toHaveAttackPower(2);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Chane).toHaveAP(0);
    expectFabCard(Chane, shadowOfUrsurBlue).toBeIn("graveyard");
  });

  it("timing: without another blood-debt card the additional cost is declined", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [shadowOfUrsurBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.attackWith(shadowOfUrsurBlue);
    expectCombat(game).toHaveAttackPower(2);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Chane).toHaveAP(0);
  });
});
