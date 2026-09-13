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
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { murmuringGloombladeRed } from "./murmuring-gloomblade.ts";

/**
 * Murmuring Gloomblade, Red — Shadow Runeblade Action - Attack, cost 2, 4{p},
 * 3{d}. Usurp, Blood Debt.
 *
 * Printed: "You may play this from your banished zone. Usurp. When this
 * attacks or hits, create a Runechant token. Blood Debt"
 */

describe("Murmuring Gloomblade AAA", () => {
  it("happy: attacking and hitting creates two Runechants", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [murmuringGloombladeRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.playAttack(murmuringGloombladeRed);
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(4);
    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 1);
    Dash.defendWith();
    game.closeCombat();
    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 2);
    expectFabPlayer(Dash).toHaveLife(16);
  });

  it("boundary: a miss still creates the on-attack Runechant but not a second", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [murmuringGloombladeRed],
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

    Viserai.playAttack(murmuringGloombladeRed);
    Dash.defendWith(snatchRed, nimblismBlue);
    game.closeCombat();

    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 1);
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("boundary: the gloomblade may be played from the banished zone", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        banished: [murmuringGloombladeRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);

    Viserai.playAttack(murmuringGloombladeRed, { from: "banished" });
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(4);
    Dash.defendWith();
    game.closeCombat();
    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 2);
    expectFabCard(Viserai, murmuringGloombladeRed).toBeIn("graveyard");
  });
});
