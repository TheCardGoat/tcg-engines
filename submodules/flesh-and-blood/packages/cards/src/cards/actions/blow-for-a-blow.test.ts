import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { blowForABlowRed } from "./blow-for-a-blow.ts";

describe("Blow for a Blow (SEA216) AAA", () => {
  it("happy: behind on life, this gets go again and the hit pings 1", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [blowForABlowRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 15,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(blowForABlowRed);
    expectCombat(game).toHaveAttackPower(4).toHaveKeyword("go-again");
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: dash.canonicalId });
    expectFabPlayer(game.as(dash)).toHaveLife(15);
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("boundary: equal life does not grant go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [blowForABlowRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(blowForABlowRed);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: dash.canonicalId });
    expectFabPlayer(Bravo).toHaveAP(0);
  });

  it("timing: the on-hit ping is not combat-chain damage to the attacker", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [blowForABlowRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(blowForABlowRed);
    game.helpers.resolveUntilIdle({ entityTargetCanonicalId: dash.canonicalId });
    expectFabPlayer(Bravo).toHaveLife(20);
    expectFabPlayer(game.as(dash)).toHaveLife(15);
  });
});
