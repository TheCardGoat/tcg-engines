import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { tekloBaseLegs } from "../equipment/teklo-base-legs.ts";
import { evoBetaBaseLegsBlue } from "./evo-beta-base-legs.ts";
import { evoSteelSoulTowerBlue } from "./evo-steel-soul-tower.ts";

const SNATCH = 4;
const LIFE = 20;

describe("Evo Steel Soul Tower (EVO029) AAA", () => {
  it("happy: Temper d3 — first defend contributes 3, stays seated at d2", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, legs: [evoSteelSoulTowerBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expectFabCard(Dash, evoSteelSoulTowerBlue).toHaveKeyword("temper");

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(evoSteelSoulTowerBlue);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(LIFE - (SNATCH - 3));
    expectFabCard(Dash, evoSteelSoulTowerBlue).toBeIn("legs");
    expect(
      game.objectState(Dash.findCardInZone("legs", evoSteelSoulTowerBlue)).defenseCounterTotal,
    ).toBe(-1);
  });

  it("boundary: equipment that does not defend is not Tempered", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, legs: [evoSteelSoulTowerBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const legsId = Dash.findCardInZone("legs", evoSteelSoulTowerBlue);

    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, evoSteelSoulTowerBlue).toBeIn("legs");
    expect(game.objectState(legsId).defenseCounterTotal ?? 0).toBe(0);
    expectFabPlayer(Dash).toHaveLife(LIFE - SNATCH);
  });

  it("happy: play with Evo base legs equipped transforms the base and grants 1 AP", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        legs: [evoBetaBaseLegsBlue],
        hand: [evoSteelSoulTowerBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(evoSteelSoulTowerBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabCard(Dash, evoSteelSoulTowerBlue).toBeIn("legs");
    expect(Dash.zone("legs")).not.toContain(evoBetaBaseLegsBlue.canonicalId);
    expectFabPlayer(Dash).toHaveAP(1);
  });

  it("boundary: play with a non-Evo base legs equipped transforms but grants no AP", () => {
    // Release Notes — Bright Lights: the a2 trigger only fires from/into an
    // Evo partner; a Base-only seat (Teklo) still transforms and re-equips,
    // but the action point is not granted.
    const game = FabTestEngine.start(
      {
        hero: dash,
        legs: [tekloBaseLegs],
        hand: [evoSteelSoulTowerBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(evoSteelSoulTowerBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabCard(Dash, evoSteelSoulTowerBlue).toBeIn("legs");
    expect(Dash.zone("legs")).not.toContain(tekloBaseLegs.canonicalId);
    expectFabPlayer(Dash).toHaveAP(0);
  });
});
