import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { serBoltynBreakerOfDawn } from "../heroes/ser-boltyn-breaker-of-dawn.ts";
import { vForValorRed } from "./v-for-valor.ts";

/**
 * V for Valor (DTD060) — Light Warrior Action Aura red.
 *
 * Printed AR: {r}, destroy this, charge your hero's soul: Target attack gains
 * +3{p}.
 */

describe("V for Valor (DTD060) AAA", () => {
  it("happy: destroy this and charge so the attack gains +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: serBoltynBreakerOfDawn,
        hand: [vForValorRed, snatchRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(serBoltynBreakerOfDawn);

    Boltyn.play(vForValorRed);
    game.untilIdle({ ordering: "listed" });
    Boltyn.playAttack(snatchRed);
    game.toReaction("attacker");
    Boltyn.activate(vForValorRed);
    Boltyn.target(nimblismBlue);
    Boltyn.target(snatchRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(7);
    expectFabCard(Boltyn, vForValorRed).toBeIn("graveyard");
    expectFabCard(Boltyn, nimblismBlue).toBeIn("soul");
  });

  it("boundary: without a charge card the AR is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: serBoltynBreakerOfDawn,
        hand: [vForValorRed, snatchRed],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(serBoltynBreakerOfDawn);

    Boltyn.play(vForValorRed);
    game.untilIdle({ ordering: "listed" });
    Boltyn.playAttack(snatchRed);
    game.toReaction("attacker");
    Boltyn.expectActivationRejected(vForValorRed);
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Boltyn, vForValorRed).toBeIn("arena");
  });

  it("timing: the +3{p} is only on the targeted attack", () => {
    const game = FabTestEngine.start(
      {
        hero: serBoltynBreakerOfDawn,
        hand: [vForValorRed, snatchRed, snatchRed, nimblismBlue],
        resourcePoints: 1,
        actionPoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(serBoltynBreakerOfDawn);

    Boltyn.play(vForValorRed);
    game.untilIdle({ ordering: "listed" });
    Boltyn.playAttack(snatchRed);
    game.toReaction("attacker");
    Boltyn.activate(vForValorRed);
    Boltyn.target(nimblismBlue);
    Boltyn.target(snatchRed);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    Boltyn.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });
});
