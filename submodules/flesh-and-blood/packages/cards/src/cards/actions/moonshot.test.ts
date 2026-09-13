import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { zeroToSixtyRed } from "./zero-to-sixty.ts";
import { teklovossen } from "../heroes/teklovossen.ts";
import { hyperDriver } from "../tokens/hyper-driver.ts";
import { moonshotYellow } from "./moonshot.ts";

/**
 * Moonshot (EVO140) — Play only if you've boosted this turn. Additional cost:
 * destroy X Hyper Drivers you control. When this attacks, +3{p} for each
 * destroyed this way. If this has 10 or more {p}, it gets overpower.
 * Printed 3{p}; Overpower is the 10{p} rider, not a printed keyword line.
 */

describe("Moonshot (EVO140) AAA", () => {
  it("happy: after a boost, X=0 attacks at printed 3{p} without overpower", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [zeroToSixtyRed, moonshotYellow],
        arena: [{ card: hyperDriver, state: { steamCounters: 1 } }],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(zeroToSixtyRed, { boost: true, stopAt: "on-attack" });
    game.untilIdle({ ordering: "listed", optionals: "decline" });
    Teklo.playAttack(moonshotYellow, { xValue: 0, stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveAttackPower(3);
    expectCombat(game).notToHaveKeyword("overpower");
  });

  it("boundary: without boosting this turn this cannot be played", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [moonshotYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    expect(() => Teklo.playAttack(moonshotYellow)).toThrow(/play condition is not satisfied/);
    expectFabCard(Teklo, moonshotYellow).toBeIn("hand");
  });

  it("timing: X=1 destroys a Hyper Driver and this attacks at 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: teklovossen,
        hand: [zeroToSixtyRed, moonshotYellow],
        arena: [{ card: hyperDriver, state: { steamCounters: 2 } }],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Teklo = game.as(teklovossen);

    Teklo.playAttack(zeroToSixtyRed, { boost: true, stopAt: "on-attack" });
    game.untilIdle({ ordering: "listed", optionals: "decline" });
    Teklo.playAttack(moonshotYellow, { xValue: 1, stopAt: "on-attack" });
    Teklo.target(hyperDriver);
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveAttackPower(6);
    expectCombat(game).notToHaveKeyword("overpower");
    expect(Teklo.cardsIn("arena", hyperDriver)).toHaveLength(0);
  });
});
