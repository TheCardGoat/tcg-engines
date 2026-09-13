import { describe, it, expect } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { bloodsongGloombladeRed } from "./bloodsong-gloomblade.ts";
import { sigilOfEarthBlue } from "./sigil-of-earth.ts";

/**
 * Bloodsong Gloomblade (IAR114) — Shadow Runeblade Action - Attack, cost 0,
 * 2{p}, Usurp, Blood Debt.
 *
 * Printed: "You may play this from your banished zone.\nUsurp\nWhen this hits
 * a hero, you may banish target aura permanent they control."
 */

describe("Bloodsong Gloomblade (IAR114) AAA", () => {
  it("happy: played from the banished zone, a hit banishes the defender's aura", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [sigilOfEarthBlue],
        life: 20,
        deck: 6,
      },
      {
        hero: viserai,
        banished: [bloodsongGloombladeRed],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Viserai = game.as(viserai);

    Dash.play(sigilOfEarthBlue);
    game.untilIdle();
    Dash.endTurn();
    game.untilIdle();

    Viserai.playAttack(bloodsongGloombladeRed, { from: "banished" });
    Dash.defendWith();
    game.closeCombat({ optionals: "accept", entityTargets: "maximum" });

    expectFabPlayer(Dash).toHaveLife(18);
    expectFabCard(Dash, sigilOfEarthBlue).toBeBanished();
    expectFabCard(Viserai, bloodsongGloombladeRed).toBeIn("graveyard");
  });

  it("boundary: declining the optional leaves the aura in the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [sigilOfEarthBlue],
        life: 20,
        deck: 6,
      },
      {
        hero: viserai,
        banished: [bloodsongGloombladeRed],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Viserai = game.as(viserai);

    Dash.play(sigilOfEarthBlue);
    game.untilIdle();
    Dash.endTurn();
    game.untilIdle();

    Viserai.playAttack(bloodsongGloombladeRed, { from: "banished" });
    Dash.defendWith();
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(18);
    expectFabCard(Dash, sigilOfEarthBlue).toBeIn("arena");
  });

  it("boundary: a non-Spectra opposing aura is not a legal attack target", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [sigilOfEarthBlue],
        life: 20,
        deck: 6,
      },
      {
        hero: viserai,
        banished: [bloodsongGloombladeRed],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Viserai = game.as(viserai);

    Dash.play(sigilOfEarthBlue);
    game.untilIdle();
    Dash.endTurn();
    game.untilIdle();

    const sigilInstanceId = Dash.findCardInZone("arena", sigilOfEarthBlue);
    expect(() =>
      Viserai.play(bloodsongGloombladeRed, {
        from: "banished",
        targetInstanceId: sigilInstanceId,
      }),
    ).toThrow();
    expectFabCard(Dash, sigilOfEarthBlue).toBeIn("arena");
    expectCombat(game).toBeClosed();
  });
});
