import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kano } from "../heroes/kano.ts";
import { boltyn } from "../heroes/boltyn.ts";
import { hatchetOfBody } from "../weapons/hatchet-of-body.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { spillBloodRed } from "./spill-blood.ts";

/**
 * Spill Blood (MON109) — Warrior Action, cost 1, 3{d}, go again.
 *
 * Printed: "Axes you control gain +2{p} and dominate until end of turn.
 * Go again"
 */

describe("Spill Blood (MON109) AAA", () => {
  it("happy: axes you control gain +2{p} and dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [spillBloodRed],
        weapon1: [hatchetOfBody],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: kano, hand: [], life: 15, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Kano = game.as(kano);

    Boltyn.play(spillBloodRed);
    game.untilIdle();
    expectFabPlayer(Boltyn).toHaveAP(1);

    Boltyn.activateAttack(hatchetOfBody);
    expectCombat(game).toHaveAttackPower(4).toHaveKeyword("dominate");
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Kano).toHaveLife(11);
    expectFabCard(Boltyn, spillBloodRed).toBeIn("graveyard");
  });

  it("boundary: a non-axe weapon does not gain +2{p} or dominate", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [spillBloodRed],
        weapon1: [cintariSaber],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: kano, hand: [], life: 15, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Kano = game.as(kano);

    Boltyn.play(spillBloodRed);
    game.untilIdle();
    Boltyn.activateAttack(cintariSaber);
    expectCombat(game).toHaveAttackPower(2).notToHaveKeyword("dominate");
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Kano).toHaveLife(13);
  });

  it("timing: dominate on the axe rejects a second card from hand", () => {
    const game = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [spillBloodRed],
        weapon1: [hatchetOfBody],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Boltyn = game.as(boltyn);
    const Dash = game.as(dash);

    Boltyn.play(spillBloodRed);
    game.untilIdle();
    Boltyn.activateAttack(hatchetOfBody);
    game.advanceCombatTo("defend");
    Dash.defendWith(snatchRed);
    expect(() => Dash.defendWith(nimblismBlue)).toThrow();
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
  });
});
