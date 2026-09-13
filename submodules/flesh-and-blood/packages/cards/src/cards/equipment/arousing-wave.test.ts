import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { nuu } from "../heroes/nuu.ts";
import { snatchRed } from "../actions/snatch.ts";
import { arousingWave } from "./arousing-wave.ts";

/**
 * Arousing Wave (LGS269) — Mystic Assassin Arms, Battleworn.
 * Printed: "Attack Reaction - {r}, destroy this: Create a Fang Strike in
 * your hand."
 * Activated attack-reaction abilities are attacker-window only (CR reaction
 * step), so Nuu proves it while attacking.
 */

describe("Arousing Wave (LGS269) AAA", () => {
  it("happy: paying 1 as an attack reaction destroys this and creates a Fang Strike in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        arms: [arousingWave],
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);
    const _Dash = game.as(dash);

    Nuu.playAttack(snatchRed);
    game.toReaction("attacker");
    Nuu.activate(arousingWave);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expectFabCard(Nuu, arousingWave).toBeIn("graveyard");
    // Snatch's printed draw-on-hit rider adds the drawn deck filler.
    expectFabPlayer(Nuu).toHaveHandCount(2);
    expectFabPlayer(Nuu).toHaveResourceCount(0);
  });

  it("boundary: with no resources the reaction is rejected and the arms stay equipped", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        arms: [arousingWave],
        hand: [snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);

    Nuu.playAttack(snatchRed);
    game.toReaction("attacker");
    Nuu.expectActivationRejected(arousingWave);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expectFabCard(Nuu, arousingWave).toBeIn("arms");
    // No Fang Strike: only Snatch's printed draw-on-hit filler is in hand.
    expectFabPlayer(Nuu).toHaveHandCount(1);
  });
});
