import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { runechant } from "../tokens/runechant.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { shadowakeGloombladeRed } from "./shadowake-gloomblade.ts";

/**
 * Shadowake Gloomblade, Red — Shadow Runeblade Action - Attack, cost 2, 4{p},
 * 3{d}. Usurp, Blood Debt.
 *
 * Printed: "You may play this from your banished zone. Usurp. When this hits,
 * create a Gate to i'Arathael token. Blood Debt"
 */

describe("Shadowake Gloomblade AAA", () => {
  it("happy: a hit creates a Gate to i'Arathael", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [shadowakeGloombladeRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.playAttack(shadowakeGloombladeRed);
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(4);
    Dash.defendWith();
    game.closeCombat();

    expectFabPlayer(Viserai).toHaveTokenCount("gate-to-i-arathael", 1);
    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("boundary: a miss creates no Gate", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [shadowakeGloombladeRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [snatchRed, nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.playAttack(shadowakeGloombladeRed);
    Dash.defendWith(snatchRed, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Viserai).toHaveTokenCount("gate-to-i-arathael", 0);
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("boundary: the gloomblade may be played from the banished zone", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        banished: [shadowakeGloombladeRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.playAttack(shadowakeGloombladeRed, { from: "banished" });
    Dash.defendWith();
    game.closeCombat();

    expectFabPlayer(Viserai).toHaveTokenCount("gate-to-i-arathael", 1);
    expectFabCard(Viserai, shadowakeGloombladeRed).toBeIn("graveyard");
  });

  it("regression: pays pitch after choosing the Runechant usurp cost", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [nimblismBlue],
        arena: [runechant],
        banished: [shadowakeGloombladeRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    const attackId = game.findCardInZone(Viserai.id, "banished", shadowakeGloombladeRed);
    game.playInstance(
      Viserai.id,
      attackId,
      { from: "banished", target: Dash.id, pitch: nimblismBlue },
      "explicit",
    );
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(6);
    expectFabPlayer(Viserai).toHaveResourceCount(1).toHaveTokenCount("runechant", 0);
  });
});
