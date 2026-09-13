import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { apexBusterYellow } from "./apex-buster.ts";
import { headJabRed } from "./head-jab.ts";
import { nimblismBlue } from "./nimblism.ts";
import { wageGoldRed } from "./wage-gold.ts";

/**
 * Apex Buster (IAR039) — Brute Action - Attack, cost 3, 6{p}.
 *
 * Printed: "Instant - {r}{r}, discard this: Destroy target card that is
 * defending an attack you control with 6 or more base {p}."
 */

describe("Apex Buster (IAR039) AAA", () => {
  it("happy: the instant destroys the card defending the 6{p} attack", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [apexBusterYellow, apexBusterYellow],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.playAttack(apexBusterYellow);
    expectCombat(game).toHaveAttackPower(6);
    Dash.defendWith(nimblismBlue);

    Rhinar.activate(apexBusterYellow, { index: 0 });
    Rhinar.target(nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(14);
    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
    expect(Dash.zone("hand")).not.toContain(nimblismBlue.canonicalId);
  });

  it("boundary: no card defends the attack before blockers are declared", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [apexBusterYellow, wageGoldRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.playAttack(wageGoldRed, { optionals: "decline" });
    expectCombat(game).toBeOpen();

    Rhinar.expectActivationRejected(apexBusterYellow);
  });

  it("timing: an attack under 6 base {p} cannot be targeted by the instant", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [headJabRed, apexBusterYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);

    Rhinar.playAttack(headJabRed);
    Dash.defendWith(nimblismBlue, nimblismBlue);

    Rhinar.expectActivationRejected(apexBusterYellow);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
  });
});
